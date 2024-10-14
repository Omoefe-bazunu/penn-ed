// import { redirect } from "react-router-dom";
// import { collection, addDoc, serverTimestamp } from "firebase/firestore";
// import { dbase } from "../../Firebase";
// import emailjs from '@emailjs/browser';

// export const contactForm = async ({ request }) => {
//   const data = await request.formData();
//   const messageInfo = {
//     name: data.get("name"),
//     email: data.get("email"),
//     message: data.get("message"),
//   };

//   const form = document.getElementById("contactForm");
//   form.reset();

//   try {
//     const colRef = collection(dbase, "messages");
//     await addDoc(colRef, {
//       senderEmail: messageInfo.email,
//       message: messageInfo.message,
//       name: messageInfo.name,
//       createdAt: serverTimestamp(),
//     });

//   const serviceID = service_ccid698;
//   const templateID = template_qml5dg9;
//   const publicKey = cZC6HUxRjsMFR5npe;

//   const templateParams = {
//     from_name: messageInfo.name,
//     from_email: messageInfo.email,
//     message: messageInfo.message
//   }

//   emailjs.send(serviceID, templateID, templateParams, publicKey)
//     .then((response) => {
//       console.log('Email sent successfully', response)
//     })
//     .catch((error) => {
//       console.log(error.message)
//     })

//   } catch (error) {
//     alert(error.message);
//   }

//   return redirect("/Contact");
// };

import { redirect } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { dbase } from "../../Firebase";
import emailjs from "@emailjs/browser";

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
    const serviceID = "service_ccid698";
    const templateID = "template_qml5dg9";
    const publicKey = "cZC6HUxRjsMFR5npe";

    const templateParams = {
      from_name: messageInfo.name,
      from_email: messageInfo.email,
      message: messageInfo.message,
    };

    await emailjs.send(serviceID, templateID, templateParams, publicKey);
    await addDoc(colRef, {
      senderEmail: messageInfo.email,
      message: messageInfo.message,
      name: messageInfo.name,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    alert(error.message);
  } finally {
    return redirect("/Contact");
  }
};
