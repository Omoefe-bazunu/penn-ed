import { Form, Link, useNavigate } from "react-router-dom";
import { storage } from "../../Firebase";
import { ref, getDownloadURL } from "firebase/storage";
import { useState, useEffect } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../Firebase";

export const PwdReset = () => {
  const [backgroundImage, setBackgroundImage] = useState("");
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImage = async () => {
      const imageRef = ref(storage, "General/auth.jpg");
      try {
        const url = await getDownloadURL(imageRef);

        // Lazy load the image
        const img = new Image();
        img.src = url;
        img.onload = () => {
          setBackgroundImage(url);
          setIsImageLoaded(true);
        };
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    fetchImage();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setErrorMessage("Password reset email sent. Please check your inbox.");
      setLoading(false);
      setTimeout(() => navigate("/Login"), 5000);
    } catch (error) {
      setErrorMessage("Error sending password reset email. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="PwdRT1-Wrapper w-5/6 h-screen bg-inherit flex justify-center items-center my-8 mx-auto">
      <div className="PwdRT1Inner bg-white rounded-md w-full h-96 flex justify-start items-center">
        <div
          className="featuredImage bg-cover bg-center bg-no-repeat h-full bg-slate-500 rounded-md w-full"
          style={{
            backgroundImage: isImageLoaded ? `url(${backgroundImage})` : "none",
          }}
        >
          {/* Placeholder while image is loading */}
          {!isImageLoaded && (
            <div className="image-placeholder bg-tet w-full h-full flex items-center justify-center text-white">
              Loading Image...
            </div>
          )}
        </div>
        <div className="Form flex flex-col justify-start items-start h-full w-full py-12 px-5 gap-8">
          <h2 className="brand text-2xl w-full">PENNED</h2>
          <Form
            onSubmit={handleSubmit}
            id="PwdRT1"
            className="FormElement flex flex-col justify-start items-start w-full pr-12"
          >
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="outline-none border-b-2 border-gray-100 mb-5 w-full"
            />
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            <button
              className="text-white text-nowrap py-2 w-fit px-5 rounded-sm cursor-pointer mt-3"
              disabled={loading}
            >
              {loading ? "Sending..." : "RESET PASSWORD"}
            </button>
            <div className="signup mt-8 w-full">
              <Link to="/Login">
                <p className="w-full text-sm border-t-2 pt-1 cursor-pointer">
                  Remembered Password? Login
                </p>
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};
