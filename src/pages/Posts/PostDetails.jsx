// src/pages/Posts/PostDetails.jsx
import { useState } from "react";
import { useParams, Link } from "react-router-dom";

// Dummy post data (for demo, assuming ID matches)
const dummyPosts = {
  1: {
    id: "1",
    title: "The Art of Storytelling",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    author: "Jane Doe",
    date: "April 10, 2025",
    image: "https://via.placeholder.com/800x400?text=Storytelling",
  },
  2: {
    id: "2",
    title: "Poetry in Motion",
    content:
      "Poetry allows us to express the inexpressible. This post explores techniques to craft verses that resonate deeply with readers, from rhythm to imagery.",
    author: "John Smith",
    date: "April 8, 2025",
    image: "https://via.placeholder.com/800x400?text=Poetry",
  },
};

// Dummy comments
const initialComments = [
  {
    id: "c1",
    author: "Emily Brown",
    text: "Great insights! Thanks for sharing.",
    date: "April 11, 2025",
  },
  {
    id: "c2",
    author: "Alex Green",
    text: "Really enjoyed the examples provided.",
    date: "April 10, 2025",
  },
];

function PostDetails() {
  const { id } = useParams();
  const post = dummyPosts[id] || {
    title: "Post Not Found",
    content: "This post does not exist.",
    author: "Unknown",
    date: "N/A",
  };

  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      id: `c${comments.length + 1}`,
      author: "You", // Dummy logged-in user
      text: newComment,
      date: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    };

    setComments([comment, ...comments]);
    setNewComment("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Post Header */}
      <h1 className="text-3xl font-bold font-poppins text-slate-800 mb-4">
        {post.title}
      </h1>
      <div className="flex justify-between text-sm text-slate-600 font-inter mb-6">
        <span>By {post.author}</span>
        <span>{post.date}</span>
      </div>

      {/* Post Content */}
      <section className="mb-8">
        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
        )}
        <p className="text-slate-800 font-inter leading-relaxed">
          {post.content}
        </p>
      </section>

      {/* Comments Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold font-poppins text-slate-800 mb-4">
          Comments ({comments.length})
        </h2>
        {comments.length === 0 ? (
          <p className="text-slate-600 font-inter">No comments yet.</p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white p-4 rounded-lg shadow-md"
              >
                <div className="flex justify-between text-sm text-slate-600 font-inter mb-2">
                  <span className="font-semibold">{comment.author}</span>
                  <span>{comment.date}</span>
                </div>
                <p className="text-slate-800 font-inter">{comment.text}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Comment Form */}
      <section>
        <h2 className="text-xl font-semibold font-poppins text-slate-800 mb-4">
          Add a Comment
        </h2>
        <form
          onSubmit={handleCommentSubmit}
          className="bg-white p-4 rounded-lg shadow-md"
        >
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment..."
            className="w-full p-2 border border-slate-300 rounded-md font-inter text-slate-800 mb-4"
            rows="4"
          ></textarea>
          <button
            type="submit"
            className="bg-teal-600 text-white font-inter font-semibold py-2 px-4 rounded-lg hover:bg-teal-500 transition-colors"
          >
            Submit Comment
          </button>
        </form>
      </section>

      {/* Back to Posts */}
      <div className="mt-8">
        <Link
          to="/posts"
          className="text-teal-600 font-inter font-semibold hover:underline"
        >
          Back to All Posts
        </Link>
      </div>
    </div>
  );
}

export default PostDetails;
