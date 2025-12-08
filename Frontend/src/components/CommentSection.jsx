import React, { useEffect, useState } from "react";
import api from "../api";
import toast from "react-hot-toast";

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  const getCurrentUserId = () => {
    const cur = localStorage.getItem("currentUser");
    if (!cur) return null;
    try {
      return JSON.parse(cur).id;
    } catch {
      return null;
    }
  };

  const fetchComments = async () => {
    try {
      const res = await api.get(`/api/comments?post_id=${postId}`);
      setComments(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load comments");
    }
  };

  useEffect(() => {
    if (postId) fetchComments();
  }, [postId]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/comments", { postId, content: text });
      toast.success("Comment added");
      setText("");
      fetchComments();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.error || "Failed to add comment");
    }
  };

  const onDelete = async (id) => {
    if (!confirm("Delete comment?")) return;
    try {
      await api.delete(`/api/comments/${id}`);
      toast.success("Deleted");
      fetchComments();
    } catch (err) {
      console.error(err);
      const message = err?.response?.data?.error || "Failed to delete";
      toast.error(message);
    }
  };

  const onEdit = async (c) => {
    const newText = prompt("Edit comment", c.content);
    if (newText === null) return;
    try {
      await api.put(`/api/comments/${c._id}`, { content: newText });
      toast.success("Updated");
      fetchComments();
    } catch (err) {
      console.error(err);
      const message = err?.response?.data?.error || "Update failed";
      toast.error(message);
    }
  };

  const currentUserId = getCurrentUserId();

  return (
    <div className="mt-8 p-6 bg-white/30 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-xl">
      <h4 className="text-xl font-semibold mb-4 text-gray-800">💬 Comments</h4>

      {/* COMMENT LIST */}
      <div className="space-y-4">
        {comments.map((c) => {
          const isOwner =
            currentUserId &&
            (c.author && (c.author._id ? c.author._id === currentUserId : c.author === currentUserId));

          return (
            <div key={c._id} className="p-4 bg-white/80 rounded-xl shadow-md">
              <p className="text-gray-900 text-lg">{c.content}</p>

              <p className="text-xs text-gray-600 mt-1">
                By <span className="font-semibold">{c.author?.username || "Unknown"}</span> •{" "}
                {new Date(c.createdAt).toLocaleString()}
              </p>

              <div className="mt-3 flex gap-4">
                {isOwner && (
                  <>
                    <button
                      onClick={() => onEdit(c)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-semibold transition"
                    >
                      ✏ Edit
                    </button>

                    <button
                      onClick={() => onDelete(c._id)}
                      className="text-red-600 hover:text-red-800 text-sm font-semibold transition"
                    >
                      🗑 Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD COMMENT */}
      <form onSubmit={submit} className="mt-6">
        <textarea
          rows="3"
          className="w-full p-3 rounded-xl bg-white/80 text-gray-900 border border-gray-300 backdrop-blur-lg outline-none focus:ring-2 focus:ring-yellow-400 transition"
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />

        <div className="flex justify-end mt-3">
          <button className="px-5 py-2 bg-yellow-400 text-gray-900 font-bold rounded-xl shadow-md hover:bg-yellow-300 active:scale-95 transition">
            Add Comment
          </button>
        </div>
      </form>
    </div>
  );
}