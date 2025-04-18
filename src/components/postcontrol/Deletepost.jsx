import { useState } from "react";
import { doc, deleteDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { dbase } from "../../firebase";
import { useAuth } from "../../context/AuthContext";

function DeletePost({ post, onClose, onDelete }) {
  const { user } = useAuth();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Validate props and user
  if (!post || !post.id || !post.title || !user || !user.uid) {
    console.error("Invalid props or user:", { post, user });
    return null;
  }

  const handleDelete = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Delete post from posts collection
      await deleteDoc(doc(dbase, "posts", post.id));
      // Remove post ID from user's posts array
      await updateDoc(doc(dbase, "users", user.uid), {
        posts: arrayRemove(post.id),
      });
      setSuccess("Post deleted successfully!");
      onDelete();
      setTimeout(onClose, 1500); // Close after showing success message
    } catch (err) {
      if (err.code === "permission-denied") {
        setError("You don't have permission to delete this post.");
      } else {
        setError("Failed to delete post: " + err.message);
      }
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold font-poppins text-slate-800 mb-4">
          Delete Post
        </h2>
        <p className="text-slate-600 font-inter mb-4">
          Are you sure you want to delete "{post.title}"? This action cannot be
          undone.
        </p>
        {error && <p className="text-red-500 font-inter mb-4">{error}</p>}
        {success && <p className="text-teal-600 font-inter mb-4">{success}</p>}
        <div className="flex gap-4">
          <button
            onClick={handleDelete}
            disabled={loading}
            className={`bg-red-600 text-white font-inter font-semibold py-2 px-4 rounded-lg hover:bg-red-500 transition-colors flex items-center gap-2 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {loading ? "Deleting..." : "Delete"}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="bg-slate-300 text-slate-800 font-inter font-semibold py-2 px-4 rounded-lg hover:bg-slate-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeletePost;
