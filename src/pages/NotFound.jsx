// src/pages/NotFound.jsx
function NotFound() {
  return (
    <div className="max-w-7xl mx-auto py-10 px-4 text-center">
      <h1 className="text-4xl font-bold text-slate-800 font-poppins">404</h1>
      <p className="mt-4 text-lg text-slate-600 font-inter">
        Page not found. Try navigating back to the{" "}
        <a href="/" className="text-teal-500 hover:underline">
          home page
        </a>
        .
      </p>
    </div>
  );
}

export default NotFound;
