import React, { useState } from "react";
import api from "../api";
import toast from "react-hot-toast";

export default function PostForm({ onCreated }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/posts", { title, content });
      toast.success("Post created successfully!");
      setTitle("");
      setContent("");
      if (onCreated) onCreated();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.error || "Failed to create post");
    }
  };

  return (
    <form
      onSubmit={submit}
      className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-gray-200 transition hover:shadow-2xl mb-6"
    >
      <h3 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
        📝 Create a New Post
      </h3>

      {/* Title */}
      <div className="mb-4">
        <label className="block text-gray-600 text-sm font-medium mb-1">
          Title
        </label>
        <input
          className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition outline-none"
          placeholder="Enter post title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      {/* Content */}
      <div className="mb-4">
        <label className="block text-gray-600 text-sm font-medium mb-1">
          Content
        </label>
        <textarea
          className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition outline-none"
          placeholder="Write something amazing..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="5"
          required
        ></textarea>
      </div>

      {/* Create button */}
      <div className="flex justify-end">
        <button
          className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:opacity-90 active:scale-95 transition-all"
        >
          Create Post
        </button>
      </div>
    </form>
  );
}
