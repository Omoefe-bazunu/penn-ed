import { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { dbase, storage } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function EditCourseForm({ course, isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    externalLink: "",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || "",
        description: course.description || "",
        externalLink: course.externalLink || "",
      });
      setPreview(course.image || null);
    }
  }, [course]);

  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [{ header: 1 }, { header: 2 }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
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
    "link",
    "image",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDescriptionChange = (value) => {
    setFormData({ ...formData, description: value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
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
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || user.email !== "raniem57@gmail.com") return;

    setIsLoading(true);
    try {
      const updateData = {
        title: formData.title,
        description: formData.description,
        externalLink: formData.externalLink,
      };

      // Handle image upload if new file was selected
      if (file) {
        // Delete old image if it exists
        if (course.image) {
          try {
            const oldImageRef = ref(storage, course.image);
            await deleteObject(oldImageRef);
          } catch (err) {
            console.log("Error deleting old image:", err);
          }
        }

        // Upload new image
        const storageRef = ref(
          storage,
          `images/courses/${course.id}/${file.name}`
        );
        await uploadBytes(storageRef, file);
        updateData.image = await getDownloadURL(storageRef);
      }

      await updateDoc(doc(dbase, "courses", course.id), updateData);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError("Failed to update course: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-md max-w-lg w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold font-poppins text-slate-800">
            Edit Course
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
            <label className="block text-sm font-inter text-slate-600 mb-1">
              Course Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border border-slate-300 rounded-md font-inter text-slate-800"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-inter text-slate-600 mb-1">
              Description
            </label>
            <ReactQuill
              theme="snow"
              value={formData.description}
              onChange={handleDescriptionChange}
              modules={modules}
              formats={formats}
              className="bg-white rounded-md font-inter text-slate-800 mb-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-inter text-slate-600 mb-1">
              External Link
            </label>
            <input
              type="url"
              name="externalLink"
              value={formData.externalLink}
              onChange={handleChange}
              className="w-full p-2 border border-slate-300 rounded-md font-inter text-slate-800"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-inter text-slate-600 mb-1">
              Featured Image
            </label>
            <input
              type="file"
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
              disabled={isLoading}
              className={`bg-teal-600 text-white font-inter font-semibold py-2 px-4 rounded-lg hover:bg-teal-500 transition-colors ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditCourseForm;
