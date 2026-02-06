
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export async function scrapeOnVercel(url: string) {
    console.log("🚀 Launching Serverless Chrome (@sparticuz/chromium)...");
    let browser = null;
    try {
        // En local, executablePath será null, esto solo funciona en Linux/Vercel
        // Si se ejecuta en local, fallará. (Pero en local usamos el otro método)

        const executablePath = await chromium.executablePath();

        browser = await puppeteer.launch({
            args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
            defaultViewport: chromium.defaultViewport,
            executablePath: executablePath || process.env.CHROME_PATH_LOCAL, // Fallback por si acaso
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        });

        const page = await browser.newPage();

        // User Agent real para evitar bloqueos básicos
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36');

        // Bloquear recursos innecesarios
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())) {
                req.abort();
            } else {
                req.continue();
            }
        });

        console.log("Navigating to:", url);
        // Timeout generoso pero no excesivo para Serverless
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });

        // Espera mínima para hidratación JS
        await new Promise(r => setTimeout(r, 2000));

        const html = await page.content();
        console.log(`✅ Scraped ${html.length} chars via Serverless Chrome`);

        return { html };

    } catch (error: any) {
        console.error("❌ Serverless Chrome Failed:", error);
        return { error: error.message, html: null };
    } finally {
        if (browser) await browser.close();
    }
}
