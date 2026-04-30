// Netlify serverless function that proxies requests to Reddit.
// This is needed because the _redirects proxy rule cannot set custom request headers.
// Reddit returns 403 from datacenter IPs unless a User-Agent header is present.
export const handler = async (event) => {
    // event.path may be the function path itself when called via redirect with :splat.
    // Use event.rawUrl to reliably extract the original /api/* path.
    const rawPath = new URL(event.rawUrl).pathname
    const redditPath = rawPath.replace(/^\/api/, '') || '/'
    const queryString = event.rawQuery ? `?${event.rawQuery}` : ''
    const url = `https://www.reddit.com${redditPath}${queryString}`

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'reddit-mini-client/1.0',
                'Accept': 'application/json',
            },
        })

        const body = await response.text()

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
