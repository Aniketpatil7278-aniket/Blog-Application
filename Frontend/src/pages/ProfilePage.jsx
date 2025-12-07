import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import PostItem from "../components/PostItem";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  const fetch = async (page = 1) => {
    try {
      const res = await api.get(`/api/users/${id}`, {
        params: { page, limit: 10 },
      });
      setUser(res.data.user);
      setPosts(res.data.posts || []);
      setPagination(res.data.pagination || pagination);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load profile");
    }
  };

  useEffect(() => {
    fetch();
  }, [id]);

  if (!user)
    return (
      <div className="p-6 text-center text-gray-600 animate-pulse">
        Loading profile...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg animate-fadeIn">
      {/* HEADER */}
      <div className="flex items-center gap-5 mb-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
          {user.username?.charAt(0).toUpperCase()}
        </div>

        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            {user.username}
          </h2>

          {user.bio ? (
            <p className="text-gray-600 mt-1">{user.bio}</p>
          ) : (
            <p className="text-gray-400 mt-1 italic"></p>
          )}
        </div>
      </div>

      {/* POST COUNT ONLY — Clean UI */}
      <div className="bg-gray-50 p-4 rounded-lg shadow-sm text-center mb-8">
        <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
        <p className="text-gray-500 text-sm">Total Posts</p>
      </div>

      {/* POSTS HEADER */}
      <h3 className="text-xl font-semibold mb-3">
        Posts by <span className="text-blue-600">{user.username}</span>
      </h3>

      {/* POSTS LIST */}
      <div className="grid gap-4">
        {posts.length === 0 ? (
          <div className="text-gray-500 text-center py-4">
            This user has not posted anything yet.
          </div>
        ) : (
          posts.map((p) => <PostItem key={p._id} post={p} />)
        )}
      </div>
    </div>
  );
}
