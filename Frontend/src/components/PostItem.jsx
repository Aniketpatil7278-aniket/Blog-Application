import React, { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PostForm from "./PostForm";

export default function PostItem({ post, onDeleted, onUpdated }) {
  const navigate = useNavigate();
  const [likeCount, setLikeCount] = useState(
    post.likeCount || post.likes?.length || 0
  );
  const [liked, setLiked] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const cur = localStorage.getItem("currentUser");
    if (cur) {
      try {
        const parsed = JSON.parse(cur);
        setCurrentUserId(parsed.id);
      } catch {
        setCurrentUserId(null);
      }
    }
  }, []);

  const isOwner =
    currentUserId &&
    (post.author?._id ? post.author._id === currentUserId : post.author === currentUserId);

  const toggleLike = async () => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Login to like posts");

    try {
      const res = await api.post(`/api/posts/${post._id}/like`);
      setLikeCount(res.data.likeCount);
      setLiked(res.data.liked);
    } catch (e) {
      console.error(e);
    }
  };

  const deletePost = async () => {
    if (!confirm("Delete this post?")) return;
    try {
      await api.delete(`/api/posts/${post._id}`);
      toast.success("Post deleted");
      onDeleted?.();
    } catch (err) {
      toast.error(err?.response?.data?.error || "Delete failed");
    }
  };

  if (editing) {
    return (
      <div className="p-5 bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl shadow">
        <PostForm
          post={post}
          onUpdated={(p) => {
            setEditing(false);
            onUpdated?.(p);
          }}
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="p-6 bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow hover:shadow-lg transition">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h3
            onClick={() => navigate(`/posts/${post._id}`)}
            className="text-2xl font-semibold text-gray-900 hover:text-blue-600 cursor-pointer transition"
          >
            {post.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            By{" "}
            <span className="font-medium text-gray-700">
              {post.author?.username || "Unknown"}
            </span>
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">
          {/* LIKE BUTTON */}
          <button
            onClick={toggleLike}
            className={`flex items-center gap-2 px-3 py-1 rounded-full transition ${
              liked ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"
            } hover:bg-red-200`}
          >
            <span className="text-lg">❤️</span>
            <span className="font-medium">{likeCount}</span>
          </button>

          {/* EDIT + DELETE */}
          {isOwner && (
            <>
              <button
                onClick={() => setEditing(true)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Edit
              </button>
              <button
                onClick={deletePost}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* CONTENT PREVIEW */}
      <p className="mt-4 text-gray-700 leading-relaxed">
        {post.content.length > 250
          ? post.content.slice(0, 250) + "..."
          : post.content}
      </p>

      {/* TAGS */}
      <div className="mt-4 flex flex-wrap gap-2">
        {post.tags?.map((t) => (
          <span
            key={t}
            className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
          >
            #{t}
          </span>
        ))}
      </div>
    </div>
  );
}
