import { Outlet } from "react-router-dom";
import { NavBar } from "./Home/NavBar";
import { Footer } from "./Home/Footer";

export const RootLayout = () => {
  return (
    <div className="Wrapper w-screen h-screen flex flex-col justify-between items-center gap-8 overflow-x-hidden">
      <NavBar />
      <Outlet />
      <Footer />
    </div>
  );
};
