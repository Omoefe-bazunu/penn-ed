import { NavLink } from "react-router-dom";
import { BreadCrumbs } from "./BreadCrumbs";
import { TfiList, TfiClose } from "react-icons/tfi";
import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../Firebase";

export const NavBar = () => {
  const [user, setUser] = useState("");
  const [toggle, setToggle] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const signout = () => {
    signOut(auth);
    console.log("SIGNED OUT");
    window.location.href = "/Login";
  };

  return (
    <div className="w-full h-fit sticky top-0 z-20">
      <div className="NavBar flex flex-col justify-between items-center w-5/6 mx-auto px-4 bg-primary h-fit pt-5 pb-2 border-b border-white">
        <div className="main flex justify-between items-center w-full">
          <h2 className="brand text-2xl text-white">PENNED</h2>
          {/* Desktop Menu */}
          <div className="NavLinks hidden md:flex justify-end items-center">
            <NavLink to="/">
              <p className="mr-8 text-white hover:text-yellow-300">HOME</p>
            </NavLink>
            <NavLink to="/About">
              <p className="mr-8 text-white hover:text-yellow-300">ABOUT</p>
            </NavLink>
            {user && (
              <>
                <NavLink to="/Dashboard">
                  <p className="mr-8 text-white hover:text-yellow-300">
                    DASHBOARD
                  </p>
                </NavLink>
                <NavLink to="/JobsList">
                  <p className="mr-8 text-white hover:text-yellow-300">JOBS</p>
                </NavLink>
                <NavLink to="/CoursesList">
                  <p className="mr-8 text-white hover:text-yellow-300">LEARN</p>
                </NavLink>
              </>
            )}
            <NavLink to="/Contact">
              <p className="mr-8 text-white hover:text-yellow-300">CONTACT</p>
            </NavLink>
            {user ? (
              <button
                className="Logout button px-5 py-2 bg-red-600 text-white rounded-sm text-center w-fit cursor-pointer"
                onClick={signout}
              >
                LOGOUT
              </button>
            ) : (
              <NavLink to="/Login">
                <button className="LoginBtn button Login px-5 py-2 text-white rounded-sm text-center w-fit">
                  LOGIN
                </button>
              </NavLink>
            )}
          </div>
          {/* Mobile Menu Icon */}
          <div className="MenuIcon text-white cursor-pointer md:hidden flex">
            {toggle ? (
              <TfiList size={30} onClick={() => setToggle(false)} />
            ) : (
              <TfiClose size={30} onClick={() => setToggle(true)} />
            )}
          </div>
        </div>
        {/* Mobile Menu */}
        {!toggle && (
          <div className="Bar flex flex-col bg-primary w-5/6 h-fit pt-10 pb-18 pl-5 absolute  top-16 md:hidden">
            <ul className="menu-link flex flex-col justify-end gap-3">
              <NavLink to="/">
                <p className="mr-8 text-white border-b-2 border-slate-700 pb-1 hover:text-yellow-300">
                  HOME
                </p>
              </NavLink>
              <NavLink to="/About">
                <p className="mr-8 text-white border-b-2 border-slate-700 pb-1 hover:text-yellow-300">
                  ABOUT
                </p>
              </NavLink>
              {user && (
                <>
                  <NavLink to="/Dashboard">
                    <p className="mr-8 text-white border-b-2 border-slate-700 pb-1 hover:text-yellow-300">
                      DASHBOARD
                    </p>
                  </NavLink>
                  <NavLink to="/JobsList">
                    <p className="mr-8 text-white border-b-2 border-slate-700 pb-1 hover:text-yellow-300">
                      JOBS
                    </p>
                  </NavLink>
                  <NavLink to="/CoursesList">
                    <p className="mr-8 text-white border-b-2 border-slate-700 pb-1 hover:text-yellow-300">
                      LEARN
                    </p>
                  </NavLink>
                </>
              )}
              <NavLink to="/Contact">
                <p className="mr-8 text-white border-b-2 border-slate-700 pb-1 hover:text-yellow-300">
                  CONTACT
                </p>
              </NavLink>
              {user ? (
                <button
                  className="LogoutBtn button Logout pl-2 pr-4 py-2 text-white rounded-sm w-fit cursor-pointer mb-5"
                  onClick={signout}
                >
                  LOGOUT
                </button>
              ) : (
                <NavLink to="/Login">
                  <button className="LoginBtn button Login px-5 py-2 text-white rounded-sm text-center w-fit mb-5">
                    LOGIN
                  </button>
                </NavLink>
              )}
            </ul>
          </div>
        )}
        <BreadCrumbs />
      </div>
    </div>
  );
};
