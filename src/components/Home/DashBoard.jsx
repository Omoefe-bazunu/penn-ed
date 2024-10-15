import { Form, Link } from "react-router-dom";
import { SideBar } from "./SideBar";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../Firebase";
import { useEffect, useState } from "react";
import { auth } from "../../Firebase";
import {
  collection,
  query,
  onSnapshot,
  where,
  orderBy,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { dbase } from "../../Firebase";

export const DashBoard = () => {
  const [user, setUser] = useState(null);
  const [post, setPosts] = useState(null);
  const [userEmail, setUserEmail] = useState("");

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

          setPosts(fetchedPosts);
        });
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, [userEmail]);

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

  const handleImgChange = async (e) => {
    if (e.target.files[0]) {
      try {
        const img = e.target.files[0];
        const storageRef = ref(storage, `posts/${img.name}`);
        await uploadBytes(storageRef, img);
        alert("IMAGE UPLOADED");
      } catch (error) {
        console.error("ERROR WITH UPLOAD", error);
      }
    }
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
      <div className="postwrapper w-full h-full flex flex-col justify-start gap-5">
        {user && (
          <div className=" text-white bg-secondary button cursor-pointer text-xs px-4 py-2 rounded w-fit">
            <Link to="/GoPremium">Upgrade to Premium</Link>
          </div>
        )}
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
              <button
                className="delete button text-white bg-red-600 w-fit text-xs py-2 px-4 my-5 rounded-sm"
                onClick={() => handleDeletePost(post.id)}
              >
                Delete
              </button>
            </div>
          ))}
        <div className="createPost w-full h-fit p-4 rounded-md">
          <h2 className=" text-white mb-4 font-bold mt-3"> PUBLISH A POST </h2>
          <Form
            method="post"
            action="/Dashboard"
            id="createPost"
            className="postForm flex flex-col justify-start gap-5 w-full"
          >
            <input
              placeholder="Your Name as the author e.g Omoefe Bazunu"
              name="name"
              className=" bg-inherit border-b-2 border-slate-400 outline-none text-white"
            />
            <input
              placeholder="Post Title in BLOCK LETTERS"
              name="title"
              className=" bg-inherit border-b-2 border-slate-400 outline-none text-white uppercase"
            />
            <textarea
              placeholder="Write your post here"
              name="body"
              className=" bg-inherit border-b-2 border-slate-400 outline-none text-white"
            />
            <div className="featuredImg flex bg-inherit mt-3 gap-2">
              <input
                type="file"
                name="imageurl"
                className=" outline-none text-white border-b-2 border-slate-400 w-full"
                onChange={handleImgChange}
              />
            </div>

            <button className="Btn text-white text-left text-sm text-nowrap py-2 w-fit pr-5 pl-2 rounded-sm cursor-pointer mt-3 mb-5">
              PUBLISH POST
            </button>
          </Form>
        </div>
      </div>
      <SideBar />
    </div>
  );
};

// // Handle payment gateway integration (replace with your specific code)
// const handleUpgradeToPremium = async () => {
//   // Integrate payment gateway API to process payment
//   // Upon successful payment, update role to "Premium" in Firestore
//   const userDocRef = dbase.collection("users").doc(auth.currentUser.uid); // Get current user document reference
//   await userDocRef.update({ role: "Premium" });
//   alert("Congratulations! You are now a premium user.");
// };

// import React, { useState, useEffect } from 'react';
// import firebase from 'firebase/app'; // Import Firebase

// function Dashboard() {
//   const [user, setUser] = useState(null);
//   const [userRole, setUserRole] = useState(null);

//   useEffect(() => {
//     firebase.auth().onAuthStateChanged((user) => {
//       setUser(user);

//       if (user) {
//         // Retrieve the user's role from Firestore
//         firebase.firestore().collection('users').doc(user.uid).get()
//           .then((doc) => {
//             setUserRole(doc.data().role);
//           })
//           .catch((error) => {
//             console.error('Error retrieving user role:', error);
//           });
//       }
//     });
//   }, []);

//   if (!user) {
//     return <div>Please log in to access your dashboard.</div>;
//   }

//   if (userRole === 'premium') {
//     return (
//       // Render post creation form here
//     );
//   } else {
//     return (
//       <div>
//         You are a basic user. Only premium users can create posts.
//         <a href="/premium-membership">Upgrade to premium</a>
//       </div>
//     );
//   }
// }
