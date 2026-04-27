// using specifc API cals for posts 
import redditApi from '../../shared/api/client'

// We can export specific API calls related to posts here, and keep the generic client in shared/api/client.js

const postsApi = {
    getPosts:() => redditApi.getPosts(), 
    getPostsBySubreddit: (subreddit) => redditApi.getPostsBySubreddit(subreddit),
    searchPosts: (query, type, sort) => redditApi.searchPosts(query, type, sort),
}

export default postsApi; 