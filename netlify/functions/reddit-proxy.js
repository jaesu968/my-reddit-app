// Netlify serverless function that proxies requests to Reddit.
// This is needed because the _redirects proxy rule cannot set custom request headers.
// Reddit returns 403 from datacenter IPs unless a User-Agent header is present.
export const handler = async (event) => {
    // event.path is the function's own path when called via redirect without :splat.
    // Use event.rawUrl to reliably get the original request URL (e.g. /api/subreddits/popular.json).
    const originalPath = new URL(event.rawUrl).pathname
    const redditPath = originalPath.replace(/^\/api/, '') || '/'
    const queryString = event.rawQuery ? `?${event.rawQuery}` : ''
    const hosts = ['https://www.reddit.com', 'https://old.reddit.com', 'https://api.reddit.com']

    try {
        let response
        let resolvedUrl = ''

        for (const host of hosts) {
            const url = `${host}${redditPath}${queryString}`
            console.log('[reddit-proxy] originalPath:', originalPath, '→ fetching:', url)
            response = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                    'Accept': 'application/json, text/plain, */*',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Cache-Control': 'no-cache',
                },
            })

            // Retry on common edge-block statuses from Reddit.
            if (response.status !== 403 && response.status !== 429) {
                resolvedUrl = url
                break
            }
        }

        const body = await response.text()
        console.log('[reddit-proxy] status:', response.status, 'from:', resolvedUrl || 'fallback exhausted')

        return {
            statusCode: response.status,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body,
        }
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message }),
        }
    }
}
