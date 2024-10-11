import { redirect } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { dbase } from "../../Firebase";

export const jobCreation = async ({ request }) => {
  const data = await request.formData();
  const jobDetails = {
    title: data.get("title"),
    body: data.get("body"),
    link: data.get("link"),
    imageurl: data.get("imageurl"),
  };
  const form = document.getElementById("createJob");
  form.reset();

  try {
    const colRef = collection(dbase, "jobs");
    const randomJobId = Math.floor(Math.random() * 1000000);
    await addDoc(colRef, {
      customId: randomJobId,
      postedBy: "Admin",
      title: jobDetails.title,
      body: jobDetails.body,
      link: jobDetails.link,
      imageurl: jobDetails.imageurl,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    alert(error.message);
  }

  return redirect("/CreateJobs");
};
