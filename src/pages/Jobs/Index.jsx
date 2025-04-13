// src/pages/Jobs/Index.jsx
import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  getCountFromServer,
} from "firebase/firestore";
import { dbase } from "../../firebase";
import JobCard from "../../components/ui/JobCard";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const jobsPerPage = 6;

  // Fetch total job count for pagination
  useEffect(() => {
    const fetchJobCount = async () => {
      try {
        const coll = collection(dbase, "jobs");
        const snapshot = await getCountFromServer(coll);
        const count = snapshot.data().count;
        setTotalPages(Math.ceil(count / jobsPerPage));
      } catch (err) {
        setError("Failed to load job count: " + err.message);
      }
    };
    fetchJobCount();
  }, []);

  // Fetch jobs for current page
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        let jobQuery = query(
          collection(dbase, "jobs"),
          orderBy("datePosted", "desc"),
          limit(jobsPerPage)
        );

        // Adjust query for pagination
        if (currentPage > 1 && lastDoc) {
          jobQuery = query(
            collection(dbase, "jobs"),
            orderBy("datePosted", "desc"),
            startAfter(lastDoc),
            limit(jobsPerPage)
          );
        }

        const querySnapshot = await getDocs(jobQuery);
        const jobList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Update last document for next page
        setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1] || null);
        setJobs(jobList);
        setLoading(false);
      } catch (err) {
        setError("Failed to load jobs: " + err.message);
        setLoading(false);
      }
    };
    fetchJobs();
  }, [currentPage, lastDoc]);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setLastDoc(null); // Reset for accurate fetching
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
    setLastDoc(null); // Reset for accurate fetching
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold font-poppins text-slate-800 mb-6">
        Job Opportunities
      </h1>
      {error && <p className="text-red-500 font-inter mb-4">{error}</p>}
      {jobs.length === 0 ? (
        <p className="text-slate-600 font-inter">No jobs available.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          <div className="flex justify-center items-center space-x-2">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className={`py-2 px-4 rounded-lg font-inter font-semibold ${
                currentPage === 1
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : "bg-teal-600 text-white hover:bg-teal-500"
              } transition-colors`}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageClick(page)}
                className={`py-1 px-3 rounded-md font-inter ${
                  currentPage === page
                    ? "bg-teal-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                } transition-colors`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`py-2 px-4 rounded-lg font-inter font-semibold ${
                currentPage === totalPages
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : "bg-teal-600 text-white hover:bg-teal-500"
              } transition-colors`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Jobs;
