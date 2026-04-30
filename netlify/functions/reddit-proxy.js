// Netlify serverless function that proxies requests to Reddit.
// For policy compliance and reliability, production traffic should use app-only OAuth.

let cachedToken = null
let cachedTokenExpiresAt = 0

const DEFAULT_USER_AGENT = ''

const getOAuthToken = async (clientId, clientSecret, userAgent) => {
    const now = Date.now()
    if (cachedToken && now < cachedTokenExpiresAt - 60_000) {
        return cachedToken
    }

    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    const response = await fetch('https://www.reddit.com/api/v1/access_token', {
        method: 'POST',
        headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': userAgent,
        },
        body: 'grant_type=client_credentials',
    })

    if (!response.ok) {
        throw new Error(`OAuth token request failed: ${response.status} ${response.statusText}`)
    }

    const tokenPayload = await response.json()
    cachedToken = tokenPayload.access_token
    cachedTokenExpiresAt = now + (tokenPayload.expires_in || 3600) * 1000
    return cachedToken
}

export const handler = async (event) => {
    const originalPath = new URL(event.rawUrl).pathname
    const redditPath = originalPath.replace(/^\/api/, '') || '/'
    const queryString = event.rawQuery ? `?${event.rawQuery}` : ''

    const clientId = process.env.REDDIT_CLIENT_ID
    const clientSecret = process.env.REDDIT_CLIENT_SECRET
    const userAgent = process.env.REDDIT_USER_AGENT || DEFAULT_USER_AGENT

    if (!clientId || !clientSecret || !userAgent) {
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                error:
                    'Missing Reddit API configuration. Set REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET, and REDDIT_USER_AGENT in Netlify environment variables.',
            }),
        }
    }

    try {
        let response
        let resolvedUrl

        const token = await getOAuthToken(clientId, clientSecret, userAgent)
        const oauthUrl = `https://oauth.reddit.com${redditPath}${queryString}`
        console.log('[reddit-proxy] oauth fetch:', oauthUrl)

        response = await fetch(oauthUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
                'User-Agent': userAgent,
                Accept: 'application/json, text/plain, */*',
            },
        })
        resolvedUrl = oauthUrl

        // If token expires or is rejected, refresh once and retry.
        if (response.status === 401 || response.status === 403) {
            cachedToken = null
            cachedTokenExpiresAt = 0
            const freshToken = await getOAuthToken(clientId, clientSecret, userAgent)
            response = await fetch(oauthUrl, {
                headers: {
                    Authorization: `Bearer ${freshToken}`,
                    'User-Agent': userAgent,
                    Accept: 'application/json, text/plain, */*',
                },
            })
        }

        const body = await response.text()
        console.log('[reddit-proxy] originalPath:', originalPath, 'status:', response.status, 'from:', resolvedUrl)

        return {
            statusCode: response.status,
            headers: {
                'Content-Type': response.headers.get('content-type') || 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body,
        }
    } catch (err) {
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ error: err.message }),
        }
    }
}
