import { redirect } from "react-router-dom";
import { auth } from "../../Firebase";
import {
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

export const LoginForm = async ({ request }) => {
  const data = await request.formData();
  const LoginInfo = {
    email: data.get("email"),
    password: data.get("password"),
  };
  const form = document.getElementById("LoginForm");
  form.reset();

  try {
    // Attempt to sign in the user
    const userCredential = await signInWithEmailAndPassword(
      auth,
      LoginInfo.email,
      LoginInfo.password
    );
    const user = userCredential.user;

    // Check email verification if user exists
    if (user) {
      if (user.emailVerified) {
        alert("LOGIN SUCCESS!");
        // Redirect to home page
        return redirect("/");
      } else {
        alert("Please verify your email address before logging in.");
        await sendEmailVerification(user);
        alert("Verification email resent. Please check your inbox.");
      }
    } else {
      // User not found, prompt for signup
      alert("Please Sign Up first");
    }
  } catch (err) {
    // Handle other errors (e.g., wrong password)
    alert("Wrong email or password. Please try again.");
  }
  
  return redirect("/login"); 
};
