import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import PostPage from "./pages/PostPage";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import SearchBar from "./components/SearchBar";
import api from "./api";
import toast from "react-hot-toast";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const cur = localStorage.getItem("currentUser");
    if (cur) {
      try {
        setCurrentUser(JSON.parse(cur));
      } catch {
        localStorage.removeItem("currentUser");
      }
    }

    if (token && !cur) {
      api
        .get("/api/me")
        .then((res) => {
          if (res.data && res.data.user) {
            const u = {
              id: res.data.user._id,
              username: res.data.user.username,
              avatar: res.data.user.avatar,
            };
            localStorage.setItem("currentUser", JSON.stringify(u));
            setCurrentUser(u);
          }
        })
        .catch((err) => {
          if (err?.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("currentUser");
            setCurrentUser(null);
          }
        });
    }
  }, [token]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    toast.success("Logged out");
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      
      <header className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          {/* Left Logo */}
          <div className="flex items-center gap-4">
            <Link to="/" className="text-2xl font-bold text-blue-600 tracking-wide">
              MyBlog
            </Link>
            <Link to="/" className="text-gray-700 hover:text-black font-medium hidden md:block">
              Home
            </Link>
          </div>

          {/* Center Search */}
          <div className="hidden md:block w-1/3">
            <SearchBar />
          </div>

          {/* Right Menu */}
          <div className="flex items-center gap-4">
            {!token && (
              <Link
                to="/auth"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
              >
                Login / Register
              </Link>
            )}

            {token && currentUser && (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2"
                >
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium">
                    {currentUser.username[0].toUpperCase()}
                  </div>
                  <span className="hidden md:block font-medium text-gray-700">
                    {currentUser.username}
                  </span>
                </button>

                {/* Dropdown */}
                {menuOpen && (
                  <div className="absolute right-0 bg-white shadow-lg mt-3 rounded-md w-40 py-2 text-sm border">
                    <Link
                      to={`/profile/${currentUser.id}`}
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-2xl text-gray-700"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile dropdown when logged out */}
        {!token && menuOpen && (
          <div className="md:hidden bg-white border-t p-4">
            <SearchBar />
          </div>
        )}

        {/* Mobile dropdown when logged in */}
        {token && currentUser && menuOpen && (
          <div className="md:hidden bg-white border-t p-4 space-y-3">
            <SearchBar />
            <Link
              to={`/profile/${currentUser.id}`}
              onClick={() => setMenuOpen(false)}
              className="block px-2 py-1 hover:text-blue-700"
            >
              Profile
            </Link>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded-md w-full"
            >
              Logout
            </button>
          </div>
        )}
      </header>

      {/* Routes */}
      <main className="max-w-6xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<PostPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
        </Routes>
      </main>
    </div>
  );
}
