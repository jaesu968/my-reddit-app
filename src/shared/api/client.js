// client side interaction with Reddit API (endpoints, query params, error handling, etc.)
import endpoints from './endpoints'

// All requests go to reddit.com — this is prepended to every path from endpoints.js
const BASE_URL = 'https://www.reddit.com'

// buildUrl takes a path like '/r/popular.json' and an optional params object like { q: 'cats', sort: 'new' }
// It returns a full URL string like 'https://www.reddit.com/r/popular.json?q=cats&sort=new'
// URLSearchParams handles encoding special characters (spaces, &, etc.) automatically
const buildUrl = (path, params = {}) => {
    const url = new URL(path, BASE_URL)
    Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value))
    return url.toString()
}

// Reddit's public JSON API allows ~10 requests per minute without authentication.
// We space requests 6 seconds apart (60s / 10 = 6s) to stay within that limit.
// lastRequestTime tracks when the most recent request was fired.
let lastRequestTime = 0
const RATE_LIMIT_MS = 6000 // 6 seconds between requests (~10 per minute)

// rateLimit() is called before every fetch.
// If we're calling too soon after the last request, it waits out the remaining gap.
// Example: last request was 2s ago → waits 4s before continuing.
const rateLimit = async () => {
    const now = Date.now()
    const timeSinceLastRequest = now - lastRequestTime
    if (timeSinceLastRequest < RATE_LIMIT_MS) {
        await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_MS - timeSinceLastRequest))
    }
    // Update timestamp *after* the wait so the next call measures from now
    lastRequestTime = Date.now()
}

// checkResponse inspects every fetch response before we try to parse it.
// fetch() does NOT throw on HTTP error codes (4xx, 5xx) — response.ok is false but no exception.
// We throw manually so callers (hooks, thunks) can catch errors in one place.
// 429 = Too Many Requests: Reddit is telling us to slow down.
// Any other non-ok status gets a generic error with the status code for easier debugging.
const checkResponse = (response) => {
    if (response.status === 429) {
        throw new Error('Rate limit exceeded — too many requests to Reddit. Wait a moment and try again.')
    }
    if (!response.ok) {
        throw new Error(`Reddit API error: ${response.status} ${response.statusText}`)
    }
}

const redditApi = {
    // Fetches the front-page popular posts (shown on the Home route)
    // Reddit response shape: { data: { children: [{ data: postObject }, ...] } }
    // We unwrap .data on each child to get a flat array of post objects
    getPosts: async () => {
        await rateLimit()
        const url = buildUrl(endpoints.getPosts())
        const response = await fetch(url)
        checkResponse(response)
        const data = await response.json()
        return data.data.children.map((child) => child.data)
    },
    // Fetches posts for a specific subreddit (e.g. 'reactjs' → /r/reactjs.json)
    // The subreddit name is normalized in endpoints.js (strips leading 'r/' if present)
    getPostsBySubreddit: async (subreddit) => {
        await rateLimit()
        const url = buildUrl(endpoints.getPostsBySubreddit(subreddit))
        const response = await fetch(url)
        checkResponse(response)
        const data = await response.json()
        return data.data.children.map((child) => child.data)
    },
    // Fetches comments for a post by its ID
    // Reddit's comments endpoint returns a 2-element array:
    //   data[0] = the post itself (we don't need this here)
    //   data[1] = the comment tree
    // We pull data[1] and unwrap each child the same way as posts
    getComments: async (postId) => {
        await rateLimit()
        const url = buildUrl(endpoints.getComments(postId))
        const response = await fetch(url)
        checkResponse(response)
        const data = await response.json()
        return data[1].data.children.map((child) => child.data)
    },
    // Searches Reddit using the /search.json endpoint
    // buildUrl appends the params as a query string: ?q=cats&type=link&sort=relevance
    // type='link' means posts (Reddit calls posts 'links' internally)
    // sort can be: 'relevance' | 'hot' | 'top' | 'new' | 'comments'
    searchPosts: async (query, type = 'link', sort = 'relevance') => {
        await rateLimit()
        const url = buildUrl(endpoints.searchPosts(), { q: query, type, sort })
        const response = await fetch(url)
        checkResponse(response)
        const data = await response.json()
        return data.data.children.map((child) => child.data)
    },
    // Fetches a list of popular subreddits for the sidebar
    // Same response shape as posts — array of children, each with a .data object
    getSubreddits: async () => {
        await rateLimit()
        const url = buildUrl(endpoints.getSubreddits())
        const response = await fetch(url)
        checkResponse(response)
        const data = await response.json()
        return data.data.children.map((child) => child.data)
    },
}   

export default redditApi; 