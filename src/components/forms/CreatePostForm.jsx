// src/components/forms/CreatePostForm.jsx
import { useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
  doc,
  arrayUnion,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { dbase, storage } from "../../firebase";
import { useAuth } from "../../context/AuthContext";

function CreatePostForm({ isOpen, onClose }) {
  const [postType, setPostType] = useState("single"); // single or series
  const [formData, setFormData] = useState({
    singleTitle: "",
    singleContent: "",
    seriesTitle: "",
    episodeTitle: "",
    episodeContent: "",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = ["image/png", "image/jpeg"];
      if (!validTypes.includes(selectedFile.type)) {
        setError("Please upload a PNG or JPEG image.");
        setFile(null);
        setPreview(null);
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB.");
        setFile(null);
        setPreview(null);
        return;
      }
      setError("");
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setFile(null);
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("Please log in to create a post.");
      return;
    }

    try {
      if (postType === "single") {
        // Single Post
        if (!formData.singleTitle || !formData.singleContent) {
          setError("Title and content are required.");
          return;
        }

        // Create post doc
        const postRef = await addDoc(collection(dbase, "posts"), {});
        let imageUrl = null;

        // Upload image if provided
        if (file) {
          const storageRef = ref(
            storage,
            `images/posts/${postRef.id}/${file.name}`
          );
          await uploadBytes(storageRef, file);
          imageUrl = await getDownloadURL(storageRef);
        }

        // Save post
        const postData = {
          title: formData.singleTitle,
          content: formData.singleContent,
          image: imageUrl,
          datePosted: serverTimestamp(),
          createdBy: user.uid,
        };
        await updateDoc(postRef, postData);

        // Update user posts
        await updateDoc(doc(dbase, "users", user.uid), {
          posts: arrayUnion({ id: postRef.id, ...postData }),
        });

        alert("Single Post created successfully!");
      } else {
        // Series
        if (
          !formData.seriesTitle ||
          !formData.episodeTitle ||
          !formData.episodeContent
        ) {
          setError(
            "Series title, episode title, and episode content are required."
          );
          return;
        }

        // Create series doc
        const seriesRef = await addDoc(collection(dbase, "series"), {});
        let imageUrl = null;

        // Upload image if provided
        if (file) {
          const storageRef = ref(
            storage,
            `images/series/${seriesRef.id}/${file.name}`
          );
          await uploadBytes(storageRef, file);
          imageUrl = await getDownloadURL(storageRef);
        }

        // Save series
        const seriesData = {
          title: formData.seriesTitle,
          image: imageUrl,
          datePosted: serverTimestamp(),
          createdBy: user.uid,
        };
        await updateDoc(seriesRef, seriesData);

        // Save episode
        const episodeRef = await addDoc(
          collection(dbase, "series", seriesRef.id, "episodes"),
          {
            title: formData.episodeTitle,
            content: formData.episodeContent,
            datePosted: serverTimestamp(),
          }
        );

        // Update user series
        await updateDoc(doc(dbase, "users", user.uid), {
          series: arrayUnion({
            id: seriesRef.id,
            ...seriesData,
            episodes: [
              {
                id: episodeRef.id,
                title: formData.episodeTitle,
                content: formData.episodeContent,
                datePosted: serverTimestamp(),
              },
            ],
          }),
        });

        alert("Series with Episode created successfully!");
      }

      // Reset form
      setFormData({
        singleTitle: "",
        singleContent: "",
        seriesTitle: "",
        episodeTitle: "",
        episodeContent: "",
      });
      setFile(null);
      setPreview(null);
      setError("");
      onClose();
    } catch (err) {
      setError("Failed to create post: " + err.message);
    }
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
                  Featured Image (Optional)
                </label>
                <input
                  type="file"
                  id="singleImage"
                  accept="image/png,image/jpeg"
                  onChange={handleFileChange}
                  className="w-full p-2 border border-slate-300 rounded-md font-inter text-slate-800"
                />
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="mt-2 w-32 h-32 object-cover rounded-md"
                  />
                )}
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
                  Series Image (Optional)
                </label>
                <input
                  type="file"
                  id="seriesImage"
                  accept="image/png,image/jpeg"
                  onChange={handleFileChange}
                  className="w-full p-2 border border-slate-300 rounded-md font-inter text-slate-800"
                />
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="mt-2 w-32 h-32 object-cover rounded-md"
                  />
                )}
              </div>
            </div>
          )}

          {error && <p className="text-red-500 font-inter mb-4">{error}</p>}

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
