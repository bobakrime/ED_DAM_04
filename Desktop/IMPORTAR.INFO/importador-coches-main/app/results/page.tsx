import { scrapeCarData } from "../actions/scrape-car";
import { CarData } from "../utils/calculator";
import ResultsClient from "./ResultsClient";

interface ResultsProps {
    searchParams: Promise<{
        url?: string;
        price?: string;
        date?: string;
        co2?: string;
        pro?: string;
        title?: string;
        img?: string;
    }>;
}

export default async function Results({ searchParams }: ResultsProps) {
    const params = await searchParams;
    const { url, price, date, co2, pro, title, img } = params;

    // Default Initial Data (Empty/Zero to signal missing)
    let carData: CarData = {
        price: 0,
        firstRegistrationDate: new Date(),
        co2Emissions: 0,
        isProfessionalSeller: true,
    };

    let scrapedInfo = {
        title: '',
        imgUrl: '',
        error: '',
    };

    // If we have direct data from history/params, use it (avoid re-scraping)
    if (price && date) {
        carData.price = parseFloat(price as string) || 0;
        carData.firstRegistrationDate = new Date(date as string);
        if (co2) carData.co2Emissions = parseFloat(co2 as string) || 0;
        if (pro) carData.isProfessionalSeller = (pro === 'true');

        if (title) scrapedInfo.title = decodeURIComponent(title as string);
        if (img) scrapedInfo.imgUrl = decodeURIComponent(img as string);

    } else if (url) {
        // Only scrape if we don't have direct data
        const scraped = await scrapeCarData(url);

        // Populate what we found, leave the rest as 0/empty
        if (scraped.price > 0) carData.price = scraped.price;
        if (scraped.title) scrapedInfo.title = scraped.title;
        if (scraped.imgUrl) scrapedInfo.imgUrl = scraped.imgUrl;
        if (scraped.co2) carData.co2Emissions = scraped.co2;

        if (scraped.firstRegistration) {
            const [year, month] = scraped.firstRegistration.split('-').map(Number);
            carData.firstRegistrationDate = new Date(year, month - 1, 1);
        }
    }

    return (
        <ResultsClient
            initialCarData={carData}
            initialScrapedInfo={scrapedInfo}
            searchUrl={url}
        />
    );
}
