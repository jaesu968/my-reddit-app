let cachedToken = null
let cachedTokenExpiresAt = 0

const DEFAULT_USER_AGENT = 'reddit-mini-client/1.0 (by /u/reddit-mini-app)'

// Public-mode fallback used when OAuth credentials are missing or unavailable.
const fetchPublicJson = async (redditPath, queryString, userAgent) => {
  const publicUrl = `https://www.reddit.com${redditPath}${queryString}`
  const response = await fetch(publicUrl, {
    headers: {
      'User-Agent': userAgent,
      Accept: 'application/json, text/plain, */*',
    },
  })

  const body = await response.text()
  return {
    statusCode: response.status,
    contentType: response.headers.get('content-type') || 'application/json',
    authMode: 'public',
    body,
  }
}

// Fetch and cache an app-only OAuth token to reduce auth calls per invocation.
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

// Convert Vercel's incoming request URL into a Reddit path and query string.
const parseRedditPath = (urlString, req) => {
  const protocol = req.headers['x-forwarded-proto'] || 'https'
  const host = req.headers.host || 'localhost'
  const url = new URL(urlString, `${protocol}://${host}`)
  const redditPath = url.pathname.replace(/^\/api/, '') || '/'
  const queryString = url.search || ''
  return { redditPath, queryString }
}

export default async function handler(req, res) {
  const { redditPath, queryString } = parseRedditPath(req.url, req)

  const clientId = process.env.REDDIT_CLIENT_ID
  const clientSecret = process.env.REDDIT_CLIENT_SECRET
  const userAgent = process.env.REDDIT_USER_AGENT || DEFAULT_USER_AGENT

  // If secrets are not configured, keep the app working via public Reddit endpoints.
  if (!clientId || !clientSecret) {
    console.warn('[reddit-proxy] Missing OAuth env vars. Falling back to public Reddit JSON API.')
    const result = await fetchPublicJson(redditPath, queryString, userAgent)
    res.setHeader('Content-Type', result.contentType)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('X-Reddit-Auth-Mode', result.authMode)
    return res.status(result.statusCode).send(result.body)
  }

  try {
    const oauthUrl = `https://oauth.reddit.com${redditPath}${queryString}`
    console.log('[reddit-proxy] oauth fetch:', oauthUrl)

    // Primary request path: OAuth-backed fetch for higher reliability/rate limits.
    const token = await getOAuthToken(clientId, clientSecret, userAgent)
    let response = await fetch(oauthUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent': userAgent,
        Accept: 'application/json, text/plain, */*',
      },
    })

    // Retry once with a refreshed token when Reddit rejects the cached token.
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
    console.log('[reddit-proxy] status:', response.status, 'path:', redditPath)

    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('X-Reddit-Auth-Mode', 'oauth')
    return res.status(response.status).send(body)
  } catch (err) {
    // Final safety net: if OAuth flow breaks, try public mode before returning 500.
    console.error('[reddit-proxy] OAuth flow failed, falling back to public API:', err.message)
    try {
      const fallback = await fetchPublicJson(redditPath, queryString, userAgent)
      res.setHeader('Content-Type', fallback.contentType)
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('X-Reddit-Auth-Mode', fallback.authMode)
      return res.status(fallback.statusCode).send(fallback.body)
    } catch (fallbackErr) {
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Access-Control-Allow-Origin', '*')
      return res.status(500).json({ error: fallbackErr.message })
    }
  }
}
