import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	items: [],
	status: 'idle',
	error: null,
}

const commentSlice = createSlice({
	name: 'comments',
	initialState,
	reducers: {
		setComments: (state, action) => {
			state.items = action.payload
		},
		setCommentsStatus: (state, action) => {
			state.status = action.payload
		},
		setCommentsError: (state, action) => {
			state.error = action.payload
		},
	},
})

export const { setComments, setCommentsStatus, setCommentsError } = commentSlice.actions
export default commentSlice.reducer
