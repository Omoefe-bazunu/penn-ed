import { redirect } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { dbase } from "../../Firebase";

export const CourseCreation = async ({ request }) => {
  const data = await request.formData();
  const courseDetails = {
    title: data.get("title"),
    body: data.get("body"),
    link: data.get("link"),
    imageurl: data.get("imageurl"),
  };
  const form = document.getElementById("createCourse");
  form.reset();

  try {
    const colRef = collection(dbase, "courses");
    await addDoc(colRef, {
      postedBy: "Admin",
      title: courseDetails.title,
      body: courseDetails.body,
      link: courseDetails.link,
      imageurl: courseDetails.imageurl,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    alert(error.message);
  }

  return redirect("/CreateCourses");
};
