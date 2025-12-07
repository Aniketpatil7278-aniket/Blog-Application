import React, { useEffect, useState } from "react";
import api from "../api";
import toast from "react-hot-toast";

export default function PostForm({ post = null, onCreated, onUpdated, onCancel }) {
  const isEdit = Boolean(post);

  const [title, setTitle] = useState(post ? post.title : "");
  const [content, setContent] = useState(post ? post.content : "");
  const [tags, setTags] = useState(
    post?.tags ? (Array.isArray(post.tags) ? post.tags.join(", ") : String(post.tags)) : ""
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTitle(post ? post.title : "");
    setContent(post ? post.content : "");
    setTags(
      post?.tags ? (Array.isArray(post.tags) ? post.tags.join(", ") : String(post.tags)) : ""
    );
  }, [post]);

  const submit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) return toast.error("Title & content required");

    setLoading(true);

    try {
      const tagsArray = tags
        ? tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [];

      if (isEdit) {
        const res = await api.put(`/api/posts/${post._id}`, {
          title,
          content,
          tags: tagsArray,
        });
        toast.success("Post updated");
        onUpdated?.(res.data);
      } else {
        const res = await api.post("/api/posts", {
          title,
          content,
          tags: tagsArray,
        });
        toast.success("Post created");
        onCreated?.(res.data);
        setTitle("");
        setContent("");
        setTags("");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.error ||
          (isEdit ? "Failed to update" : "Failed to create")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-md border border-gray-200 mb-6 transition"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">
          {isEdit ? "✏️ Edit Post" : "📝 Create a New Post"}
        </h3>
      </div>

      {/* Title */}
      <div>
        <label className="block text-gray-700 mb-1 font-medium">Title</label>
        <input
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
          placeholder="Post title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      {/* Content */}
      <div className="mt-4">
        <label className="block text-gray-700 mb-1 font-medium">Content</label>
        <textarea
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
          placeholder="Write your content..."
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>

      {/* Tags */}
      <div className="mt-4">
        <label className="block text-gray-700 mb-1 font-medium">Tags</label>
        <input
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
          placeholder="e.g. react, javascript, webdev"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        {/* Tag preview */}
        {tags.trim() !== "" && (
          <div className="mt-2 flex flex-wrap gap-2">
            {tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
              .map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                >
                  #{tag}
                </span>
              ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 mt-6">
        {isEdit && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 shadow-md transition active:scale-95 disabled:opacity-50"
        >
          {loading ? "Saving..." : isEdit ? "Save Changes" : "Create Post"}
        </button>
      </div>
    </form>
  );
}
