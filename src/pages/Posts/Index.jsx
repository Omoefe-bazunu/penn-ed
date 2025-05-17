import { useState, useEffect } from "react";
import SafeHTML from "./SafeHTML";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  getCountFromServer,
} from "firebase/firestore";
import { dbase } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toggleUpvote } from "../../utils/UpvoteUtils";

function Posts() {
  const { user, userData } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("single");
  const [expandedSeries, setExpandedSeries] = useState(null);
  const [expandedSeriesEpisode, setExpandedSeriesEpisode] = useState(null);
  const [currentPage, setCurrentPage] = useState({ single: 1, series: 1 });
  const [lastDoc, setLastDoc] = useState({ single: null, series: null });
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const itemsPerPage = 6;

  // Fetch total counts for pagination
  const fetchCount = async (collectionName) => {
    try {
      const coll = collection(dbase, collectionName);
      const snapshot = await getCountFromServer(coll);
      return snapshot.data().count;
    } catch (err) {
      console.error(`Error fetching ${collectionName} count:`, err);
      throw new Error(`Failed to load ${collectionName} count`);
    }
  };

  // Fetch items (posts or series) for current page
  const fetchItems = async ({ collectionName, page, lastDoc }) => {
    try {
      let q = query(
        collection(dbase, collectionName),
        orderBy("datePosted", "desc"),
        limit(itemsPerPage)
      );

      if (page > 1 && lastDoc) {
        q = query(
          collection(dbase, collectionName),
          orderBy("datePosted", "desc"),
          startAfter(lastDoc),
          limit(itemsPerPage)
        );
      }

      const snapshot = await getDocs(q);
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        datePosted: doc.data().datePosted?.toDate() || new Date(),
      }));

      return {
        items,
        lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
      };
    } catch (err) {
      console.error(`Error fetching ${collectionName}:`, err);
      throw new Error(`Failed to load ${collectionName}`);
    }
  };

  // Fetch series episodes when expanded
  const fetchEpisodes = async (seriesId) => {
    try {
      const q = query(
        collection(dbase, "series", seriesId, "episodes"),
        orderBy("datePosted", "desc")
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        datePosted: doc.data().datePosted?.toDate() || new Date(),
      }));
    } catch (err) {
      console.error("Error fetching episodes:", err);
      throw new Error("Failed to load episodes");
    }
  };

  // React Query for single posts
  const singlePostsQuery = useQuery({
    queryKey: ["posts", currentPage.single],
    queryFn: () =>
      fetchItems({
        collectionName: "posts",
        page: currentPage.single,
        lastDoc: lastDoc.single,
      }),
    keepPreviousData: true,
    retry: 3,
    retryDelay: (attempt) => Math.min(attempt * 1000, 5000),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // React Query for series
  const seriesQuery = useQuery({
    queryKey: ["series", currentPage.series],
    queryFn: () =>
      fetchItems({
        collectionName: "series",
        page: currentPage.series,
        lastDoc: lastDoc.series,
      }),
    keepPreviousData: true,
    retry: 3,
    retryDelay: (attempt) => Math.min(attempt * 1000, 5000),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Episodes query
  const episodesQuery = useQuery({
    queryKey: ["episodes", expandedSeries],
    queryFn: () => fetchEpisodes(expandedSeries),
    enabled: !!expandedSeries,
    retry: 3,
    retryDelay: (attempt) => Math.min(attempt * 1000, 5000),
  });

  // Total pages for pagination
  const singleCountQuery = useQuery({
    queryKey: ["postsCount"],
    queryFn: () => fetchCount("posts"),
    retry: 3,
  });

  const seriesCountQuery = useQuery({
    queryKey: ["seriesCount"],
    queryFn: () => fetchCount("series"),
    retry: 3,
  });

  // Upvote mutation
  const upvoteMutation = useMutation({
    mutationFn: async (postId) => {
      if (!user) throw new Error("Please log in to upvote");
      return await toggleUpvote(user.uid, postId);
    },
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries(["posts"]);
        queryClient.invalidateQueries(["userData", user.uid]);
        setError("");
      } else {
        setError(result.error);
      }
    },
    onError: (error) => {
      setError(error.message);
      if (error.message.includes("log in")) {
        navigate("/login");
      }
    },
  });

  // Auto-retry mechanism for connection issues
  useEffect(() => {
    if ((singlePostsQuery.isError || seriesQuery.isError) && retryCount < 3) {
      const timer = setTimeout(() => {
        setRetryCount(retryCount + 1);
        singlePostsQuery.refetch();
        seriesQuery.refetch();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [singlePostsQuery.isError, seriesQuery.isError, retryCount]);

  // Update lastDoc after fetch
  useEffect(() => {
    if (singlePostsQuery.data) {
      setLastDoc((prev) => ({
        ...prev,
        single: singlePostsQuery.data.lastDoc,
      }));
    }
    if (seriesQuery.data) {
      setLastDoc((prev) => ({
        ...prev,
        series: seriesQuery.data.lastDoc,
      }));
    }
  }, [singlePostsQuery.data, seriesQuery.data]);

  // Handle upvote
  const handleUpvote = (postId) => {
    upvoteMutation.mutate(postId);
  };

  // Share link
  const shareLink = (id, type) => {
    const url = `${window.location.origin}/${
      type === "post" ? "posts" : "series"
    }/${id}`;
    navigator.clipboard.writeText(url).then(() => {
      alert("Link copied to clipboard!");
    });
  };

  // Pagination controls
  const handlePrevious = (tab) => {
    setCurrentPage((prev) => ({
      ...prev,
      [tab]: prev[tab] > 1 ? prev[tab] - 1 : 1,
    }));
    setLastDoc((prev) => ({ ...prev, [tab]: null }));
  };

  const handleNext = (tab, totalPages) => {
    setCurrentPage((prev) => ({
      ...prev,
      [tab]: prev[tab] < totalPages ? prev[tab] + 1 : prev[tab],
    }));
  };

  const handlePageClick = (tab, page) => {
    setCurrentPage((prev) => ({ ...prev, [tab]: page }));
    setLastDoc((prev) => ({ ...prev, [tab]: null }));
  };

  // Toggle series expansion
  const toggleSeries = (seriesId) => {
    setExpandedSeries(expandedSeries === seriesId ? null : seriesId);
    setExpandedSeriesEpisode(null);
  };

  // Toggle episode expansion
  const toggleSeriesEpisode = (index) => {
    setExpandedSeriesEpisode(expandedSeriesEpisode === index ? null : index);
  };

  const singleTotalPages = singleCountQuery.data
    ? Math.ceil(singleCountQuery.data / itemsPerPage)
    : 1;
  const seriesTotalPages = seriesCountQuery.data
    ? Math.ceil(seriesCountQuery.data / itemsPerPage)
    : 1;

  // Loading state
  if (singlePostsQuery.isLoading || seriesQuery.isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-600"></div>
          <p className="mt-4 text-slate-600">Loading content...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (singlePostsQuery.isError || seriesQuery.isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {singlePostsQuery.error?.message || seriesQuery.error?.message}
        </div>
        <div className="text-center">
          <button
            onClick={() => {
              setRetryCount(0);
              singlePostsQuery.refetch();
              seriesQuery.refetch();
            }}
            className="bg-teal-600 text-white font-inter font-semibold py-2 px-4 rounded-lg hover:bg-teal-500 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Header */}
      <h1 className="text-3xl font-bold font-poppins text-slate-800 mb-6">
        Posts
      </h1>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab("single")}
          className={`px-4 py-2 font-inter text-sm font-semibold ${
            activeTab === "single"
              ? "text-teal-600 border-b-2 border-teal-600"
              : "text-slate-600 hover:text-teal-600"
          }`}
        >
          Single Posts
        </button>
        <button
          onClick={() => setActiveTab("series")}
          className={`px-4 py-2 font-inter text-sm font-semibold ${
            activeTab === "series"
              ? "text-teal-600 border-b-2 border-teal-600"
              : "text-slate-600 hover:text-teal-600"
          }`}
        >
          Series
        </button>
      </div>

      {/* Content */}
      {activeTab === "single" ? (
        <section>
          {singlePostsQuery.data.items.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-slate-600 font-inter mb-4">
                No posts available.
              </p>
              {user?.email === "raniem57@gmail.com" && (
                <Link
                  to="/dashboard/posts/create"
                  className="bg-teal-600 text-white font-inter font-semibold py-2 px-4 rounded-lg hover:bg-teal-500 transition-colors"
                >
                  Create First Post
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {singlePostsQuery.data.items.map((post) => {
                  const isUpvoted = userData?.upvotedPosts?.includes(post.id);
                  return (
                    <div
                      key={post.id}
                      className="relative bg-white border-b-4 border-teal-600 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                    >
                      <Link to={`/posts/${post.id}`}>
                        <h2 className="text-xl font-semibold font-poppins text-slate-800 mb-2 hover:text-teal-600">
                          {post.title}
                        </h2>
                        {post.image && (
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-40 object-cover rounded-md my-2"
                            loading="lazy"
                          />
                        )}
                        <SafeHTML
                          html={post.content}
                          className="text-slate-800 font-inter mb-2"
                          maxLength={100}
                        />
                        <p className="text-sm text-slate-600 font-inter">
                          By {post.createdBy} •{" "}
                          {post.datePosted.toLocaleDateString()}
                        </p>
                      </Link>
                      <div className="absolute top-2 right-2 flex space-x-2">
                        <button
                          onClick={() => shareLink(post.id, "post")}
                          className="p-1 rounded-full bg-white shadow-md hover:bg-slate-100"
                          title="Share"
                        >
                          <svg
                            className="w-5 h-5 text-slate-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleUpvote(post.id)}
                          className="p-1 rounded-full bg-white shadow-md hover:bg-slate-100 flex items-center"
                          title={isUpvoted ? "Unupvote" : "Upvote"}
                          disabled={upvoteMutation.isLoading}
                        >
                          <svg
                            className={`w-5 h-5 ${
                              isUpvoted
                                ? "text-teal-600 fill-teal-600"
                                : "text-slate-600"
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                          <span className="text-xs text-slate-600 ml-1">
                            {post.upvotes || 0}
                          </span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              {singleTotalPages > 1 && (
                <div className="flex justify-center items-center space-x-2">
                  <button
                    onClick={() => handlePrevious("single")}
                    disabled={currentPage.single === 1}
                    className={`py-2 px-4 rounded-lg font-inter font-semibold ${
                      currentPage.single === 1
                        ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                        : "bg-teal-600 text-white hover:bg-teal-500"
                    } transition-colors`}
                  >
                    Previous
                  </button>
                  {Array.from(
                    { length: Math.min(singleTotalPages, 5) },
                    (_, i) => {
                      let page;
                      if (singleTotalPages <= 5) {
                        page = i + 1;
                      } else if (currentPage.single <= 3) {
                        page = i + 1;
                      } else if (currentPage.single >= singleTotalPages - 2) {
                        page = singleTotalPages - 4 + i;
                      } else {
                        page = currentPage.single - 2 + i;
                      }
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageClick("single", page)}
                          className={`py-1 px-3 rounded-md font-inter ${
                            currentPage.single === page
                              ? "bg-teal-600 text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          } transition-colors`}
                        >
                          {page}
                        </button>
                      );
                    }
                  )}
                  <button
                    onClick={() => handleNext("single", singleTotalPages)}
                    disabled={currentPage.single === singleTotalPages}
                    className={`py-2 px-4 rounded-lg font-inter font-semibold ${
                      currentPage.single === singleTotalPages
                        ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                        : "bg-teal-600 text-white hover:bg-teal-500"
                    } transition-colors`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      ) : (
        <section>
          {seriesQuery.data.items.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-slate-600 font-inter mb-4">
                No series available.
              </p>
              {user?.email === "raniem57@gmail.com" && (
                <Link
                  to="/dashboard/series/create"
                  className="bg-teal-600 text-white font-inter font-semibold py-2 px-4 rounded-lg hover:bg-teal-500 transition-colors"
                >
                  Create First Series
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="space-y-6 mb-6">
                {seriesQuery.data.items.map((series) => {
                  const isUpvoted = userData?.upvotedPosts?.includes(series.id);
                  return (
                    <div
                      key={series.id}
                      className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start relative">
                        <img
                          src={
                            series.image || "https://via.placeholder.com/150"
                          }
                          alt={series.title}
                          className="w-24 h-24 object-cover rounded-md mr-4"
                          loading="lazy"
                        />
                        <div className="flex-grow">
                          <h2 className="text-xl font-semibold font-poppins text-slate-800">
                            {series.title}
                          </h2>
                          <p className="text-sm text-slate-600 font-inter">
                            By {series.createdBy} •{" "}
                            {series.datePosted.toLocaleDateString()}
                          </p>
                          <SafeHTML
                            html={series.content}
                            className="text-slate-800 font-inter my-4"
                          />
                        </div>
                        <div className="absolute top-2 right-2 flex space-x-2">
                          <button
                            onClick={() => shareLink(series.id, "series")}
                            className="p-1 rounded-full bg-white shadow-md hover:bg-slate-100"
                            title="Share"
                          >
                            <svg
                              className="w-5 h-5 text-slate-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleSeries(series.id)}
                        className="mt-4 text-teal-600 font-inter font-semibold hover:underline"
                      >
                        {expandedSeries === series.id
                          ? "Hide Episodes"
                          : `Show ${episodesQuery.data?.length || 0} Episodes`}
                      </button>
                      {expandedSeries === series.id && (
                        <div className="mt-4 space-y-2">
                          {episodesQuery.isLoading ? (
                            <div className="text-center py-4">
                              <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-teal-600"></div>
                            </div>
                          ) : episodesQuery.error ? (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                              {episodesQuery.error.message}
                            </div>
                          ) : (
                            episodesQuery.data.map((episode, index) => (
                              <div
                                key={episode.id}
                                className="border-l-4 border-teal-600 pl-4 bg-slate-50 rounded-md transition-all duration-300"
                              >
                                <button
                                  onClick={() => toggleSeriesEpisode(index)}
                                  className="w-full text-left flex justify-between items-center py-2"
                                >
                                  <h3 className="text font-semibold font-inter text-slate-800">
                                    {episode.title}
                                  </h3>
                                  <svg
                                    className={`w-5 h-5 text-slate-600 transform transition-transform ${
                                      expandedSeriesEpisode === index
                                        ? "rotate-180"
                                        : ""
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M19 9l-7 7-7-7"
                                    />
                                  </svg>
                                </button>
                                {expandedSeriesEpisode === index && (
                                  <div>
                                    <p className="text-xs text-slate-600 font-inter">
                                      {episode.datePosted.toLocaleDateString()}
                                    </p>
                                    <SafeHTML
                                      html={episode.content}
                                      className="text-slate-800 font-inter mb-6"
                                    />
                                  </div>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {seriesTotalPages > 1 && (
                <div className="flex justify-center items-center space-x-2">
                  <button
                    onClick={() => handlePrevious("series")}
                    disabled={currentPage.series === 1}
                    className={`py-2 px-4 rounded-lg font-inter font-semibold ${
                      currentPage.series === 1
                        ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                        : "bg-teal-600 text-white hover:bg-teal-500"
                    } transition-colors`}
                  >
                    Previous
                  </button>
                  {Array.from(
                    { length: Math.min(seriesTotalPages, 5) },
                    (_, i) => {
                      let page;
                      if (seriesTotalPages <= 5) {
                        page = i + 1;
                      } else if (currentPage.series <= 3) {
                        page = i + 1;
                      } else if (currentPage.series >= seriesTotalPages - 2) {
                        page = seriesTotalPages - 4 + i;
                      } else {
                        page = currentPage.series - 2 + i;
                      }
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageClick("series", page)}
                          className={`py-1 px-3 rounded-md font-inter ${
                            currentPage.series === page
                              ? "bg-teal-600 text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          } transition-colors`}
                        >
                          {page}
                        </button>
                      );
                    }
                  )}
                  <button
                    onClick={() => handleNext("series", seriesTotalPages)}
                    disabled={currentPage.series === seriesTotalPages}
                    className={`py-2 px-4 rounded-lg font-inter font-semibold ${
                      currentPage.series === seriesTotalPages
                        ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                        : "bg-teal-600 text-white hover:bg-teal-500"
                    } transition-colors`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      )}
    </div>
  );
}

export default Posts;
