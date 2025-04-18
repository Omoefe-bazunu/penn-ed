import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [retryTimeout, setRetryTimeout] = useState(null);
  const { signup, authError, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Clear timeout on unmount
    return () => {
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, [retryTimeout]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic validation
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    const result = await signup(email, password, name);

    if (result.success) {
      setSuccess("Account created! Please check your email for verification.");
      setTimeout(() => navigate("/login"), 5000);
    } else if (result.code === "auth/too-many-requests") {
      // Set a retry timeout (5 minutes)
      const timeout = setTimeout(() => {
        setError("You can now try signing up again.");
        setRetryTimeout(null);
      }, 300000); // 5 minutes
      setRetryTimeout(timeout);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Sign Up</h1>

      {authError && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
          {authError}
          {retryTimeout && (
            <p className="mt-2 text-sm">
              Try again in {Math.ceil(retryTimeout._idleTimeout / 1000 / 60)}{" "}
              minutes.
            </p>
          )}
        </div>
      )}

      {success && (
        <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-4">
          {success}
        </div>
      )}

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
            className="w-full p-2 border border-slate-300 rounded-md font-inter text-slate-800 darktheme"
            placeholder="Enter your name"
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-md font-inter text-slate-800 darktheme"
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
            className="w-full p-2 border border-slate-300 rounded-md font-inter text-slate-800 darktheme"
            required
            minLength={6}
          />
        </div>
        <button
          type="submit"
          disabled={loading || retryTimeout}
          className={`w-full py-2 rounded-lg ${
            loading || retryTimeout
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-teal-600 hover:bg-teal-500"
          } text-white font-semibold transition-colors`}
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}

export default Signup;
