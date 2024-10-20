import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  onSnapshot,
  where,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { dbase } from "../../Firebase";
import { useEffect, useState } from "react";
import { auth } from "../../Firebase";
import { FaRegTrashCan } from "react-icons/fa6";
import { HiDotsVertical } from "react-icons/hi";

export const Comments = ({ postId }) => {
  const [user, setUser] = useState(null);
  const [comment, setComments] = useState([]); // renamed for clarity
  const [isOpen, setIsOpen] = useState(false);
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
      const docRef = await addDoc(collection(dbase, "comments"), {
        commentText: formData.commentText,
        email: user.userEmail,
        name: user.FullName,
        postId: postId,
        CreatedAt: serverTimestamp(),
      });
      // const form = document.getElementById('comment');
      // form.reset()
      setFormData({
        commentText: "",
        email: "",
        name: "",
      });
    } catch (e) {
      alert("Signup/Login to make a comment");
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
      collection(dbase, "comments"),
      where("postId", "==", postId),
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
  }, [postId]);

  const handleDelete = async (cId, cEmail) => {
    if (user.userEmail == cEmail) {
      const docRef = doc(dbase, "comments", cId);
      await deleteDoc(docRef)
        .then(() => {
          // alert("Comment deleted successfully!");
          setComments(comment.filter((comment) => comment.id !== cId)); // Update state with filtered posts
        })
        .catch((error) => {
          alert("Error deleting Post: ", error);
        });
      toggleDeleteBtn();
    }
  };

  const toggleDeleteBtn = () => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  };

  return (
    <div className="commentbox w-full h-fit bg-slate-600 p-4 rounded-md authenticated">
      <h2 className=" text-white mb-4 font-bold mt-3"> COMMENTS </h2>
      <div className="comments text-white w-full h-fit">
        {comment &&
          comment.map((comment) => (
            <div
              key={comment.id}
              className=" w-full h-fit bg-inherit py-2 flex flex-col gap-2 justify-start relative"
            >
              {user && user.userEmail === comment.email && (
                <div className="absolute right-0 ">
                  <div
                    className="relative cursor-pointer"
                    onClick={toggleDeleteBtn}
                  >
                    <HiDotsVertical />
                  </div>
                  <div
                    className={`bg-secondary w-8 h-10 flex justify-center items-center rounded absolute -right-4 -top-14 ${
                      isOpen ? "" : "hidden "
                    }`}
                  >
                    <FaRegTrashCan
                      className=" cursor-pointer button "
                      onClick={() => handleDelete(comment.id, comment.email)}
                    />
                  </div>
                </div>
              )}

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
