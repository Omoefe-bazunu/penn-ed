import { Form } from "react-router-dom";
import { SideBar } from "../Home/SideBar";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../Firebase";
import { useEffect, useState } from "react";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { dbase } from "../../Firebase";

export const CreateCourse = () => {
  const [courses, setCourses] = useState(null);

  // This fetches the image for each post
  const fetchImage = async (imageurl) => {
    if (imageurl) {
      const imageRef = ref(storage, `courses/${imageurl}`);
      try {
        const url = await getDownloadURL(imageRef);
        return url;
      } catch (error) {
        console.error("Error fetching image:", error);
        return null;
      }
    }
  };

  // This fetches the posts made by the user logged in
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const q = query(
          collection(dbase, "courses"),
          orderBy("createdAt", "desc")
        );
        onSnapshot(q, async (snapshot) => {
          const fetchedCourses = [];

          for (const doc of snapshot.docs) {
            const courseItem = { ...doc.data(), id: doc.id };
            courseItem.formattedDate = formatDate(
              courseItem.createdAt.toDate()
            );
            courseItem.featuredImageUrl = await fetchImage(courseItem.imageurl);
            fetchedCourses.push(courseItem);
          }

          setCourses(fetchedCourses);
        });
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchCourses();
  }, []);

  // Helper function to format date
  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth();
    const monthName = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ][month];
    const year = date.getFullYear();
    return `${monthName} ${day}, ${year}`;
  };

  const handleImgChange = async (e) => {
    if (e.target.files[0]) {
      try {
        const img = e.target.files[0];
        const storageRef = ref(storage, `courses/${img.name}`);
        await uploadBytes(storageRef, img);
        alert("IMAGE UPLOADED");
      } catch (error) {
        console.error("ERROR WITH UPLOAD", error);
      }
    }
  };

  const handleDeleteJob = async (jId) => {
    const docRef = doc(dbase, "courses", jId);
    await deleteDoc(docRef)
      .then(() => {
        alert("Post deleted successfully!");
        setCourses(courses.filter((courses) => courses.id !== jId)); // Update state with filtered posts
      })
      .catch((error) => {
        alert("Error deleting Post: ", error);
      });
  };

  return (
    <div className="DashboardWrapper w-5/6 h-fit flex gap-4">
      <div className="postwrapper w-full h-full flex flex-col justify-start gap-5">
        {courses &&
          courses.map((course) => (
            <div
              key={course.id}
              className="posts w-full flex flex-col h-fit py-5 px-5 mb-5"
            >
              <h2 className=" text-lg text-yellow-300 text-wrap leading-2 mb-1 font-semibold uppercase">
                {course.title}
              </h2>
              <p className="date text-xs text-white w-fit">
                {course.formattedDate}
              </p>
              {course.featuredImageUrl ? (
                <img
                  src={course.featuredImageUrl}
                  alt=""
                  className=" w-24 h-24 bg-cover bg-center bg-no-repeat mt-3 mb-5 text-white"
                />
              ) : (
                <img />
              )}
              <p className="postBody text-white whitespace-pre-wrap">
                {course.body.slice(0, 200)}...
              </p>
              <p className=" text-yellow-300 text-sm mt-1 mb-4 ">
                Read Full Content....
              </p>
              <p className=" hidden" id={course.id}>
                {course.id}
              </p>
              <button
                className="delete button text-white bg-red-600 w-fit text-xs py-2 px-4 mb-5 rounded-sm"
                onClick={() => handleDeleteJob(course.id)}
              >
                Delete
              </button>
            </div>
          ))}
        <div className="createPost w-full h-fit p-4 rounded-md">
          <h2 className=" text-white mb-4 font-bold mt-3">
            {" "}
            PUBLISH A COURSE{" "}
          </h2>
          <Form
            method="post"
            action="/CreateCourse"
            id="createCourse"
            className="postForm flex flex-col justify-start gap-5 w-full"
          >
            <input
              placeholder="Job Title in BLOCK LETTERS"
              name="title"
              className=" bg-inherit border-b-2 border-slate-400 outline-none text-white uppercase"
            />
            <input
              placeholder="Link to Apply for Job"
              name="link"
              className=" bg-inherit border-b-2 border-slate-400 outline-none text-white"
            />
            <textarea
              placeholder="Job Details"
              name="body"
              className=" bg-inherit border-b-2 border-slate-400 outline-none text-white"
            />
            <div className="featuredImg flex bg-inherit mt-3 gap-2">
              <input
                type="file"
                name="imageurl"
                className=" outline-none text-white border-b-2 border-slate-400 w-full"
                onChange={handleImgChange}
              />
            </div>

            <button className="Btn text-white text-left text-sm text-nowrap py-2 w-fit pr-5 pl-2 rounded-sm cursor-pointer mt-3 mb-5">
              PUBLISH COURSE
            </button>
          </Form>
        </div>
      </div>
      <SideBar />
    </div>
  );
};
