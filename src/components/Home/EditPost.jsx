// import { useState, useEffect } from "react";
// import { dbase } from "../../Firebase";
// import { updateDoc, doc, collection, onSnapshot } from "firebase/firestore";
// import { IoIosClose } from "react-icons/io";

// const EditPost = ({ id, isEditingPost, close }) => {
//   //   const { id, title, body } = post;
//   const [currentPost, setCurrentPost] = useState({
//     // id: post/.id,
//     title: post?.title,
//     body: post?.body,
//   });

//   const [post, setPost] = useState(null);

//   useEffect(() => {
//     const colRef = collection(dbase, "posts");
//     const postRef = doc(colRef, id);

//     onSnapshot(
//       postRef,
//       (doc) => {
//         if (doc.exists()) {
//           const postDetails = { ...doc.data(), id: doc.id };
//           setPost(postDetails);
//         } else {
//           console.log(`Post with ID ${id} does not exist.`);
//         }
//       },
//       (error) => {
//         console.error("Error fetching post:", error);
//       }
//     );
//   }, [id]);

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setCurrentPost((prevPost) => ({
//       ...prevPost,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     try {
//       // Get a reference to the document to be updated
//       const postRef = doc(dbase, "posts", currentPost.id);

//       // Update the document with the new title and body
//       await updateDoc(postRef, {
//         title: currentPost.title,
//         body: currentPost.body,
//       });

//       // Reset the form fields
//       setCurrentPost({
//         title: "",
//         body: "",
//       });

//       // Handle success (e.g., show success message, redirect)
//       console.log("Post updated successfully!");
//       close();
//     } catch (error) {
//       // Handle errors (e.g., show error message)
//       console.error("Error updating post:", error);
//     }
//   };

//   return (
//     <div
//       className={`w-full z-10 bg-tet rounded px-5 py-4 h-fit absolute top-0 left-0 ${
//         isEditingPost ? "" : "hidden "
//       }`}
//     >
//       <div className="close w-full flex justify-end">
//         <IoIosClose
//           onClick={close}
//           className="text-white w-12 h-12 button cursor-pointer"
//         />
//       </div>
//       <form
//         id="editPost"
//         className="postForm flex flex-col justify-start gap-5 w-full py-8"
//       >
//         <input
//           placeholder="Post Title"
//           name="title"
//           value={currentPost.title}
//           onChange={handleChange}
//           className=" bg-inherit border-b-2 border-slate-400 outline-none text-white uppercase"
//         />
//         <textarea
//           placeholder="Post body"
//           name="body"
//           onChange={handleChange}
//           value={currentPost.body}
//           className=" bg-inherit border-b-2 border-slate-400 outline-none text-white h-32"
//         />

//         <button
//           onClick={handleSubmit}
//           className="Btn button bg-secondary text-white text-left text-sm text-nowrap py-2 w-fit px-4 rounded-sm cursor-pointer my-3"
//         >
//           Save
//         </button>
//       </form>
//     </div>
//   );
// };

// export default EditPost;
