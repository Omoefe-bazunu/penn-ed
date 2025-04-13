// src/pages/Courses/Index.jsx
import { useState } from "react";
import CreateCourseForm from "../../components/forms/CreateCourseForm";
import CourseDetailsModal from "../../components/CourseDetailsModal";

// Dummy course data
const dummyCourses = [
  {
    id: "1",
    title: "Creative Writing Masterclass",
    datePosted: "April 11, 2025",
    description:
      "Unlock your storytelling potential with our comprehensive creative writing course. Learn narrative techniques, character development, and more.",
    image: "https://via.placeholder.com/400x200?text=Creative+Writing",
    externalLink: "https://example.com/enroll/creative-writing",
  },
  {
    id: "2",
    title: "Poetry Workshop",
    datePosted: "April 9, 2025",
    description:
      "Explore the art of poetry through guided exercises and feedback. Perfect for beginners and seasoned poets alike.",
    image: "https://via.placeholder.com/400x200?text=Poetry+Workshop",
  },
  {
    id: "3",
    title: "Screenwriting Fundamentals",
    datePosted: "April 7, 2025",
    description:
      "Learn the essentials of screenwriting, from structure to dialogue. Create compelling scripts for film and TV.",
    image: "https://via.placeholder.com/400x200?text=Screenwriting",
    externalLink: "https://example.com/enroll/screenwriting",
  },
  {
    id: "4",
    title: "Blogging for Beginners",
    datePosted: "April 5, 2025",
    description:
      "Start your blogging journey with tips on content creation, SEO, and audience engagement. No prior experience needed.",
  },
  {
    id: "5",
    title: "Editing and Proofreading",
    datePosted: "April 3, 2025",
    description:
      "Master the skills to polish any manuscript. Learn editing techniques and proofreading strategies for professional results.",
    image: "https://via.placeholder.com/400x200?text=Editing",
    externalLink: "https://example.com/enroll/editing",
  },
];

function Courses() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);

  const openCourseModal = (course) => setSelectedCourse(course);
  const closeCourseModal = () => setSelectedCourse(null);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-poppins text-slate-800">
          Writing Courses
        </h1>
        <button
          onClick={openForm}
          className="bg-teal-600 text-white font-inter font-semibold py-2 px-4 rounded-lg hover:bg-teal-500 transition-colors"
        >
          Add New Course
        </button>
      </div>

      {/* Create Course Form Modal */}
      <CreateCourseForm isOpen={isFormOpen} onClose={closeForm} />

      {/* Course List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dummyCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
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
              Posted on: {course.datePosted}
            </p>
            <p className="text-slate-600 font-inter line-clamp-3">
              {course.description}
            </p>
          </div>
        ))}
      </div>

      {/* Course Details Modal */}
      <CourseDetailsModal
        course={selectedCourse}
        isOpen={!!selectedCourse}
        onClose={closeCourseModal}
      />
    </div>
  );
}

export default Courses;
