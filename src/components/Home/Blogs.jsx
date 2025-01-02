import { SideBar } from "./SideBar";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { useEffect, useState } from "react";
import { dbase } from "../../Firebase";
import { storage } from "../../Firebase";
import { ref, getDownloadURL } from "firebase/storage";
import { NavLink } from "react-router-dom";
import { HiArrowDown } from "react-icons/hi2";
import { ChallengeInfo } from "./Challenge/ChallengeInfo";
import { CgNotes } from "react-icons/cg";
import { GiBookCover } from "react-icons/gi";
import { GiTrophyCup } from "react-icons/gi";

export const Blogs = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [visiblePosts, setVisiblePosts] = useState(5); // Initial number of posts to display

  const fetchImage = async (imageurl) => {
    if (!imageurl) return null;
    const imageRef = ref(storage, `posts/${imageurl}`);
    try {
      return await getDownloadURL(imageRef);
    } catch (error) {
      console.error("Error fetching image:", error);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribeUsers = onSnapshot(
      collection(dbase, "users"),
      (querySnapshot) => setCount(querySnapshot.size)
    );

    return () => unsubscribeUsers(); // Cleanup
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      const q = query(collection(dbase, "posts"), orderBy("createdAt", "desc"));
      const unsubscribePosts = onSnapshot(q, async (snapshot) => {
        const fetchedPosts = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const data = doc.data();
            return {
              ...data,
              id: doc.id,
              formattedDate: formatDate(data.createdAt.toDate()),
              featuredImageUrl: await fetchImage(data.imageurl),
            };
          })
        );
        setPosts(fetchedPosts);
        setIsLoading(false);
      });

      return () => unsubscribePosts(); // Cleanup
    };

    fetchPosts();
  }, []);

  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const loadMorePosts = () => setVisiblePosts((prev) => prev + 5);

  return (
    <div className="BlogsWrapper w-5/6 h-fit flex">
      {isLoading ? (
        <div
          className="loading-spinner w-32 h-32 pulsate-fwd rounded-full mx-auto p-5 bg-secondary flex justify-center items-center text-white text-sm"
          role="status"
          aria-live="polite"
        >
          Loading...
        </div>
      ) : (
        <>
          <div className="post-inner w-full h-fit  flex justify-start flex-col border-x border-b border-white">
            <div className="text-white text-sm w-full text-center font-light bg-tet py-4 rounded px-8 hidden">
              Registered Users: {count}
            </div>
            <ChallengeInfo />
            <header className="header w-full h-fit py-4 px-5 text-white flex justify-center gap-6 lg:gap-12 items-center">
              <div className="cursor-pointer flex items-center gap-2">
                <CgNotes className="w-4 h-4 lg:h-6 lg:w-6" />
                <p className="text-sm lg:text-normal text-nowrap">
                  Single Posts
                </p>
              </div>
              {/* <div className="w-0.5 h-4 bg-white"></div> */}
              <NavLink
                to="/Series"
                className="hover:text-yellow-300 cursor-pointer"
              >
                <div className=" flex items-center gap-2">
                  <GiBookCover className=" w-4 h-4 lg:h-6 lg:w-6" />
                  <p className="text-sm lg:text-normal text-nowrap">Series</p>
                </div>
              </NavLink>
              {/* <div className="w-0.5 h-4 bg-white"></div> */}
              <NavLink
                to="/ChallengePosts"
                className="hover:text-yellow-300 cursor-pointer"
              >
                <div className=" flex items-center gap-2">
                  <GiTrophyCup className="w-4 h-4 lg:h-6 lg:w-6" />
                  <p className="text-sm lg:text-normal text-nowrap">
                    Challenge Posts
                  </p>
                </div>
              </NavLink>
            </header>
            {posts.slice(0, visiblePosts).map((post) => (
              <article
                key={post.id}
                className="posts w-full h-fit py-5 px-5 border-white border-t"
              >
                <h2 className="text-lg text-yellow-300 font-semibold leading-2 mb-1 uppercase">
                  {post.title}
                </h2>
                <div className="features flex justify-start w-fit gap-2 text-white text-xs mb-4">
                  <div className="author">
                    {post.authorName} <span className="mx-1">:</span>{" "}
                    {post.formattedDate}
                    <br />
                    {post.upvotes} Upvotes
                  </div>
                </div>
                {post.featuredImageUrl ? (
                  <img
                    src={post.featuredImageUrl}
                    alt={`Featured image for ${post.title}`}
                    loading="lazy"
                    className="w-24 h-24 bg-cover bg-center rounded mt-3 mb-5"
                  />
                ) : (
                  <img
                    alt="Placeholder for missing image"
                    className="text-white text-xs"
                  />
                )}
                <p className="postBody text-white whitespace-pre-wrap mt-4">
                  {post.body.slice(0, 200)}...
                </p>
                <NavLink
                  to={post.id}
                  className="text-yellow-300 text-sm mt-2 mb-4"
                >
                  Read Full Content
                </NavLink>
              </article>
            ))}
            {visiblePosts < posts.length && (
              <button
                onClick={loadMorePosts}
                className="load-more-button w-fit self-center mt-4 p-4 bg-tet text-white rounded-full"
                aria-label="Load more posts"
              >
                <HiArrowDown className="font-bold" />
              </button>
            )}
          </div>
          <SideBar />
        </>
      )}
    </div>
  );
};
