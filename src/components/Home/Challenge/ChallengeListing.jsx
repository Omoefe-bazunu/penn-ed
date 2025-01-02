import { SideBar } from "../SideBar";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { useEffect, useState } from "react";
import { dbase } from "../../../Firebase";
import { Link } from "react-router-dom";

export const ChallengeListing = () => {
  const [challenges, setChallenges] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      const q = query(
        collection(dbase, "challengentry"),
        orderBy("timestamp", "desc")
      );
      onSnapshot(q, async (snapshot) => {
        const challenges = [];
        for (const doc of snapshot.docs) {
          const challengeItem = { ...doc.data(), id: doc.id };
          challengeItem.formattedDate = formatDate(
            challengeItem.timestamp.toDate()
          ); // Add formatted date

          challenges.push(challengeItem);
        }
        setChallenges(challenges);
        console.log(challenges);
        setIsLoading(false);
      });
    };

    fetchChallenges();
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

  return (
    <div className="BlogsWrapper w-5/6 h-fit flex">
      {isLoading ? (
        <div className="loading-spinner w-32 h-32 pulsate-fwd rounded-full mx-auto p-5 bg-secondary flex justify-center items-center text-white text-sm">
          Loading...
        </div>
      ) : (
        <>
          <div className="post-inner w-full h-fit rounded-md flex justify-start flex-col">
            <div className="header w-full h-fit border-x py-4 px-5  text-white text-xl justify-center items-center flex">
              PARTICIPATING POSTS
            </div>
            {challenges &&
              challenges.map((challenge) => (
                <Link
                  to={`/ChallengesPosts/${challenge.customId}`}
                  key={challenge.id}
                >
                  <div className="posts w-full h-fit py-5 px-5 border">
                    <h2 className=" text-lg text-yellow-300 text-wrap font-semibold leading-2 mb-1 uppercase">
                      {challenge.title}
                    </h2>
                    <p className="postBody text-white whitespace-pre-wrap">
                      {challenge.body.slice(0, 200)}...
                    </p>
                    <p className=" text-yellow-300 text-sm mt-2 mb-4">
                      Read Full Content....
                    </p>
                  </div>
                </Link>
              ))}
          </div>
          <SideBar />
        </>
      )}
    </div>
  );
};
