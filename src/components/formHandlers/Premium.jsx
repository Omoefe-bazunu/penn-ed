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
  const email = data.get("email"); // Extract email address

  const form = document.getElementById("premiumForm");
  form.reset();

  try {
    // Create a query to find the user document by email
    const q = query(
      collection(dbase, "users"),
      where("userEmail", "==", email)
    );

    // Get matching documents
    const querySnapshot = await getDocs(q);

    // Check if a document exists with the provided email
    if (querySnapshot.empty) {
      alert("No user found with that email address.");
      return; // Exit if no user found
    }

    // Get the first matching document (assuming only one user per email)
    const userDoc = querySnapshot.docs[0];

    // Update the user document with "Premium" value
    await updateDoc(userDoc.ref, {
      role: "Premium", // Update the "plan" field to "Premium"
    });
    alert("user upgrade successful");
  } catch (error) {
    alert(error.message);
  } finally {
    return redirect("/Premium");
  }
};
