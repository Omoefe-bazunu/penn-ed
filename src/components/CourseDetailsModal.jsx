// src/components/CourseDetailsModal.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import SubscriptionModal from "./subscriptionModal";

function CourseDetailsModal({ course, isOpen, onClose }) {
  const { user, userData } = useAuth();
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);

  const openSubscriptionModal = () => setIsSubscriptionOpen(true);
  const closeSubscriptionModal = () => setIsSubscriptionOpen(false);

  if (!isOpen || !course) return null;

  if (!userData?.subscribed && user) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-md max-w-lg w-full mx-4 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold font-poppins text-slate-800">
              Access Restricted
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
          <p className="text-red-500 font-inter mb-4">
            Please{" "}
            <button
              onClick={openSubscriptionModal}
              className="text-teal-600 hover:underline"
            >
              subscribe
            </button>{" "}
            to access course details.
          </p>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="bg-slate-600 text-white font-inter font-semibold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors"
            >
              Close
            </button>
          </div>
          <SubscriptionModal
            isOpen={isSubscriptionOpen}
            onClose={closeSubscriptionModal}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-md max-w-lg w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold font-poppins text-slate-800">
            {course.title}
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
        {course.image && (
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-48 object-cover rounded-md mb-4"
          />
        )}
        <p className="text-sm font-inter text-slate-600 mb-2">
          Posted on: {new Date(course.datePosted).toLocaleDateString()}
        </p>
        <p className="text-slate-600 font-inter mb-4">{course.description}</p>
        {course.externalLink && (
          <a
            href={course.externalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-teal-600 text-white font-inter font-semibold py-2 px-4 rounded-lg hover:bg-teal-500 transition-colors"
          >
            Enroll Now
          </a>
        )}
      </div>
    </div>
  );
}

export default CourseDetailsModal;
