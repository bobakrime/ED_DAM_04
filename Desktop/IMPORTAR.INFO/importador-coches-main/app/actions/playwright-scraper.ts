import { chromium } from "playwright";
import path from "path";
import fs from "fs";
import * as cheerio from 'cheerio';

// Configuration
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
// Only use user data dir in local dev
const USER_DATA_DIR = path.resolve("./user-data/mobile");

// Ensure user data directory exists ONLY in local dev
if (process.env.NODE_ENV !== 'production' && !fs.existsSync(USER_DATA_DIR)) {
    try {
        fs.mkdirSync(USER_DATA_DIR, { recursive: true });
    } catch (e) {
        console.warn("Could not create user data dir:", e);
    }
}

export async function scrapeWithRealChrome(url: string) {
    console.log(`Launching Scraper for: ${url}`);

    // Check if running in Vercel/Production environment
    const isProduction = process.env.NODE_ENV === 'production';

    if (isProduction) {
        console.log("Running in Production (Vercel). Using Cheerio fallback.");
        try {
            // Simple fetch + Cheerio for Vercel
            // Note: mobile.de often blocks simple fetches, but this prevents the 500 crash.
            // If blocked, we return a graceful error or partial data.
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.9'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch page: ${response.status}`);
            }

            const html = await response.text();
            const $ = cheerio.load(html);
            const data: any = {};

            // Title
            data.title = $('h1').first().text().trim() || $('title').text().trim();

            // Price
            // Try robust selectors
            const priceText = $('[data-testid="prime-price-label"]').text() ||
                $('[data-testid="price-label"]').text() ||
                $('.price-label').text() ||
                $('span[class*="Price-root"]').text() ||
                $('body').text().match(/(?:€|EUR)\s?([0-9]{1,3}(?:[.,][0-9]{3})*)/i)?.[0] || '';

            const priceMatch = priceText.match(/([0-9]{1,3}(?:[.,][0-9]{3})*)/);
            if (priceMatch) {
                data.price = parseFloat(priceMatch[1].replace(/\./g, '').replace(',', '.'));
            }

            // Image
            data.imgUrl = $('img[data-testid="gallery-image"]').first().attr('src') ||
                $('.gallery-image').first().attr('src') ||
                $('img[class*="Gallery"]').first().attr('src');

            // First Registration
            const bodyText = $('body').text();
            const dateMatch = bodyText.match(/(?:EZ|Erstzulassung|First Registration)[^0-9]*([0-9]{2}\/[0-9]{4})/i);
            if (dateMatch) {
                data.firstRegistration = dateMatch[1];
            }

            // CO2
            const co2Match = bodyText.match(/([0-9]{2,3})\s?g\/?km/i);
            if (co2Match) {
                data.co2 = parseInt(co2Match[1]);
            }

            console.log("Scraped Data (Cheerio):", data);
            return { ...data, source: 'cheerio' };

        } catch (error) {
            console.error("Cheerio Scraping Error:", error);
            // Return empty object instead of crashing, so user can fill manually
            return { source: 'error', error: 'Could not auto-scrape in cloud. Please fill manually.' };
        }
    }

    // Local Development with Playwright
    let browserContext;
    try {
        console.log("🚀 Launching Chrome with Persistent Context...");
        browserContext = await chromium.launchPersistentContext(USER_DATA_DIR, {
            headless: false,
            executablePath: CHROME_PATH,
            args: ["--disable-blink-features=AutomationControlled", "--no-sandbox", "--start-maximized"],
            viewport: null,
        });
    } catch (e) {
        console.warn("⚠️ Persistent Context Locked/Failed. Retrying with Ephemeral Context...", e);
        // Fallback: Launch standard browser (Incognito-like)
        const browser = await chromium.launch({
            headless: false,
            executablePath: CHROME_PATH,
            args: ["--disable-blink-features=AutomationControlled", "--no-sandbox", "--start-maximized"],
        });
        browserContext = await browser.newContext({ viewport: null });
    }

    try {
        const page = await browserContext.newPage();

        // Humanize
        await page.addInitScript(() => {
            Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
        });

        // Intercept JSON responses
        let jsonData = null;
        page.on("response", async (response) => {
            const reqUrl = response.url();
            // Broader filter for JSON
            if ((reqUrl.includes("json") || reqUrl.includes("api")) && !reqUrl.includes("google") && !reqUrl.includes("facebook")) {
                try {
                    // Only try to parse if it looks like the details endpoint
                    if (reqUrl.includes("details") || reqUrl.includes("data")) {
                        const body = await response.text();
                        if (body && body.startsWith("{")) {
                            const parsed = JSON.parse(body);
                            // Check if it looks like the car data
                            if (parsed.data || (parsed.make && parsed.model) || parsed.id) {
                                console.log("FOUND POTENTIAL JSON:", reqUrl);
                                jsonData = parsed;
                            }
                        }
                    }
                } catch (e) {
                    // Ignore
                }
            }
        });

        console.log("Navigating...");
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

        // Handle Cookie Consent (Crucial for mobile.de to show content)
        try {
            // Mobile.de specific consent (mde-consent-accept-btn or similar)
            const acceptBtn = page.locator('button:has-text("Akzeptieren"), button:has-text("Accept All"), button[id*="consent"]');
            if (await acceptBtn.count() > 0) {
                console.log("🍪 Clicking Cookie Consent...");
                await acceptBtn.first().click();
                await page.waitForTimeout(2000);
            }
        } catch (e) {
            console.log("Cookie consent skipped:", e);
        }

        // Wait for manual interaction (Captcha) if needed
        console.log("⏳ Waiting 15s for page load / manual captcha...");
        await page.waitForTimeout(15000);

        console.log("Waiting for network idle...");
        try {
            await page.waitForLoadState('networkidle', { timeout: 8000 });
        } catch (e) {
            console.log("Network idle timeout, proceeding...");
        }

        // DOM Extraction Fallback (Robust Selectors)
        console.log("Extracting from DOM...");
        const extractedData = await page.evaluate(() => {
            const data: any = {};

            // Title: Try h1, then title tag
            const h1 = document.querySelector('h1');
            data.title = h1 ? h1.innerText : document.title;

            // Price: Look for specific price classes or text patterns
            // mobile.de often uses 'span' with large font or 'data-testid'
            const priceSelectors = [
                '[data-testid="prime-price-label"]',
                '[data-testid="price-label"]',
                '.price-label',
                'span[class*="Price-root"]',
                'span[class*="price"]'
            ];

            for (const sel of priceSelectors) {
                const el = document.querySelector(sel);
                if (el) {
                    const text = el.textContent || '';
                    // Extract number from "23.500 €"
                    const match = text.match(/([0-9]{1,3}(?:[.,][0-9]{3})*)/);
                    if (match) {
                        data.price = parseFloat(match[1].replace(/\./g, '').replace(',', '.'));
                        break;
                    }
                }
            }

            // Fallback Price: Search entire body text for "€ XX.XXX" pattern near top
            if (!data.price) {
                const bodyText = document.body.innerText.substring(0, 3000); // Check first 3000 chars
                const priceMatch = bodyText.match(/(?:€|EUR)\s?([0-9]{1,3}(?:[.,][0-9]{3})*)/i) || bodyText.match(/([0-9]{1,3}(?:[.,][0-9]{3})*)\s?(?:€|EUR)/i);
                if (priceMatch) {
                    data.price = parseFloat(priceMatch[1].replace(/\./g, '').replace(',', '.'));
                }
            }

            // Images
            const imgSelectors = [
                'img[data-testid="gallery-image"]',
                '.gallery-image',
                'img[class*="Gallery"]',
                '.image-gallery-slide img'
            ];

            for (const sel of imgSelectors) {
                const el = document.querySelector(sel);
                if (el) {
                    data.imgUrl = el.getAttribute('src');
                    break;
                }
            }

            // First Registration & Mileage (often in a list of attributes)
            // Look for "Erstzulassung" or "First Registration"
            const attributes = document.body.innerText;

            // Date
            const dateMatch = attributes.match(/(?:EZ|Erstzulassung|First Registration)[^0-9]*([0-9]{2}\/[0-9]{4})/i);
            if (dateMatch) {
                data.firstRegistration = dateMatch[1]; // MM/YYYY
            }

            // CO2
            const co2Match = attributes.match(/([0-9]{2,3})\s?g\/?km/i);
            if (co2Match) {
                data.co2 = parseInt(co2Match[1]);
            }

            return data;
        });

        const htmlContent = await page.content();

        await browserContext.close();

        console.log("Scraped Data (DOM):", extractedData);
        console.log("Scraped Data (JSON):", jsonData ? "Found" : "Not Found");

        const safeObject = (v: any) =>
            v && typeof v === 'object' && !Array.isArray(v) ? v : {};

        return {
            ...(jsonData ? safeObject(jsonData) : safeObject(extractedData)),
            source: jsonData ? 'json' : 'dom',
            html: htmlContent
        };

    } catch (error) {
        console.error("Playwright Error:", error);
        throw error;
    }
}
