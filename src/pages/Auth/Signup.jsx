// src/pages/Auth/Signup.jsx
import { useState } from "react";
import { Link } from "react-router-dom";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dummy submission logic
    console.log("SignUp Data:", formData);
    alert("SignUp submitted (dummy)");
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      {/* Header */}
      <h1 className="text-3xl font-bold font-poppins text-slate-800 mb-6 text-center">
        Sign Up
      </h1>

      {/* Signup Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-inter text-slate-600 mb-1"
          >
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-slate-300 rounded-md font-inter text-slate-800"
            required
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
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-slate-300 rounded-md font-inter text-slate-800"
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
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border border-slate-300 rounded-md font-inter text-slate-800"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-inter text-slate-600 mb-1"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-2 border border-slate-300 rounded-md font-inter text-slate-800"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-teal-600 text-white font-inter font-semibold py-2 px-4 rounded-lg hover:bg-teal-500 transition-colors"
        >
          Sign Up
        </button>
      </form>

      {/* Login Link */}
      <p className="mt-4 text-center text-slate-600 font-inter">
        Already have an account?{" "}
        <Link to="/login" className="text-teal-600 hover:underline">
          Log In
        </Link>
      </p>
    </div>
  );
}

export default Signup;
