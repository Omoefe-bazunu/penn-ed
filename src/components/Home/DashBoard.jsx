import { SideBar } from "./SideBar";
import { useEffect, useState } from "react";
import { auth } from "../../Firebase";
import { HiPencil } from "react-icons/hi";
import { collection, query, where, getDocs } from "firebase/firestore";
import { dbase } from "../../Firebase";
import SeriesForm from "./Series/SeriesForm";
import SinglePostForm from "./Series/SinglePostForm";
import { NavLink } from "react-router-dom";
import Single from "./PostControl/Single";
// import { Series } from "./Series/seriesList";
import SeriesEpisodes from "./PostControl/SeriesEpisodes";
import ChallengeForm from "./Challenge/PostSubmission";

export const DashBoard = () => {
  const [user, setUser] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const q = query(
            collection(dbase, "users"),
            where("userEmail", "==", currentUser.email)
          );
          const querySnapshot = await getDocs(q);
          if (querySnapshot.docs.length > 0) {
            const data = querySnapshot.docs[0].data();
            const { role } = data;
            if (role == "Basic") {
              setUser({ role });
            }
          } else {
            console.log("No such document!");
          }
        } else {
          console.log("No current user logged in");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email);
    }
  }, [userEmail]);

  return (
    <div className="DashboardWrapper w-5/6 h-fit flex">
      <div className="postwrapper w-full h-full flex flex-col justify-start relative">
        {user && (
          <div className=" text-white bg-secondary button cursor-pointer text-xs px-4 py-2 rounded w-fit">
            <NavLink to="/GoPremium">Upgrade to Premium</NavLink>
          </div>
        )}
        <div className=" w-full bg-tet p-4 border-x border-b">
          <div className=" w-full text-white font-medium mt-4 flex justify-center items-center">
            Create
            <span className=" ml-4">
              <HiPencil />
            </span>
          </div>
          <ChallengeForm />
          <SinglePostForm />
          <SeriesForm />
        </div>
        <p className=" w-full flex justify-center items-center text-white bg-tet py-8 border-x">
          Your Posts
        </p>
        <Single userEmail={userEmail} />
        <SeriesEpisodes userEmail={userEmail} />
      </div>
      <SideBar />
    </div>
  );
};
