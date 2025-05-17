import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  increment,
} from "firebase/firestore";
import { dbase } from "../../firebase";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import SafeHTML from "../Posts/SafeHTML";
import { FiEdit2, FiTrash2, FiSave, FiX } from "react-icons/fi";

function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [comment, setComment] = useState("");
  const [editingPost, setEditingPost] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [editingCommentIndex, setEditingCommentIndex] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState("");

  const fetchPost = async () => {
    const docRef = doc(dbase, "blogs", id);
    const docSnap = await getDoc(docRef);
    return { id: docSnap.id, ...docSnap.data() };
  };

  const { data: blog, refetch } = useQuery({
    queryKey: ["blog", id],
    queryFn: fetchPost,
  });

  const isAuthorOrAdmin = (creator) =>
    user && (user.email === creator || user.email === "raniem57@gmail.com");

  const updatePost = useMutation({
    mutationFn: async () => {
      const postRef = doc(dbase, "blogs", id);
      await updateDoc(postRef, {
        title: editedTitle,
        content: editedContent,
      });
    },
    onSuccess: () => {
      setEditingPost(false);
      refetch();
    },
  });

  const deletePost = useMutation({
    mutationFn: async () => {
      const postRef = doc(dbase, "blogs", id);
      await deleteDoc(postRef);
    },
    onSuccess: () => {
      navigate("/blogs");
    },
  });

  const likeMutation = useMutation({
    mutationFn: async () => {
      const postRef = doc(dbase, "blogs", id);
      const docSnap = await getDoc(postRef);
      const post = docSnap.data();
      const userEmail = user.email;

      const updates = {};
      const alreadyLiked = post.likedBy?.includes(userEmail);
      const alreadyDisliked = post.dislikedBy?.includes(userEmail);

      if (alreadyLiked) {
        updates.likes = increment(-1);
        updates.likedBy = arrayRemove(userEmail);
      } else {
        updates.likes = increment(1);
        updates.likedBy = arrayUnion(userEmail);
        if (alreadyDisliked) {
          updates.dislikes = increment(-1);
          updates.dislikedBy = arrayRemove(userEmail);
        }
      }

      await updateDoc(postRef, updates);
    },
    onSuccess: refetch,
  });

  const dislikeMutation = useMutation({
    mutationFn: async () => {
      const postRef = doc(dbase, "blogs", id);
      const docSnap = await getDoc(postRef);
      const post = docSnap.data();
      const userEmail = user.email;

      const updates = {};
      const alreadyLiked = post.likedBy?.includes(userEmail);
      const alreadyDisliked = post.dislikedBy?.includes(userEmail);

      if (alreadyDisliked) {
        updates.dislikes = increment(-1);
        updates.dislikedBy = arrayRemove(userEmail);
      } else {
        updates.dislikes = increment(1);
        updates.dislikedBy = arrayUnion(userEmail);
        if (alreadyLiked) {
          updates.likes = increment(-1);
          updates.likedBy = arrayRemove(userEmail);
        }
      }

      await updateDoc(postRef, updates);
    },
    onSuccess: refetch,
  });

  const commentMutation = useMutation({
    mutationFn: async () => {
      const postRef = doc(dbase, "blogs", id);
      await updateDoc(postRef, {
        comments: arrayUnion({
          text: comment,
          author: user.email,
          date: new Date().toISOString(),
        }),
      });
    },
    onSuccess: () => {
      setComment("");
      refetch();
    },
  });

  const deleteComment = (commentObj) =>
    updateDoc(doc(dbase, "blogs", id), {
      comments: arrayRemove(commentObj),
    }).then(refetch);

  const updateComment = async (original, updatedText) => {
    const updated = { ...original, text: updatedText };
    const postRef = doc(dbase, "blogs", id);
    await updateDoc(postRef, {
      comments: arrayRemove(original),
    });
    await updateDoc(postRef, {
      comments: arrayUnion(updated),
    });
    setEditingCommentIndex(null);
    refetch();
  };

  if (!blog)
    return (
      <div className="text-center py-20">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-600"></div>
        <p className="mt-4 text-slate-600">Loading content...</p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {blog.image && (
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full rounded-md mb-6"
        />
      )}
      <div className="flex justify-between items-start mb-2">
        {editingPost ? (
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="text-3xl font-bold mb-2 w-full"
          />
        ) : (
          <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
        )}
        {isAuthorOrAdmin(blog.createdBy) && (
          <div className="flex gap-2 p-2">
            {editingPost ? (
              <>
                <button onClick={() => updatePost.mutate()}>
                  <FiSave className="text-green-600" />
                </button>
                <button onClick={() => setEditingPost(false)}>
                  <FiX className="text-gray-500" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setEditingPost(true);
                    setEditedTitle(blog.title);
                    setEditedContent(blog.content);
                  }}
                >
                  <FiEdit2 className="text-blue-600" />
                </button>
                <button onClick={() => deletePost.mutate()}>
                  <FiTrash2 className="text-red-600" />
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Posted on {new Date(blog.datePosted?.toDate?.()).toLocaleDateString()}
      </p>

      {editingPost ? (
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="w-full border rounded p-4 mb-6"
          rows="10"
        />
      ) : (
        <SafeHTML html={blog.content} className="text-slate-800 mb-6" />
      )}

      <div className="flex gap-4 mb-6 items-center">
        {user ? (
          <>
            <button
              onClick={() => likeMutation.mutate()}
              className="text-green-600 hover:underline"
            >
              👍 {blog.likes || 0}
            </button>
            <button
              onClick={() => dislikeMutation.mutate()}
              className="text-red-600 hover:underline"
            >
              👎 {blog.dislikes || 0}
            </button>
          </>
        ) : (
          <p className="text-sm text-slate-500 italic">
            Please log in to like or dislike this post.
          </p>
        )}
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Comments</h3>
        <ul className="space-y-2">
          {(blog.comments || []).map((c, i) => (
            <li key={i} className="border p-2 rounded">
              <div className="flex justify-between items-center">
                <p className="font-medium">{c.author}</p>
                {isAuthorOrAdmin(c.author) && (
                  <div className="flex gap-2">
                    {editingCommentIndex === i ? (
                      <>
                        <button
                          onClick={() => updateComment(c, editedCommentText)}
                        >
                          <FiSave className="text-green-600" />
                        </button>
                        <button onClick={() => setEditingCommentIndex(null)}>
                          <FiX className="text-gray-500" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingCommentIndex(i);
                            setEditedCommentText(c.text);
                          }}
                        >
                          <FiEdit2 className="text-blue-600" />
                        </button>
                        <button onClick={() => deleteComment(c)}>
                          <FiTrash2 className="text-red-600" />
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
              {editingCommentIndex === i ? (
                <textarea
                  value={editedCommentText}
                  onChange={(e) => setEditedCommentText(e.target.value)}
                  className="w-full border rounded mt-2"
                  rows="2"
                />
              ) : (
                <>
                  <p>{c.text}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(c.date).toLocaleString()}
                  </p>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>

      {user ? (
        <div className="mt-6">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="3"
            className="w-full border rounded p-4"
            placeholder="Write a comment..."
          ></textarea>
          <button
            onClick={() => commentMutation.mutate()}
            className="mt-2 bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-500"
            disabled={!comment.trim()}
          >
            Submit Comment
          </button>
        </div>
      ) : (
        <p className="text-slate-500 italic mt-4">
          Please log in to comment on this post.
        </p>
      )}
    </div>
  );
}

export default BlogDetails;
