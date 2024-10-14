import { Form } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth } from "../../Firebase";

export const Premium = () => {
  const [user, setUser] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (!user) {
    return (
      <>
        <p className=" text-white">Unauthorized Access</p>
      </>
    );
  }

  if (user && user.uid !== "Nj7jptHDgfgFbhL4qcO1Gwg1YfM2") {
    return (
      <>
        <p className=" text-white">Access Denied: Not an Admin</p>
      </>
    );
  }

  return (
    <div className="Contact-Wrapper w-5/6 h-fit bg-inherit flex justify-center items-center my-0 mx-auto">
      <div className="ContactInnerounded-md w-full h-96 flex justify-start items-center">
        <div className="Form flex flex-col justify-start items-start h-full w-full py-12 px-5 gap-8">
          <h2 className="header text-2xl w-full text-white">
            Assign Premium Role
          </h2>
          <Form
            method="post"
            action="/Premium"
            id="premiumForm"
            className="FormElement flex flex-col justify-start items-start w-full h-full pr-12"
          >
            <input
              type="email"
              placeholder="Email"
              name="email"
              className=" outline-none border-b-2 border-gray-100 mb-5 w-full bg-inherit text-white"
            />
            <button className="bg-secondary button text-white text-nowrap py-2 w-fit px-8 rounded-sm cursor-pointer mt-5">
              SUBMIT
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
};
