import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  upVotes: 0,
  downVotes: 0,
}

const votesSlice = createSlice({
  name: 'votes',
  initialState,
  reducers: {
    upVote: (state) => {
      state.upVotes += 1
    },
    downVote: (state) => {
      state.downVotes += 1
    },
    removeUpVote: (state) => {
      state.upVotes = Math.max(0, state.upVotes - 1)
    },
    removeDownVote: (state) => {
      state.downVotes = Math.max(0, state.downVotes - 1)
    },
    resetVotes: (state) => {
      state.upVotes = 0
      state.downVotes = 0
    },
  },
})

export const { upVote, downVote, removeUpVote, removeDownVote, resetVotes } = votesSlice.actions

// Backward-compatible aliases so existing callers of increment/decrement still work.
export const increment = upVote
export const decrement = downVote

const selectVotesState = (state) => state.votes ?? state.counter

export const selectUpVotes = (state) => selectVotesState(state).upVotes
export const selectDownVotes = (state) => selectVotesState(state).downVotes
export const selectVoteScore = (state) => selectVotesState(state).upVotes - selectVotesState(state).downVotes

export default votesSlice.reducer
