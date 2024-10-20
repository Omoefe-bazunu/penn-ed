import { SideBar } from "../Home/SideBar";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { useEffect, useState } from "react";
import { dbase } from "../../Firebase";
import { storage } from "../../Firebase";
import { ref, getDownloadURL } from "firebase/storage";

import Course from "./CourseDetails";

export const CourseListing = () => {
  const [courses, setCourses] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    const fetchCourses = async () => {
      const q = query(
        collection(dbase, "courses"),
        orderBy("createdAt", "desc")
      );
      onSnapshot(q, async (snapshot) => {
        const courses = [];
        for (const doc of snapshot.docs) {
          const courseItem = { ...doc.data(), id: doc.id };
          courseItem.formattedDate = formatDate(courseItem.createdAt.toDate()); // Add formatted date
          courseItem.featuredImageUrl = await fetchImage(courseItem.imageurl); // Fetch image URL
          courses.push(courseItem);
        }
        setCourses(courses);
        setIsLoading(false);
      });
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

  return (
    <div className="BlogsWrapper w-5/6 h-fit flex gap-4">
      {isLoading ? (
        <div className="loading-spinner w-32 h-32 pulsate-fwd rounded-full mx-auto p-5 bg-secondary flex justify-center items-center text-white text-sm">
          {" "}
          Loading...
        </div>
      ) : (
        <>
          <div className="post-inner w-full h-fit rounded-md flex justify-start gap-3 flex-col">
            <div className="header w-full h-fit rounded-md py-4 px-5 text-white  text-xl justify-center items-center flex">
              LEARN VALUABLE SKILLS
            </div>
            {courses &&
              courses.map((course) => (
                <Course key={course.id} course={course} />
              ))}
          </div>
          <SideBar />
        </>
      )}
    </div>
  );
};
