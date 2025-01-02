import { Form } from "react-router-dom";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { storage, dbase, auth } from "../../../Firebase";

export const CreateChallenge = () => {
  const [user, setUser] = useState("");
  const [formData, setFormData] = useState({
    instructions: "",
    imageFile: null,
  });

  // Check if user is authenticated and admin
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, imageFile: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.instructions || !formData.imageFile) {
      alert("Please provide both instructions and an image.");
      return;
    }

    try {
      // Upload the image to Firebase Storage
      const imageRef = ref(storage, `challenge/${formData.imageFile.name}`);
      await uploadBytes(imageRef, formData.imageFile);
      const imageUrl = await getDownloadURL(imageRef);

      // Add the document to Firestore with image URL
      await addDoc(collection(dbase, "challenge"), {
        instructions: formData.instructions,
        imageUrl: imageUrl,
        createdAt: Timestamp.now(),
      });

      alert("Challenge submitted successfully!");
      setFormData({ instructions: "", imageFile: null }); // Reset form
    } catch (error) {
      console.error("Error submitting challenge:", error);
      alert("Failed to submit. Please try again.");
    }
  };

  if (!user) {
    return <p className=" text-white">Unauthorized Access</p>;
  }

  if (user && user.uid !== "Nj7jptHDgfgFbhL4qcO1Gwg1YfM2") {
    return <p className=" text-white">Access Denied: Not an Admin</p>;
  }

  return (
    <div className="DashboardWrapper w-5/6 h-fit flex gap-4">
      <div className="createPost w-full h-fit p-4 rounded-md">
        <h2 className="text-white mb-4 font-bold mt-3">CREATE A CHALLENGE</h2>
        <Form
          onSubmit={handleSubmit}
          className="postForm flex flex-col justify-start gap-5 w-full"
        >
          <textarea
            placeholder="Challenge Instructions"
            name="instructions"
            value={formData.instructions}
            onChange={handleInputChange}
            className="bg-inherit border-b-2 border-slate-400 outline-none text-white"
            required
          />

          <div className="featuredImg flex bg-inherit mt-3 gap-2">
            <input
              type="file"
              name="imageFile"
              accept="image/*"
              onChange={handleFileChange}
              className="outline-none text-white border-b-2 border-slate-400 w-full"
              required
            />
          </div>

          <button
            type="submit"
            className="Btn bg-secondary text-white text-left text-sm text-nowrap py-2 w-fit pr-5 pl-2 rounded-sm cursor-pointer mt-3 mb-5"
          >
            SUBMIT CHALLENGE
          </button>
        </Form>
      </div>
    </div>
  );
};
