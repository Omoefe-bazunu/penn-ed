import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  addDoc,
  collection,
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

function CreateBlogPost({ onSuccess }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (!["image/png", "image/jpeg"].includes(selected.type)) {
      return setError("Only PNG or JPEG images are allowed.");
    }
    if (selected.size > 5 * 1024 * 1024) {
      return setError("Image size should be less than 5MB.");
    }

    setError("");
    setFile(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) return setError("You must be logged in to create a post.");
    if (!title || !content) return setError("Title and content are required.");

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const createdBy = user.displayName || user.email.split("@")[0];
      const postsRef = collection(dbase, "blogs");
      const postId = doc(postsRef).id;

      let imageUrl = null;

      if (file) {
        const imageRef = ref(storage, `images/blogs/${postId}/${file.name}`);
        await uploadBytes(imageRef, file);
        imageUrl = await getDownloadURL(imageRef);
      }

      const docRef = await addDoc(postsRef, {
        title,
        content,
        image: imageUrl,
        createdBy,
        datePosted: serverTimestamp(),
        upvotes: 0,
      });

      const userRef = doc(dbase, "users", user.uid);
      await updateDoc(userRef, {
        posts: arrayUnion(docRef.id),
      });

      setSuccess("Post created successfully!");
      setTitle("");
      setContent("");
      setFile(null);
      if (onSuccess) onSuccess();
      navigate("/posts");
    } catch (err) {
      setError(err.message || "Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-5xl mx-auto">
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>
      )}
      {success && (
        <div className="bg-green-100 text-green-700 p-4 rounded mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm mb-1">Title</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">Content</label>
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            className="bg-white"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">Image (optional)</label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          className={`w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-500 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Blog Post"}
        </button>
      </form>
    </div>
  );
}

export default CreateBlogPost;
