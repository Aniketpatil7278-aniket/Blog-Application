import React, { useState } from "react";
import PostForm from "../components/PostForm";
import PostList from "../components/PostList";

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(false);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-100 via-white to-gray-200 px-4 py-10">
      {/* Center container */}
      <div className="max-w-4xl mx-auto space-y-10 animate-fadeIn">

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🌟 Welcome to Your Blog
          </h1>
          <p className="text-gray-600 text-lg">
            Share your thoughts & explore posts from the community.
          </p>
        </div>

        {/* Post Form */}
        <PostForm onCreated={() => setRefreshKey((k) => !k)} />

        {/* Divider Line */}
        <div className="border-t border-gray-300 my-4"></div>

        {/* Post List */}
        <PostList key={String(refreshKey)} />
      </div>
    </div>
  );
}
