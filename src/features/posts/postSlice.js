import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	items: [],
	selectedPost: null,
	status: 'idle',
	error: null,
}

const postSlice = createSlice({
	name: 'posts',
	initialState,
	reducers: {
		setPosts: (state, action) => {
			state.items = action.payload
		},
		setSelectedPost: (state, action) => {
			state.selectedPost = action.payload
		},
		setPostsStatus: (state, action) => {
			state.status = action.payload
		},
		setPostsError: (state, action) => {
			state.error = action.payload
		},
	},
})

export const { setPosts, setSelectedPost, setPostsStatus, setPostsError } = postSlice.actions
export default postSlice.reducer
