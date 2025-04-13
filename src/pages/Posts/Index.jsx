// src/pages/Posts/Index.jsx
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  getCountFromServer,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import { dbase } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import Card from "../../components/ui/Card";
import { Link } from "react-router-dom";

function Posts() {
  const { user, userData } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("single"); // single or series
  const [expandedSeries, setExpandedSeries] = useState(null); // Track expanded series
  const [selectedItem, setSelectedItem] = useState(null); // For modal (post or episode)
  const [currentPage, setCurrentPage] = useState({ single: 1, series: 1 });
  const [lastDoc, setLastDoc] = useState({ single: null, series: null });
  const itemsPerPage = 6;

  // Fetch total counts for pagination
  const fetchCount = async (collectionName) => {
    const coll = collection(dbase, collectionName);
    const snapshot = await getCountFromServer(coll);
    return snapshot.data().count;
  };

  // Fetch items (posts or series) for current page
  const fetchItems = async ({ collectionName, page, lastDoc }) => {
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
    }));
    return { items, lastDoc: snapshot.docs[snapshot.docs.length - 1] || null };
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
  });

  // Fetch series episodes when expanded
  const fetchEpisodes = async (seriesId) => {
    const q = query(
      collection(dbase, "series", seriesId, "episodes"),
      orderBy("datePosted", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  const episodesQuery = useQuery({
    queryKey: ["episodes", expandedSeries],
    queryFn: () => fetchEpisodes(expandedSeries),
    enabled: !!expandedSeries,
  });

  // Total pages for pagination
  const singleCountQuery = useQuery({
    queryKey: ["postsCount"],
    queryFn: () => fetchCount("posts"),
  });
  const seriesCountQuery = useQuery({
    queryKey: ["seriesCount"],
    queryFn: () => fetchCount("series"),
  });

  // Upvote/Unupvote mutation
  const upvoteMutation = useMutation({
    mutationFn: async ({ id, type, isUpvoting }) => {
      const docRef = doc(dbase, type === "post" ? "posts" : "series", id);
      const userRef = doc(dbase, "users", user.uid);
      await updateDoc(docRef, {
        upvotes: isUpvoting
          ? (await getDoc(docRef)).data().upvotes + 1
          : (await getDoc(docRef)).data().upvotes - 1,
      });
      await updateDoc(userRef, {
        upvotedPosts: isUpvoting ? arrayUnion(id) : arrayRemove(id),
      });
    },
    onSuccess: (_, { id, type }) => {
      queryClient.invalidateQueries([type === "post" ? "posts" : "series"]);
    },
    onError: (err) => alert("Failed to update upvote: " + err.message),
  });

  const toggleUpvote = (id, type, isUpvoted) => {
    if (!user) {
      alert("Please log in to upvote.");
      return;
    }
    upvoteMutation.mutate({ id, type, isUpvoting: !isUpvoted });
  };

  // Share link
  const shareLink = (id, type) => {
    const url = `${window.location.origin}/posts/${id}`;
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

  // Open modal for post or episode
  const openModal = async (item, type) => {
    if (type === "episode") {
      const episodeDoc = await getDoc(
        doc(dbase, "series", item.seriesId, "episodes", item.id)
      );
      setSelectedItem({
        ...item,
        content: episodeDoc.data().content,
        type: "episode",
      });
    } else {
      setSelectedItem({ ...item, type: "post" });
    }
  };

  // Update lastDoc after fetch
  useEffect(() => {
    if (singlePostsQuery.data) {
      setLastDoc((prev) => ({
        ...prev,
        single: singlePostsQuery.data.lastDoc,
      }));
    }
    if (seriesQuery.data) {
      setLastDoc((prev) => ({ ...prev, series: seriesQuery.data.lastDoc }));
    }
  }, [singlePostsQuery.data, seriesQuery.data]);

  const singleTotalPages = singleCountQuery.data
    ? Math.ceil(singleCountQuery.data / itemsPerPage)
    : 1;
  const seriesTotalPages = seriesCountQuery.data
    ? Math.ceil(seriesCountQuery.data / itemsPerPage)
    : 1;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
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
          {singlePostsQuery.isLoading ? (
            <div className="text-center py-10">Loading...</div>
          ) : singlePostsQuery.error ? (
            <p className="text-red-500 font-inter">
              Error: {singlePostsQuery.error.message}
            </p>
          ) : singlePostsQuery.data.items.length === 0 ? (
            <p className="text-slate-600 font-inter">No posts available.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {singlePostsQuery.data.items.map((post) => {
                  const isUpvoted = userData?.upvotedPosts?.includes(post.id);
                  return (
                    <div key={post.id} className="relative">
                      <div onClick={() => openModal(post, "post")}>
                        <Card
                          title={post.title}
                          excerpt={
                            post.content.length > 100
                              ? `${post.content.substring(0, 100)}...`
                              : post.content
                          }
                          author={post.createdBy}
                          date={new Date(
                            post.datePosted?.seconds * 1000
                          ).toLocaleDateString()}
                          image={post.image}
                        />
                      </div>
                      <div className="absolute top-2 right-2 flex space-x-2">
                        <button
                          onClick={() => shareLink(post.id, "post")}
                          className="p-1 rounded-full bg-white shadow-md"
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
                          onClick={() =>
                            toggleUpvote(post.id, "post", isUpvoted)
                          }
                          className="p-1 rounded-full bg-white shadow-md"
                          title={isUpvoted ? "Unupvote" : "Upvote"}
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
                          <span className="text-xs text-slate-600">
                            {post.upvotes || 0}
                          </span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
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
                {Array.from({ length: singleTotalPages }, (_, i) => i + 1).map(
                  (page) => (
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
                  )
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
            </>
          )}
        </section>
      ) : (
        <section>
          {seriesQuery.isLoading ? (
            <div className="text-center py-10">Loading...</div>
          ) : seriesQuery.error ? (
            <p className="text-red-500 font-inter">
              Error: {seriesQuery.error.message}
            </p>
          ) : seriesQuery.data.items.length === 0 ? (
            <p className="text-slate-600 font-inter">No series available.</p>
          ) : (
            <>
              <div className="space-y-6 mb-6">
                {seriesQuery.data.items.map((series) => {
                  const isUpvoted = userData?.upvotedPosts?.includes(series.id);
                  return (
                    <div
                      key={series.id}
                      className="bg-white rounded-lg shadow-md p-4"
                    >
                      <div className="flex items-start relative">
                        <img
                          src={
                            series.image || "https://via.placeholder.com/150"
                          }
                          alt={series.title}
                          className="w-24 h-24 object-cover rounded-md mr-4"
                        />
                        <div className="flex-grow">
                          <h2
                            onClick={() => openModal(series, "series")}
                            className="text-xl font-semibold font-poppins text-slate-800 hover:text-teal-600 cursor-pointer"
                          >
                            {series.title}
                          </h2>
                          <p className="text-sm text-slate-600 font-inter">
                            By {series.createdBy} •{" "}
                            {new Date(
                              series.datePosted?.seconds * 1000
                            ).toLocaleDateString()}
                          </p>
                          <p className="text-slate-800 font-inter mt-1">
                            {series.content || "A thrilling series."}
                          </p>
                        </div>
                        <div className="absolute top-2 right-2 flex space-x-2">
                          <button
                            onClick={() => shareLink(series.id, "series")}
                            className="p-1 rounded-full bg-white shadow-md"
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
                            onClick={() =>
                              toggleUpvote(series.id, "series", isUpvoted)
                            }
                            className="p-1 rounded-full bg-white shadow-md"
                            title={isUpvoted ? "Unupvote" : "Upvote"}
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
                            <span className="text-xs text-slate-600">
                              {series.upvotes || 0}
                            </span>
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
                        <div className="mt-4 space-y-4">
                          {episodesQuery.isLoading ? (
                            <p className="text-slate-600 font-inter">
                              Loading episodes...
                            </p>
                          ) : episodesQuery.error ? (
                            <p className="text-red-500 font-inter">
                              Error: {episodesQuery.error.message}
                            </p>
                          ) : (
                            episodesQuery.data.map((episode) => (
                              <div
                                key={episode.id}
                                className="border-l-4 border-teal-600 pl-4"
                              >
                                <h3
                                  onClick={() =>
                                    openModal(
                                      { ...episode, seriesId: series.id },
                                      "episode"
                                    )
                                  }
                                  className="text-lg font-semibold font-inter text-slate-800 hover:text-teal-600 cursor-pointer"
                                >
                                  {episode.title}
                                </h3>
                                <p className="text-sm text-slate-600 font-inter">
                                  {new Date(
                                    episode.datePosted?.seconds * 1000
                                  ).toLocaleDateString()}
                                </p>
                                <p className="text-slate-800 font-inter">
                                  {episode.content.length > 100
                                    ? `${episode.content.substring(0, 100)}...`
                                    : episode.content}
                                </p>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
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
                {Array.from({ length: seriesTotalPages }, (_, i) => i + 1).map(
                  (page) => (
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
                  )
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
            </>
          )}
        </section>
      )}

      {/* Modal for Post/Episode */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-md max-w-lg w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold font-poppins text-slate-800">
                {selectedItem.title}
              </h2>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-slate-600 hover:text-slate-800"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <Card
              title={selectedItem.title}
              excerpt={selectedItem.content}
              author={selectedItem.createdBy || "Unknown"}
              date={
                selectedItem.datePosted
                  ? new Date(
                      selectedItem.datePosted?.seconds * 1000
                    ).toLocaleDateString()
                  : "Unknown"
              }
              image={selectedItem.image}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Posts;
