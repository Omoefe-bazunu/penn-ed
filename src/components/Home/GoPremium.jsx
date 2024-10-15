import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useState, useEffect } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { storage } from "../../Firebase";
import { dbase, auth } from "../../Firebase";

const GoPremium = () => {
  const [imageurl, setImageurl] = useState("");
  const [user, setUser] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!user) {
        console.error("User email is not defined.");
        return; // Handle missing email
      }

      // ... (rest of the upload logic)

      const userCred = user.auth;
      const userSpec = userCred.currentUser;
      console.log(userSpec.email);

      const docRef = await addDoc(collection(dbase, "premium"), {
        imageurl: imageurl, // Use the state variable here
        email: userSpec.email,
        createdAt: serverTimestamp(),
      });
      console.log("Document written with ID:", docRef.id);
      //   Handle success message or redirect
    } catch (error) {
      console.error("Error submitting data:", error);
      // Handle error message
    }
  };

  const handleImgChange = async (e) => {
    if (e.target.files[0]) {
      try {
        const img = e.target.files[0];
        const storageRef = ref(storage, `premium/${img.name}`);
        await uploadBytes(storageRef, img);
        const imageUrls = await getDownloadURL(storageRef); // Get the public URL
        setImageurl(imageUrls); // Update state with the URL
        alert("IMAGE UPLOADED");
      } catch (error) {
        console.error("ERROR WITH UPLOAD", error);
      }
    }
  };

  return (
    <div className=" createPost w-5/6 h-fit p-4 rounded-md flex flex-col text-white">
      <h2 className=" text-white mb-4 font-bold mt-3">GO PREMIUM</h2>
      <p>
        Benefits: <br /> - Earnings from all posts you create <br /> - Get
        Personal Portfolio in case of job applications <br />
      </p>
      <form
        id="createAds"
        className="postForm flex flex-col justify-start gap-5 w-full"
        onSubmit={handleSubmit}
      >
        <div className="featuredImg flex bg-inherit mt-8 gap-2 flex-col">
          <p className=" italic text-sm">
            Make a transfer to the account details below, upload the screenshot
            and click the SUBMIT button
          </p>
          <p className=" mt-4">
            3098523897 <br />
            OMOEFE BAZUNU <br /> FIRST BANK
          </p>
          <input
            type="file"
            name="imageurl"
            className="outline-none text-white border-b-2 border-slate-400 w-full mt-2"
            onChange={handleImgChange}
          />
        </div>
        <p className=" text-xs italic">
          Upgrade takes less than 30 mins after verification from the Admin.
        </p>
        <button className="Btn button bg-secondary text-white text-left text-sm text-nowrap py-2 w-fit pr-5 pl-2 rounded-sm cursor-pointer mt-3 mb-5">
          SUBMIT ADS
        </button>
      </form>
    </div>
  );
};

export default GoPremium;
