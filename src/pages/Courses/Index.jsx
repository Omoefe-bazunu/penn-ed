import { useState, useEffect } from "react";
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
  const [retryCount, setRetryCount] = useState(0);
  const { user, userData, loading: authLoading } = useAuth();

  const fetchCourses = async () => {
    try {
      const querySnapshot = await getDocs(collection(dbase, "courses"));
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        datePosted: doc.data().datePosted?.toDate() || new Date(),
      }));
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw new Error("Failed to load courses. Please check your connection.");
    }
  };

  const {
    data: courses = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
    retry: 3,
    retryDelay: (attempt) => Math.min(attempt * 1000, 5000),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Auto-retry mechanism for connection issues
  useEffect(() => {
    if (isError && retryCount < 3) {
      const timer = setTimeout(() => {
        setRetryCount(retryCount + 1);
        refetch();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isError, retryCount, refetch]);

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

  const handleCreateSuccess = () => {
    closeForm();
    refetch();
  };

  const handleDeleteSuccess = () => {
    refetch();
  };

  if (authLoading) {
    return (
      <div className="text-center py-10">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
        <p className="mt-2 text-slate-600">Checking authentication...</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
        <p className="mt-2 text-slate-600">Loading courses...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-md mx-auto">
          {error.message}
        </div>
        <button
          onClick={() => {
            setRetryCount(0);
            refetch();
          }}
          className="bg-teal-600 text-white font-inter font-semibold py-2 px-4 rounded-lg hover:bg-teal-500 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

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

      <CreateCourseForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSuccess={handleCreateSuccess}
      />

      {!userData?.subscribed && user && (
        <div className="bg-white shadow-md rounded-lg p-4 mb-6 w-fit">
          <p className="text-red-500 font-inter">
            Please{" "}
            <button
              onClick={openSubscriptionModal}
              className="text-teal-600 hover:underline font-semibold"
            >
              subscribe
            </button>{" "}
            to access course content.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.length > 0 ? (
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
                    onSuccess={handleDeleteSuccess}
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
                Posted on: {course.datePosted.toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center py-10">
            <p className="text-slate-600 font-inter mb-4">
              No courses available.
            </p>
            {user?.email === "raniem57@gmail.com" && (
              <button
                onClick={openForm}
                className="bg-teal-600 text-white font-inter font-semibold py-2 px-4 rounded-lg hover:bg-teal-500 transition-colors"
              >
                Create First Course
              </button>
            )}
          </div>
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
