import { useState } from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { dbase } from "../../firebase";
import { useAuth } from "../../context/AuthContext";

function DeleteCourseButton({ courseId, onSuccess, className }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const handleDelete = async () => {
    if (!user || user.email !== "raniem57@gmail.com") return;

    if (!window.confirm("Are you sure you want to delete this course?")) return;

    setIsDeleting(true);
    try {
      await deleteDoc(doc(dbase, "courses", courseId));
      onSuccess?.();
    } catch (err) {
      setError("Failed to delete course: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className={className}
        title="Delete"
      >
        {isDeleting ? (
          <span className="text-slate-600">...</span>
        ) : (
          <svg
            className="w-5 h-5 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        )}
      </button>
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </>
  );
}

export default DeleteCourseButton;
