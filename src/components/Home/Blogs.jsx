import { SideBar } from "./SideBar";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { useEffect, useState } from "react";
import { dbase } from "../../Firebase";
import { storage } from "../../Firebase";
import { ref, getDownloadURL } from "firebase/storage";
import { Link } from "react-router-dom";

export const Blogs = () => {
  const [post, setPosts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [count, setCount] = useState(0);

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

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(dbase, "users"),
      (querySnapshot) => {
        setCount(querySnapshot.size);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      const q = query(collection(dbase, "posts"), orderBy("createdAt", "desc"));
      onSnapshot(q, async (snapshot) => {
        const posts = [];
        for (const doc of snapshot.docs) {
          const postItem = { ...doc.data(), id: doc.id };
          postItem.formattedDate = formatDate(postItem.createdAt.toDate()); // Add formatted date
          postItem.featuredImageUrl = await fetchImage(postItem.imageurl); // Fetch image URL
          posts.push(postItem);
        }
        setPosts(posts);
        setIsLoading(false);
      });
    };

    fetchPosts();
  }, []);

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

  return (
    <div className="BlogsWrapper w-5/6 h-fit flex gap-4">
      {isLoading ? (
        <div className="loading-spinner w-32 h-32 pulsate-fwd rounded-full mx-auto p-5 bg-secondary flex justify-center items-center text-white text-sm">
          {" "}
          Loading...
        </div>
      ) : (
        <>
          <div className="post-inner w-full h-fit rounded-md flex justify-start gap-3 flex-col">
            <div className=" text-white text-sm w-full text-center font-light bg-tet py-1 rounded px-8">
              Registered Users: {count}
            </div>
            <div className="header w-full h-fit rounded-md py-4 px-5 text-white justify-center gap-8 items-center flex">
              <div className=" cursor-pointer">Single Posts</div>
              <div className=" w-0.5 h-4 bg-white"></div>
              <Link
                to={"/Series"}
                className=" hover:border-b-2 pb-1 cursor-pointer"
              >
                Series
              </Link>
            </div>
            {post &&
              post.map((post) => (
                <Link to={post.id} key={post.title}>
                  <div className="posts w-full h-fit py-5 px-5 mb-5">
                    <h2 className=" text-lg text-yellow-300 text-wrap font-semibold leading-2 mb-1 uppercase">
                      {post.title}
                    </h2>
                    <div className="features  flex justify-start w-fit gap-2 text-white text-xs mb-4">
                      <div className="author">
                        {post.authorName} <span className="mx-1">:</span>{" "}
                        {post.formattedDate}
                        <br />
                        {post.upvotes} Upvote
                      </div>
                    </div>
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
                    <p className=" text-yellow-300 text-sm mt-2 mb-4">
                      Read Full Content....
                    </p>
                  </div>
                </Link>
              ))}
          </div>

          <SideBar />
        </>
      )}
    </div>
  );
};
