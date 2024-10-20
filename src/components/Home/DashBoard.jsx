import { SideBar } from "./SideBar";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../Firebase";
import { useEffect, useState } from "react";
import { auth } from "../../Firebase";
import { IoIosClose } from "react-icons/io";
import { HiPencil } from "react-icons/hi";
import {
  collection,
  query,
  onSnapshot,
  where,
  orderBy,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { dbase } from "../../Firebase";
import SeriesForm from "./Series/SeriesForm";
import SinglePostForm from "./Series/SinglePostForm";
import { Link } from "react-router-dom";

export const DashBoard = () => {
  const [user, setUser] = useState(null);
  const [post, setPosts] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [currentPost, setCurrentPost] = useState({
    // id: post/.id,
    title: "",
    body: "",
  });

  // This fetches the posts made by the user logged in
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(
          collection(dbase, "posts"),
          where("userEmail", "==", userEmail),
          orderBy("createdAt", "desc")
        );
        onSnapshot(q, async (snapshot) => {
          const fetchedPosts = [];

          for (const doc of snapshot.docs) {
            const postItem = { ...doc.data(), id: doc.id };
            postItem.formattedDate = formatDate(postItem.createdAt.toDate());
            postItem.featuredImageUrl = await fetchImage(postItem.imageurl);
            fetchedPosts.push(postItem);
          }

          // Set the fetched posts to the state
          setPosts(fetchedPosts);
        });
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    // Fetch posts immediately when the component mounts
    fetchPosts();
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCurrentPost((prevPost) => ({
      ...prevPost,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Get a reference to the document to be updated
      const postRef = doc(dbase, "posts", currentPost.id);

      // Update the document with the new title and body
      await updateDoc(postRef, {
        title: currentPost.title,
        body: currentPost.body,
      });

      // Reset the form fields
      setCurrentPost({
        title: "",
        body: "",
      });

      // Handle success (e.g., show success message, redirect)
      console.log("Post updated successfully!");
      setIsEditingPost(false);
    } catch (error) {
      // Handle errors (e.g., show error message)
      console.error("Error updating post:", error);
    }
  };

  //END

  const handleClose = () => {
    setIsEditingPost(false);
  };

  const handleEdit = (postId) => {
    // Find the clicked post by ID
    const clickedPost = post.find((p) => p.id === postId);

    if (clickedPost) {
      // Update currentPost state with clicked post data
      setCurrentPost({
        id: clickedPost.id,
        title: clickedPost.title,
        body: clickedPost.body,
      });
      setIsEditingPost(true);
    } else {
      console.error("Post not found!");
    }
  };

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
            const { role } = data;
            if (role == "Basic") {
              setUser({ role });
            }
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

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email);
    }
  }, [userEmail]);

  // This fetches the image for each post
  const fetchImage = async (imageurl) => {
    if (imageurl) {
      const imageRef = ref(storage, `posts/${imageurl}`);
      try {
        const url = await getDownloadURL(imageRef);
        return url;
      } catch (error) {
        console.error("Error fetching image:", error);
        return null;
      }
    }
  };

  // Helper function to format date
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

  const handleDeletePost = async (pId) => {
    const docRef = doc(dbase, "posts", pId);
    await deleteDoc(docRef)
      .then(() => {
        alert("Post deleted successfully!");
        setPosts(post.filter((post) => post.id !== pId)); // Update state with filtered posts
      })
      .catch((error) => {
        alert("Error deleting Post: ", error);
      });
  };

  return (
    <div className="DashboardWrapper w-5/6 h-fit flex gap-4">
      <div className="postwrapper w-full h-full flex flex-col justify-start gap-5 relative">
        {user && (
          <div className=" text-white bg-secondary button cursor-pointer text-xs px-4 py-2 rounded w-fit">
            <Link to="/GoPremium">Upgrade to Premium</Link>
          </div>
        )}
        <div className=" w-full bg-tet p-4 rounded-md">
          <div className=" w-full text-white font-medium mt-4 flex justify-center items-center">
            Create
            <span className=" ml-4">
              <HiPencil />
            </span>
          </div>

          <SinglePostForm />
          <SeriesForm />
        </div>
        <div className=" w-full flex justify-center items-center text-white bg-tet py-2 px-4">
          Your Posts
        </div>
        {post &&
          post.map((post) => (
            <div
              key={post.id}
              className="posts w-full flex flex-col h-fit py-5 px-5 mb-5"
            >
              <h2 className=" text-lg text-yellow-300 text-wrap leading-2 mb-1 font-semibold uppercase">
                {post.title}
              </h2>
              <p className="date text-xs text-white w-fit">
                {post.formattedDate}
                <span className="mx-2">:</span>
                {post.upvotes} Upvote
              </p>
              {post.featuredImageUrl ? (
                <img
                  src={post.featuredImageUrl}
                  alt=""
                  className=" w-24 h-24 bg-cover bg-center bg-no-repeat mt-3 mb-5 text-white"
                />
              ) : (
                <img />
              )}
              <p className="postBody text-white whitespace-pre-wrap">
                {post.body.slice(0, 200)}...
              </p>
              <p className=" hidden" id={post.id}>
                {post.id}
              </p>
              {isEditingPost && (
                <div
                  className={`w-full z-10 bg-tet rounded px-5 py-4 h-full absolute top-0 left-0 ${
                    isEditingPost ? "" : "hidden "
                  }`}
                >
                  <div className="edit close w-full flex justify-end">
                    <IoIosClose
                      onClick={handleClose}
                      className="text-white w-12 h-12 button cursor-pointer"
                    />
                  </div>
                  <form
                    id="editPost"
                    className="postForm flex flex-col justify-start gap-5 w-full py-8"
                  >
                    <input
                      placeholder="Post Title"
                      name="title"
                      value={currentPost.title}
                      onChange={handleChange}
                      className=" bg-inherit border-b-2 border-slate-400 outline-none text-white uppercase"
                    />
                    <textarea
                      placeholder="Post body"
                      name="body"
                      onChange={handleChange}
                      value={currentPost.body}
                      className=" bg-inherit border-b-2 border-slate-400 outline-none text-white h-48"
                    />

                    <button
                      onClick={handleSubmit}
                      className="Btn button bg-secondary text-white text-left text-sm text-nowrap py-2 w-fit px-4 rounded-sm cursor-pointer my-3"
                    >
                      Save
                    </button>
                  </form>
                </div>
              )}
              <div className=" w-full py-2 h-fit flex gap-5">
                <button
                  className="delete button text-white bg-red-600 w-fit text-xs py-2 px-4 my-5 rounded-sm"
                  onClick={() => handleDeletePost(post.id)}
                >
                  Delete
                </button>
                <button
                  className="edit button text-white bg-secondary w-fit text-xs py-2 px-4 my-5 rounded-sm"
                  onClick={() => handleEdit(post.id)}
                >
                  Edit Post
                </button>
              </div>
            </div>
          ))}
      </div>
      <SideBar />
    </div>
  );
};

// npm i react-image-file-resizer
// import ImageResizer from 'react-image-file-resizer';
