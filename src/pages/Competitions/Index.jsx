// src/pages/Competitions/Index.jsx
import { useState } from "react";
import CompetitionApplicationModal from "../../components/CompetitionApplicationModal";

// Dummy competition data
const dummyCompetitions = [
  {
    id: "1",
    title: "Short Story Challenge 2025",
    datePosted: "April 12, 2025",
    description:
      "Write a captivating short story under 2,000 words. Open to all genres, judged on creativity and impact.",
    image: "https://via.placeholder.com/400x200?text=Short+Story",
    status: "ongoing",
    entryRequirements:
      "Submit a story of 1,000-2,000 words. PDF format, unpublished work only. Entry fee: $10.",
    externalLink: "https://example.com/competitions/short-story",
  },
  {
    id: "2",
    title: "Poetry Slam Spring",
    datePosted: "April 10, 2025",
    description:
      "Compose a poem on the theme 'Hope.' Perform or submit written work for a chance to shine.",
    image: "https://via.placeholder.com/400x200?text=Poetry+Slam",
    status: "ongoing",
    entryRequirements:
      "One poem, max 3 minutes if performed, or 500 words if written. Free entry.",
  },
  {
    id: "3",
    title: "Essay Writing Contest",
    datePosted: "April 8, 2025",
    description:
      "Craft a thought-provoking essay on 'The Future of Storytelling.' Top entries published.",
    image: "https://via.placeholder.com/400x200?text=Essay+Contest",
    status: "ongoing",
    entryRequirements:
      "Essay of 1,500-3,000 words. Open to all, no fee. Submit by May 15, 2025.",
    externalLink: "https://example.com/competitions/essay",
  },
  {
    id: "4",
    title: "Flash Fiction Fest 2024",
    datePosted: "October 15, 2024",
    description:
      "Write a complete story in 500 words or less. Past winners amazed us with their brevity.",
    image: "https://via.placeholder.com/400x200?text=Flash+Fiction",
    status: "past",
    winners: [
      {
        name: "Jane Doe",
        image: "https://via.placeholder.com/80?text=Jane",
      },
      {
        name: "John Smith",
        image: "https://via.placeholder.com/80?text=John",
      },
      {
        name: "Emma Brown",
        image: "https://via.placeholder.com/80?text=Emma",
      },
    ],
  },
  {
    id: "5",
    title: "Novel Opening Competition 2024",
    datePosted: "September 1, 2024",
    description:
      "Submit the first 5,000 words of your novel. Our judges loved the diversity of entries.",
    image: "https://via.placeholder.com/400x200?text=Novel+Opening",
    status: "past",
    winners: [
      {
        name: "Alex Carter",
        image: "https://via.placeholder.com/80?text=Alex",
      },
      {
        name: "Sarah Lee",
        image: "https://via.placeholder.com/80?text=Sarah",
      },
      {
        name: "Michael Chen",
        image: "https://via.placeholder.com/80?text=Michael",
      },
    ],
  },
];

function Competitions() {
  const [activeTab, setActiveTab] = useState("ongoing");
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState(null);

  const openApplicationModal = (competition) => {
    setSelectedCompetition(competition);
    setIsApplicationOpen(true);
  };

  const closeApplicationModal = () => {
    setIsApplicationOpen(false);
    setSelectedCompetition(null);
  };

  const filteredCompetitions = dummyCompetitions.filter(
    (comp) => comp.status === activeTab
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <h1 className="text-3xl font-bold font-poppins text-slate-800 mb-6">
        Writing Competitions
      </h1>

      {/* Toggle Tabs */}
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

      {/* Competition List */}
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
                Posted on: {comp.datePosted}
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
                    <button
                      onClick={() => openApplicationModal(comp)}
                      className="bg-teal-600 text-white font-inter font-semibold py-2 px-4 rounded-lg hover:bg-teal-500 transition-colors"
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

      {/* Application Modal */}
      {selectedCompetition && (
        <CompetitionApplicationModal
          isOpen={isApplicationOpen}
          onClose={closeApplicationModal}
          competitionTitle={selectedCompetition.title}
        />
      )}
    </div>
  );
}

export default Competitions;
