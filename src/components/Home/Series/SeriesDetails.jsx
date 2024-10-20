import { SideBar } from "../SideBar";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, where, onSnapshot, query } from "firebase/firestore";
import { dbase } from "../../../Firebase";
import { SeriesComments } from "./SeriesComments";

export const SeriesDetails = () => {
  const [episode, setEpisode] = useState(null);
  const { id } = useParams();
  // This fetches the Post
  useEffect(() => {
    const colRef = collection(dbase, "series");
    const g = Number(id);
    console.log(g);
    const q = query(colRef, where("eId", "==", g));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          console.log(`Post with eId ${id} does not exist.`);
          setEpisode(null); // Set job to null if not found
          return; // Early exit if no documents found
        }
        const jobDetails = snapshot.docs[0].data(); // Get data from the first document
        jobDetails.id = snapshot.docs[0].id; // Set the ID
        setEpisode(jobDetails);
      },
      (error) => {
        console.error("Error fetching post:", error);
      }
    );

    // Cleanup function to unsubscribe on unmount
    return () => unsubscribe();
  }, [id]);

  return (
    <div className="BlogDetailsWrapper w-5/6 h-fit flex gap-4">
      {/* This code with 'post' preceding the div, checks if the post state has a value meaning the fetch document function was successful before displaying the elements with the post details */}
      {episode && (
        <div className="postwrapper w-full h-full flex flex-col justify-start items-center gap-5">
          <div className="post w-full h-fit bg-slate-600 rounded-md relative py-5 px-4">
            <div className="post1 felx flex-col justify-start gap-4">
              <h2 className=" text-yellow-300 my-1 font-semibold uppercase">
                {episode.episodeTitle}
              </h2>
              <p className="text-white mb-8 whitespace-pre-wrap">
                {episode.body}
              </p>
            </div>
          </div>
          <SeriesComments postId={episode.eId} />
        </div>
      )}
      <SideBar />
    </div>
  );
};
