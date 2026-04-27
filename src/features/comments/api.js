// using specfic API calls for comments
import redditApi from '../../shared/api/client'

// we can export specific API calls related to comments here, and keep the generic client in shared/api/client.js

const commentsApi = {
    getComments: (postId) => redditApi.getComments(postId),
}

export default commentsApi;