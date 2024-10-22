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
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { dbase } from "../../../Firebase";

const SeriesEpisodes = ({ userEmail }) => {
  const [post, setPosts] = useState(null);
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [currentPost, setCurrentPost] = useState({
    episodeTitle: "",
    body: "",
  });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(
          collection(dbase, "series"),
          where("userEmail", "==", userEmail),
          orderBy("createdAt", "desc")
        );
        onSnapshot(q, async (snapshot) => {
          const fetchedPosts = [];

          for (const doc of snapshot.docs) {
            const postItem = { ...doc.data(), id: doc.id };
            fetchedPosts.push(postItem);
          }
          setPosts(fetchedPosts);
        });
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
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
      const q = query(
        collection(dbase, "series"),
        where("eId", "==", currentPost.eId)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert("Post not found.");
        return;
      }

      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, {
        episodeTitle: currentPost.episodeTitle,
        body: currentPost.body,
      });

      setCurrentPost({
        episodeTitle: "",
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
    // Find the clicked post by ID
    const clickedPost = post.find((p) => p.eId === postId);
    if (clickedPost) {
      // Update currentPost state with clicked post data
      setCurrentPost({
        eId: clickedPost.eId,
        episodeTitle: clickedPost.episodeTitle, // Use episodeTitle here
        body: clickedPost.body,
      });
      setIsEditingPost(true);
    } else {
      console.error("Post not found!");
    }
  };

  const handleDeletePost = async (pId) => {
    try {
      const q = query(collection(dbase, "series"), where("eId", "==", pId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert("Post not found.");
        return;
      }

      const docRef = querySnapshot.docs[0].ref;
      await deleteDoc(docRef);
      alert("Post deleted successfully!");
      setPosts(post.filter((post) => post.eId !== pId));
    } catch (error) {
      alert("Error deleting Post: ", error);
    }
  };

  return (
    <div>
      {post &&
        post.map((post) => (
          <div
            key={post.eId}
            className="posts w-full flex flex-col h-fit py-5 px-5 mb-5"
          >
            <h2 className=" text-lg text-yellow-300 text-wrap leading-2 mb-1 font-semibold uppercase">
              {post.episodeTitle}
            </h2>
            <p className="postBody text-white whitespace-pre-wrap">
              {post.body.slice(0, 200)}...
            </p>
            <p className=" hidden" id={post.eId}>
              {post.eId}
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
                    name="episodeTitle"
                    value={currentPost.episodeTitle} // Use episodeTitle here
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
                onClick={() => handleDeletePost(post.eId)}
              >
                Delete
              </button>
              <button
                className="edit button text-white bg-secondary w-fit text-xs py-2 px-4 my-5 rounded-sm"
                onClick={() => handleEdit(post.eId)}
              >
                Edit Post
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default SeriesEpisodes;
