import { storage } from "../../Firebase";
import { ref, getDownloadURL } from "firebase/storage";
import { useState, useEffect } from "react";

export const About = () => {
  const [backgroundImage, setBackgroundImage] = useState("");
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      const imageRef = ref(storage, "General/abt.jpg");
      try {
        const url = await getDownloadURL(imageRef);

        // Lazy load image by creating a new Image object
        const img = new Image();
        img.src = url;
        img.onload = () => {
          setBackgroundImage(url);
          setIsImageLoaded(true);
        };
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    fetchImage();
  }, []);

  return (
    <div className="AboutWrapper w-5/6 h-fit flex justify-start items-center my-8 gap-8">
      <div
        className="featuredImage bg-cover bg-center bg-no-repeat h-[500px] bg-slate-500 rounded-md w-full border-r-2 border-white"
        style={{
          backgroundImage: isImageLoaded ? `url(${backgroundImage})` : "none",
        }}
      >
        {!isImageLoaded && (
          <div className="image-placeholder w-full bg-tet h-full flex items-center justify-center text-white">
            Loading Image...
          </div>
        )}
      </div>
      <div className="AboutDetails text-white flex flex-col justify-start gap-3 w-full">
        <p>
          PENNED is a unique blog that allows creatives around the world to pen
          their thoughts and share their stories to a global audience and earn
          from it. Regardless of your age, field or region, PENNED is accessible
          to you to be at your best.
        </p>
        <p>
          PENNED was developed by HIGH-ER ENTERPRISES. A Nigerian based company
          founded and managed by Omoefe Bazunu, a Software Engineer and Data
          Analyst with specialty in REACTJS, TAILWIND CSS, JAVASCRIPT,
          TYPESCRIPT, EXCEL AND GOOGLE FIREBASE.
        </p>
        <p>
          You are free to sign up as a BASIC user to post, read, comment and
          upvote posts on the blog, as well as get access to the jobs page for
          remote, onsite and hybrid job offers, specifically those that relate
          to writing. But you have to upgrade to a PREMIUM user with a monthly
          subscription to be able to publish a post that can become eligible for
          earning from our Ads revenue program based on pre-set criteria. As a
          PREMIUM user, you also get a personalized professional portfolio which
          you can share with employers when applying.
        </p>
      </div>
    </div>
  );
};
