import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { dbase } from "../../firebase";
import SafeHTML from "../Posts/SafeHTML";

function PublicPortfolio() {
  const { uid } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedPosts, setExpandedPosts] = useState({});

  const togglePostExpand = (postId) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (uid) {
        try {
          // Fetch user data
          const userDoc = await getDoc(doc(dbase, "users", uid));
          if (!userDoc.exists()) {
            throw new Error("User document not found");
          }
          const userData = userDoc.data();

          // Fetch posts data
          const postsData = [];
          if (userData.posts?.length > 0) {
            const postsPromises = userData.posts.map((postId) =>
              getDoc(doc(dbase, "posts", postId))
            );
            const postsSnapshots = await Promise.all(postsPromises);
            postsData.push(
              ...postsSnapshots
                .filter((snap) => snap.exists())
                .map((snap) => ({ id: snap.id, ...snap.data() }))
            );
          }

          // Fetch series data with episodes
          const seriesData = [];
          if (userData.series?.length > 0) {
            const seriesPromises = userData.series.map((seriesId) =>
              getDoc(doc(dbase, "series", seriesId))
            );
            const seriesSnapshots = await Promise.all(seriesPromises);

            for (const seriesSnap of seriesSnapshots) {
              if (seriesSnap.exists()) {
                const series = { id: seriesSnap.id, ...seriesSnap.data() };

                // Fetch episodes for this series
                const episodesSnap = await getDocs(
                  collection(dbase, "series", series.id, "episodes")
                );
                series.episodes = episodesSnap.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
                }));

                seriesData.push(series);
              }
            }
          }

          setPortfolio({
            name: userData.name || "",
            email: userData.email || "",
            profilePicture: userData.profilePicture || null,
            bio: userData.bio || "",
            contactInfo: userData.contactInfo || { phone: "", address: "" },
            socialLinks: userData.socialLinks || {
              twitter: "",
              linkedin: "",
              instagram: "",
            },
            posts: postsData,
            series: seriesData,
          });
          setLoading(false);
        } catch (err) {
          setError("Failed to load portfolio: " + err.message);
          setLoading(false);
        }
      }
    };
    fetchPortfolio();
  }, [uid]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return (
      <div className="text-center py-10 text-red-500 font-inter">{error}</div>
    );
  if (!portfolio)
    return (
      <div className="text-center py-10 text-slate-600 font-inter">
        Portfolio not found.
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {portfolio.profilePicture && (
            <img
              src={portfolio.profilePicture}
              alt={portfolio.name}
              className="w-24 h-24 rounded-full object-cover"
            />
          )}
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold font-poppins text-slate-800">
              {portfolio.name}
            </h1>
            <p className="text-slate-600 font-inter">{portfolio.email}</p>
            {portfolio.bio && (
              <p className="text-slate-600 font-inter mt-2">{portfolio.bio}</p>
            )}
            {(portfolio.contactInfo?.phone ||
              portfolio.contactInfo?.address) && (
              <div className="mt-2">
                {portfolio.contactInfo.phone && (
                  <p className="text-slate-600 font-inter">
                    Phone: {portfolio.contactInfo.phone}
                  </p>
                )}
                {portfolio.contactInfo.address && (
                  <p className="text-slate-600 font-inter">
                    Address: {portfolio.contactInfo.address}
                  </p>
                )}
              </div>
            )}
            {(portfolio.socialLinks?.twitter ||
              portfolio.socialLinks?.linkedin ||
              portfolio.socialLinks?.instagram) && (
              <div className="flex gap-4 mt-4 justify-center sm:justify-start">
                {portfolio.socialLinks.twitter && (
                  <a
                    href={portfolio.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-600 hover:text-teal-500 p-4 bg-gray-600 rounded-full"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                )}
                {portfolio.socialLinks.linkedin && (
                  <a
                    href={portfolio.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-600 hover:text-teal-500 p-4 bg-gray-600 rounded-full"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                    </svg>
                  </a>
                )}
                {portfolio.socialLinks.instagram && (
                  <a
                    href={portfolio.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-600 hover:text-teal-500 p-4 bg-gray-600 rounded-full"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162 spruce up your profile picture a2.162 0 110-4.324 2.162 2.162 0 010 4.324zm4.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold font-poppins text-slate-800 mb-4">
          Posts
        </h2>
        {portfolio.posts.length === 0 ? (
          <p className="text-slate-600 font-inter">No posts yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolio.posts.map((post) => (
              <div
                key={post.id}
                className="bg-slate-100 rounded-lg shadow-md overflow-hidden"
              >
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-32 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-teal-600 font-poppins font-semibold mb-2">
                    {post.title}
                  </h3>
                  <button
                    onClick={() => togglePostExpand(post.id)}
                    className="text-gray-500 hover:text-gray-400 text-sm font-inter mb-2"
                  >
                    {expandedPosts[post.id]
                      ? "Close content -"
                      : "Open Content +"}
                  </button>
                  {expandedPosts[post.id] && (
                    <SafeHTML
                      html={post.content}
                      className="text-slate-800 font-inter mb-6"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <h2 className="text-xl font-semibold font-poppins text-slate-800 mt-6 mb-4">
          Series
        </h2>
        {portfolio.series.length === 0 ? (
          <p className="text-slate-600 font-inter">No series yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolio.series.map((series) => (
              <div
                key={series.id}
                className="bg-slate-100 rounded-lg shadow-md overflow-hidden"
              >
                {series.image && (
                  <img
                    src={series.image}
                    alt={series.title}
                    className="w-full h-32 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-teal-600 font-poppins font-semibold">
                    {series.title}
                  </h3>
                  <p className="text-slate-600 font-inter text-sm mt-2">
                    {series.episodes.length} episode(s)
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PublicPortfolio;
