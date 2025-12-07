import React, { useState } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";

export default function SearchBar() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    const params = {};
    if (q) params.search = q;

    navigate({
      pathname: "/",
      search: createSearchParams(params).toString(),
    });
  };

  return (
    <form
      onSubmit={submit}
      className="w-full flex items-center justify-center mt-4"
    >
      <div className="relative w-full max-w-md">
        {/* Search Icon */}
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z"
            />
          </svg>
        </span>

        <input
          type="text"
          placeholder="Search posts..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full pl-10 pr-28 py-2.5 rounded-full border border-gray-300 bg-white shadow-sm
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
        />

        {/* Search Button */}
        <button
          type="submit"
          className="absolute right-1 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-blue-600 text-white rounded-full 
                     shadow hover:bg-blue-700 active:scale-95 transition"
        >
          Search
        </button>
      </div>
    </form>
  );
}
