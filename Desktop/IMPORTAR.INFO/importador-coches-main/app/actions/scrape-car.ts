'use server';

import { scrapeWithScraperAPI } from './scraper-api';

export interface ScrapedData {
    price: number;
    title: string;
    imgUrl: string;
    firstRegistration?: string; // YYYY-MM
    mileage?: string;
    power?: string;
    co2?: number;
    error?: string;
}

export async function scrapeCarData(url: string): Promise<ScrapedData> {
    // Initialize with NO defaults
    let scrapedData: ScrapedData = {
        price: 0,
        title: '',
        imgUrl: '',
        co2: 0,
        firstRegistration: '',
        error: ''
    };

    try {
        console.log(`Starting Scrape for: ${url}`);

        // Try ScraperAPI first (Robust, handles blocking)
        const apiData = await scrapeWithScraperAPI(url);

        if (apiData) {
            console.log("✅ ScraperAPI Success:", apiData.title);
            if (apiData.price) scrapedData.price = apiData.price;
            if (apiData.title) scrapedData.title = apiData.title;
            if (apiData.imgUrl) scrapedData.imgUrl = apiData.imgUrl;
            if (apiData.co2) scrapedData.co2 = apiData.co2;
            if (apiData.firstRegistration) scrapedData.firstRegistration = apiData.firstRegistration;
        } else {
            console.log("⚠️ ScraperAPI returned no data (or no key provided). Falling back to URL parsing.");
        }

    } catch (error) {
        console.error('Scrape error:', error);
        // Do not throw, allow fallback
    }

    // Fallback: URL Parsing (Fill gaps)
    const urlInfo = parseMobileDeUrl(url);
    if ((!scrapedData.title || scrapedData.title === 'Vehículo encontrado' || scrapedData.title === 'mobile.de' || scrapedData.title === 'Auto') && urlInfo.title) {
        scrapedData.title = urlInfo.title;
    }
    // Trust URL year if we have nothing better
    if (!scrapedData.firstRegistration && urlInfo.firstRegistration) {
        scrapedData.firstRegistration = urlInfo.firstRegistration;
    }

    return scrapedData;
}

function parseMobileDeUrl(url: string) {
    const info = { title: '', firstRegistration: '' };
    try {
        // Try to extract from path: /auto-inserat/make-model-spec-city/id.html
        const match = url.match(/\/auto-inserat\/([^\/]+)\/([0-9]+)\.html/);
        if (match && match[1]) {
            // Slug: audi-a3-spb-2-0-tdi-f-ap-s-tr-ambiente-san-miniato
            const slug = match[1];
            const parts = slug.split('-');
            const make = parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) : '';
            const model = parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1) : '';
            const spec = parts.slice(2, 6).join(' ');

            info.title = `${make} ${model} ${spec}`;

            // Extract Year from slug (often present: ...-2015-...)
            const yearMatch = slug.match(/-((?:19|20)\d{2})-/);
            if (yearMatch) {
                // Return YYYY-01 as approximation
                info.firstRegistration = `${yearMatch[1]}-01`;
            }
        }
    } catch (e) {
        console.error('URL parsing error', e);
    }
    return info;
}
