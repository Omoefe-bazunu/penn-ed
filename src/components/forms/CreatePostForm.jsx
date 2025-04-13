// src/components/forms/CreatePostForm.jsx
import { useState } from "react";

function CreatePostForm({ isOpen, onClose }) {
  const [postType, setPostType] = useState("single"); // single or series
  const [formData, setFormData] = useState({
    singleTitle: "",
    singleContent: "",
    singleImage: "",
    seriesTitle: "",
    episodeTitle: "",
    episodeContent: "",
    seriesImage: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dummy submission
    console.log("Create Post Data:", { postType, ...formData });
    alert(
      postType === "single"
        ? "Single Post submitted (dummy)"
        : "Series with Episode submitted (dummy)"
    );
    // Reset form
    setFormData({
      singleTitle: "",
      singleContent: "",
      singleImage: "",
      seriesTitle: "",
      episodeTitle: "",
      episodeContent: "",
      seriesImage: "",
    });
    onClose(); // Close modal
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-md max-w-lg w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold font-poppins text-slate-800">
            Create New Post
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

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Post Type Selection */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold font-inter text-slate-800 mb-2">
              Post Type
            </h3>
            <div className="flex space-x-4">
              <label className="flex items-center font-inter text-slate-600">
                <input
                  type="radio"
                  name="postType"
                  value="single"
                  checked={postType === "single"}
                  onChange={() => setPostType("single")}
                  className="mr-2"
                />
                Single Post
              </label>
              <label className="flex items-center font-inter text-slate-600">
                <input
                  type="radio"
                  name="postType"
                  value="series"
                  checked={postType === "series"}
                  onChange={() => setPostType("series")}
                  className="mr-2"
                />
                Series
              </label>
            </div>
          </div>

          {/* Single Post Form */}
          {postType === "single" && (
            <div>
              <div className="mb-4">
                <label
                  htmlFor="singleTitle"
                  className="block text-sm font-inter text-slate-600 mb-1"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="singleTitle"
                  name="singleTitle"
                  value={formData.singleTitle}
                  onChange={handleChange}
                  className="w-full p-2 border border-slate-300 rounded-md font-inter text-slate-800"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="singleContent"
                  className="block text-sm font-inter text-slate-600 mb-1"
                >
                  Content
                </label>
                <textarea
                  id="singleContent"
                  name="singleContent"
                  value={formData.singleContent}
                  onChange={handleChange}
                  className="w-full p-2 border border-slate-300 rounded-md font-inter text-slate-800"
                  rows="6"
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="singleImage"
                  className="block text-sm font-inter text-slate-600 mb-1"
                >
                  Image URL (Optional)
                </label>
                <input
                  type="url"
                  id="singleImage"
                  name="singleImage"
                  value={formData.singleImage}
                  onChange={handleChange}
                  className="w-full p-2 border border-slate-300 rounded-md font-inter text-slate-800"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          )}

          {/* Series Form */}
          {postType === "series" && (
            <div>
              <div className="mb-4">
                <label
                  htmlFor="seriesTitle"
                  className="block text-sm font-inter text-slate-600 mb-1"
                >
                  Series Title
                </label>
                <input
                  type="text"
                  id="seriesTitle"
                  name="seriesTitle"
                  value={formData.seriesTitle}
                  onChange={handleChange}
                  className="w-full p-2 border border-slate-300 rounded-md font-inter text-slate-800"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="episodeTitle"
                  className="block text-sm font-inter text-slate-600 mb-1"
                >
                  Episode Title
                </label>
                <input
                  type="text"
                  id="episodeTitle"
                  name="episodeTitle"
                  value={formData.episodeTitle}
                  onChange={handleChange}
                  className="w-full p-2 border border-slate-300 rounded-md font-inter text-slate-800"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="episodeContent"
                  className="block text-sm font-inter text-slate-600 mb-1"
                >
                  Episode Content
                </label>
                <textarea
                  id="episodeContent"
                  name="episodeContent"
                  value={formData.episodeContent}
                  onChange={handleChange}
                  className="w-full p-2 border border-slate-300 rounded-md font-inter text-slate-800"
                  rows="6"
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="seriesImage"
                  className="block text-sm font-inter text-slate-600 mb-1"
                >
                  Series Image URL (Optional)
                </label>
                <input
                  type="url"
                  id="seriesImage"
                  name="seriesImage"
                  value={formData.seriesImage}
                  onChange={handleChange}
                  className="w-full p-2 border border-slate-300 rounded-md font-inter text-slate-800"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          )}

          {/* Form Actions */}
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
              Create {postType === "single" ? "Post" : "Series"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePostForm;
