import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import CommentSection from "../components/CommentSection";
import toast from "react-hot-toast";

export default function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    api
      .get(`/api/posts/${id}`)
      .then((res) => setPost(res.data))
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load post");
      });
  }, [id]);

  if (!post)
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600 text-lg animate-pulse">
        Loading post...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 px-4 py-10">
      <div className="max-w-3xl mx-auto animate-fadeIn">

        {/* Post Card */}
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-gray-200">
          
          {/* Back Button */}
          <Link
            to="/"
            className="text-blue-600 font-medium flex items-center gap-1 hover:underline"
          >
            ← Back
          </Link>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mt-3 leading-tight">
            {post.title}
          </h1>

          {/* Author Box */}
          <div className="mt-3 flex items-center gap-3 bg-gray-50 border border-gray-200 p-3 rounded-xl shadow-sm">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-semibold shadow">
              {post.author?.username?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div>
              <p className="text-gray-700 font-medium">
                {post.author?.username || "Unknown"}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Content */}
          <p className="text-gray-800 mt-6 leading-relaxed text-lg whitespace-pre-line">
            {post.content}
          </p>

          {/* Divider */}
          <div className="border-t border-gray-300 my-6"></div>

          {/* Comments Section */}
          <CommentSection postId={post._id} />
        </div>
      </div>
    </div>
  );
}
