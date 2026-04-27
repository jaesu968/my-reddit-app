// using specific API calls for subreddits
import redditApi from '../../shared/api/client'

const subredditsApi = {
    getSubreddits: () => redditApi.getSubreddits(),
}

export default subredditsApi;