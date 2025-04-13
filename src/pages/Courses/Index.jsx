// src/pages/Courses/Index.jsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { dbase } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import CreateCourseForm from "../../components/forms/CreateCourseForm";
import CourseDetailsModal from "../../components/CourseDetailsModal";
import SubscriptionModal from "../../components/subscriptionModal";

function Courses() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const { user, userData, loading: authLoading } = useAuth();

  const fetchCourses = async () => {
    const querySnapshot = await getDocs(collection(dbase, "courses"));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  const {
    data: courses,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  const openForm = () => {
    if (!user) {
      alert("Please log in to add a course.");
      return;
    }
    setIsFormOpen(true);
  };
  const closeForm = () => setIsFormOpen(false);

  const openCourseModal = (course) => {
    if (!userData?.subscribed) return;
    setSelectedCourse(course);
  };

  const closeCourseModal = () => setSelectedCourse(null);

  const openSubscriptionModal = () => setIsSubscriptionOpen(true);
  const closeSubscriptionModal = () => setIsSubscriptionOpen(false);

  if (isLoading || authLoading)
    return <div className="text-center py-10">Loading...</div>;
  if (error)
    return (
      <div className="text-center py-10 text-red-500">{error.message}</div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-poppins text-slate-800">
          Courses
        </h1>
      </div>
      <CreateCourseForm isOpen={isFormOpen} onClose={closeForm} />
      {!userData?.subscribed && user && (
        <p className="text-red-500 font-inter mb-6 bg-white shadow-md rounded-lg w-fit p-4">
          Please{" "}
          <button
            onClick={openSubscriptionModal}
            className="text-teal-600 hover:underline"
          >
            subscribe
          </button>{" "}
          to access courses.
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses && courses.length > 0 ? (
          courses.map((course) => (
            <div
              key={course.id}
              className={`bg-white rounded-lg shadow-md p-6 ${
                userData?.subscribed
                  ? "cursor-pointer hover:shadow-lg transition-shadow"
                  : "opacity-75 cursor-not-allowed"
              }`}
              onClick={() => openCourseModal(course)}
            >
              {course.image && (
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-32 object-cover rounded-md mb-4"
                />
              )}
              <h2 className="text-xl font-semibold font-poppins text-slate-800 mb-2">
                {course.title}
              </h2>
              <p className="text-sm font-inter text-slate-600 mb-2">
                Posted on: {new Date(course.datePosted).toLocaleDateString()}
              </p>
              <p className="text-slate-600 font-inter line-clamp-3">
                {course.description}
              </p>
            </div>
          ))
        ) : (
          <p className="text-slate-600 font-inter col-span-2">
            No courses available.
          </p>
        )}
      </div>
      <CourseDetailsModal
        course={selectedCourse}
        isOpen={!!selectedCourse}
        onClose={closeCourseModal}
      />
      <SubscriptionModal
        isOpen={isSubscriptionOpen}
        onClose={closeSubscriptionModal}
      />
    </div>
  );
}

export default Courses;
