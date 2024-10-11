import { SideBar } from "../Home/SideBar";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, where, onSnapshot } from "firebase/firestore";
import { dbase } from "../../Firebase";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../Firebase";
import { query } from "firebase/firestore";
import { JobComments } from "./JobComments";

export const JobDetails = () => {
  const [job, setJob] = useState(null);
  const { jobPath } = useParams();
  const [ImageSrc, setImageSrc] = useState("");

  //This code fetches the post image from the firebase storage if the post exists or has a value
  const fetchImage = async () => {
    if (job) {
      const imageRef = ref(storage, `jobs/${job.imageurl}`); // The imageurl property of the post object is passed as the path for the post image.
      try {
        const url = await getDownloadURL(imageRef);
        setImageSrc(url);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    }
  };

  // This runs the image fetching function anytime there's a change to the post state.
  useEffect(() => {
    fetchImage();
  }, [job]);

  // This fetches the Post
  useEffect(() => {
    const colRef = collection(dbase, "jobs");
    const g = Number(jobPath);
    const q = query(colRef, where("customId", "==", g));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          console.log(`Post with customId ${jobPath} does not exist.`);
          setJob(null); // Set job to null if not found
          return; // Early exit if no documents found
        }

        const jobDetails = snapshot.docs[0].data(); // Get data from the first document
        jobDetails.id = snapshot.docs[0].id; // Set the ID
        jobDetails.formattedDate = formatDate(jobDetails.createdAt.toDate()); // Add formatted date
        setJob(jobDetails);
      },
      (error) => {
        console.error("Error fetching post:", error);
      }
    );

    // Cleanup function to unsubscribe on unmount
    return () => unsubscribe();
  }, [jobPath]);

  // This code converts the timestamp for the post to a readable date that users can see
  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth();
    const monthName = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ][month];
    const year = date.getFullYear();
    return `${monthName} ${day}, ${year}`;
  };
  return (
    <div className="BlogDetailsWrapper w-5/6 h-fit flex gap-4">
      {/* This code with 'post' preceding the div, checks if the post state has a value meaning the fetch document function was successful before displaying the elements with the post details */}
      {job && (
        <div className="postwrapper w-full h-full flex flex-col justify-start items-center gap-5">
          <div className="post w-full h-fit bg-slate-600 rounded-md relative py-5 px-4">
            <div className="post1 felx flex-col justify-start gap-4">
              <h2 className=" text-yellow-300 my-1 font-semibold uppercase">
                {job.title}
              </h2>
              <img
                src={ImageSrc}
                alt="featured-Image"
                className=" w-50 h-50  mb-8 bg-cover bg-center bg-no-repeat text-white"
              ></img>
              <p className="text-white mb-8 whitespace-pre-wrap">{job.body}</p>
              <p className="text-white mb-8 whitespace-pre-wrap">{job.link}</p>
            </div>
          </div>
          <JobComments jobId={job.id} />
        </div>
      )}
      <SideBar />
    </div>
  );
};
