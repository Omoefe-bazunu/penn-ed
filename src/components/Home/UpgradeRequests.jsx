import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { useEffect, useState } from "react";
import { dbase, auth } from "../../Firebase";
import { storage } from "../../Firebase";
import { ref, getDownloadURL } from "firebase/storage";

export const PremiumRequests = () => {
  const [jobs, setJobs] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  //   const fetchImage = async (imageurl) => {
  //     if (imageurl) {
  //       const imageRef = ref(storage, `premium/${imageurl}`);
  //       try {
  //         const url = await getDownloadURL(imageRef);
  //         return url;
  //       } catch (error) {
  //         console.error("Error fetching image:", error);
  //         return null;
  //       }
  //     }
  //   };

  useEffect(() => {
    const fetchJobs = async () => {
      const q = query(collection(dbase, "premium"), orderBy("createdAt"));
      onSnapshot(q, async (snapshot) => {
        const jobs = [];
        for (const doc of snapshot.docs) {
          const jobItem = { ...doc.data(), id: doc.id };
          jobItem.formattedDate = formatDate(jobItem.createdAt.toDate()); // Add formatted date
          //   console.log(`jobItemImageurl ${jobItem.imageurl}`);
          //   jobItem.featuredImageUrl = await fetchImage(jobItem.imageurl); // Fetch image URL
          jobs.push(jobItem);
        }
        setJobs(jobs);
        setIsLoading(false);
      });
    };

    fetchJobs();
  }, []);

  // Helper function to format date
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

  if (!user) {
    return (
      <>
        <p className="text-white">No Authorization</p>
      </>
    );
  }

  return (
    <div className="BlogsWrapper w-5/6 h-fit flex gap-4">
      {isLoading ? (
        <div className="loading-spinner w-full flex justify-center items-center text-white text-xl">
          {" "}
          Loading...
        </div>
      ) : (
        <>
          <div className="post-inner w-full h-fit rounded-md flex justify-start gap-3 flex-col">
            <div className="header w-full h-fit rounded-md py-4 px-5 text-white text-xl justify-center items-center flex">
              UNANSWERED REQUESTS
            </div>
            {jobs &&
              jobs.map((job) => (
                <div key={job.id}>
                  <div className="posts w-full h-fit py-5 px-5 mb-5">
                    <h2 className=" text-yellow-300 text-wrap  leading-2 mb-1">
                      {job.email}
                    </h2>
                    {/* {job.featuredImageUrl ? (
                      <img
                        src={job.featuredImageUrl}
                        alt=""
                        className=" w-24 h-24 bg-cover bg-center bg-no-repeat mt-3 mb-5 text-white"
                      />
                    ) : (
                      <img />
                    )} */}
                  </div>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
};
