// src/App.jsx
import { Route, Routes } from 'react-router-dom'
import PostPage from './features/posts/pages/PostPage'
import NotFound from './pages/NotFound'
import Layout from './shared/components/Layout'
import SubredditPage from './features/subreddits/pages/SubredditPage'
import { useState } from 'react'


export default function App() {
  const [query, setQuery] = useState('')
  return (
    <Layout query={query} onQueryChange={setQuery}>
      <Routes>
        <Route path="/" element={<PostPage query={query}/>} />
        <Route path="/subreddits" element={<SubredditPage query={query}/>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}