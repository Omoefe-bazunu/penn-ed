import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import { Blogs } from "./components/Home/Blogs";
import { RootLayout } from "./components/RootLayout";
import { About } from "./components/Home/About";
import { LogIn } from "./components/auth/SignIn";
import { PwdReset } from "./components/auth/PwdRT1";
import { SignUp } from "./components/auth/SignUp";
import { Contact } from "./components/Home/Contact";
import { BlogDetails } from "./components/Home/BlogDetails";
import { DashBoard } from "./components/Home/DashBoard";
import { contactForm } from "./components/formHandlers/Contact";
import { LoginForm } from "./components/formHandlers/SignIn";
import { SignupForm } from "./components/formHandlers/Signup";
import { createPostForm } from "./components/formHandlers/CreatePost";
import { Messages } from "./components/Home/Messages";
import CreateAds from "./components/Home/CreateAds";
import { JobListing } from "./components/JOBS/JobsList";
import { JobDetails } from "./components/JOBS/JobDetails";
import { CreateJobs } from "./components/JOBS/CreateJobs";
import { CourseListing } from "./components/LEARNING/CourseList";
import { CreateCourse } from "./components/LEARNING/CreateCourse.jsx";
import { jobCreation } from "./components/formHandlers/Jobs.jsx";
import { CourseCreation } from "./components/formHandlers/Course.jsx";
import { ErrorPage } from "./components/ErrorPage.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Blogs />} />
      <Route path="About" element={<About />} />
      <Route path="JobsList" element={<JobListing />} />
      <Route path="/JobsList/:jobPath" element={<JobDetails />} />
      <Route path="CreateJobs" element={<CreateJobs />} action={jobCreation} />
      <Route path="CoursesList" element={<CourseListing />} />
      <Route
        path="CreateCourse"
        element={<CreateCourse />}
        action={CourseCreation}
      />
      <Route path=":id" element={<BlogDetails />} />
      <Route path="Dashboard" element={<DashBoard />} action={createPostForm} />
      <Route path="Contact" element={<Contact />} action={contactForm} />
      <Route path="Signup" element={<SignUp />} action={SignupForm} />
      <Route path="CreateAds" element={<CreateAds />} />
      <Route path="Login" element={<LogIn />} action={LoginForm} />
      <Route path="PasswordReset1" element={<PwdReset />} />
      <Route path="Messages" element={<Messages />} />
      <Route path="*" element={<ErrorPage />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
