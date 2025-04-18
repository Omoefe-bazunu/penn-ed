import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { dbase } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import CreateCourseForm from "../../components/forms/CreateCourseForm";
import CourseDetailsModal from "../../components/CourseDetailsModal";
import SubscriptionModal from "../../components/subscriptionModal";
import SafeHTML from "../Posts/SafeHTML";
import DeleteCourseButton from "../../components/forms/DeleteCourse";
import EditCourseForm from "../../components/forms/EditCourse";

function Courses() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const { user, userData, loading: authLoading } = useAuth();

  const fetchCourses = async () => {
    const querySnapshot = await getDocs(collection(dbase, "courses"));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  const {
    data: courses,
    isLoading,
    error,
    refetch,
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

  const handleEditClick = (course, e) => {
    e.stopPropagation();
    setEditingCourse(course);
  };

  const handleEditSuccess = () => {
    setEditingCourse(null);
    refetch();
  };

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
        {user?.email === "raniem57@gmail.com" && (
          <button
            onClick={openForm}
            className="bg-teal-600 text-white font-inter font-semibold py-2 px-4 rounded-lg hover:bg-teal-500 transition-colors"
          >
            Add New Course
          </button>
        )}
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
              className={`bg-white rounded-lg shadow-md p-6 relative ${
                userData?.subscribed
                  ? "cursor-pointer hover:shadow-lg transition-shadow"
                  : "opacity-75 cursor-not-allowed"
              }`}
              onClick={() => openCourseModal(course)}
            >
              {user?.email === "raniem57@gmail.com" && (
                <div className="absolute top-2 right-2 flex space-x-2 z-10">
                  <button
                    onClick={(e) => handleEditClick(course, e)}
                    className="p-1 rounded-full bg-white shadow-md hover:bg-slate-100"
                    title="Edit"
                  >
                    <svg
                      className="w-5 h-5 text-slate-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <DeleteCourseButton
                    courseId={course.id}
                    onSuccess={refetch}
                    className="p-1 rounded-full bg-white shadow-md hover:bg-slate-100"
                  />
                </div>
              )}
              {course.image && (
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-32 object-cover rounded-md mb-4"
                />
              )}
              <h3 className="text-xl font-semibold font-poppins text-slate-800 mb-2">
                {course.title}
              </h3>
              <SafeHTML
                html={course.description}
                className="text-slate-800 font-inter mb-2"
                maxLength={200}
              />
              <p className="text-sm font-inter text-slate-600">
                Posted on:{" "}
                {course.datePosted?.toDate
                  ? course.datePosted.toDate().toLocaleDateString()
                  : new Date(
                      course.datePosted?.seconds * 1000
                    ).toLocaleDateString()}
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
      {editingCourse && (
        <EditCourseForm
          course={editingCourse}
          isOpen={!!editingCourse}
          onClose={() => setEditingCourse(null)}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}

export default Courses;
