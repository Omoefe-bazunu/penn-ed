// src/components/SubscriptionModal.jsx
import { useState } from "react";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { dbase, storage } from "../firebase";
import { useAuth } from "../context/AuthContext";
import emailjs from "@emailjs/browser";

function SubscriptionModal({ isOpen, onClose }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const { user, userData } = useAuth();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = ["image/png", "image/jpeg", "application/pdf"];
      if (!validTypes.includes(selectedFile.type)) {
        setError("Please upload a PNG, JPEG, or PDF file.");
        setFile(null);
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB.");
        setFile(null);
        return;
      }
      setError("");
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !user) {
      setError("Please select a receipt file.");
      return;
    }
    try {
      // Upload receipt
      const timestamp = new Date().toISOString();
      const storageRef = ref(
        storage,
        `receipts/${user.uid}/${timestamp}-${file.name}`
      );
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Update user
      await updateDoc(doc(dbase, "users", user.uid), {
        pendingReceipt: downloadURL,
        subscriptions: arrayUnion({
          receiptUrl: downloadURL,
          approved: false,
          date: timestamp,
        }),
      });

      // Send email via EmailJS
      await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        {
          user_name: userData?.name || "User",
          user_email: user.email,
          receipt_url: downloadURL,
        },
        process.env.REACT_APP_EMAILJS_USER_ID
      );

      alert("Receipt submitted! Awaiting admin approval.");
      setFile(null);
      onClose();
    } catch (err) {
      setError("Failed to submit receipt: " + err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-md max-w-lg w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold font-poppins text-slate-800">
            Subscribe to Unlock Features
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
        <p className="text-slate-600 font-inter mb-4">
          Subscribe for a monthly fee of <strong>NGN 500</strong>. Your
          subscription will be activated after admin verification which takes
          less than 20mins
        </p>
        <div className="mb-4">
          <h3 className="text-lg font-semibold font-poppins text-slate-800 mb-2">
            Payment Details
          </h3>
          <p className="text-slate-600 font-inter">
            <strong>Bank Name:</strong> Moniepoint MFB
          </p>
          <p className="text-slate-600 font-inter">
            <strong>Account Name:</strong> Omoefe Bazunu
          </p>
          <p className="text-slate-600 font-inter">
            <strong>Account Number:</strong> 9043970401
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="receipt"
              className="block text-sm font-inter text-slate-600 mb-1"
            >
              Upload Payment Receipt
            </label>
            <input
              type="file"
              id="receipt"
              accept="image/png,image/jpeg,application/pdf"
              onChange={handleFileChange}
              className="w-full p-2 border border-slate-300 rounded-md font-inter text-slate-800"
              required
            />
            {file && (
              <p className="text-sm text-slate-600 font-inter mt-1">
                Selected: {file.name}
              </p>
            )}
          </div>
          {error && <p className="text-red-500 font-inter mb-4">{error}</p>}
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
              Submit Receipt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SubscriptionModal;
