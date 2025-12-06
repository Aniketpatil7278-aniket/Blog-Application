import React from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import PostPage from "./pages/PastPage";
import AuthPage from "./pages/AuthPage";
import toast from "react-hot-toast";

export default function App() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out");
    navigate("/");
    window.location.reload();
  };

  // detect if we are on auth page
  const isAuthPage = location.pathname === "/auth";

  return (
    <div className="min-h-screen">
      
      {/* NAVBAR (hidden only on auth page if you want) */}
      <header
        className={`sticky top-0 z-20 backdrop-blur-md bg-white/70 border-b border-gray-200 shadow-sm ${
          isAuthPage ? "hidden" : ""
        }`}
      >
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            MyBlog
          </Link>

          <nav className="flex items-center gap-4">
            {!token && (
              <Link
                to="/auth"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition active:scale-95"
              >
                Login / Register
              </Link>
            )}
            {token && (
              <button
                onClick={logout}
                className="px-4 py-2 rounded-lg bg-red-500 text-white shadow hover:bg-red-600 transition active:scale-95"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* PAGE CONTENT */}
      <main
        className={`${
          isAuthPage
            ? "min-h-screen w-full" // full screen for auth
            : "max-w-5xl mx-auto px-6 py-10" // normal for others
        }`}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<PostPage />} />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
      </main>
    </div>
  );
}
