import { Form } from "react-router-dom";
import { HiPaperAirplane } from "react-icons/hi2";
import { useState } from "react";

const SeriesForm = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleContent = () => {
    setIsExpanded(!isExpanded);
  };

  const contentStyle = {
    maxHeight: isExpanded ? "unset" : "0",
    overflow: isExpanded ? "visible" : "hidden",
    transition: "max-height 0.3s ease-in-out",
  };

  return (
    <div className="createPost w-full h-fit mt-8 mb-4">
      <div className=" relative">
        <h2 className=" text-white mb-1 mt-3">SERIES: Multiple Episodes</h2>
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
          action="/CreateSeries"
          id="createSeries"
          className="postForm flex flex-col justify-start gap-5 w-full mt-10"
        >
          <input
            placeholder="Author e.g Omoefe Bazunu"
            name="name"
            className=" bg-inherit border-b-2 border-slate-400 outline-none text-white text-sm w-full"
          />
          <input
            placeholder="Series Title in BLOCK LETTERS"
            name="series"
            className=" bg-inherit border-b-2 border-slate-400 outline-none text-white uppercase text-sm w-full"
          />
          <input
            placeholder="Episode E.g Episode 1: The OutCast"
            name="episode"
            className=" bg-inherit border-b-2 border-slate-400 outline-none text-white text-sm"
          />
          <textarea
            placeholder="Write your post here"
            name="body"
            className=" bg-inherit h-24 border-b-2 border-slate-400 outline-none text-white text-sm"
          />
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

          <button className="Btn button bg-secondary text-white text-left text-sm text-nowrap py-2 w-fit px-5 rounded-sm cursor-pointer mt-3 mb-5">
            PUBLISH EPISODE
          </button>
        </Form>
      </div>
    </div>
  );
};

export default SeriesForm;
