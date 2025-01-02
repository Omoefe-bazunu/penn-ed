import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { storage } from "../../Firebase";
import { dbase } from "../../Firebase";

const CreateAds = () => {
  const [adsData, setAdsData] = useState({
    link: "",
    link2: "",
    link3: "",
    link4: "",
  });
  const [imageFiles, setImageFiles] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload images to Firebase Storage and get download URLs
      const imageUrls = await Promise.all(
        ["imageurl", "imageurl2", "imageurl3", "imageurl4"].map((key) =>
          imageFiles[key] ? uploadImage(imageFiles[key]) : null
        )
      );

      // Create ads array
      const adsArray = [
        { imageurl: imageUrls[0], link: adsData.link },
        { imageurl: imageUrls[1], link: adsData.link2 },
        { imageurl: imageUrls[2], link: adsData.link3 },
        { imageurl: imageUrls[3], link: adsData.link4 },
      ].filter((ad) => ad.imageurl && ad.link); // Exclude empty entries

      // Add ads data to Firestore
      await addDoc(collection(dbase, "ads"), { ads: adsArray });

      alert("Ads successfully submitted!");
    } catch (error) {
      console.error("Error submitting ads:", error);
      alert("Failed to submit ads.");
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file) => {
    if (!file) return null;
    const storageRef = ref(storage, `ads/${Date.now()}-${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdsData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setImageFiles((prev) => ({ ...prev, [name]: files[0] }));
  };

  return (
    <div className="createPost w-5/6 h-fit p-4 rounded-md">
      <h2 className="text-white mb-4 font-bold mt-3">CREATE ADS</h2>
      <form
        className="postForm flex flex-col justify-start gap-5 w-full"
        onSubmit={handleSubmit}
      >
        {["", "2", "3", "4"].map((num) => (
          <div
            key={num}
            className={`featuredImg${num} flex bg-inherit mt-3 gap-2`}
          >
            <input
              type="file"
              name={`imageurl${num}`}
              className="outline-none text-white border-b-2 border-slate-400 w-full"
              onChange={handleFileChange}
            />
            <input
              type="text"
              name={`link${num}`}
              placeholder="Type or paste the ads link"
              className="bg-inherit border-b-2 border-slate-400 outline-none text-white"
              value={adsData[`link${num}`]}
              onChange={handleInputChange}
            />
          </div>
        ))}
        <button
          type="submit"
          className="Btn button text-white bg-secondary text-left text-sm text-nowrap py-2 w-fit px-4 rounded-sm cursor-pointer mt-3 mb-5"
          disabled={loading}
        >
          {loading ? "SUBMITTING..." : "SUBMIT ADS"}
        </button>
      </form>
    </div>
  );
};

export default CreateAds;
