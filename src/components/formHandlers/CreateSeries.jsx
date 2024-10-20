import { redirect } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { dbase } from "../../Firebase";
import { auth } from "../../Firebase";

export const createSeriesForm = async ({ request }) => {
  const data = await request.formData();
  const episodeDetails = {
    name: data.get("name"),
    series: data.get("series"),
    episode: data.get("episode"),
    body: data.get("body"),
  };
  const form = document.getElementById("createSeries");
  form.reset();

  try {
    const userEmail = auth.currentUser.email;

    const colRef = collection(dbase, "series");
    const randomJobId = Math.floor(Math.random() * 1000000);
    await addDoc(colRef, {
      eId: randomJobId,
      authorName: episodeDetails.name,
      userEmail: userEmail,
      seriesTitle: episodeDetails.series,
      episodeTitle: episodeDetails.episode,
      body: episodeDetails.body,
      upvotes: 0,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    alert(error.message);
  }

  return redirect("/CreateSeries");
};
