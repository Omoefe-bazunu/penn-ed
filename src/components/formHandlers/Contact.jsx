import { redirect } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { dbase } from "../../Firebase";

export const contactForm = async ({ request }) => {
  const data = await request.formData();
  const messageInfo = {
    name: data.get("name"),
    email: data.get("email"),
    message: data.get("message"),
  };

  const form = document.getElementById("contactForm");
  form.reset();

  try {
    const colRef = collection(dbase, "messages");
    await addDoc(colRef, {
      senderEmail: messageInfo.email,
      message: messageInfo.message,
      name: messageInfo.name,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    alert(error.message);
  }

  return redirect("/Contact");
};
