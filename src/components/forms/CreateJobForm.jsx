import { useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { dbase, storage } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function CreateJobForm({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    externalLink: "",
    image: null,
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  // Quill editor modules configuration
  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [{ header: 1 }, { header: 2 }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ direction: "rtl" }],
      [{ size: ["small", false, "large", "huge"] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "color",
    "background",
    "align",
    "size",
    "font",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDescriptionChange = (value) => {
    setFormData({ ...formData, description: value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      setFile(null);
      setPreview(null);
      return;
    }

    const validTypes = ["image/png", "image/jpeg"];
    if (!validTypes.includes(selectedFile.type)) {
      setError("Please upload a PNG or JPEG image.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    setError("");
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!user) {
      setError("Please log in to add a job.");
      setIsSubmitting(false);
      return;
    }

    if (!formData.title || !formData.company || !formData.description) {
      setError("Title, company, and description are required.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Create job document first
      const jobData = {
        title: formData.title.trim(),
        company: formData.company.trim(),
        description: formData.description,
        externalLink: formData.externalLink.trim() || null,
        datePosted: serverTimestamp(),
        createdBy: user.uid,
        createdByName: user.displayName || "Anonymous",
      };

      // Upload image if provided
      if (file) {
        const docRef = await addDoc(collection(dbase, "jobs"), jobData);
        const storageRef = ref(
          storage,
          `images/jobs/${docRef.id}/${file.name}`
        );
        await uploadBytes(storageRef, file);
        const imageUrl = await getDownloadURL(storageRef);
        await updateDoc(doc(dbase, "jobs", docRef.id), { image: imageUrl });
      } else {
        await addDoc(collection(dbase, "jobs"), jobData);
      }

      // Reset form
      setFormData({
        title: "",
        company: "",
        description: "",
        externalLink: "",
        image: null,
      });
      setFile(null);
      setPreview(null);

      alert("Job added successfully!");
      onClose();
    } catch (err) {
      console.error("Error adding job:", err);
      setError("Failed to add job: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-md max-w-lg w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold font-poppins text-slate-800">
            Add New Job
          </h2>
          <button
            onClick={onClose}
            className="text-slate-600 hover:text-slate-800"
            disabled={isSubmitting}
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
              Job Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border border-slate-300 rounded-md font-inter text-slate-800"
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="company"
              className="block text-sm font-inter text-slate-600 mb-1"
            >
              Company *
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full p-2 border border-slate-300 rounded-md font-inter text-slate-800"
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-inter text-slate-600 mb-1"
            >
              Description *
            </label>
            <ReactQuill
              theme="snow"
              value={formData.description}
              onChange={handleDescriptionChange}
              modules={modules}
              formats={formats}
              className="bg-white rounded-md font-inter text-slate-800 mb-2"
              readOnly={isSubmitting}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="externalLink"
              className="block text-sm font-inter text-slate-600 mb-1"
            >
              Application Link
            </label>
            <input
              type="url"
              id="externalLink"
              name="externalLink"
              value={formData.externalLink}
              onChange={handleChange}
              className="w-full p-2 border border-slate-300 rounded-md font-inter text-slate-800"
              disabled={isSubmitting}
              placeholder="https://example.com/apply"
            />
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
              disabled={isSubmitting}
            />
            {preview && (
              <div className="mt-2">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                  className="mt-2 text-sm text-red-600 hover:text-red-800"
                  disabled={isSubmitting}
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>
          {error && <p className="text-red-500 font-inter mb-4">{error}</p>}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-600 text-white font-inter font-semibold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-teal-600 text-white font-inter font-semibold py-2 px-4 rounded-lg hover:bg-teal-500 transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Job"}
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2">* Required fields</p>
        </form>
      </div>
    </div>
  );
}

export default CreateJobForm;
