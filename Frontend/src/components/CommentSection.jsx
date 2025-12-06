import React, { useEffect, useState } from 'react';
import api from '../api';
import toast from 'react-hot-toast';

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/comments?post_id=${postId}`);
      setComments(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!postId) return;
    fetchComments();
  }, [postId]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/comments', { postId, content: text });
      toast.success('Comment added');
      setText('');
      fetchComments();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.error || 'Failed to add comment');
    }
  };

  return (
    <div className="mt-6 p-4 bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-gray-200">
      <h4 className="font-semibold text-xl mb-4 text-gray-800 flex items-center gap-2">
        💬 Comments
      </h4>

      {loading && (
        <div className="text-gray-600 animate-pulse">Loading comments...</div>
      )}

      {!loading && comments.length === 0 && (
        <div className="text-gray-500 italic">No comments yet.</div>
      )}

      <div className="space-y-4">
        {comments.map((c) => (
          <div
            key={c._id}
            className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold shadow">
                {c.author?.username?.charAt(0).toUpperCase() || "U"}
              </div>

              {/* Comment Content */}
              <div className="flex-1">
                <p className="text-gray-800">{c.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  By <span className="font-medium">{c.author?.username || 'Unknown'}</span> •{' '}
                  {new Date(c.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add comment box */}
      <form
        onSubmit={submit}
        className="mt-6 bg-white p-4 rounded-lg shadow border border-gray-100"
      >
        <textarea
          className="w-full bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg p-3 outline-none transition"
          rows="3"
          placeholder="Write a friendly comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />

        <div className="flex justify-end mt-3">
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition active:scale-95"
          >
            Add Comment
          </button>
        </div>
      </form>
    </div>
  );
}
