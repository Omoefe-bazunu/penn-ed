import { redirect } from "react-router-dom";
import { auth, dbase } from "../../Firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export const SignupForm = async ({ request }) => {
  const data = await request.formData();
  const SignupInfo = {
    name: data.get("name"),
    email: data.get("email"),
    password: data.get("password"),
  };
  const form = document.getElementById("SignupForm");
  form.reset();

  try {
    // Create user with Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      SignupInfo.email,
      SignupInfo.password
    );

    const user = userCredential.user;

    // Send email verification
    await sendEmailVerification(user);

    // Create user document in Firestore (optional after verification)
    const userDocRef = doc(dbase, "users", user.uid);
    await setDoc(userDocRef, {
      userEmail: SignupInfo.email,
      FullName: SignupInfo.name,
      role: "Basic",
      upvotedOn: [],
      createdAt: serverTimestamp(),
    });

    alert("Check your email to complete verification");
  } catch (err) {
    alert(err.message);
  }

  return redirect("/");
};
