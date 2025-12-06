import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/posts");
      setPosts(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading)
    return (
      <div className="text-center py-10 text-gray-600 animate-pulse text-lg">
        Loading posts...
      </div>
    );

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.length === 0 && (
        <div className="text-center text-gray-500 text-lg col-span-full">
          No posts yet.
        </div>
      )}

      {posts.map((post) => (
        <div
          key={post._id}
          className="bg-white/70 backdrop-blur-lg border border-gray-200 p-5 rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer"
          onClick={() => navigate(`/posts/${post._id}`)}
        >
          {/* Title */}
          <h3 className="text-2xl font-semibold text-blue-700 hover:underline">
            {post.title}
          </h3>

          {/* Author */}
          <p className="text-sm text-gray-500 mt-1">
            By <span className="font-medium">{post.author?.username || "Unknown"}</span>
          </p>

          {/* Content Preview */}
          <p className="mt-3 text-gray-700 leading-relaxed">
            {post.content.length > 200
              ? post.content.slice(0, 200) + "..."
              : post.content}
          </p>

          {/* Footer Line */}
          <div className="mt-4 flex items-center justify-between text-gray-400 text-xs">
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            <span className="text-blue-600 font-medium">Read more →</span>
          </div>
        </div>
      ))}
    </div>
  );
}
