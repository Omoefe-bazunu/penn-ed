import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { dbase, storage } from "../../firebase";
import { useAuth } from "../../context/AuthContext";

function CreateCourseForm({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    externalLink: "",
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
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("Please log in to add a course.");
      return;
    }
    if (!file) {
      setError("Please upload a featured image.");
      return;
    }
    try {
      // Upload image
      const docRef = await addDoc(collection(dbase, "courses"), {}); // Create doc to get ID
      const storageRef = ref(
        storage,
        `images/courses/${docRef.id}/${file.name}`
      );
      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);

      // Save course
      await updateDoc(docRef, {
        title: formData.title,
        description: formData.description,
        externalLink: formData.externalLink,
        image: imageUrl,
        datePosted: serverTimestamp(),
        createdBy: user.uid,
      });

      alert("Course added successfully!");
      setFormData({ title: "", description: "", externalLink: "" });
      setFile(null);
      setPreview(null);
      onClose();
    } catch (err) {
      setError("Failed to add course: " + err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-md max-w-lg w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold font-poppins text-slate-800">
            Add New Course
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
              Course Title
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
              htmlFor="description"
              className="block text-sm font-inter text-slate-600 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border border-slate-300 rounded-md font-inter text-slate-800"
              rows="4"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label
              htmlFor="externalLink"
              className="block text-sm font-inter text-slate-600 mb-1"
            >
              External Link
            </label>
            <input
              type="url"
              id="externalLink"
              name="externalLink"
              value={formData.externalLink}
              onChange={handleChange}
              className="w-full p-2 border border-slate-300 rounded-md font-inter text-slate-800"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="image"
              className="block text-sm font-inter text-slate-600 mb-1"
            >
              Featured Image
            </label>
            <input
              type="file"
              id="image"
              accept="image/png,image/jpeg"
              onChange={handleFileChange}
              className="w-full p-2 border border-slate-300 rounded-md font-inter text-slate-800"
              required
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
              Add Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCourseForm;
