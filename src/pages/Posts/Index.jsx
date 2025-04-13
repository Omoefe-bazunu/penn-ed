// src/pages/Posts/Index.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/ui/card";

// Dummy data
const dummySinglePosts = [
  {
    id: "p1",
    title: "The Art of Storytelling",
    excerpt: "Craft compelling narratives.",
    author: "Jane Doe",
    date: "April 10, 2025",
    image: "https://via.placeholder.com/400x200?text=Storytelling",
    upvotes: 15,
  },
  {
    id: "p2",
    title: "Poetry in Motion",
    excerpt: "Beauty of modern poetry.",
    author: "John Smith",
    date: "April 8, 2025",
    image: "https://via.placeholder.com/400x200?text=Poetry",
    upvotes: 8,
  },
];

const dummySeries = [
  {
    id: "s1",
    title: "Epic Fantasy Saga",
    author: "Emily Brown",
    excerpt: "A thrilling multi-part adventure.",
    image: "https://via.placeholder.com/400x200?text=Fantasy",
    upvotes: 20,
    episodes: [
      {
        id: "e1",
        title: "Chapter 3: The Final Battle",
        excerpt: "The heroes face their greatest foe.",
        date: "April 12, 2025",
        link: "/posts/s1/e1",
      },
      {
        id: "e2",
        title: "Chapter 2: The Dark Forest",
        excerpt: "A perilous journey unfolds.",
        date: "April 10, 2025",
        link: "/posts/s1/e2",
      },
      {
        id: "e3",
        title: "Chapter 1: The Beginning",
        excerpt: "A new world is introduced.",
        date: "April 8, 2025",
        link: "/posts/s1/e3",
      },
    ],
  },
  {
    id: "s2",
    title: "Sci-Fi Chronicles",
    author: "Alex Green",
    excerpt: "Tales from a futuristic universe.",
    image: "https://via.placeholder.com/400x200?text=SciFi",
    upvotes: 12,
    episodes: [
      {
        id: "e4",
        title: "Episode 2: Starfall",
        excerpt: "A rebellion sparks.",
        date: "April 11, 2025",
        link: "/posts/s2/e4",
      },
      {
        id: "e5",
        title: "Episode 1: First Contact",
        excerpt: "Humanity meets the unknown.",
        date: "April 9, 2025",
        link: "/posts/s2/e5",
      },
    ],
  },
];

function Posts() {
  const [activeTab, setActiveTab] = useState("single"); // single or series
  const [expandedSeries, setExpandedSeries] = useState(null); // Track expanded series
  const [upvotes, setUpvotes] = useState({
    // Track upvote state (dummy)
    p1: false,
    p2: false,
    s1: false,
    s2: false,
  });

  const toggleUpvote = (id) => {
    setUpvotes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleSeries = (seriesId) => {
    setExpandedSeries(expandedSeries === seriesId ? null : seriesId);
  };

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dummySinglePosts.map((post) => (
              <div key={post.id} className="relative">
                <Card
                  title={post.title}
                  excerpt={post.excerpt}
                  author={post.author}
                  date={post.date}
                  image={post.image}
                  link={`/posts/${post.id}`}
                />
                <button
                  onClick={() => toggleUpvote(post.id)}
                  className="absolute top-2 right-2 p-1 rounded-full bg-white shadow-md"
                >
                  <svg
                    className={`w-5 h-5 ${
                      upvotes[post.id]
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
                    {post.upvotes + (upvotes[post.id] ? 1 : 0)}
                  </span>
                </button>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section>
          <div className="space-y-6">
            {dummySeries.map((series) => (
              <div
                key={series.id}
                className="bg-white rounded-lg shadow-md p-4"
              >
                <div className="flex items-start relative">
                  <img
                    src={series.image}
                    alt={series.title}
                    className="w-24 h-24 object-cover rounded-md mr-4"
                  />
                  <div className="flex-grow">
                    <Link
                      to={`/posts/${series.id}`}
                      className="text-xl font-semibold font-poppins text-slate-800 hover:text-teal-600"
                    >
                      {series.title}
                    </Link>
                    <p className="text-sm text-slate-600 font-inter">
                      By {series.author} • {series.episodes[0].date}
                    </p>
                    <p className="text-slate-800 font-inter mt-1">
                      {series.excerpt}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleUpvote(series.id)}
                    className="absolute top-2 right-2 p-1 rounded-full bg-white shadow-md"
                  >
                    <svg
                      className={`w-5 h-5 ${
                        upvotes[series.id]
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
                      {series.upvotes + (upvotes[series.id] ? 1 : 0)}
                    </span>
                  </button>
                </div>
                <button
                  onClick={() => toggleSeries(series.id)}
                  className="mt-4 text-teal-600 font-inter font-semibold hover:underline"
                >
                  {expandedSeries === series.id
                    ? "Hide Episodes"
                    : `Show ${series.episodes.length} Episodes`}
                </button>
                {expandedSeries === series.id && (
                  <div className="mt-4 space-y-4">
                    {series.episodes
                      .sort((a, b) => new Date(b.date) - new Date(a.date)) // Latest first
                      .map((episode) => (
                        <div
                          key={episode.id}
                          className="border-l-4 border-teal-600 pl-4"
                        >
                          <Link
                            to={episode.link}
                            className="text-lg font-semibold font-inter text-slate-800 hover:text-teal-600"
                          >
                            {episode.title}
                          </Link>
                          <p className="text-sm text-slate-600 font-inter">
                            {episode.date}
                          </p>
                          <p className="text-slate-800 font-inter">
                            {episode.excerpt}
                          </p>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default Posts;
