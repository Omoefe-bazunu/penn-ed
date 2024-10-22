import { Form } from "react-router-dom";
import { HiPaperAirplane } from "react-icons/hi2";
import ImageResizer from "react-image-file-resizer";
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "../../../Firebase";
import { useState } from "react";

const SinglePostForm = () => {
  const [isExpanded, setIsExpanded] = useState(false);

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

        // Use ImageResizer to compress the image to 25kb
        ImageResizer.imageFileResizer(
          img,
          25 * 1024, // 25kb in bytes
          25 * 1024, // 25kb in bytes
          "JPEG", // Use JPEG format for compression
          100, // Quality (adjust as needed)
          0,
          (uri) => {
            // Upload the resized image to Firebase storage
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

  return (
    <div className="createPost w-full h-fit border-b-2 border-white pb-4 mt-4">
      <div className="relative">
        <h2 className=" text-white mb-1 mt-3"> Single Post </h2>
        <div className=" w-full flex flex-row justify-end items-center absolute top-0 right-2">
          <button className="expand-button" onClick={toggleContent}>
            {!isExpanded && <p className=" text-2xl text-white">+</p>}
            {isExpanded && <p className=" text-3xl text-white">-</p>}
          </button>
        </div>
      </div>

      <div style={contentStyle}>
        <p className=" text-xs text-yellow-300 mb-4">
          NOTE: We take originality seriously & reserve the right to delete
          plagiarized content. Be CREATIVE
        </p>
        <Form
          method="post"
          action="/CreateSinglePost"
          id="createPost"
          className="postForm flex flex-col justify-start gap-5 w-full mt-10"
        >
          <input
            placeholder="Your Name as the author e.g Omoefe Bazunu"
            name="name"
            className=" bg-inherit border-b-2 border-slate-400 outline-none text-white"
          />
          <input
            placeholder="Post Title in BLOCK LETTERS"
            name="title"
            className=" bg-inherit border-b-2 border-slate-400 outline-none text-white uppercase"
          />
          <textarea
            placeholder="Write your post here"
            name="body"
            className=" bg-inherit border-b-2 border-slate-400 outline-none text-white"
          />
          <div className="featuredImg flex bg-inherit mt-3 gap-2">
            <input
              type="file"
              name="imageurl"
              className=" outline-none text-white border-b-2 border-slate-400 w-full"
              onChange={handleImgChange}
            />
          </div>
          <div className="w-full h-fit flex justify-center items-center rounded gap-4">
            <a
              href="https://www.paraphraser.io/?aff_id=79ba4ef20681767092610f7cf4f986e8"
              target="_blank"
              className=" bg-secondary px-4 py-2 text-white rounded button text-xs flex flex-wrap gap-2 justify-center items-center"
            >
              <span className="">
                <HiPaperAirplane />
              </span>
              Plagiarism & Grammar Check
            </a>
          </div>

          <button className="Btn button text-white text-left text-sm text-nowrap py-2 w-fit px-5 rounded-sm cursor-pointer mt-3 mb-5">
            PUBLISH POST
          </button>
        </Form>
      </div>
    </div>
  );
};

export default SinglePostForm;
