// src/App.jsx
import { Route, Routes } from 'react-router-dom'
import PostPage from './features/posts/pages/PostPage'
import NotFound from './pages/NotFound'
import Layout from './shared/components/Layout'
import SubredditPage from './features/subreddits/pages/SubredditPage'


export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<PostPage />} />
        <Route path="/posts" element={<PostPage />} />
        <Route path="/subreddits" element={<SubredditPage/>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}