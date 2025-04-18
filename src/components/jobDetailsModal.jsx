// src/components/JobDetailsModal.jsx
function JobDetailsModal({ job, isOpen, onClose }) {
  if (!isOpen || !job) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-md max-w-2xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold font-poppins text-slate-800">
            {job.title}
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

        {/* Job Details */}
        <div className="space-y-4">
          {job.image && (
            <img
              src={job.image}
              alt={job.title}
              className="w-full h-48 object-cover rounded-md"
            />
          )}
          <p className="text-sm font-inter text-slate-600">
            Posted on: {job.datePosted}
          </p>
          <p className="text-slate-800 font-inter leading-relaxed">
            {job.description}
          </p>
          {job.externalLink && (
            <a
              href={job.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-teal-600 text-white font-inter font-semibold py-2 px-4 rounded-lg hover:bg-teal-500 transition-colors"
            >
              Apply Now
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobDetailsModal;
