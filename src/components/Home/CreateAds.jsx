import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { storage } from "../../Firebase";
import { dbase } from "../../Firebase";
import { Form } from "react-router-dom";

const CreateAds = () => {
  const [adsData, setAdsData] = useState({
    imageurl: "",
    link: "",
    imageurl2: "",
    link2: "",
    imageurl3: "",
    link3: "",
    imageurl4: "",
    link4: "",
  });
  const [imageFiles, setImageFiles] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create adsArray
      const adsArray = [
        { imageurl: imageFiles.imageurl, link: adsData.link },
        { imageurl: imageFiles.imageurl2, link: adsData.link2 },
        { imageurl: imageFiles.imageurl3, link: adsData.link3 },
        { imageurl: imageFiles.imageurl4, link: adsData.link4 },
      ];

      // Upload images to Firebase Storage and get download URLs
      const imageUrls = await Promise.all([
        uploadImage(imageFiles.imageurl),
        uploadImage(imageFiles.imageurl2),
        uploadImage(imageFiles.imageurl3),
        uploadImage(imageFiles.imageurl4),
      ]);

      // Add the ads data with image URLs to the Firestore collection
      const docRef = await addDoc(collection(dbase, "ads"), {
        ads: adsArray.map((ad, index) => ({
          ...ad,
          imageurl: imageUrls[index],
        })),
      });

      // Handle response
    } catch (error) {
      console.error("Error submitting ads:", error);
    }
  };

  const uploadImage = async (file) => {
    if (!file) {
      return null;
    }
    const storageRef = ref(storage, `ads/${new Date().getTime()}-${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  return (
    <div className=" createPost w-5/6 h-fit p-4 rounded-md">
      <h2 className=" text-white mb-4 font-bold mt-3">CREATE ADS</h2>
      <Form
        method="post"
        action="/CreateAds"
        id="createAds"
        className="postForm flex flex-col justify-start gap-5 w-full"
        onSubmit={handleSubmit}
      >
        <div className="featuredImg flex bg-inherit mt-3 gap-2">
          <input
            type="file"
            name="imageurl"
            className="outline-none text-white border-b-2 border-slate-400 w-full"
            onChange={(e) =>
              setImageFiles({ ...imageFiles, imageurl: e.target.files[0] })
            }
          />
          <input
            placeholder="Type or paste the ads link"
            name="link"
            className="bg-inherit border-b-2 border-slate-400 outline-none text-white"
            value={adsData.link}
            onChange={(e) => setAdsData({ ...adsData, link: e.target.value })}
          />
        </div>
        <div className="featuredImg2 flex bg-inherit mt-3 gap-2">
          <input
            type="file"
            name="imageurl2"
            className="outline-none text-white border-b-2 border-slate-400 w-full"
            onChange={(e) =>
              setImageFiles({ ...imageFiles, imageurl2: e.target.files[0] })
            }
          />
          <input
            placeholder="Type or paste the ads link"
            name="link2"
            className="bg-inherit border-b-2 border-slate-400 outline-none text-white"
            value={adsData.link2}
            onChange={(e) => setAdsData({ ...adsData, link2: e.target.value })}
          />
        </div>
        <div className="featuredImg3 flex bg-inherit mt-3 gap-2">
          <input
            type="file"
            name="imageurl3"
            className="outline-none text-white border-b-2 border-slate-400 w-full"
            onChange={(e) =>
              setImageFiles({ ...imageFiles, imageurl3: e.target.files[0] })
            }
          />
          <input
            placeholder="Type or paste the ads link"
            name="link3"
            className="bg-inherit border-b-2 border-slate-400 outline-none text-white"
            value={adsData.link3}
            onChange={(e) => setAdsData({ ...adsData, link3: e.target.value })}
          />
        </div>
        <div className="featuredImg4 flex bg-inherit mt-3 gap-2">
          <input
            type="file"
            name="imageurl4"
            className="outline-none text-white border-b-2 border-slate-400 w-full"
            onChange={(e) =>
              setImageFiles({ ...imageFiles, imageurl4: e.target.files[0] })
            }
          />
          <input
            placeholder="Type or paste the ads link"
            name="link4"
            className="bg-inherit border-b-2 border-slate-400 outline-none text-white"
            value={adsData.link4}
            onChange={(e) => setAdsData({ ...adsData, link4: e.target.value })}
          />
        </div>

        <button className="Btn button text-white bg-secondary text-left text-sm text-nowrap py-2 w-fit px-4 rounded-sm cursor-pointer mt-3 mb-5">
          SUBMIT ADS
        </button>
      </Form>
    </div>
  );
};

export default CreateAds;

// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import React, { useState, useEffect } from "react";
// import {
//   collection,
//   addDoc,
//   doc,
//   getFirestore,
//   updateDoc,
// } from "firebase/firestore";
// import { storage } from "../../Firebase";
// import { dbase } from "../../Firebase";
// import { Form } from "react-router-dom";

// const CreateAds = () => {
//   const [adsData, setAdsData] = useState({
//     imageurl: "",
//     link: "",
//     position: 1,
//     imageurl2: "",
//     link2: "",
//     position2: 2,
//     imageurl3: "",
//     link3: "",
//     position3: 3,
//   });
//   const [imageFiles, setImageFiles] = useState({});
//   const [db, setDb] = useState(null); // State to hold Firestore instance

//   useEffect(() => {
//     setDb(getFirestore()); // Get Firestore instance on component mount
//   }, []);

//   const createAdsObject= () => {
//     return  {
//         imageurl: imageFiles.imageurl,
//         link: adsData.link,
//         position: adsData.position,
//         imageurl2: imageFiles.imageurl2,
//         link2: adsData.link2,
//         position2: adsData.position2,
//         imageurl3: imageFiles.imageurl3,
//         link3: adsData.link3,
//         position3: adsData.position3,
//       },

//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // Create adsArray
//       const adsArray = createAdsObject();

//       // Upload images to Firebase Storage and get download URLs
//       const imageUrls = await Promise.all([
//         uploadImage(imageFiles.imageurl),
//         uploadImage(imageFiles.imageurl2),
//         uploadImage(imageFiles.imageurl3),
//       ]);

//       // Add the ads data with image URLs to the Firestore collection
//       const docRef = await addDoc(collection(db, "ads"), {
//         ads: adsArray.map((ad, index) => ({
//           ...ad,
//           imageurl: imageUrls[index],
//         })),
//       });

//       // Handle response
//       console.log("Ads submitted successfully:", docRef.id);

//       // Optionally, you can use the docRef.id for further operations
//       // ...
//     } catch (error) {
//       console.error("Error submitting ads:", error);
//       // Add more specific error handling here
//       if (error.code === "storage/unauthorized") {
//         console.error("User does not have permission to upload images.");
//       } else if (error.code === "firestore/permission-denied") {
//         console.error(
//           "User does not have permission to write to the Firestore collection."
//         );
//       } else {
//         console.error("Unknown error:", error);
//       }
//     }
//   };

//   const handleUpdateAd = async (adIndex, e) => {
//     e.preventDefault();
//     const { imageurl } = imageFiles; // Assuming only one image update per ad
//     const selectedImageUrl = imageurl ? await uploadImage(imageurl) : null;
//     const adsArray = createAdsArray();

//     try {
//       // Find the ad object based on position (adIndex + 1)
//       const adToUpdate = adsArray.find((ad) => ad.position === adIndex + 1);

//       if (!adToUpdate) {
//         console.error("Ad with position", adIndex + 1, "not found!");
//         return; // Handle error if ad not found
//       }

//       const updatedAdData = {
//         ...adsData,
//         // Update specific ad properties based on the found object
//         [`imageurl${adToUpdate.position}`]:
//           selectedImageUrl || adsData[`imageurl${adToUpdate.position}`],
//       };

//       const adRef = doc(db, "ads", adToUpdate.id); // Assuming you have the document ID

//       await updateDoc(adRef, updatedAdData);

//       console.log("Ad updated successfully!");
//       setImageFiles({});
//     } catch (error) {
//       console.error("Error updating ad:", error);
//     }
//   };

//   return (
//     <div className=" createPost w-5/6 h-fit p-4 rounded-md">
//       <h2 className=" text-white mb-4 font-bold mt-3">CREATE ADS</h2>
//       <Form
//         method="post"
//         action="/CreateAds"
//         id="createAds"
//         className="postForm flex flex-col justify-start gap-5 w-full"
//         onSubmit={handleSubmit}
//       >
//         <div className="featuredImg flex bg-inherit mt-3 gap-2 w-[80%]">
//           <input
//             type="file"
//             name="imageurl"
//             className="outline-none text-white border-b-2 border-slate-400 w-full"
//             onChange={(e) =>
//               setImageFiles({ ...imageFiles, imageurl: e.target.files[0] })
//             }
//           />
//           <input
//             placeholder="Type or paste the ads link"
//             name="link"
//             className="bg-inherit border-b-2 border-slate-400 outline-none text-white w-full"
//             value={adsData.link}
//             onChange={(e) => setAdsData({ ...adsData, link: e.target.value })}
//           />
//           <button
//             className="Btn text-white text-left bg-secondary text-sm text-nowrap py-2 w-fit px-4 rounded-sm cursor-pointer"
//             onClick={(e) => handleUpdateAd(0, e)}
//           >
//             UPDATE AD 1
//           </button>
//         </div>
//         <div className="featuredImg2 flex bg-inherit mt-3 gap-2 w-[80%]">
//           <input
//             type="file"
//             name="imageurl2"
//             className="outline-none text-white border-b-2 border-slate-400 w-full"
//             onChange={(e) =>
//               setImageFiles({ ...imageFiles, imageurl2: e.target.files[0] })
//             }
//           />
//           <input
//             placeholder="Type or paste the ads link"
//             name="link2"
//             className="bg-inherit border-b-2 border-slate-400 outline-none text-white w-full"
//             value={adsData.link2}
//             onChange={(e) => setAdsData({ ...adsData, link2: e.target.value })}
//           />
//           <button
//             className="Btn text-white text-left bg-secondary text-sm text-nowrap py-2 w-fit px-4 rounded-sm cursor-pointer"
//             onClick={(e) => handleUpdateAd(1, e)}
//           >
//             UPDATE AD 2
//           </button>
//         </div>
//         <div className="featuredImg3 flex bg-inherit mt-3 gap-2 w-[80%]">
//           <input
//             type="file"
//             name="imageurl3"
//             className="outline-none text-white border-b-2 border-slate-400 w-full"
//             onChange={(e) =>
//               setImageFiles({ ...imageFiles, imageurl3: e.target.files[0] })
//             }
//           />
//           <input
//             placeholder="Type or paste the ads link"
//             name="link3"
//             className="bg-inherit border-b-2 border-slate-400 outline-none text-white w-full"
//             value={adsData.link3}
//             onChange={(e) => setAdsData({ ...adsData, link3: e.target.value })}
//           />
//           <button
//             className="Btn text-white text-left bg-secondary text-sm text-nowrap py-2 w-fit px-4 rounded-sm cursor-pointer"
//             onClick={(e) => handleUpdateAd(2, e)}
//           >
//             UPDATE AD 3
//           </button>
//         </div>
//         <button className="Btn text-white text-left text-sm bg-secondary text-nowrap py-2 w-fit px-8 rounded-sm cursor-pointer mt-3 mb-5">
//           SUBMIT ALL ADS
//         </button>
//       </Form>
//     </div>
//   );
// };

// export default CreateAds;
