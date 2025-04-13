// src/pages/Dashboard/Index.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/ui/card";
import CreatePostForm from "../../components/forms/CreatePostForm";

// Dummy data for dashboard
const dummyStats = [
  { label: "Total Posts", value: 12 },
  { label: "Portfolio Views", value: 245 },
  { label: "Community Interactions", value: 87 },
];

const dummyPosts = [
  {
    id: "1",
    title: "My Latest Story",
    excerpt: "A thrilling tale of adventure and discovery.",
    author: "You",
    date: "April 10, 2025",
    image: "https://via.placeholder.com/400x200?text=Story",
  },
  {
    id: "2",
    title: "Poetry Collection",
    excerpt: "Exploring emotions through verse.",
    author: "You",
    date: "April 8, 2025",
    image: "https://via.placeholder.com/400x200?text=Poetry",
  },
];

// Dummy auth state (replace with Firebase later)
const isLoggedIn = true; // Simulate logged-in user

function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <h1 className="text-3xl font-bold font-poppins text-slate-800 mb-6">
        Your Dashboard
      </h1>

      {/* Create Post Button (User Only) */}
      {isLoggedIn && (
        <div className="mb-8">
          <button
            onClick={openModal}
            className="inline-block bg-teal-600 text-white font-inter font-semibold py-2 px-4 rounded-lg hover:bg-teal-500 transition-colors"
          >
            Create New Post
          </button>
        </div>
      )}

      {/* Create Post Modal */}
      <CreatePostForm isOpen={isModalOpen} onClose={closeModal} />

      {/* Stats Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold font-poppins text-slate-800 mb-4">
          Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {dummyStats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white p-4 rounded-lg shadow-md text-center"
            >
              <p className="text-2xl font-bold text-teal-600 font-inter">
                {stat.value}
              </p>
              <p className="text-sm text-slate-600 font-inter">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Posts Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold font-poppins text-slate-800 mb-4">
          Recent Posts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dummyPosts.map((post) => (
            <Card
              key={post.id}
              title={post.title}
              excerpt={post.excerpt}
              author={post.author}
              date={post.date}
              image={post.image}
              link={`/posts/${post.id}`}
            />
          ))}
        </div>
        <Link
          to="/posts"
          className="block text-teal-600 font-inter font-semibold hover:underline mt-4"
        >
          View All Posts
        </Link>
      </section>

      {/* Quick Links Section */}
      <section>
        <h2 className="text-xl font-semibold font-poppins text-slate-800 mb-4">
          Quick Links
        </h2>
        <div className="flex space-x-4">
          <Link
            to="/dashboard/portfolio"
            className="bg-teal-600 text-white font-inter font-semibold py-2 px-4 rounded-lg hover:bg-teal-500 transition-colors"
          >
            Manage Portfolio
          </Link>
          <Link
            to="/dashboard/settings"
            className="bg-slate-600 text-white font-inter font-semibold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors"
          >
            Account Settings
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
