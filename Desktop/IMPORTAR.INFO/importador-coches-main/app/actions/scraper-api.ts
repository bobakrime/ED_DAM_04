'use server';

import * as cheerio from 'cheerio';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { scrapeWithRealChrome } from './playwright-scraper';
import { scrapeOnVercel } from './serverless-scraper';
import fs from 'fs';

function logToFile(msg: string) {
    try { fs.appendFileSync('scrape-debug.log', `[${new Date().toISOString()}] ${msg}\n`); } catch (e) { }
}

export interface ExtractedCarData {
    price?: number;
    title?: string;
    imgUrl?: string;
    firstRegistration?: string; // YYYY-MM
    co2?: number;
    mileage?: number;
    powerHp?: number;
    sellerType?: 'Dealer' | 'Private';
    brand?: string;
    model?: string;
    fuelType?: string;
}

export async function scrapeWithScraperAPI(targetUrl: string): Promise<ExtractedCarData | null> {
    const scraperApiKey = process.env.SCRAPER_API_KEY || '50031caa55c6bf0f4f0ed788fff63447';
    const googleApiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

    console.log(`🚀 Starting extraction for: ${targetUrl}`);
    logToFile(`Start: ${targetUrl}`);

    let html = '';

    // ===================================
    // STRATEGY A: Local Playwright (Dev)
    // ===================================
    if (process.env.NODE_ENV !== 'production') {
        try {
            console.log("🔧 DEV MODE: Trying Local Playwright...");
            const pwResult = await scrapeWithRealChrome(targetUrl);
            if (pwResult && pwResult.html) {
                html = pwResult.html;
                console.log(`✅ Local Playwright success: ${html.length} chars`);
            }
        } catch (e: any) {
            console.warn("⚠️ Local Playwright failed:", e.message);
        }
    }

    // ===================================
    // STRATEGY B: Serverless Chrome (Prod)
    // ===================================
    if (!html && process.env.NODE_ENV === 'production') {
        try {
            console.log("☁️ PROD MODE: Trying Serverless Chrome...");
            // Use scrapeOnVercel from serverless-scraper.ts
            const vRes = await scrapeOnVercel(targetUrl);
            if (vRes && vRes.html && vRes.html.length > 2000) {
                html = vRes.html;
                console.log(`✅ Serverless Chrome success: ${html.length} chars`);
            }
        } catch (e: any) {
            console.warn("⚠️ Serverless Chrome failed:", e.message);
        }
    }

    // ===================================
    // STRATEGY C: ScraperAPI (Fallback)
    // ===================================
    if (!html) {
        if (!scraperApiKey) {
            console.warn("⚠️ ScraperAPI key missing and other methods failed.");
            // No return null yet.
        } else {
            const apiUrl = `http://api.scraperapi.com?api_key=${scraperApiKey}&url=${encodeURIComponent(targetUrl)}&render=true&country_code=de&premium=true`;
            try {
                console.log("🌐 Fetching via ScraperAPI...");
                const response = await fetch(apiUrl, { next: { revalidate: 0 } });
                if (response.ok) {
                    html = await response.text();

                    // Check for Captcha
                    if (html.includes("Please verify you are a human") || html.length < 2000) {
                        console.warn("⚠️ ScraperAPI returned Captcha/Block.");
                    }
                } else {
                    console.warn(`⚠️ ScraperAPI Error: ${response.status}`);
                }
            } catch (e) {
                console.error("ScraperAPI fetch error:", e);
            }
        }
    }

    if (!html || html.length < 500) {
        console.error("❌ Fatal: No HTML retrieved.");
        return null;
    }

    // ===================================
    // STEP 2: PARSE & AI EXTRACT
    // ===================================
    const $ = cheerio.load(html);
    let data: ExtractedCarData = {};

    // 2.1 Basic Metadata
    data.imgUrl = $('meta[property="og:image"]').attr('content') || $('meta[name="twitter:image"]').attr('content');
    data.title = $('meta[property="og:title"]').attr('content') || $('title').text();
    if (data.title) data.title = data.title.replace('kaufen', '').replace('buy', '').trim();

    // JSON-LD Image Fallback
    if (!data.imgUrl) {
        $('script[type="application/ld+json"]').each((_, el) => {
            try {
                const j = JSON.parse($(el).html() || '{}');
                const list = Array.isArray(j) ? j : [j];
                for (const item of list) {
                    if (item.image) {
                        const img = Array.isArray(item.image) ? item.image[0] : item.image;
                        data.imgUrl = (typeof img === 'string' ? img : img.url);
                        if (data.imgUrl) break;
                    }
                }
            } catch (e) { }
        });
    }

    // 2.2 Google Gemini AI
    if (googleApiKey) {
        logToFile("🤖 Initializing AI...");
        try {
            const genAI = new GoogleGenerativeAI(googleApiKey);
            // Try robust model sequence
            const models = ["gemini-1.5-flash-latest", "gemini-1.5-flash", "gemini-pro", "gemini-1.5-pro"];
            let aiResult = null;

            const jsonLds: string[] = [];
            $('script[type="application/ld+json"]').each((_, el) => {
                const c = $(el).html();
                if (c && c.length < 15000) jsonLds.push(c);
            });

            const $c = cheerio.load(html);
            $c('script, style, noscript, iframe, svg, footer, nav').remove();
            let cleanText = $c('body').text().replace(/\s+/g, ' ').substring(0, 30000);

            const prompt = `
            Analyze this car listing (HTML + JSON-LD). Extract Technical Specs into JSON.
            
            JSON-LD:
            ${jsonLds.join('\n\n')}

            Text:
            ${cleanText}

            Return content for: price, firstRegistration (YYYY-MM), co2, mileage, sellerType, brand, model, fuelType, powerHp.
            Strict JSON.
            `;

            for (const mName of models) {
                try {
                    console.log(`🤖 Trying AI Model: ${mName}`);
                    const model = genAI.getGenerativeModel({ model: mName });
                    const res = await model.generateContent(prompt);
                    const txt = res.response.text().replace(/```json|```/g, '').trim();
                    aiResult = JSON.parse(txt);
                    logToFile(`✅ AI Success with ${mName}`);
                    break;
                } catch (e: any) {
                    console.warn(`AI Model ${mName} failed:`, e.message);
                }
            }

            if (aiResult) {
                if (aiResult.price) data.price = Number(aiResult.price);
                if (aiResult.firstRegistration) data.firstRegistration = aiResult.firstRegistration;
                if (aiResult.co2) data.co2 = Number(aiResult.co2);
                if (aiResult.mileage) data.mileage = Number(aiResult.mileage);
                if (aiResult.brand) data.brand = aiResult.brand;
                if (aiResult.model) data.model = aiResult.model;
                if (aiResult.fuelType) data.fuelType = aiResult.fuelType;
                if (aiResult.sellerType) data.sellerType = aiResult.sellerType;
            }

        } catch (e) {
            console.error("AI Fatal Error:", e);
        }
    }

    // 2.3 Regex Fallback (Brute Force) - DISABLED TO PREVENT INVENTED DATA
    // if (!data.price) {
    //     const pricePattern = /(?:€|EUR)\s*([0-9]{1,3}(?:\.[0-9]{3})*)|([0-9]{1,3}(?:\.[0-9]{3})*)\s*(?:€|EUR)/gi;
    //     const text = $('body').text();
    //     let m, best = 0;
    //     while ((m = pricePattern.exec(text)) !== null) {
    //         const num = m[1] || m[2];
    //         if (num) {
    //             const v = parseFloat(num.replace(/\./g, ''));
    //             if (v > 500 && v < 5000000 && v > best) best = v;
    //         }
    //     }
    //     if (best > 0) data.price = best;
    // }

    if (!data.firstRegistration) {
        const dm = $('body').text().match(/(\d{2})[\/\.](\d{4})/);
        // Validate year is reasonable (between 1900 and current year + 1)
        if (dm) {
            const year = parseInt(dm[2]);
            const currentYear = new Date().getFullYear();
            if (year > 1900 && year <= currentYear + 1) {
                data.firstRegistration = `${dm[2]}-${dm[1]}`;
            }
        }
    }

    if (!data.co2) {
        const cm = $('body').text().match(/(\d+)\s*g\/km/i);
        if (cm) data.co2 = parseInt(cm[1]);
    }

    return data;
}
