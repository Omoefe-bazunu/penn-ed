// src/components/ui/TopNavbar.jsx
import { Link, useLocation } from "react-router-dom";

// Dummy auth state (replace with Firebase later)
const isLoggedIn = true; // Simulate logged-in user

// Top navigation links with SVG icons
const topNavLinks = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M20.488 9H15V15.488"
        />
      </svg>
    ),
  },
  {
    to: "/about",
    label: "About",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    to: "/contact",
    label: "Contact",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
];

function TopNavbar() {
  const location = useLocation();

  // Dummy logout function (replace with Firebase logout)
  const handleLogout = () => {
    console.log("Logged out (dummy)");
    alert("Logged out (dummy)");
  };

  return (
    <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-20 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center py-3">
        {/* Brand Logo */}
        <Link
          to="/"
          className="text-2xl font-bold font-poppins text-teal-600 hover:text-teal-500"
        >
          Penned
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {topNavLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center px-2 py-1 text-sm font-inter text-slate-600 hover:text-teal-600 transition-colors ${
                location.pathname === link.to
                  ? "text-teal-600 font-semibold"
                  : ""
              }`}
            >
              <span className="mr-1 hidden md:inline">{link.icon}</span>
              <span className="hidden md:inline">{link.label}</span>
              <span className="md:hidden">{link.icon}</span>
            </Link>
          ))}
          {/* Auth Link */}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="flex items-center px-2 py-1 text-sm font-inter text-slate-600 hover:text-teal-600 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="hidden md:inline">Logout</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="flex items-center px-2 py-1 text-sm font-inter text-slate-600 hover:text-teal-600 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              <span className="hidden md:inline">Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default TopNavbar;
