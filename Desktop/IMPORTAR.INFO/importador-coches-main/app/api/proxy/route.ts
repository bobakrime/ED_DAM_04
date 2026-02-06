import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const url = request.nextUrl.searchParams.get('url');
    if (!url) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    try {
        // Basic validation
        if (!url.includes('mobile.de') && !url.includes('autoscout24')) {
            return NextResponse.json({ error: 'URL no soportada. Usa mobile.de o autoscout24.' }, { status: 400 });
        }

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
                'Referer': 'https://suchen.mobile.de/',
                'Cache-Control': 'no-cache',
                'Upgrade-Insecure-Requests': '1',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-User': '?1',
            },
        });

        if (!response.ok) {
            return NextResponse.json({ error: `Failed to fetch: ${response.status}` }, { status: response.status });
        }

        const html = await response.text();

        // Return the HTML with CORS headers allowing the client to read it
        return new NextResponse(html, {
            headers: {
                'Content-Type': 'text/html',
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch (error) {
        console.error('Proxy error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
