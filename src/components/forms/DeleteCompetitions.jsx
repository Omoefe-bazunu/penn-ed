import { useState } from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { dbase } from "../../firebase";
import { useAuth } from "../../context/AuthContext";

function DeleteCompetitionModal({
  isOpen,
  onClose,
  competition,
  refetchCompetitions,
}) {
  const [error, setError] = useState("");
  const { user, userData } = useAuth();

  const handleDelete = async () => {
    if (!user) {
      setError("Please log in to delete a competition.");
      return;
    }
    if (userData?.email !== "raniem57@gmail.com") {
      setError("Only admins can delete competitions.");
      return;
    }
    try {
      const docRef = doc(dbase, "competitions", competition.id);
      await deleteDoc(docRef);
      alert("Competition deleted successfully!");
      refetchCompetitions();
      onClose();
    } catch (err) {
      setError("Failed to delete competition: " + err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-md max-w-md w-full mx-4 p-6">
        <h2 className="text-xl font-bold font-poppins text-slate-800 mb-4">
          Delete Competition
        </h2>
        <p className="text-slate-600 font-inter mb-6">
          Are you sure you want to delete <strong>{competition.title}</strong>?
          This action cannot be undone.
        </p>
        {error && <p className="text-red-500 font-inter mb-4">{error}</p>}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-slate-600 text-white font-inter font-semibold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white font-inter font-semibold py-2 px-4 rounded-lg hover:bg-red-500 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteCompetitionModal;
