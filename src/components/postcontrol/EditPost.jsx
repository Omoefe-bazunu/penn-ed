import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { dbase, storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function EditPost({ post, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: post.title || "",
    content: post.content || "",
    image: post.image || "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.title.trim() || !formData.content.trim()) {
      setError("Title and content are required.");
      setLoading(false);
      return;
    }

    try {
      let imageUrl = formData.image;

      // Upload new file if selected
      if (selectedFile) {
        const storageRef = ref(
          storage,
          `posts/${post.id}/${selectedFile.name}`
        );
        await uploadBytes(storageRef, selectedFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      await setDoc(
        doc(dbase, "posts", post.id),
        {
          title: formData.title.trim(),
          content: formData.content.trim(),
          image: imageUrl || null,
        },
        { merge: true }
      );
      onSave();
      onClose();
    } catch (err) {
      setError("Failed to update post: " + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold font-poppins text-slate-800 mb-4">
          Edit Post
        </h2>
        {error && <p className="text-red-500 font-inter mb-4">{error}</p>}
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
              className="w-full p-2 border border-slate-300 rounded-md font-inter text-slate-800 darktheme"
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
              className="w-full p-2 border border-slate-300 rounded-md font-inter text-slate-800 darktheme"
              rows="5"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label
              htmlFor="file"
              className="block text-sm font-inter text-slate-600 mb-1"
            >
              Upload Image
            </label>
            <input
              type="file"
              id="file"
              name="file"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full p-2 border border-slate-300 rounded-md font-inter text-slate-800"
            />
            {formData.image && !selectedFile && (
              <p className="text-xs mt-1 text-slate-500">
                Current image will be kept if no new file is selected.
              </p>
            )}
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className={`bg-teal-600 text-white font-inter font-semibold py-2 px-4 rounded-lg hover:bg-teal-500 transition-colors ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-300 text-slate-800 font-inter font-semibold py-2 px-4 rounded-lg hover:bg-slate-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPost;
