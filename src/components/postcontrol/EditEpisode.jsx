import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { dbase } from "../../firebase";

function EditEpisode({ series, episode, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: episode.title || "",
    content: episode.content || "",
    image: episode.image || "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      await setDoc(
        doc(dbase, "series", series.id, "episodes", episode.id),
        {
          title: formData.title.trim(),
          content: formData.content.trim(),
          image: formData.image.trim() || null,
        },
        { merge: true }
      );
      onSave();
      onClose();
    } catch (err) {
      setError("Failed to update episode: " + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold font-poppins text-slate-800 mb-4">
          Edit Episode
        </h2>
        <p className="text-slate-600 font-inter mb-4">Series: {series.title}</p>
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
              htmlFor="image"
              className="block text-sm font-inter text-slate-600 mb-1"
            >
              Image URL
            </label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full p-2 border border-slate-300 rounded-md font-inter text-slate-800 darktheme"
            />
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

export default EditEpisode;
