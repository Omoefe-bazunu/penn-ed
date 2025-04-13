// src/pages/Auth/Signup.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { dbase } from "../../firebase";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signup(email, password);
      const user = userCredential.user;
      await setDoc(doc(dbase, "users", user.uid), {
        name: name || user.email.split("@")[0],
        email: user.email,
        profilePicture: null,
        bio: "",
        contactInfo: {
          phone: "",
          address: "",
        },
        socialLinks: {
          twitter: "",
          linkedin: "",
          instagram: "",
        },
        posts: [],
        series: [],
        upvotedPosts: [],
        pendingReceipt: null,
        subscriptions: [],
        subscribed: false,
      });
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to sign up: " + err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold font-poppins text-slate-800 mb-6">
        Sign Up
      </h1>
      {error && <p className="text-red-500 font-inter mb-4">{error}</p>}
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
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-md font-inter"
            placeholder="Enter your name"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-inter text-slate-600 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-md font-inter"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-inter text-slate-600 mb-1"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-md font-inter"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-teal-600 text-white font-inter font-semibold py-2 rounded-lg hover:bg-teal-500 transition-colors"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default Signup;
