import { SideBar } from "./SideBar";
import { useEffect, useState } from "react";
import { auth } from "../../Firebase";
import { HiPencil } from "react-icons/hi";
import { collection, query, where, getDocs } from "firebase/firestore";
import { dbase } from "../../Firebase";
import SeriesForm from "./Series/SeriesForm";
import SinglePostForm from "./Series/SinglePostForm";
import { Link } from "react-router-dom";
import Single from "./PostControl/Single";
import { Series } from "./Series/seriesList";
import SeriesEpisodes from "./PostControl/SeriesEpisodes";

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
    <div className="DashboardWrapper w-5/6 h-fit flex gap-4">
      <div className="postwrapper w-full h-full flex flex-col justify-start gap-5 relative">
        {user && (
          <div className=" text-white bg-secondary button cursor-pointer text-xs px-4 py-2 rounded w-fit">
            <Link to="/GoPremium">Upgrade to Premium</Link>
          </div>
        )}
        <div className=" w-full bg-tet p-4 rounded-md">
          <div className=" w-full text-white font-medium mt-4 flex justify-center items-center">
            Create
            <span className=" ml-4">
              <HiPencil />
            </span>
          </div>

          <SinglePostForm />
          <SeriesForm />
        </div>
        <div className=" w-full flex justify-center items-center text-white bg-tet py-2">
          Your Posts
        </div>
        <Single userEmail={userEmail} />
        <SeriesEpisodes userEmail={userEmail} />
      </div>
      <SideBar />
    </div>
  );
};
