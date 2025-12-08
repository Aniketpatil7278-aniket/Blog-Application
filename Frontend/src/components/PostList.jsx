import React, { useEffect, useState } from "react";
import api from "../api";
import { useSearchParams } from "react-router-dom";
import PostItem from "./PostItem";
import Pagination from "./Pagination";
import toast from "react-hot-toast";

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  // Fetch Tag list
  const fetchTags = async () => {
    try {
      const res = await api.get("/api/posts/tags/list");
      setTags(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  // Fetch posts
  const fetchPosts = async (page = 1) => {
    setLoading(true);
    try {
      const search = searchParams.get("search") || "";
      const tag = searchParams.get("tag") || "";
      const limit = 8;

      const res = await api.get("/api/posts", {
        params: { search, tag, page, limit },
      });

      setPosts(res.data.posts || res.data);
      setPagination(
        res.data.pagination || { page, limit, total: res.data.length }
      );
    } catch (err) {
      toast.error("Failed to load posts");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
    fetchPosts(Number(searchParams.get("page") || 1));
    // eslint-disable-next-line
  }, [searchParams]);

  // Shimmer UI while loading
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-40 bg-gray-200 rounded-xl shadow-sm"
          ></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* TAG FILTERS */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-3">Filter by Tags</h3>

        <div className="flex flex-wrap gap-3">
          {tags.map((t) => (
            <button
              key={t.tag}
              className={`px-3 py-1.5 rounded-full border text-sm transition
                ${
                  searchParams.get("tag") === t.tag
                    ? "bg-blue-600 text-white border-blue-600 shadow"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              onClick={() => setSearchParams({ tag: t.tag })}
            >
              #{t.tag}{" "}
              <span className="text-xs opacity-70">({t.count})</span>
            </button>
          ))}

          {/* Clear button */}
          <button
            onClick={() => setSearchParams({})}
            className="text-blue-600 text-sm hover:underline"
          >
            Clear Filter
          </button>
        </div>
      </div>

      {/* POSTS GRID */}
      <div className="grid gap-6 md:grid-cols-2">
        {posts.length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-500 bg-gray-50 rounded-xl">
            <p className="text-lg font-medium">No posts found</p>
            <p className="text-sm text-gray-400">
              Try removing filters or adding new posts.
            </p>
          </div>
        )}

        {posts.map((post) => (
          <PostItem
            key={post._id}
            post={post}
            onDeleted={() => fetchPosts(pagination.page)}
            onUpdated={() => fetchPosts(pagination.page)}
          />
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center mt-4">
        <Pagination
          {...pagination}
          onPage={(p) =>
            setSearchParams((prev) => {
              const obj = {};
              if (searchParams.get("search"))
                obj.search = searchParams.get("search");
              if (searchParams.get("tag"))
                obj.tag = searchParams.get("tag");
              obj.page = p;
              return obj;
            })
          }
        />
      </div>
    </div>
  );
}
