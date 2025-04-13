// src/App.jsx
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "./components/ui/bottomTab";
import TopNavbar from "./components/ui/topTab";
import { AuthContextProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact/Index";
import NotFound from "./pages/NotFound";

// Lazy-loaded pages
const Dashboard = lazy(() => import("./pages/Dashboard/Index"));
const Portfolio = lazy(() => import("./pages/Dashboard/Portfolio"));
const Settings = lazy(() => import("./pages/Dashboard/AccountSettings"));
const Posts = lazy(() => import("./pages/Posts/Index"));
const PostDetails = lazy(() => import("./pages/Posts/PostDetails"));
const Jobs = lazy(() => import("./pages/Jobs/Index"));
const Courses = lazy(() => import("./pages/Courses/Index"));
const Competitions = lazy(() => import("./pages/Competitions/Index"));
const Login = lazy(() => import("./pages/Auth/Login"));
const Signup = lazy(() => import("./pages/Auth/SignUp"));

const PublicPortfolio = lazy(() => import("./pages/Dashboard/PublicPortfolio"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard/Index"));

// const ResetPassword = lazy(() => import("./pages/Auth/ResetPassword")); // TODO: Uncomment when ResetPassword page is created
// const JobDetails = lazy(() => import("./pages/Jobs/JobDetails")); // TODO: Uncomment when JobDetails page is created
// const CourseDetails = lazy(() => import("./pages/Courses/CourseDetails")); // TODO: Uncomment when CourseDetails page is created
// const Community = lazy(() => import("./pages/Community/Index")); // TODO: Uncomment when Community page is created
// const ChatRoom = lazy(() => import("./pages/Community/ChatRoom")); // TODO: Uncomment when ChatRoom page is created
// const CompetitionDetails = lazy(() => import("./pages/Competitions/CompetitionDetails")); // TODO: Uncomment when CompetitionDetails page is created
// const Profile = lazy(() => import("./pages/Profiles/Profile")); // TODO: Uncomment when Profile page is created

// Initialize QueryClient for data fetching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
      retry: 1, // Retry failed queries once
    },
  },
});

function App() {
  return (
    <AuthContextProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <div className="bg-slate-100 text-slate-800 min-h-screen flex flex-col">
            {/* Top Navbar */}
            <TopNavbar />
            {/* Main content with padding for top and bottom navbars */}
            <main className="flex-grow pt-16 pb-16 md:pt-16 md:pb-20">
              <Suspense
                fallback={<div className="text-center py-10">Loading...</div>}
              >
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/dashboard/portfolio" element={<Portfolio />} />
                  <Route path="/portfolio/:uid" element={<PublicPortfolio />} />
                  <Route path="/dashboard/settings" element={<Settings />} />
                  <Route path="/posts" element={<Posts />} />
                  <Route path="/posts/:id" element={<PostDetails />} />
                  <Route path="/jobs" element={<Jobs />} />
                  <Route path="/jobs/:id" element={<Navigate to="/jobs" />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route
                    path="/courses/:id"
                    element={<Navigate to="/courses" />}
                  />
                  <Route path="/competitions" element={<Competitions />} />
                  <Route
                    path="/competitions/:id"
                    element={<Navigate to="/competitions" />}
                  />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  {/* <Route path="/reset-password" element={<ResetPassword />} /> // TODO: Uncomment when ResetPassword page is created */}
                  {/* <Route path="/community" element={<Community />} /> // TODO: Uncomment when Community page is created */}
                  {/* <Route path="/community/chats/:id" element={<ChatRoom />} /> // TODO: Uncomment when ChatRoom page is created */}
                  {/* <Route path="/profiles/:username" element={<Profile />} /> // TODO: Uncomment when Profile page is created */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
            {/* Bottom Navbar */}
            <Navbar />
          </div>
        </BrowserRouter>
      </QueryClientProvider>
    </AuthContextProvider>
  );
}

export default App;
