import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { dbase } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import SafeHTML from "../Posts/SafeHTML";

function BlogPosts() {
  const { user, loading: authLoading } = useAuth();
  const [retryCount, setRetryCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const fetchPosts = async () => {
    const querySnapshot = await getDocs(collection(dbase, "blogs"));
    const posts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      datePosted: doc.data().datePosted?.toDate() || new Date(),
    }));
    // Sort by date descending
    return posts.sort((a, b) => b.datePosted - a.datePosted);
  };

  const {
    data: posts = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    retry: 3,
    retryDelay: (attempt) => Math.min(attempt * 1000, 5000),
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (isError && retryCount < 3) {
      const timer = setTimeout(() => {
        setRetryCount(retryCount + 1);
        refetch();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isError, retryCount, refetch]);

  if (authLoading || isLoading) {
    return (
      <div className="text-center py-10">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-teal-600"></div>
        <p className="mt-2 text-slate-600">Loading blog posts...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-md mx-auto">
          {error.message}
        </div>
        <button
          onClick={() => {
            setRetryCount(0);
            refetch();
          }}
          className="bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-500 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // Pagination logic
  const totalPosts = posts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;
  const currentPosts = posts.slice(indexOfFirst, indexOfLast);

  const goToNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">Blog Posts</h1>
        {["raniem57@gmail.com", "edumebifavour@gmail.com"].includes(
          user?.email
        ) && (
          <Link
            to="/create-blog"
            className="bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-500 transition-colors"
          >
            Add New Post
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentPosts.map((post) => (
          <Link
            to={`/blogs/${post.id}`}
            key={post.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            {post.image && (
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-32 object-cover rounded-md mb-4"
              />
            )}
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              {post.title}
            </h3>
            <SafeHTML
              html={post.content}
              className="text-slate-800"
              maxLength={200}
            />
            <p className="text-sm text-slate-600 mt-2">
              Posted on: {post.datePosted.toLocaleDateString()}
            </p>
          </Link>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-4 items-center">
          <button
            onClick={goToPrev}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-teal-600 text-white hover:bg-teal-500"
            }`}
          >
            Previous
          </button>
          <span className="text-slate-700 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={goToNext}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded ${
              currentPage === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-teal-600 text-white hover:bg-teal-500"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default BlogPosts;
