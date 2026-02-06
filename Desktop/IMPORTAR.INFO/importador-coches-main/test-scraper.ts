
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { scrapeWithScraperAPI } from './app/actions/scraper-api';

const url = 'https://suchen.mobile.de/auto-inserat/audi-rs3-sportback-2-5-tfsi-quattro-s-tronic-bose-bielefeld/443982745.html';

(async () => {
    console.log('Running scraper-api test...');
    try {
        const data = await scrapeWithScraperAPI(url);
        console.log('--- FINAL DATA ---');
        console.log(JSON.stringify(data, null, 2));
    } catch (e) {
        console.error('Test failed:', e);
    }
})();
