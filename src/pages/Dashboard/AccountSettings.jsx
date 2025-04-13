import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { dbase, storage } from "../../firebase";
import { Navigate } from "react-router-dom";

function AccountSettings() {
  const { user, userData, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    phone: "",
    address: "",
    twitter: "",
    linkedin: "",
    instagram: "",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        bio: userData.bio || "",
        phone: userData.contactInfo?.phone || "",
        address: userData.contactInfo?.address || "",
        twitter: userData.socialLinks?.twitter || "",
        linkedin: userData.socialLinks?.linkedin || "",
        instagram: userData.socialLinks?.instagram || "",
      });
      setPreview(userData.profilePicture || null);
    }
  }, [userData]);

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
      setPreview(userData?.profilePicture || null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("Please log in.");
      return;
    }
    try {
      let profilePictureUrl = userData?.profilePicture || null;
      if (file) {
        const storageRef = ref(
          storage,
          `images/profiles/${user.uid}/${file.name}`
        );
        await uploadBytes(storageRef, file);
        profilePictureUrl = await getDownloadURL(storageRef);
      }
      await updateDoc(doc(dbase, "users", user.uid), {
        name: formData.name,
        bio: formData.bio,
        contactInfo: {
          phone: formData.phone,
          address: formData.address,
        },
        socialLinks: {
          twitter: formData.twitter,
          linkedin: formData.linkedin,
          instagram: formData.instagram,
        },
        profilePicture: profilePictureUrl,
      });
      setSuccess("Profile updated successfully!");
      setError("");
    } catch (err) {
      setError("Failed to update profile: " + err.message);
      setSuccess("");
    }
  };

  if (authLoading) return <div className="text-center py-10">Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold font-poppins text-slate-800 mb-6">
        Account Settings
      </h1>
      {error && <p className="text-red-500 font-inter mb-4">{error}</p>}
      {success && <p className="text-teal-600 font-inter mb-4">{success}</p>}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-inter text-slate-600 mb-1"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-slate-300 rounded-md font-inter"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="bio"
            className="block text-sm font-inter text-slate-600 mb-1"
          >
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full p-2 border border-slate-300 rounded-md font-inter"
            rows="4"
          ></textarea>
        </div>
        <div className="mb-4">
          <label
            htmlFor="phone"
            className="block text-sm font-inter text-slate-600 mb-1"
          >
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 border border-slate-300 rounded-md font-inter"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="address"
            className="block text-sm font-inter text-slate-600 mb-1"
          >
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 border border-slate-300 rounded-md font-inter"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="twitter"
            className="block text-sm font-inter text-slate-600 mb-1"
          >
            Twitter URL
          </label>
          <input
            type="url"
            id="twitter"
            name="twitter"
            value={formData.twitter}
            onChange={handleChange}
            className="w-full p-2 border border-slate-300 rounded-md font-inter"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="linkedin"
            className="block text-sm font-inter text-slate-600 mb-1"
          >
            LinkedIn URL
          </label>
          <input
            type="url"
            id="linkedin"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
            className="w-full p-2 border border-slate-300 rounded-md font-inter"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="instagram"
            className="block text-sm font-inter text-slate-600 mb-1"
          >
            Instagram URL
          </label>
          <input
            type="url"
            id="instagram"
            name="instagram"
            value={formData.instagram}
            onChange={handleChange}
            className="w-full p-2 border border-slate-300 rounded-md font-inter"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="profilePicture"
            className="block text-sm font-inter text-slate-600 mb-1"
          >
            Profile Picture (PNG/JPEG, max 5MB)
          </label>
          <input
            type="file"
            id="profilePicture"
            accept="image/png,image/jpeg"
            onChange={handleFileChange}
            className="w-full p-2 border border-slate-300 rounded-md font-inter"
          />
          {preview && (
            <img
              src={preview}
              alt="Profile Preview"
              className="mt-2 w-24 h-24 rounded-full object-cover"
            />
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-teal-600 text-white font-inter font-semibold py-2 rounded-lg hover:bg-teal-500 transition-colors"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
}

export default AccountSettings;
