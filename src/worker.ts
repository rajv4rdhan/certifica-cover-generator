/**
 * Cloudflare Worker to extract logo images from websites
 * 
 * Usage:
 * - GET /api?url=https://example.com - Extract logo from the given URL
 * - GET /api?url=https://example.com&return=json - Return JSON with all found logos
 * - GET /api?url=https://example.com&direct=true - Return the logo image directly
 */

interface LogoCandidate {
	url: string;
	source: string;
	score: number;
}

const LOGO_PATTERNS = [
	'/logo.png',
	'/logo.jpg',
	'/logo.jpeg',
	'/logo.svg',
	'/logo.webp',
	'/assets/logo.png',
	'/assets/logo.jpg',
	'/assets/logo.svg',
	'/images/logo.png',
	'/images/logo.jpg',
	'/images/logo.svg',
	'/img/logo.png',
	'/img/logo.jpg',
	'/img/logo.svg',
	'/static/logo.png',
	'/static/logo.jpg',
	'/static/logo.svg',
];

async function extractLogos(targetUrl: string): Promise<LogoCandidate[]> {
	const candidates: LogoCandidate[] = [];
	
	try {
		// Parse the target URL
		const baseUrl = new URL(targetUrl);
		const origin = baseUrl.origin;

		// Fetch the website HTML
		const response = await fetch(targetUrl, {
			headers: {
				'User-Agent': 'Mozilla/5.0 (compatible; LogoExtractorBot/1.0)',
			},
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch ${targetUrl}: ${response.status}`);
		}

		const html = await response.text();

		// 1. Check common logo paths directly
		for (const pattern of LOGO_PATTERNS) {
			const logoUrl = `${origin}${pattern}`;
			candidates.push({
				url: logoUrl,
				source: 'common-pattern',
				score: 50,
			});
		}

		// 2. Extract from HTML - look for <img> tags with logo-related attributes
		const imgRegex = /<img[^>]+>/gi;
		const imgTags = html.match(imgRegex) || [];

		for (const imgTag of imgTags) {
			// Extract src attribute
			const srcMatch = imgTag.match(/src=["']([^"']+)["']/i);
			if (srcMatch) {
				const src = srcMatch[1];
				
				// Check if it's logo-related
				const isLogo = /logo|brand|site-logo|header-logo/i.test(imgTag);
				
				if (isLogo) {
					const absoluteUrl = new URL(src, origin).href;
					candidates.push({
						url: absoluteUrl,
						source: 'img-tag',
						score: 80,
					});
				}
			}
		}

		// 3. Look for Open Graph image
		const ogImageMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
							 html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
		if (ogImageMatch) {
			const absoluteUrl = new URL(ogImageMatch[1], origin).href;
			candidates.push({
				url: absoluteUrl,
				source: 'og-image',
				score: 60,
			});
		}

		// 4. Look for favicon
		const faviconMatch = html.match(/<link[^>]+rel=["'](?:icon|shortcut icon)["'][^>]+href=["']([^"']+)["']/i) ||
							 html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["'](?:icon|shortcut icon)["']/i);
		if (faviconMatch) {
			const absoluteUrl = new URL(faviconMatch[1], origin).href;
			candidates.push({
				url: absoluteUrl,
				source: 'favicon',
				score: 40,
			});
		}

		// 5. Look for apple-touch-icon
		const appleTouchMatch = html.match(/<link[^>]+rel=["']apple-touch-icon["'][^>]+href=["']([^"']+)["']/i) ||
							   html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']apple-touch-icon["']/i);
		if (appleTouchMatch) {
			const absoluteUrl = new URL(appleTouchMatch[1], origin).href;
			candidates.push({
				url: absoluteUrl,
				source: 'apple-touch-icon',
				score: 45,
			});
		}

		// 6. Look for schema.org logo
		const schemaLogoMatch = html.match(/"logo"\s*:\s*"([^"]+)"/i);
		if (schemaLogoMatch) {
			const absoluteUrl = new URL(schemaLogoMatch[1], origin).href;
			candidates.push({
				url: absoluteUrl,
				source: 'schema-org',
				score: 70,
			});
		}

	} catch (error) {
		console.error('Error extracting logos:', error);
	}

	// Remove duplicates and sort by score
	const uniqueLogos = Array.from(
		new Map(candidates.map(c => [c.url, c])).values()
	).sort((a, b) => b.score - a.score);

	return uniqueLogos;
}

async function verifyImageExists(url: string): Promise<boolean> {
	try {
		const response = await fetch(url, { method: 'HEAD' });
		const contentType = response.headers.get('content-type') || '';
		return response.ok && contentType.startsWith('image/');
	} catch {
		return false;
	}
}

export async function handleLogoExtraction(request: Request): Promise<Response> {
	const url = new URL(request.url);
	const targetUrl = url.searchParams.get('url');
	const returnJson = url.searchParams.get('return') === 'json';
	const direct = url.searchParams.get('direct') === 'true';

	// CORS headers
	const corsHeaders = {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'GET, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type',
	};

	// Handle OPTIONS request for CORS
	if (request.method === 'OPTIONS') {
		return new Response(null, { headers: corsHeaders });
	}

	// Show usage if no URL provided
	if (!targetUrl) {
		return new Response(
			JSON.stringify({
				error: 'Missing URL parameter',
				usage: {
					endpoint: `${url.origin}/api`,
					examples: [
						`${url.origin}/api?url=https://example.com`,
						`${url.origin}/api?url=https://example.com&return=json`,
						`${url.origin}/api?url=https://example.com&direct=true`,
					],
				},
			}),
			{
				status: 400,
				headers: {
					'Content-Type': 'application/json',
					...corsHeaders,
				},
			}
		);
	}

	// Validate URL
	try {
		new URL(targetUrl);
	} catch {
		return new Response(
			JSON.stringify({ error: 'Invalid URL provided' }),
			{
				status: 400,
				headers: {
					'Content-Type': 'application/json',
					...corsHeaders,
				},
			}
		);
	}

	try {
		// Extract logos
		const logos = await extractLogos(targetUrl);

		if (logos.length === 0) {
			return new Response(
				JSON.stringify({
					error: 'No logos found',
					url: targetUrl,
				}),
				{
					status: 404,
					headers: {
						'Content-Type': 'application/json',
						...corsHeaders,
					},
				}
			);
		}

		// Return JSON with all found logos
		if (returnJson) {
			return new Response(
				JSON.stringify({
					url: targetUrl,
					logos: logos,
					count: logos.length,
				}),
				{
					headers: {
						'Content-Type': 'application/json',
						...corsHeaders,
					},
				}
			);
		}

		// Find first valid logo
		let validLogo: LogoCandidate | null = null;
		for (const logo of logos) {
			const exists = await verifyImageExists(logo.url);
			if (exists) {
				validLogo = logo;
				break;
			}
		}

		if (!validLogo) {
			return new Response(
				JSON.stringify({
					error: 'No valid logos found',
					url: targetUrl,
					candidates: logos.map(l => l.url),
				}),
				{
					status: 404,
					headers: {
						'Content-Type': 'application/json',
						...corsHeaders,
					},
				}
			);
		}

		// Return the logo image directly
		if (direct) {
			const imageResponse = await fetch(validLogo.url);
			const imageBlob = await imageResponse.blob();
			
			return new Response(imageBlob, {
				headers: {
					'Content-Type': imageResponse.headers.get('content-type') || 'image/png',
					'Cache-Control': 'public, max-age=86400',
					...corsHeaders,
				},
			});
		}

		// Return JSON with the best logo
		return new Response(
			JSON.stringify({
				url: targetUrl,
				logo: validLogo,
			}),
			{
				headers: {
					'Content-Type': 'application/json',
					...corsHeaders,
				},
			}
		);

	} catch (error) {
		return new Response(
			JSON.stringify({
				error: 'Failed to extract logo',
				message: error instanceof Error ? error.message : String(error),
			}),
			{
				status: 500,
				headers: {
					'Content-Type': 'application/json',
					...corsHeaders,
				},
			}
		);
	}
}
