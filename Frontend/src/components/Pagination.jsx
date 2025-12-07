import React from "react";

export default function Pagination({ page = 1, limit = 10, total = 0, onPage }) {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  const getPages = () => {
    let arr = [];

    if (totalPages <= 7) {
      // show all pages
      for (let i = 1; i <= totalPages; i++) arr.push(i);
    } else {
      // show dynamic: first, last, around current
      arr = [1];

      if (page > 3) arr.push("...");

      let start = Math.max(2, page - 1);
      let end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) arr.push(i);

      if (page < totalPages - 2) arr.push("...");

      arr.push(totalPages);
    }

    return arr;
  };

  const pages = getPages();

  return (
    <div className="flex items-center gap-2 mt-6 justify-center">
      {/* Prev */}
      <button
        disabled={page <= 1}
        onClick={() => onPage(page - 1)}
        className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 shadow hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        ← Prev
      </button>

      {/* Page Numbers */}
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={i} className="px-3 text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPage(p)}
            className={`px-4 py-2 rounded-full transition shadow 
              ${
                p === page
                  ? "bg-blue-600 text-white shadow-lg scale-105"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        disabled={page >= totalPages}
        onClick={() => onPage(page + 1)}
        className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 shadow hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        Next →
      </button>
    </div>
  );
}
