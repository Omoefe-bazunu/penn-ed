import { storage } from "../../Firebase";
import { ref, getDownloadURL } from "firebase/storage";
import { useState, useEffect } from "react";

export const About = () => {
  const [backgroundImage, setBackgroundImage] = useState("");

  useEffect(() => {
    const fetchImage = async () => {
      const imageRef = ref(storage, "General/abt.jpg");
      try {
        const url = await getDownloadURL(imageRef);
        setBackgroundImage(url);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    fetchImage();
  }, []);

  return (
    <div className="AboutWrapper w-5/6 h-fit flex justify-start items-center gap-8">
      <div
        className="featuredImage bg-cover bg-center bg-no-repeat h-[500px] bg-slate-500 rounded-md w-full border-r-2 border-white"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>
      <div className="AboutDetails text-white flex flex-col justify-start gap-3 border-l-2 border-white pl-8 w-full">
        <p className="">
          PENNED is a unique blog that allows creatives around the world to pen
          their thoughts and share their stories to a global audience and earn
          from it. Regardless of your age, field or region, PENNED is accessible
          to you to be at your best.
        </p>
        <p className="">
          PENNED was developed by HIGH-ER ENTERPRISES. A Nigerian based company
          founded and managed by Omoefe Bazunu, a Software Engineer and Data
          Analyst with specialty in REACTJS, TAILWIND CSS, JAVASCRIPT,
          TYPESCRIPT, EXCEL AND GOOGLE FIREBASE.
        </p>
        <p className="">
          You are free to sign up as a BASIC user to post, read, comment and
          upvote posts on the blog, but you have to upgrade to a PREMIUM user
          with a monthly subscription to be able to publish a post that can
          become eligible for earning based on pre-set criteria and to also to
          get access to the jobs page for remote, onsite and hybrid job offers,
          specifically those that relates to writing.
        </p>
      </div>
    </div>
  );
};
