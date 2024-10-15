import { SideBar } from "./SideBar";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { dbase } from "../../Firebase";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../Firebase";
import { Comments } from "./Comments";
import { analytics } from "../../Firebase";
import { logEvent } from "firebase/analytics";
import { runTransaction } from "firebase/firestore";
import { auth } from "../../Firebase";

export const BlogDetails = () => {
  const [post, setPost] = useState(null);
  const { id } = useParams();
  const [ImageSrc, setImageSrc] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const postId = id;
    logEvent(analytics, "select_content", {
      content_type: "post",
      content_id: postId,
    });
  }, [id]);

  //This code fetches the post image from the firebase storage if the post exists or has a value
  const fetchImage = async () => {
    if (post) {
      const imageRef = ref(storage, `posts/${post.imageurl}`); // The imageurl property of the post object is passed as the path for the post image.
      try {
        const url = await getDownloadURL(imageRef);
        setImageSrc(url);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    }
  };

  // This fetches the Post
  useEffect(() => {
    const colRef = collection(dbase, "posts");
    const postRef = doc(colRef, id);

    onSnapshot(
      postRef,
      (doc) => {
        if (doc.exists()) {
          const postDetails = { ...doc.data(), id: doc.id };
          postDetails.formattedDate = formatDate(
            postDetails.createdAt.toDate()
          ); // This calls the date conversion function, passing the timestamp as the parameter and converting first to a general date
          setPost(postDetails);
          setIsLoading(false);
          // console.log(post);
        } else {
          console.log(`Post with ID ${id} does not exist.`);
        }
      },
      (error) => {
        console.error("Error fetching post:", error);
      }
    );
  }, [id]);

  // This runs the image fetching function anytime there's a change to the post state.
  useEffect(() => {
    fetchImage();
  }, [post]);

  // This code converts the timestamp for the post to a readable date that users can see
  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth();
    const monthName = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ][month];
    const year = date.getFullYear();
    return `${monthName} ${day}, ${year}`;
  };

  const handleUpvote = async (postId) => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      console.log("User not logged in");
      return;
    }

    const userRef = doc(dbase, "users", currentUser.uid);
    const postRef = doc(dbase, "posts", postId);

    try {
      await runTransaction(
        dbase,
        async (transaction) => {
          const userDoc = await transaction.get(userRef);
          const postDoc = await transaction.get(postRef);

          if (!userDoc.exists() || !postDoc.exists()) {
            console.log("Document not found");
            return;
          }

          const userData = userDoc.data();
          const upvotedOn = userData.upvotedOn || [];
          const upVotes = postDoc.data();

          // Process data
          let newUpvotes, newUpvotedOn;
          if (upvotedOn.includes(postId)) {
            newUpvotedOn = upvotedOn.filter((id) => id !== postId);
            newUpvotes = upVotes.upvotes - 1;
          } else {
            newUpvotedOn = [...upvotedOn, postId];
            newUpvotes = upVotes.upvotes + 1;
          }

          // Write updates
          transaction.update(postRef, { upvotes: newUpvotes });
          transaction.update(userRef, { upvotedOn: newUpvotedOn });
        },
        { maxAttempts: 1 }
      );
    } catch (error) {
      console.error("Error handling upvote:", error);
    }
  };

  return (
    <div className="BlogDetailsWrapper w-5/6 h-fit flex gap-4">
      {isLoading ? (
        <div className="loading-spinner w-full flex justify-center items-center text-white text-xl">
          {" "}
          Loading...
        </div>
      ) : (
        <>
          {post && (
            <div className="postwrapper w-full h-full flex flex-col justify-start items-center gap-5">
              <div className="post w-full h-fit bg-slate-600 rounded-md relative py-5 px-4">
                <div className="post1 felx flex-col justify-start gap-4">
                  <h2 className=" text-yellow-300 my-1 font-semibold uppercase">
                    {post.title}
                  </h2>
                  <div className="features  flex justify-start w-fit gap-2 text-white text-xs mb-4">
                    <div className="author">
                      {post.authorName} <span className="mx-1">:</span>{" "}
                      {post.formattedDate} <br />
                      {post.upvotes} Upvote
                    </div>
                  </div>
                  <img
                    src={ImageSrc}
                    alt="featured-Image"
                    className=" w-50 h-50  mb-8 bg-cover bg-center bg-no-repeat text-white"
                  ></img>
                  <p className="text-white mb-8 whitespace-pre-wrap">
                    {post.body}
                  </p>
                </div>
                <div className="reactions absolute bottom-0 -right-2 cursor-pointer w-10 h-10 rounded-full bg-white authenticated">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="white"
                    className="size-6  Reaction mt-2 mx-auto"
                    onClick={() => {
                      handleUpvote(post.id);
                    }}
                  >
                    <path d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75A.75.75 0 0 1 15 2a2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23h-.777ZM2.331 10.727a11.969 11.969 0 0 0-.831 4.398 12 12 0 0 0 .52 3.507C2.28 19.482 3.105 20 3.994 20H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 0 1-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227Z" />
                  </svg>
                </div>
              </div>
              <Comments postId={post.id} />
            </div>
          )}
          <SideBar />
        </>
      )}
    </div>
  );
};
