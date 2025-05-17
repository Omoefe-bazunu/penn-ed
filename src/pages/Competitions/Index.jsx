import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where } from "firebase/firestore";
import { dbase } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import CompetitionApplicationModal from "../../components/CompetitionApplicationModal";
import SubscriptionModal from "../../components/subscriptionModal";
import EditCompetitionForm from "../../components/forms/EditCompetitions";
import DeleteCompetitionModal from "../../components/forms/DeleteCompetitions";
import SafeHTML from "../Posts/SafeHTML";

function Competitions() {
  const [activeTab, setActiveTab] = useState("ongoing");
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const { user, userData, loading: authLoading } = useAuth();

  const fetchCompetitions = async () => {
    try {
      const q = query(
        collection(dbase, "competitions"),
        where("status", "==", activeTab) // Use lowercase to match database
      );
      const querySnapshot = await getDocs(q);
      const competitionsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        datePosted: doc.data().datePosted?.toDate() || new Date(),
      }));
      // console.log("Fetched competitions:", competitionsData); // Debug log
      return competitionsData;
    } catch (error) {
      console.error("Error fetching competitions:", error);
      throw new Error("Failed to load competitions. Please try again.");
    }
  };

  const {
    data: competitions = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["competitions", activeTab],
    queryFn: fetchCompetitions,
    retry: 3,
    retryDelay: (attempt) => Math.min(attempt * 1000, 5000),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  // Auto-retry mechanism for connection issues
  useEffect(() => {
    if (isError && retryCount < 3) {
      // console.log(`Retrying fetch (attempt ${retryCount + 1})...`);
      const timer = setTimeout(() => {
        setRetryCount(retryCount + 1);
        refetch();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isError, retryCount, refetch]);

  // Debug admin status
  // useEffect(() => {
  //   console.log(
  //     "User:",
  //     user?.email,
  //     "Is admin:",
  //     user?.email === "raniem57@gmail.com"
  //   );
  // }, [user]);

  const openApplicationModal = (competition) => {
    if (!user) {
      alert("Please log in to apply for competitions");
      return;
    }
    if (!userData?.subscribed) {
      setIsSubscriptionOpen(true);
      return;
    }
    setSelectedCompetition(competition);
    setIsApplicationOpen(true);
  };

  const openEditModal = (competition) => {
    setSelectedCompetition(competition);
    setIsEditOpen(true);
  };

  const openDeleteModal = (competition) => {
    setSelectedCompetition(competition);
    setIsDeleteOpen(true);
  };

  const closeApplicationModal = () => {
    setIsApplicationOpen(false);
    setSelectedCompetition(null);
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
    setSelectedCompetition(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteOpen(false);
    setSelectedCompetition(null);
  };

  const openSubscriptionModal = () => setIsSubscriptionOpen(true);
  const closeSubscriptionModal = () => setIsSubscriptionOpen(false);

  if (authLoading) {
    return (
      <div className="text-center py-10">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
        <p className="mt-2 text-slate-600">Checking authentication...</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-teal-600"></div>
        <p className="mt-2 text-slate-600">Loading competitions...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-md mx-auto">
          {error.message}
        </div>
        <button
          onClick={() => {
            setRetryCount(0);
            refetch();
          }}
          className="bg-teal-600 text-white font-inter font-semibold py-2 px-4 rounded-lg hover:bg-teal-500 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold font-poppins text-slate-800 mb-6">
        Writing Competitions
      </h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("ongoing")}
          className={`px-4 py-2 font-inter font-semibold rounded-lg transition-colors ${
            activeTab === "ongoing"
              ? "bg-teal-600 text-white"
              : "bg-slate-200 text-slate-600 hover:bg-slate-300"
          }`}
        >
          Ongoing
        </button>
        <button
          onClick={() => setActiveTab("past")}
          className={`px-4 py-2 font-inter font-semibold rounded-lg transition-colors ${
            activeTab === "past"
              ? "bg-teal-600 text-white"
              : "bg-slate-200 text-slate-600 hover:bg-slate-300"
          }`}
        >
          Past
        </button>
      </div>

      {/* Competitions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {competitions.length === 0 ? (
          <div className="col-span-2 text-center py-10">
            <p className="text-slate-600 font-inter mb-4">
              No {activeTab} competitions available.
            </p>
            {user?.email === "raniem57@gmail.com" && (
              <Link
                to="/dashboard/competitions/create"
                className="bg-teal-600 text-white font-inter font-semibold py-2 px-4 rounded-lg hover:bg-teal-500 transition-colors"
              >
                Create Competition
              </Link>
            )}
          </div>
        ) : (
          competitions.map((comp) => (
            <div
              key={comp.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow relative"
            >
              {/* Admin Controls */}
              {user?.email === "raniem57@gmail.com" && (
                <div className="absolute top-4 right-4 flex space-x-2 z-10">
                  <button
                    onClick={() => openEditModal(comp)}
                    className="text-slate-600 hover:text-teal-600 transition-colors"
                    title="Edit Competition"
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => openDeleteModal(comp)}
                    className="text-slate-600 hover:text-red-600 transition-colors"
                    title="Delete Competition"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              )}

              {comp.image && (
                <img
                  src={comp.image}
                  alt={comp.title}
                  className="w-full h-50 object-cover rounded-md mb-4"
                  loading="lazy"
                />
              )}
              <h2 className="text-xl font-semibold font-poppins text-slate-800 mb-2">
                {comp.title}
              </h2>
              <p className="text-sm font-inter text-slate-600 mb-2">
                Posted on: {comp.datePosted.toLocaleDateString()}
              </p>
              <SafeHTML
                html={comp.description}
                className="text-slate-800 font-inter mb-4"
              />

              {comp.status === "ongoing" && (
                <>
                  {/* <h3 className="text-md font-semibold font-inter text-slate-800 mb-2">
                    Entry Requirements
                  </h3>
                  <SafeHTML
                    html={comp.entryRequirements}
                    className="text-slate-600 font-inter mb-4"
                  /> */}
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() => openApplicationModal(comp)}
                      className={`font-inter font-semibold py-2 px-4 rounded-lg transition-colors ${
                        userData?.subscribed
                          ? "bg-teal-600 text-white hover:bg-teal-500"
                          : "bg-slate-400 text-white cursor-not-allowed"
                      }`}
                    >
                      Apply
                    </button>
                    {comp.externalLink && (
                      <a
                        href={comp.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-slate-600 text-white font-inter font-semibold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors"
                      >
                        Learn More
                      </a>
                    )}
                  </div>

                  {!userData?.subscribed && (
                    <p className="text-red-500 font-inter text-sm mt-2">
                      {user ? (
                        <>
                          <button
                            onClick={openSubscriptionModal}
                            className="text-teal-600 hover:underline"
                          >
                            Subscribe
                          </button>{" "}
                          to apply for competitions.
                        </>
                      ) : (
                        <>
                          <Link
                            to="/login"
                            className="text-teal-600 hover:underline"
                          >
                            Log in
                          </Link>{" "}
                          and subscribe to apply.
                        </>
                      )}
                    </p>
                  )}
                </>
              )}

              {comp.status === "past" && comp.winners && (
                <>
                  <h3 className="text-md font-semibold font-inter text-slate-800 mb-2">
                    Top 3 Winners
                  </h3>
                  <div className="space-y-2">
                    {comp.winners.map((winner, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <img
                          src={winner.image || "/default-avatar.png"}
                          alt={winner.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <span className="text-slate-600 font-inter">
                          {winner.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      {selectedCompetition && (
        <CompetitionApplicationModal
          isOpen={isApplicationOpen}
          onClose={closeApplicationModal}
          competitionTitle={selectedCompetition.title}
        />
      )}
      <SubscriptionModal
        isOpen={isSubscriptionOpen}
        onClose={closeSubscriptionModal}
      />
      {selectedCompetition && (
        <EditCompetitionForm
          isOpen={isEditOpen}
          onClose={closeEditModal}
          competition={selectedCompetition}
          refetchCompetitions={refetch}
        />
      )}
      {selectedCompetition && (
        <DeleteCompetitionModal
          isOpen={isDeleteOpen}
          onClose={closeDeleteModal}
          competition={selectedCompetition}
          refetchCompetitions={refetch}
        />
      )}
    </div>
  );
}

export default Competitions;
