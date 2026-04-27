// custom hooks for subreddits feature
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import subredditsApi from './api'
import { setSubreddits, setSubredditsStatus, setSubredditsError } from './subredditSlice'

// custom hook to fetch subreddits and manage state
export const useSubreddits = () => {
    const dispatch = useDispatch() // get subreddits state from the store
    const { items, status, error } = useSelector((state) => state.subreddits) // get subreddits state from the store

    // fetch subreddits when the component mounts
    useEffect(() => {
        dispatch(setSubredditsStatus('loading')) // set loading status
        subredditsApi.getSubreddits() // fetch subreddits from the API
            .then((subreddits) => {
                dispatch(setSubreddits(subreddits)) // save subreddits to the store
                dispatch(setSubredditsStatus('succeeded')) // set success status
            })
            .catch((err) => {
                dispatch(setSubredditsError(err.message)) // save error message to the store
                dispatch(setSubredditsStatus('failed')) // set failed status
            })
    }, [dispatch]) // dispatch is a stable reference, so this effect will only run once on mount
    return { items, status, error } // return subreddits data and status for the component to use
}