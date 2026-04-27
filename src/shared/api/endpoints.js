// Define Reddit API endpoint builders in one place.
// Keep this file path-only. Query params belong in the API client layer.

// Accept both "reactjs" and "r/reactjs" and normalize to "reactjs".
const normalizeSubreddit = (subreddit = '') => subreddit.replace(/^r\//i, '').trim()

// Ensure every endpoint path ends with .json.
const toJsonPath = (path) => (path.endsWith('.json') ? path : `${path}.json`)

const endpoints = {
  // Popular feed route.
  getPosts: () => toJsonPath('/r/popular'),

  // Posts for a specific subreddit.
  getPostsBySubreddit: (subreddit) => toJsonPath(`/r/${normalizeSubreddit(subreddit)}`),

  // Post detail/comments listing by post id.
  getComments: (postId) => toJsonPath(`/comments/${postId}`),

  // Search endpoint path only. Pass q/type/sort params in the API layer.
  searchPosts: () => toJsonPath('/search'),

  // Popular subreddit listing.
  getSubreddits: () => toJsonPath('/subreddits/popular'),
}

export default endpoints;