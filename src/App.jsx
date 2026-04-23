// src/App.jsx
import { Route, Routes } from 'react-router-dom'
import PostPage from './features/posts/pages/PostPage'
import SubredditPage from './features/subreddits/pages/SubredditPage'
import Explore from './pages/Explore'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Layout from './shared/components/Layout'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<PostPage />} />
        <Route path="/subreddits" element={<SubredditPage />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}