import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	items: [],
	selectedSubreddit: null,
	status: 'idle',
	error: null,
}

const subredditSlice = createSlice({
	name: 'subreddits',
	initialState,
	reducers: {
		setSubreddits: (state, action) => {
			state.items = action.payload
		},
		setSelectedSubreddit: (state, action) => {
			state.selectedSubreddit = action.payload
		},
		setSubredditsStatus: (state, action) => {
			state.status = action.payload
		},
		setSubredditsError: (state, action) => {
			state.error = action.payload
		},
	},
})

export const {
	setSubreddits,
	setSelectedSubreddit,
	setSubredditsStatus,
	setSubredditsError,
} = subredditSlice.actions

export default subredditSlice.reducer
