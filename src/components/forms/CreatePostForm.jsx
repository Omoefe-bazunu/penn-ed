import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  addDoc,
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { dbase, storage } from "../../firebase";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function CreatePostForm({ onSuccess }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [contentType, setContentType] = useState("post");
  const [seriesId, setSeriesId] = useState("");
  const [seriesList, setSeriesList] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Quill editor modules configuration
  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"], // toggled buttons
      ["blockquote", "code-block"],
      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }], // superscript/subscript
      [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
      [{ direction: "rtl" }], // text direction
      [{ size: ["small", false, "large", "huge"] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],
      ["link", "image", "video"],
      ["clean"], // remove formatting button
    ],
  };

  // Quill editor formats configuration
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

  // Fetch series for episode creation
  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const q = query(collection(dbase, "series"), orderBy("title"));
        const snapshot = await getDocs(q);
        const seriesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
        }));
        setSeriesList(seriesData);
      } catch (err) {
        setError("Failed to load series: " + err.message);
      }
    };
    if (contentType === "episode") {
      fetchSeries();
    }
  }, [contentType]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = ["image/png", "image/jpeg"];
      if (!validTypes.includes(selectedFile.type)) {
        setError("Please upload a PNG or JPEG image.");
        setFile(null);
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB.");
        setFile(null);
        return;
      }
      setError("");
      setFile(selectedFile);
    } else {
      setFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("Please log in to create content.");
      return;
    }
    if (!title || !content) {
      setError("Title and content are required.");
      return;
    }
    if (contentType === "episode" && !seriesId) {
      setError("Please select a series for the episode.");
      return;
    }

    setLoading(true);
    try {
      let imageUrl = null;
      const createdBy = user.displayName || user.email.split("@")[0];

      // Determine Firestore and Storage paths based on content type
      let collectionPath, storagePathPrefix, navigatePath;
      if (contentType === "post") {
        collectionPath = collection(dbase, "posts");
        storagePathPrefix = `images/posts`;
        navigatePath = `/posts`;
      } else if (contentType === "series") {
        collectionPath = collection(dbase, "series");
        storagePathPrefix = `images/series`;
        navigatePath = `/posts`;
      } else {
        collectionPath = collection(dbase, "series", seriesId, "episodes");
        storagePathPrefix = `images/series/${seriesId}/episodes`;
        navigatePath = `/series/${seriesId}`;
      }

      // Generate a docId for the Storage path
      const docId = doc(collectionPath).id;

      // Upload image if provided
      if (file) {
        const storageRef = ref(
          storage,
          `${storagePathPrefix}/${docId}/${file.name}`
        );
        await uploadBytes(storageRef, file);
        imageUrl = await getDownloadURL(storageRef);
      }

      // Create document with all data
      const docRef = await addDoc(collectionPath, {
        title,
        content,
        image: imageUrl,
        datePosted: serverTimestamp(),
        upvotes: 0,
        createdBy,
      });

      // Only add to user's posts array if this is a post (not series or episode)
      if (contentType === "post") {
        const userRef = doc(dbase, "users", user.uid);
        await updateDoc(userRef, {
          posts: arrayUnion(docRef.id),
        });
      }

      setSuccess(
        `${
          contentType.charAt(0).toUpperCase() + contentType.slice(1)
        } created successfully!`
      );
      setError("");
      setTitle("");
      setContent("");
      setFile(null);
      setSeriesId("");
      setContentType("post");

      // Call onSuccess to close modal and navigate
      if (onSuccess) onSuccess();
      navigate(navigatePath);
    } catch (err) {
      if (err.code === "permission-denied") {
        setError(
          `Permission denied when creating ${contentType}. Please ensure you are logged in.`
        );
      } else if (err.code.includes("storage")) {
        setError(`Failed to upload image: ${err.message}`);
      } else {
        setError(`Failed to create ${contentType}: ${err.message}`);
      }
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg font-inter mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-teal-100 text-teal-700 p-4 rounded-lg font-inter mb-4">
          {success}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="mb-4">
          <label
            htmlFor="contentType"
            className="block text-sm font-inter text-slate-600 mb-1 darktheme"
          >
            Content Type
          </label>
          <select
            id="contentType"
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-md font-inter text-slate-800 darktheme"
          >
            <option value="post">Single Post</option>
            <option value="series">Series</option>
            <option value="episode">Episode (For existing Series)</option>
          </select>
        </div>
        {contentType === "episode" && (
          <div className="mb-4">
            <label
              htmlFor="seriesId"
              className="block text-sm font-inter text-slate-600 mb-1"
            >
              Select Series
            </label>
            <select
              id="seriesId"
              value={seriesId}
              onChange={(e) => setSeriesId(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-md font-inter text-slate-800 darktheme"
              required
            >
              <option value="">Select a series</option>
              {seriesList.map((series) => (
                <option key={series.id} value={series.id}>
                  {series.title}
                </option>
              ))}
            </select>
          </div>
        )}
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            className="bg-white"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="image"
            className="block text-sm font-inter text-slate-600 mb-1"
          >
            Image (PNG/JPEG, max 5MB)
          </label>
          <input
            type="file"
            id="image"
            accept="image/png,image/jpeg"
            onChange={handleFileChange}
            className="w-full p-2 border border-slate-300 rounded-md font-inter text-slate-800"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-teal-600 text-white font-inter font-semibold py-2 rounded-lg hover:bg-teal-500 transition-colors ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading
            ? "Creating..."
            : `Create ${
                contentType.charAt(0).toUpperCase() + contentType.slice(1)
              }`}
        </button>
      </form>
    </div>
  );
}

export default CreatePostForm;
