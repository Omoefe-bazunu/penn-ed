import { GiTrophyCup } from "react-icons/gi";
import { HiPaperAirplane } from "react-icons/hi2";
import ImageResizer from "react-image-file-resizer";
import { ref, uploadBytes } from "firebase/storage";
import { storage, dbase } from "../../../Firebase"; // Firebase imports
import { useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore"; // Firestore imports

const ChallengeForm = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    body: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleContent = () => {
    setIsExpanded(!isExpanded);
  };

  const contentStyle = {
    maxHeight: isExpanded ? "unset" : "0",
    overflow: isExpanded ? "visible" : "hidden",
    transition: "max-height 0.3s ease-in-out",
  };

  const handleImgChange = async (e) => {
    if (e.target.files[0]) {
      try {
        const img = e.target.files[0];

        ImageResizer.imageFileResizer(
          img,
          25 * 1024,
          25 * 1024,
          "JPEG",
          100,
          0,
          (uri) => {
            const storageRef = ref(storage, `posts/${img.name}`);
            uploadBytes(storageRef, uri);
            alert("IMAGE UPLOADED");
          },
          "blob"
        );
      } catch (error) {
        console.error("ERROR WITH UPLOAD", error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addDoc(collection(dbase, "challengentry"), {
        ...formData,
        timestamp: Timestamp.now(),
      });
      alert("Challenge post submitted successfully!");
      setFormData({ name: "", title: "", body: "", email: "" });
    } catch (error) {
      console.error("Error submitting post:", error);
      alert("Failed to submit post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="createPost w-full h-fit border-b-2 border-white pb-4 mt-4 ">
      <div className="relative">
        <div className=" flex gap-2">
          <GiTrophyCup className="w-6 h-6 text-white" />
          <h2 className="text-white ">Challenge Submission</h2>
        </div>

        <div className="w-full flex flex-row justify-end items-center absolute top-0 right-2">
          <button className="expand-button" onClick={toggleContent}>
            {!isExpanded ? (
              <p className="text-2xl text-white">+</p>
            ) : (
              <p className="text-3xl text-white">-</p>
            )}
          </button>
        </div>
      </div>

      <div style={contentStyle}>
        <p className="text-xs text-yellow-300 mb-4 mt-2">
          NOTE: We take originality seriously & reserve the right to delete
          plagiarized content. Be CREATIVE
        </p>
        <form
          onSubmit={handleSubmit}
          className="postForm flex flex-col justify-start gap-5 w-full mt-10"
        >
          <input
            placeholder="Your Name as the author e.g Omoefe Bazunu"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="bg-inherit border-b-2 border-slate-400 outline-none text-white"
            required
          />
          <input
            placeholder="Post Title in BLOCK LETTERS"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="bg-inherit border-b-2 border-slate-400 outline-none text-white uppercase"
            required
          />
          <textarea
            placeholder="Write your post here"
            name="body"
            value={formData.body}
            onChange={handleInputChange}
            className="bg-inherit border-b-2 border-slate-400 outline-none text-white"
            required
          />
          <input
            placeholder="Your Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="bg-inherit border-b-2 border-slate-400 outline-none text-white"
            required
          />

          <div className="featuredImg flex bg-inherit mt-3 gap-2">
            <input
              type="file"
              name="imageurl"
              className="outline-none text-white border-b-2 border-slate-400 w-full"
              onChange={handleImgChange}
            />
          </div>
          <div className="w-full h-fit flex justify-center items-center rounded gap-4">
            <a
              href="https://www.paraphraser.io/?aff_id=79ba4ef20681767092610f7cf4f986e8"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-secondary px-4 py-2 text-white rounded button text-xs flex flex-wrap gap-2 justify-center items-center"
            >
              <HiPaperAirplane />
              Plagiarism & Grammar Check
            </a>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="Btn button text-white text-left text-sm text-nowrap py-2 w-fit px-5 rounded-sm cursor-pointer mt-3 mb-5"
          >
            {isSubmitting ? "Publishing..." : "PUBLISH POST"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChallengeForm;
