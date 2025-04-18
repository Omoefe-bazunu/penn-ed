import { useState } from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { dbase } from "../../firebase";

function DeleteEpisode({ series, episode, onClose, onDelete }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setError("");
    setLoading(true);

    try {
      await deleteDoc(doc(dbase, "series", series.id, "episodes", episode.id));
      onDelete();
      onClose();
    } catch (err) {
      setError("Failed to delete episode: " + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold font-poppins text-slate-800 mb-4">
          Delete Episode
        </h2>
        <p className="text-slate-600 font-inter mb-4">
          Are you sure you want to delete "{episode.title}" from "{series.title}
          "? This action cannot be undone.
        </p>
        {error && <p className="text-red-500 font-inter mb-4">{error}</p>}
        <div className="flex gap-4">
          <button
            onClick={handleDelete}
            disabled={loading}
            className={`bg-red-600 text-white font-inter font-semibold py-2 px-4 rounded-lg hover:bg-red-500 transition-colors ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
          <button
            onClick={onClose}
            className="bg-slate-300 text-slate-800 font-inter font-semibold py-2 px-4 rounded-lg hover:bg-slate-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteEpisode;
