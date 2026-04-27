// hooks for posts feature
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import postsApi from './api'
import { setPosts, setPostsStatus, setPostsError } from './postSlice'

// custom hook to fetch posts and manage state
export const usePosts = () => {
    const dispatch = useDispatch() // get posts state from the store
    const { items, status, error } = useSelector((state) => state.posts) // get posts state from the store

    // fetch posts when the component mounts 
    useEffect(() => {
        dispatch(setPostsStatus('loading')) // set loading status
        postsApi.getPosts() // fetch posts from the API
            .then((posts) => {
                dispatch(setPosts(posts)) // save posts to the store
                dispatch(setPostsStatus('succeeded')) // set success status
            })
            .catch((err) => {
                dispatch(setPostsError(err.message)) // save error message to the store
                dispatch(setPostsStatus('failed')) // set failed status
            })
    }, [dispatch]) // dispatch is a stable reference, so this effect will only run once on mount
    return { items, status, error } // return posts data and status for the component to use
}
// custom hook to fetch posts by subreddit and manage state
export const usePostsBySubreddit = (subreddit) => {
    const dispatch = useDispatch() // get posts state from the store
    const { items, status, error } = useSelector((state) => state.posts) // get posts state from the store

    // fetch posts for the given subreddit when it changes
    useEffect(() => {
        if (!subreddit) return // if no subreddit is provided, do nothing
        dispatch(setPostsStatus('loading')) // set loading status
        postsApi.getPostsBySubreddit(subreddit) // fetch posts for the subreddit from the API
            .then((posts) => {
                dispatch(setPosts(posts)) // save posts to the store
                dispatch(setPostsStatus('succeeded')) // set success status
            })
            .catch((err) => {
                dispatch(setPostsError(err.message)) // save error message to the store
                dispatch(setPostsStatus('failed')) // set failed status
            })
    }, [dispatch, subreddit]) // dispatch is a stable reference, so this effect will only run once on mount
    return { items, status, error } // return posts data and status for the component to use
}
// custom hook to search posts and manage state
export const useSearchPosts = (query, type, sort) => {
    const dispatch = useDispatch() // get posts state from the store
    const { items, status, error } = useSelector((state) => state.posts) // get posts state from the store

    // fetch search results when the query, type, or sort changes
    useEffect(() => {
        const trimmedQuery = query?.trim() ?? ''
        if (!trimmedQuery) return // skip empty or whitespace-only search terms
        dispatch(setPostsStatus('loading')) // set loading status
        postsApi.searchPosts(trimmedQuery, type, sort) // search posts from the API
            .then((posts) => {
                dispatch(setPosts(posts)) // save posts to the store
                dispatch(setPostsStatus('succeeded')) // set success status
            })
            .catch((err) => {
                dispatch(setPostsError(err.message)) // save error message to the store
                dispatch(setPostsStatus('failed')) // set failed status
            })
    }, [dispatch, query, type, sort]) // dispatch is a stable reference, so this effect will only run once on mount
    return { items, status, error } // return posts data and status for the component to use 
}