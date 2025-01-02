import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  onSnapshot,
  where,
  orderBy,
} from "firebase/firestore";
import { dbase } from "../../Firebase";
import { useEffect, useState } from "react";
import { auth } from "../../Firebase";

export const JobComments = ({ jobId }) => {
  const [user, setUser] = useState(null);
  const [comment, setComments] = useState([]); // renamed for clarity
  const [formData, setFormData] = useState({
    commentText: "",
    email: "",
    name: " ",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const q = query(
            collection(dbase, "users"),
            where("userEmail", "==", currentUser.email)
          );
          const querySnapshot = await getDocs(q);
          if (querySnapshot.docs.length > 0) {
            const data = querySnapshot.docs[0].data();
            const { FullName, userEmail } = data;
            setUser({ FullName, userEmail });
          } else {
            console.log("No such document!");
          }
        } else {
          console.log("No current user logged in");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const docRef = await addDoc(collection(dbase, "jobcomments"), {
        commentText: formData.commentText,
        email: user.userEmail,
        name: user.FullName,
        jobId: jobId,
        CreatedAt: serverTimestamp(),
      });
      // const form = document.getElementById('comment');
      // form.reset()
      setFormData({
        commentText: "",
        email: "",
        name: "",
      });
    } catch (error) {
      alert("Signup/Login to make a comment");
      console.log(error.message);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const fetchComment = () => {
    const q = query(
      collection(dbase, "jobcomments"),
      where("jobId", "==", jobId),
      orderBy("CreatedAt", "desc")
    );
    onSnapshot(q, (snapshot) => {
      const comments = [];
      for (const doc of snapshot.docs) {
        const commentItem = { ...doc.data(), id: doc.id };
        comments.push(commentItem);
      }
      setComments(comments);
    });
  };

  useEffect(() => {
    fetchComment();
  }, [jobId]);

  return (
    <div className="commentbox w-full h-fit bg-slate-600 p-4 authenticated border">
      <h2 className=" text-white mb-4 font-bold mt-3"> COMMENTS </h2>
      <div className="comments text-white w-full h-fit">
        {comment &&
          comment.map((comment) => (
            <div
              key={comment.id}
              className=" w-full h-fit bg-inherit py-2 flex flex-col gap-2 justify-start"
            >
              <p className=" italic ">{comment.commentText}</p>
              <p className=" italic border-b-2 border-slate-400 pb-5">
                - {comment.name}
              </p>
            </div>
          ))}
      </div>
      <div className="comment  authenticated">
        <form
          method="post"
          action="/Comments"
          id="comment"
          className="commentForm flex flex-col justify-start gap-4 w-full"
        >
          <h2 className=" text-white border-b-2 border-slate-400 mt-10">
            Leave a Comment
          </h2>
          <textarea
            type="text"
            placeholder="Write your comment here"
            value={formData.commentText}
            onChange={handleChange}
            name="commentText"
            className=" bg-inherit border-b-2 border-slate-400 outline-none text-white"
          />
          <button
            className=" text-white text-sm text-nowrap py-2 w-fit px-5 rounded-sm cursor-pointer mt-3 mb-5"
            onClick={handleSubmit}
          >
            POST COMMENT
          </button>
        </form>
      </div>
    </div>
  );
};
