// src/pages/Dashboard/Portfolio.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { dbase } from "../../firebase";
import { Link, Navigate } from "react-router-dom";

function Portfolio() {
  const { user, userData, loading: authLoading } = useAuth();
  const [portfolio, setPortfolio] = useState({
    posts: [],
    series: [],
    name: "",
    email: "",
    profilePicture: null,
    bio: "",
    contactInfo: { phone: "", address: "" },
    socialLinks: { twitter: "", linkedin: "", instagram: "" },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const shareUrl = user
    ? `${window.location.origin}/portfolio/${user.uid}`
    : "";

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(dbase, "users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setPortfolio({
              name: data.name || "",
              email: data.email || "",
              profilePicture: data.profilePicture || null,
              bio: data.bio || "",
              contactInfo: data.contactInfo || { phone: "", address: "" },
              socialLinks: data.socialLinks || {
                twitter: "",
                linkedin: "",
                instagram: "",
              },
              posts: data.posts || [],
              series: data.series || [],
            });
          }
          setLoading(false);
        } catch (err) {
          setError("Failed to load portfolio: " + err.message);
          setLoading(false);
        }
      }
    };
    fetchPortfolio();
  }, [user]);

  const handleShare = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("Portfolio link copied to clipboard!");
  };

  if (authLoading || loading)
    return <div className="text-center py-10">Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold font-poppins text-slate-800 mb-6">
        Your Portfolio
      </h1>
      {error && <p className="text-red-500 font-inter mb-4">{error}</p>}
      {portfolio.name ? (
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
              <h2 className="text-2xl font-bold font-poppins text-slate-800">
                {portfolio.name}
              </h2>
              <p className="text-slate-600 font-inter">{portfolio.email}</p>
              {portfolio.bio && (
                <p className="text-slate-600 font-inter mt-2">
                  {portfolio.bio}
                </p>
              )}
              {(portfolio.contactInfo.phone ||
                portfolio.contactInfo.address) && (
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
              {(portfolio.socialLinks.twitter ||
                portfolio.socialLinks.linkedin ||
                portfolio.socialLinks.instagram) && (
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
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4.162 4.162 0 110-8.324 4.162 4.162 0 010 8.324zm4.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                      </svg>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={handleShare}
            className="mt-4 bg-teal-600 text-white font-inter font-semibold py-2 px-4 rounded-lg hover:bg-teal-500 transition-colors"
          >
            Share Portfolio
          </button>
        </div>
      ) : (
        <div className="mb-4 bg-teal-600 w-fit text-white font-inter font-semibold py-2 px-4 rounded-lg hover:bg-teal-500 transition-colors">
          <Link to="/dashboard/settings">Update your Portfolio</Link>
        </div>
      )}
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
                className="bg-slate-100 rounded-lg shadow-md p-4"
              >
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-32 object-cover rounded-md mb-2"
                  />
                )}
                <h3 className="text-teal-600 font-poppins font-semibold">
                  {post.title}
                </h3>
                <p className="text-slate-600 font-inter text-sm">
                  {post.content.substring(0, 100)}...
                </p>
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
                className="bg-slate-100 rounded-lg shadow-md p-4"
              >
                {series.image && (
                  <img
                    src={series.image}
                    alt={series.title}
                    className="w-full h-32 object-cover rounded-md mb-2"
                  />
                )}
                <h3 className="text-teal-600 font-poppins font-semibold">
                  {series.title}
                </h3>
                <p className="text-slate-600 font-inter text-sm">
                  {series.episodes.length} episode(s)
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Portfolio;
