import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import PostPage from './pages/PostPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import SearchBar from './components/SearchBar';
import api from './api';
import toast from 'react-hot-toast';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    // Load currentUser from localStorage first (fast)
    const cur = localStorage.getItem('currentUser');
    if (cur) {
      try {
        setCurrentUser(JSON.parse(cur));
      } catch (e) {
        localStorage.removeItem('currentUser');
      }
    }

    // If logged in but no currentUser, try to fetch it from /api/me
    if (token && !cur) {
      api.get('/api/me')
        .then(res => {
          if (res.data && res.data.user) {
            const u = { id: res.data.user._id, username: res.data.user.username, avatar: res.data.user.avatar };
            localStorage.setItem('currentUser', JSON.stringify(u));
            setCurrentUser(u);
          }
        })
        .catch(err => {
          console.warn('Could not fetch current user', err?.response?.data || err.message);
          // clear token if invalid
          if (err?.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('currentUser');
            setCurrentUser(null);
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    toast.success('Logged out');
    navigate('/');
    // reload to reset pages that rely on stored state
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-2xl font-bold">My Blog</Link>
            {/* Home link added here */}
            <Link to="/" className="text-gray-600 hover:underline">Home</Link>
          </div>

          <div className="flex items-center gap-4">
            <SearchBar />

            {!token && (
              <Link to="/auth" className="text-blue-600">Login / Register</Link>
            )}

            {token && currentUser && (
              <div className="flex items-center gap-3">
                <Link
                  to={`/profile/${currentUser.id}`}
                  className="flex items-center gap-2 text-sm text-gray-700 hover:underline"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-700">
                    {currentUser.username ? currentUser.username[0].toUpperCase() : 'U'}
                  </div>
                  <span>{currentUser.username}</span>
                </Link>

                <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
              </div>
            )}

            {token && !currentUser && (
              // Fallback while fetching user
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Loading...</span>
                <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
              </div>
            )}
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/posts/:id" element={<PostPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}