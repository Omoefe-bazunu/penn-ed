import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react({ fastRefresh: true })],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor libraries
          firebase: [
            "firebase/app",
            "firebase/auth",
            "firebase/firestore",
            "firebase/storage",
          ],
          reactQuery: ["@tanstack/react-query"],
          router: ["react-router-dom"],
          emailjs: ["@emailjs/browser"],
          // App sections
          dashboard: [
            "./src/pages/Dashboard/Index",
            "./src/pages/Dashboard/Portfolio",
            "./src/pages/Dashboard/PublicPortfolio",
            "./src/pages/Dashboard/AccountSettings",
          ],
          admin: ["./src/pages/AdminDashboard/Index"],
          posts: ["./src/pages/Posts/Index"],
          jobs: ["./src/pages/Jobs/Index"],
          courses: [
            "./src/pages/Courses/Index",
            "./src/components/CourseDetailsModal",
          ],
          competitions: [
            "./src/pages/Competitions/Index",
            "./src/components/CompetitionApplicationModal",
          ],
          auth: [
            "./src/pages/Auth/Login",
            "./src/pages/Auth/Signup",
            "./src/context/AuthContext",
          ],
          components: [
            "./src/components/ui/bottomTab",
            "./src/components/ui/topTab",
            "./src/components/SubscriptionModal",
          ],
        },
      },
    },
    chunkSizeWarningLimit: 600, // Increase to 600 kB
  },
});
