// src/components/CompetitionApplicationModal.jsx
import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { dbase } from "../Firebase";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import SubscriptionModal from "./subscriptionModal";

function CompetitionApplicationModal({ isOpen, onClose, competitionTitle }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    submission: "",
  });
  const [error, setError] = useState("");
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const { user, userData } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!user) {
      setError("Please log in to submit applications.");
      return;
    }
    if (!userData?.subscribed) {
      setError("Please subscribe to submit applications.");
      return;
    }
    try {
      await addDoc(collection(dbase, "applications"), {
        competition: competitionTitle,
        name: formData.name,
        email: formData.email,
        submission: formData.submission,
        submittedAt: new Date().toISOString(),
      });
      alert("Application submitted successfully");
      setFormData({ name: "", email: "", submission: "" });
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  const openSubscriptionModal = () => setIsSubscriptionOpen(true);
  const closeSubscriptionModal = () => setIsSubscriptionOpen(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-md max-w-lg w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold font-poppins text-slate-800">
            Apply for {competitionTitle}
          </h2>
          <button
            onClick={onClose}
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
        {error && (
          <p className="text-red-500 font-inter mb-4">
            {error}{" "}
            {error.includes("subscribe") && (
              <button
                onClick={openSubscriptionModal}
                className="text-teal-600 hover:underline"
              >
                Subscribe now
              </button>
            )}
            {error.includes("log in") && (
              <Link to="/login" className="text-teal-600 hover:underline">
                Log in
              </Link>
            )}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-inter text-slate-600 mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-slate-300 rounded-md font-inter text-slate-800"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-inter text-slate-600 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-slate-300 rounded-md font-inter text-slate-800"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="submission"
              className="block text-sm font-inter text-slate-600 mb-1"
            >
              Submission Details
            </label>
            <textarea
              id="submission"
              name="submission"
              value={formData.submission}
              onChange={handleChange}
              className="w-full p-2 border border-slate-300 rounded-md font-inter text-slate-800"
              rows="6"
              placeholder="Describe your submission or provide a link"
              required
            ></textarea>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-600 text-white font-inter font-semibold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-teal-600 text-white font-inter font-semibold py-2 px-4 rounded-lg hover:bg-teal-500 transition-colors"
            >
              Submit Application
            </button>
          </div>
        </form>
        <SubscriptionModal
          isOpen={isSubscriptionOpen}
          onClose={closeSubscriptionModal}
        />
      </div>
    </div>
  );
}

export default CompetitionApplicationModal;
