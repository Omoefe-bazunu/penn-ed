import { GiTrophyCup } from "react-icons/gi";
import { useState, useEffect } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { dbase } from "../../../Firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

export const ChallengeInfo = () => {
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    whatsappNumber: "",
  });
  const [instructions, setInstructions] = useState("");

  // Fetch instructions from Firebase
  useEffect(() => {
    const fetchInstructions = async () => {
      try {
        const querySnapshot = await getDocs(collection(dbase, "challenge"));
        const challengeData = querySnapshot.docs.map((doc) => doc.data());
        if (challengeData.length > 0) {
          setInstructions(challengeData[0].instructions); // Assumes there's one instruction document
        }
      } catch (error) {
        console.error("Error fetching instructions:", error);
      }
    };

    fetchInstructions();
  }, []);

  // Toggle Instructions visibility
  const toggleInstructions = (e) => {
    e.preventDefault();
    setIsInstructionsOpen((prev) => !prev);
  };

  // Toggle Form visibility
  const toggleForm = () => {
    setIsFormOpen((prev) => !prev);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Submit form data to Firebase
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add document to the 'challenge' collection
      await addDoc(collection(dbase, "challenge"), formData);
      alert("Challenge submitted successfully!");
      // Reset form after submission
      setFormData({ fullName: "", email: "", whatsappNumber: "" });
      setIsFormOpen(false); // Optionally close form after submission
    } catch (error) {
      console.error("Error submitting challenge:", error);
      alert("Failed to submit. Please try again.");
    }
  };

  return (
    <div className="w-full h-fit flex flex-col justify-center border-b items-center text-white">
      <a
        href="#"
        onClick={toggleInstructions}
        className="bg-nurs  gap-4 flex justify-center items-center w-full py-2 px-8 cursor-pointer"
      >
        <GiTrophyCup className="w-6 h-6" />
        <p>New Challenge</p>
        {isInstructionsOpen ? (
          <FaMinus className="ml-2 w-4 h-4" />
        ) : (
          <FaPlus className="ml-2 w-4 h-4" />
        )}
      </a>

      {isInstructionsOpen && (
        <div className="Instructions w-full border-y border-white p-4 bg-tet text-white">
          <p className="font-bold">CHALLENGE INSTRUCTIONS</p>
          <p className="text-sm mt-2 whitespace-pre-wrap">{instructions}</p>

          <button
            onClick={toggleForm}
            className="bg-blue-600 mb-4 py-2 px-4 rounded text-white hover:bg-blue-700"
          >
            JOIN CHALLENGE
          </button>

          {isFormOpen && (
            <form
              onSubmit={handleSubmit}
              className="mt-4 p-4 bg-primary rounded w-full"
            >
              <div className="mb-4 ">
                <label className="block text-sm font-medium mb-2 text-white">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded text-tet bg-white border border-gray-600 focus:outline-none focus:border-tet"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded text-tet bg-white border border-gray-600 focus:outline-none focus:border-tet"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleInputChange}
                  className="w-full p-2 text-tet rounded bg-white border border-gray-600 focus:outline-none focus:border-tet"
                  placeholder="Enter your WhatsApp number"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-nurs py-2 mt-2 rounded text-white "
              >
                Submit
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
