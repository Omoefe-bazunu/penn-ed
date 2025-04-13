// src/components/JobCard.jsx
function JobCard({ job }) {
  return (
    <div className="bg-slate-100 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      {job.image && (
        <img
          src={job.image}
          alt={job.title}
          className="w-full h-32 object-cover rounded-md mb-3"
        />
      )}
      <h3 className="text-lg font-semibold font-poppins text-teal-600 mb-1">
        {job.title}
      </h3>
      <p className="text-slate-600 font-inter text-sm mb-2">
        <strong>{job.company}</strong>
      </p>
      <p className="text-slate-600 font-inter text-sm mb-3">
        {job.description.length > 100
          ? `${job.description.substring(0, 100)}...`
          : job.description}
      </p>
      {job.externalLink && (
        <a
          href={job.externalLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-teal-600 text-white font-inter font-semibold py-1 px-3 rounded-md hover:bg-teal-500 transition-colors"
        >
          Apply Now
        </a>
      )}
    </div>
  );
}

export default JobCard;
