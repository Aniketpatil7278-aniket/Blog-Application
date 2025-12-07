import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import CommentSection from "../components/CommentSection";
import toast from "react-hot-toast";
import PostForm from "../components/PostForm";

export default function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/posts/${id}`);
      setPost(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load post");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const handleUpdated = () => {
    setEditing(false);
    fetchPost(); // refresh post after update
  };

  if (loading) {
    return (
      <div className="p-8 bg-white rounded-xl shadow-lg text-center">
        Loading post...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="p-8 bg-white rounded-xl shadow-lg text-center">
        Post not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg animate-fadeIn">
      {/* BACK BUTTON */}
      <Link
        to="/"
        className="text-blue-600 text-sm hover:underline flex items-center gap-1"
      >
        ← Back to posts
      </Link>

      {/* VIEW MODE */}
      {!editing && (
        <>
          <h1 className="text-3xl font-extrabold mt-3 text-gray-900">
            {post.title}
          </h1>

          <p className="text-gray-700 leading-relaxed my-6 whitespace-pre-wrap">
            {post.content}
          </p>

          <p className="text-sm text-gray-500 mb-6">
            Written by{" "}
            <span className="font-medium text-gray-700">
              {post.author?.username || "Unknown"}
            </span>
          </p>
        </>
      )}

      {/* EDIT MODE */}
      {editing && (
        <div className="bg-gray-50 p-5 rounded-xl border">
          <PostForm
            post={post}
            onUpdated={handleUpdated}
            onCancel={() => setEditing(false)}
          />
        </div>
      )}

      {/* COMMENTS */}
      <CommentSection postId={post._id} />
    </div>
  );
}
