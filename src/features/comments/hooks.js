// hooks for comments feature 
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import commentsApi from './api'
import { setComments, setCommentsStatus, setCommentsError } from './commentSlice'

// custom hook to fetch comments for a post and manage state 
export const useComments = (postId) => {
    const dispatch = useDispatch() // get comments state from the store
    const { items, status, error } = useSelector((state) => state.comments) // get comments state from the store

    // fetch comments when the postId changes
    useEffect(() => {
        if (!postId) return // if no postId is provided, do nothing
        dispatch(setCommentsStatus('loading')) // set loading status
        commentsApi.getComments(postId) // fetch comments for the post from the API
            .then((comments) => {
                dispatch(setComments(comments)) // save comments to the store
                dispatch(setCommentsStatus('succeeded')) // set success status
            })
            .catch((err) => {
                dispatch(setCommentsError(err.message)) // save error message to the store
                dispatch(setCommentsStatus('failed')) // set failed status
            })
    }, [dispatch, postId]) // dispatch is a stable reference, so this effect will only run when postId changes
    return { items, status, error } // return comments data and status for the component to use
}