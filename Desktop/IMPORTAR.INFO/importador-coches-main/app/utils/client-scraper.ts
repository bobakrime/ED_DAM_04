export interface ClientScrapedData {
    price: number;
    title: string;
    imgUrl: string;
    firstRegistration?: string; // YYYY-MM
    mileage?: string;
    power?: string;
    co2?: number;
    error?: string;
}

export async function scrapeCarDataClient(url: string): Promise<ClientScrapedData> {
    try {
        // 1. Try to extract ID and fetch the hidden JSON endpoint first
        // Pattern: .../id=12345... or .../12345.html
        let carId = '';
        const idMatch = url.match(/id=([0-9]+)/) || url.match(/\/([0-9]+)\.html/);
        if (idMatch) {
            carId = idMatch[1];
        }

        if (carId) {
            try {
                // Construct the hidden JSON URL
                const jsonUrl = `https://suchen.mobile.de/fahrzeuge/data/details.json?id=${carId}&lang=es`;
                const proxyUrl = `/api/proxy?url=${encodeURIComponent(jsonUrl)}`;

                const response = await fetch(proxyUrl);
                if (response.ok) {
                    const jsonData = await response.json();
                    // If we got valid JSON, map it
                    if (jsonData) {
                        return mapMobileDeJson(jsonData);
                    }
                }
            } catch (e) {
                console.log('JSON endpoint failed, falling back to HTML', e);
            }
        }

        // 2. Fallback: Fetch HTML via Proxy
        const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
        const response = await fetch(proxyUrl);

        if (!response.ok) {
            throw new Error(`Proxy error: ${response.status}`);
        }

        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const data: ClientScrapedData = {
            price: 0,
            title: '',
            imgUrl: '',
        };

        // Try JSON-LD (Structured Data)
        const scripts = doc.querySelectorAll('script[type="application/ld+json"]');
        for (const script of scripts) {
            try {
                const json = JSON.parse(script.textContent || '{}');

                if (json['@type'] === 'Vehicle' || json['@type'] === 'Car' || json['@type'] === 'Product') {
                    if (json.name) data.title = json.name;
                    if (json.image) data.imgUrl = Array.isArray(json.image) ? json.image[0] : json.image;
                    if (json.offers && json.offers.price) {
                        data.price = parseFloat(json.offers.price);
                    }
                    if (json.productionDate) {
                        data.firstRegistration = json.productionDate.substring(0, 7); // YYYY-MM
                    }
                }
            } catch (e) {
                // Ignore parse errors
            }
        }

        // Fallback Meta Tags
        if (!data.title) {
            data.title = doc.querySelector('meta[property="og:title"]')?.getAttribute('content') || doc.title || '';
        }
        if (!data.imgUrl) {
            data.imgUrl = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';
        }

        // Regex on Body Text (Last Resort)
        const bodyText = doc.body.innerText;

        if (!data.price) {
            const priceMatch = bodyText.match(/(?:€|EUR)\s?([0-9]{1,3}(?:[.,][0-9]{3})*)/i) || bodyText.match(/([0-9]{1,3}(?:[.,][0-9]{3})*)\s?(?:€|EUR)/i);
            if (priceMatch) {
                data.price = parseFloat(priceMatch[1].replace(/\./g, '').replace(',', '.'));
            }
        }

        if (!data.co2) {
            const co2Match = bodyText.match(/([0-9]{2,3})\s?g\/?km/i) || bodyText.match(/([0-9]{2,3})\s?g\s?CO2/i);
            if (co2Match) {
                data.co2 = parseInt(co2Match[1]);
            } else {
                data.co2 = 150;
            }
        }

        if (!data.firstRegistration) {
            const dateMatch = bodyText.match(/(?:EZ|Erstzulassung|Reg):?\s?([0-9]{2}\/[0-9]{4})/i);
            if (dateMatch) {
                const [month, year] = dateMatch[1].split('/');
                data.firstRegistration = `${year}-${month}`;
            } else {
                data.firstRegistration = '2020-01';
            }
        }

        if (!data.price) {
            return { ...data, error: 'No se pudo extraer el precio. Verifica el enlace o introduce los datos manualmente.' };
        }

        return data;

    } catch (error) {
        console.error('Scraping error:', error);
        return { price: 0, title: '', imgUrl: '', error: 'Error al cargar la página. Asegúrate de que el enlace es correcto.' };
    }
}

function mapMobileDeJson(json: any): ClientScrapedData {
    // Map the internal JSON format to our data structure
    // Note: This mapping depends on the actual structure of the details.json
    // We try to handle a few common variations

    let price = 0;
    // Try to find price in various locations
    if (json.price && json.price.grossAmount) price = json.price.grossAmount;
    else if (json.data && json.data.price && json.data.price.grossAmount) price = json.data.price.grossAmount;
    else if (json.financing && json.financing.price && json.financing.price.grossAmount) price = json.financing.price.grossAmount;

    let title = json.title || (json.make + ' ' + json.model) || 'Vehículo encontrado';
    if (json.data && json.data.make) title = `${json.data.make} ${json.data.model} ${json.data.modelDescription || ''}`;

    let imgUrl = '';
    if (json.images && json.images.length > 0) imgUrl = json.images[0].uri || json.images[0].url;
    else if (json.data && json.data.images && json.data.images.length > 0) imgUrl = json.data.images[0].url;

    // Fix imgUrl if it's relative or missing protocol
    if (imgUrl && imgUrl.startsWith('//')) imgUrl = 'https:' + imgUrl;
    if (imgUrl && !imgUrl.startsWith('http')) imgUrl = 'https://' + imgUrl;

    let firstRegistration = '2020-01';
    if (json.firstRegistration) firstRegistration = json.firstRegistration.substring(0, 7);
    else if (json.data && json.data.firstRegistration) firstRegistration = json.data.firstRegistration.substring(0, 7);

    let co2 = 150;
    if (json.envkv && json.envkv.emission) co2 = json.envkv.emission;
    else if (json.data && json.data.envkv && json.data.envkv.emission) co2 = json.data.envkv.emission;

    return {
        price,
        title,
        imgUrl,
        firstRegistration,
        co2,
        isProfessionalSeller: true
    } as any;
}
