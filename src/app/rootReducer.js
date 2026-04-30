import { combineReducers } from '@reduxjs/toolkit'
import commentsReducer from '../features/comments/commentSlice'
import postsReducer from '../features/posts/postSlice'
import subredditsReducer from '../features/subreddits/subredditSlice'
import votesReducer from '../features/votes/votesSlice'

const rootReducer = combineReducers({
	votes: votesReducer,
	posts: postsReducer,
	comments: commentsReducer,
	subreddits: subredditsReducer,
})

export default rootReducer
