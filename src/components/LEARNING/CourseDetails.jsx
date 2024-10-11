import { useState } from "react";

const Course = ({ course }) => {
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
    <>
      <div className="posts w-full h-fit py-5 px-5 mb-5">
        <h2 className=" text-lg text-yellow-300 text-wrap font-semibold leading-2 mb-1 uppercase">
          {course.title}
        </h2>
        <p className="text-white text-xs italic opacity-60">
          - Toggle the icons to open and close the content -
        </p>
        <div className=" w-full flex flex-row justify-end items-center">
          <button className="expand-button" onClick={toggleContent}>
            {!isExpanded && <p className=" text-2xl text-white">+</p>}
            {isExpanded && <p className=" text-3xl text-white">-</p>}
          </button>
        </div>

        <div className="post-content" style={contentStyle}>
          {course.featuredImageUrl && (
            <img
              src={course.featuredImageUrl}
              alt=""
              className="w-24 h-24 bg-cover bg-center bg-no-repeat mt-3 mb-5 text-white"
            />
          )}
          <p className="postBody text-white whitespace-pre-wrap">
            {course.body}
          </p>
        </div>
      </div>
    </>
  );
};

export default Course;
