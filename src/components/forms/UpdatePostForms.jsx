import { useState, useEffect } from "react";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { dbase, storage } from "../../firebase";
import { useAuth } from "../../context/AuthContext";

function UpdatePostForm({ isOpen, onClose, post }) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || "",
        content: post.content || "",
      });
      setPreview(post.image || null);
    }
  }, [post]);

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
      setPreview(post?.image || null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("Please log in.");
      return;
    }
    if (!formData.title || !formData.content) {
      setError("Title and content are required.");
      return;
    }
    try {
      let imageUrl = post?.image || null;
      if (file) {
        const storageRef = ref(storage, `images/posts/${post.id}/${file.name}`);
        await uploadBytes(storageRef, file);
        imageUrl = await getDownloadURL(storageRef);
      }
      await updateDoc(doc(dbase, "posts", post.id), {
        title: formData.title,
        content: formData.content,
        image: imageUrl,
      });
      alert("Post updated successfully!");
      onClose();
    } catch (err) {
      setError("Failed to update post: " + err.message);
    }
  };

  const handleDelete = async () => {
    if (!user) {
      setError("Please log in.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        if (post.image) {
          const imageRef = ref(storage, post.image);
          await deleteObject(imageRef).catch(() => {}); // Ignore if image missing
        }
        await deleteDoc(doc(dbase, "posts", post.id));
        alert("Post deleted successfully!");
        onClose();
      } catch (err) {
        setError("Failed to delete post: " + err.message);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-md max-w-lg w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold font-poppins text-slate-800">
            Update Post
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
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-inter text-slate-600 mb-1"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border border-slate-300 rounded-md font-inter text-slate-800"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="content"
              className="block text-sm font-inter text-slate-600 mb-1"
            >
              Content
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="w-full p-2 border border-slate-300 rounded-md font-inter text-slate-800"
              rows="6"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label
              htmlFor="image"
              className="block text-sm font-inter text-slate-600 mb-1"
            >
              Featured Image (Optional)
            </label>
            <input
              type="file"
              id="image"
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
          {error && <p className="text-red-500 font-inter mb-4">{error}</p>}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-600 text-white font-inter font-semibold py-2 px-4 rounded-lg hover:bg-red-500 transition-colors"
            >
              Delete Post
            </button>
            <div className="flex space-x-4">
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
                Update Post
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdatePostForm;
