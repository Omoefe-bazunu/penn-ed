import { redirect } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { dbase } from "../../Firebase";

export const premiumForm = async ({ request }) => {
  const data = await request.formData();
  const email = data.get("email");

  const form = document.getElementById("premiumForm");
  form.reset();

  try {
    const q = query(
      collection(dbase, "users"),
      where("userEmail", "==", email)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      alert("No user found with that email address.");
      return;
    }
    const userDoc = querySnapshot.docs[0];
    await updateDoc(userDoc.ref, {
      role: "Premium",
    });
    alert("user upgrade successful");
  } catch (error) {
    alert(error.message);
  }
  return redirect("/Premium");
};
