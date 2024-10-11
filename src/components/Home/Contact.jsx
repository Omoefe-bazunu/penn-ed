import { Form } from "react-router-dom";
import { storage } from "../../Firebase";
import { ref, getDownloadURL } from "firebase/storage";
import { useState, useEffect } from "react";

export const Contact = () => {
  const [backgroundImage, setBackgroundImage] = useState("");

  useEffect(() => {
    const fetchImage = async () => {
      const imageRef = ref(storage, "General/auth.jpg");
      try {
        const url = await getDownloadURL(imageRef);
        setBackgroundImage(url);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    fetchImage();
  }, []);

  return (
    <div className="Contact-Wrapper w-5/6 h-fit bg-inherit flex justify-center items-center my-0 mx-auto">
      <div className="ContactInner bg-white rounded-md w-full h-96 flex justify-start items-center">
        <div
          className="featuredImage bg-cover bg-center bg-no-repeat h-full bg-slate-500 rounded-md w-full"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        ></div>
        <div className="Form flex flex-col justify-start items-start h-full w-full py-12 px-5 gap-8">
          <h2 className="header text-2xl w-full">Contact Admin</h2>
          <Form
            method="post"
            action="/Contact"
            id="contactForm"
            className="FormElement flex flex-col justify-start items-start w-full h-full pr-12"
          >
            <input
              type="text"
              placeholder="Full name"
              name="name"
              className=" outline-none border-b-2 border-gray-100 mb-5 w-full"
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              className=" outline-none border-b-2 border-gray-100 mb-5 w-full"
            />
            <textarea
              placeholder="Message"
              name="message"
              className="outline-none h-36 px-2 py-3 border-2 border-gray-100 w-full mb-2"
            />
            <button className=" text-white text-nowrap py-2 w-fit px-8 rounded-sm cursor-pointer mt-5">
              SUBMIT
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
};
