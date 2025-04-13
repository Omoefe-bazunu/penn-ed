// src/pages/Competitions/Index.jsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { dbase } from "../../Firebase";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import CompetitionApplicationModal from "../../components/CompetitionApplicationModal";
import SubscriptionModal from "../../components/subscriptionModal";

function Competitions() {
  const [activeTab, setActiveTab] = useState("ongoing");
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const { user, userData, loading: authLoading } = useAuth();

  const fetchCompetitions = async () => {
    const querySnapshot = await getDocs(collection(dbase, "competitions"));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  const {
    data: competitions,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["competitions"],
    queryFn: fetchCompetitions,
  });

  const openApplicationModal = (competition) => {
    setSelectedCompetition(competition);
    setIsApplicationOpen(true);
  };

  const closeApplicationModal = () => {
    setIsApplicationOpen(false);
    setSelectedCompetition(null);
  };

  const openSubscriptionModal = () => setIsSubscriptionOpen(true);
  const closeSubscriptionModal = () => setIsSubscriptionOpen(false);

  const filteredCompetitions = competitions
    ? competitions.filter((comp) => comp.status === activeTab)
    : [];

  if (isLoading || authLoading)
    return <div className="text-center py-10">Loading...</div>;
  if (error)
    return (
      <div className="text-center py-10 text-red-500">{error.message}</div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold font-poppins text-slate-800 mb-6">
        Writing Competitions
      </h1>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCompetitions.length === 0 ? (
          <p className="text-slate-600 font-inter col-span-2">
            No {activeTab} competitions available.
          </p>
        ) : (
          filteredCompetitions.map((comp) => (
            <div
              key={comp.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              {comp.image && (
                <img
                  src={comp.image}
                  alt={comp.title}
                  className="w-full h-32 object-cover rounded-md mb-4"
                />
              )}
              <h2 className="text-xl font-semibold font-poppins text-slate-800 mb-2">
                {comp.title}
              </h2>
              <p className="text-sm font-inter text-slate-600 mb-2">
                Posted on: {new Date(comp.datePosted).toLocaleDateString()}
              </p>
              <p className="text-slate-600 font-inter mb-4 line-clamp-3">
                {comp.description}
              </p>
              {comp.status === "ongoing" && (
                <>
                  <h3 className="text-md font-semibold font-inter text-slate-800 mb-2">
                    Entry Requirements
                  </h3>
                  <p className="text-slate-600 font-inter mb-4">
                    {comp.entryRequirements}
                  </p>
                  <div className="flex space-x-4">
                    {user ? (
                      userData?.subscribed ? (
                        <button
                          onClick={() => openApplicationModal(comp)}
                          className="bg-teal-600 text-white font-inter font-semibold py-2 px-4 rounded-lg hover:bg-teal-500 transition-colors"
                        >
                          Apply
                        </button>
                      ) : (
                        <div>
                          <button
                            disabled
                            className="bg-slate-400 text-white font-inter font-semibold py-2 px-4 rounded-lg cursor-not-allowed"
                          >
                            Apply
                          </button>
                          <p className="text-red-500 font-inter text-sm mt-2">
                            <button
                              onClick={openSubscriptionModal}
                              className="text-teal-600 hover:underline"
                            >
                              Subscribe
                            </button>{" "}
                            to apply for competitions.
                          </p>
                        </div>
                      )
                    ) : (
                      <div>
                        <button
                          disabled
                          className="bg-slate-400 text-white font-inter font-semibold py-2 px-4 rounded-lg cursor-not-allowed"
                        >
                          Apply
                        </button>
                        <p className="text-red-500 font-inter text-sm mt-2">
                          <Link
                            to="/login"
                            className="text-teal-600 hover:underline"
                          >
                            Log in
                          </Link>{" "}
                          and subscribe to apply.
                        </p>
                      </div>
                    )}
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
                          src={winner.image}
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
    </div>
  );
}

export default Competitions;
