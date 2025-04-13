// src/pages/Jobs/Index.jsx
import { useState } from "react";
import CreateJobForm from "../../components/forms/CreateJobForm";
import JobDetailsModal from "../../components/jobDetailsModal";

// Dummy job data
const dummyJobs = [
  {
    id: "1",
    title: "Freelance Content Writer",
    datePosted: "April 10, 2025",
    description:
      "Join our team to create engaging blog posts and articles for various clients. Flexible hours, remote work.",
    image: "https://via.placeholder.com/400x200?text=Content+Writer",
    externalLink: "https://example.com/apply/content-writer",
  },
  {
    id: "2",
    title: "Scriptwriter for Short Films",
    datePosted: "April 8, 2025",
    description:
      "We’re looking for a creative scriptwriter to develop compelling scripts for short films. Experience in storytelling required.",
    image: "https://via.placeholder.com/400x200?text=Scriptwriter",
  },
  {
    id: "3",
    title: "Copyeditor (Part-Time)",
    datePosted: "April 5, 2025",
    description:
      "Polish manuscripts and marketing content for clarity and impact. Attention to detail is a must.",
    image: "https://via.placeholder.com/400x200?text=Copyeditor",
    externalLink: "https://example.com/apply/copyeditor",
  },
  {
    id: "4",
    title: "Technical Writer",
    datePosted: "April 3, 2025",
    description:
      "Create clear documentation for software products. Knowledge of tech and strong writing skills needed.",
  },
  {
    id: "5",
    title: "Poetry Contributor",
    datePosted: "April 1, 2025",
    description:
      "Submit original poetry for our literary magazine. All styles welcome, passion for verse required.",
    image: "https://via.placeholder.com/400x200?text=Poetry",
    externalLink: "https://example.com/apply/poetry",
  },
];

function Jobs() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);

  const openJobModal = (job) => setSelectedJob(job);
  const closeJobModal = () => setSelectedJob(null);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-poppins text-slate-800">
          Job Opportunities
        </h1>
        <button
          onClick={openForm}
          className="bg-teal-600 text-white font-inter font-semibold py-2 px-4 rounded-lg hover:bg-teal-500 transition-colors"
        >
          Post New Job
        </button>
      </div>

      {/* Create Job Form Modal */}
      <CreateJobForm isOpen={isFormOpen} onClose={closeForm} />

      {/* Job List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dummyJobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => openJobModal(job)}
          >
            {job.image && (
              <img
                src={job.image}
                alt={job.title}
                className="w-full h-32 object-cover rounded-md mb-4"
              />
            )}
            <h2 className="text-xl font-semibold font-poppins text-slate-800 mb-2">
              {job.title}
            </h2>
            <p className="text-sm font-inter text-slate-600 mb-2">
              Posted on: {job.datePosted}
            </p>
            <p className="text-slate-600 font-inter line-clamp-3">
              {job.description}
            </p>
          </div>
        ))}
      </div>

      {/* Job Details Modal */}
      <JobDetailsModal
        job={selectedJob}
        isOpen={!!selectedJob}
        onClose={closeJobModal}
      />
    </div>
  );
}

export default Jobs;
