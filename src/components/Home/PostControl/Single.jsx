import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../../Firebase";
import { useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";
import {
  collection,
  query,
  onSnapshot,
  where,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { dbase } from "../../../Firebase";

const Single = ({ userEmail }) => {
  const [posts, setPosts] = useState([]); // Renamed state to `posts`
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [currentPost, setCurrentPost] = useState({
    title: "",
    body: "",
  });

  // Fetch posts made by the user logged in
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(
          collection(dbase, "posts"),
          where("userEmail", "==", userEmail),
          orderBy("createdAt", "desc")
        );

        // Listen for updates in real-time using onSnapshot
        const unsubscribe = onSnapshot(q, async (snapshot) => {
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

        // Cleanup subscription on unmount
        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    // Fetch posts immediately when the component mounts
    fetchPosts();
  }, [posts]); // Added userEmail as a dependency

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
      const postRef = doc(dbase, "posts", currentPost.id);
      await updateDoc(postRef, {
        title: currentPost.title,
        body: currentPost.body,
      });

      setCurrentPost({
        title: "",
        body: "",
      });

      console.log("Post updated successfully!");
      setIsEditingPost(false);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleClose = () => {
    setIsEditingPost(false);
  };

  const handleEdit = (postId) => {
    const clickedPost = posts.find((p) => p.id === postId);

    if (clickedPost) {
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
    return null; // Return null if imageurl is not provided
  };

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
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== pId));
      })
      .catch((error) => {
        alert("Error deleting Post: ", error);
      });
  };

  return (
    <div>
      {posts &&
        posts.map((post) => (
          <div
            key={post.id}
            className="posts w-full flex flex-col h-fit py-5 px-5 border-t border-x"
          >
            <h2 className="text-lg text-yellow-300 text-wrap leading-2 mb-1 font-semibold uppercase">
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
                className="w-24 h-24 bg-cover bg-center bg-no-repeat mt-3 mb-5 text-white"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-500 mt-3 mb-5"></div>
            )}
            <p className="postBody text-white whitespace-pre-wrap">
              {post.body.slice(0, 200)}...
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
                    className="bg-inherit border-b-2 border-slate-400 outline-none text-white uppercase"
                  />
                  <textarea
                    placeholder="Post body"
                    name="body"
                    onChange={handleChange}
                    value={currentPost.body}
                    className="bg-inherit border-b-2 border-slate-400 outline-none text-white h-48"
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
            <div className="w-full py-2 h-fit flex gap-5">
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
  );
};

export default Single;
