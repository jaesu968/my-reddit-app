import { combineReducers } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import commentsReducer from '../features/comments/commentSlice'
import counterReducer from '../features/counter/counterSlice'
import postsReducer from '../features/posts/postSlice'
import subredditsReducer from '../features/subreddits/subredditSlice'

const rootReducer = combineReducers({
	counter: counterReducer,
	posts: postsReducer,
	comments: commentsReducer,
	auth: authReducer,
	subreddits: subredditsReducer,
})

export default rootReducer
