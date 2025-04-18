import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  runTransaction,
  increment,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { dbase } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import SafeHTML from "./SafeHTML";

function PostDetails() {
  const { id } = useParams();
  const { user, userData } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");

  // Fetch post
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postDoc = await getDoc(doc(dbase, "posts", id));
        if (postDoc.exists()) {
          setPost({ id: postDoc.id, ...postDoc.data() });
        } else {
          setError("Post not found");
        }
      } catch (err) {
        setError("Failed to load post: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  // Fetch comments
  const commentsQuery = useQuery({
    queryKey: ["comments", id],
    queryFn: async () => {
      const q = query(
        collection(dbase, "posts", id, "comments"),
        orderBy("datePosted", "desc")
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    },
  });

  // Upvote/Unupvote mutation
  const upvoteMutation = useMutation({
    mutationFn: async ({ isUpvoting }) => {
      const postRef = doc(dbase, "posts", id);
      const userRef = doc(dbase, "users", user.uid);

      await runTransaction(dbase, async (transaction) => {
        const postSnap = await transaction.get(postRef);
        const userSnap = await transaction.get(userRef);
        if (!postSnap.exists()) throw new Error("Post does not exist");
        if (!userSnap.exists()) throw new Error("User does not exist");

        const upvotedPosts = userSnap.data().upvotedPosts || [];

        if (isUpvoting && !upvotedPosts.includes(id)) {
          transaction.update(postRef, { upvotes: increment(1) });
          transaction.update(userRef, { upvotedPosts: arrayUnion(id) });
        } else if (!isUpvoting && upvotedPosts.includes(id)) {
          transaction.update(postRef, { upvotes: increment(-1) });
          transaction.update(userRef, { upvotedPosts: arrayRemove(id) });
        }
      });
    },
    onSuccess: (_, { isUpvoting }) => {
      queryClient.invalidateQueries(["posts"]);
      queryClient.invalidateQueries(["userData", user.uid]);
      setPost((prev) => ({
        ...prev,
        upvotes: prev.upvotes
          ? prev.upvotes + (isUpvoting ? 1 : -1)
          : isUpvoting
          ? 1
          : 0,
      }));
      setError("");
    },
    onError: (err) => setError("Failed to update upvote: " + err.message),
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: async (content) => {
      if (!user) throw new Error("Please log in to comment");
      const commentRef = collection(dbase, "posts", id, "comments");
      await addDoc(commentRef, {
        content,
        userId: user.uid,
        createdBy: user.email || user.displayName || "Anonymous",
        datePosted: new Date(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", id]);
      setNewComment("");
      setError("");
    },
    onError: (err) => setError("Failed to add comment: " + err.message),
  });

  // Edit comment mutation
  const editCommentMutation = useMutation({
    mutationFn: async ({ commentId, content }) => {
      const commentRef = doc(dbase, "posts", id, "comments", commentId);
      await updateDoc(commentRef, { content, updatedAt: new Date() });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", id]);
      setEditingCommentId(null);
      setEditingCommentText("");
      setError("");
    },
    onError: (err) => setError("Failed to edit comment: " + err.message),
  });

  // Delete comment mutation
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId) => {
      const commentRef = doc(dbase, "posts", id, "comments", commentId);
      await deleteDoc(commentRef);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", id]);
      setError("");
    },
    onError: (err) => setError("Failed to delete comment: " + err.message),
  });

  const toggleUpvote = (isUpvoted) => {
    if (!user) {
      setError("Please log in to upvote");
      navigate("/login");
      return;
    }
    upvoteMutation.mutate({ isUpvoting: !isUpvoted });
  };

  const shareLink = () => {
    const url = `${window.location.origin}/posts/${id}`;
    navigator.clipboard.writeText(url).then(() => {
      alert("Link copied to clipboard!");
    });
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      setError("Comment cannot be empty");
      return;
    }
    addCommentMutation.mutate(newComment);
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditingCommentText(comment.content);
  };

  const handleSaveEdit = (e, commentId) => {
    e.preventDefault();
    if (!editingCommentText.trim()) {
      setError("Comment cannot be empty");
      return;
    }
    editCommentMutation.mutate({ commentId, content: editingCommentText });
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      deleteCommentMutation.mutate(commentId);
    }
  };

  if (loading) {
    return (
      <div className="text-center font-inter text-slate-600">Loading...</div>
    );
  }

  if (error && !post) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-lg font-inter max-w-3xl mx-auto mt-8">
        {error}
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center font-inter text-slate-600 mt-8">
        Post not found
      </div>
    );
  }

  const isUpvoted = userData?.upvotedPosts?.includes(id);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold font-poppins text-slate-800 mb-4">
        {post.title}
      </h1>
      <p className="text-sm text-slate-600 font-inter mb-4">
        By {post.createdBy} •{" "}
        {new Date(post.datePosted?.seconds * 1000).toLocaleDateString()}
      </p>
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover rounded-md mb-4"
        />
      )}
      <SafeHTML
        html={post.content}
        className="text-slate-800 font-inter mb-6"
      />
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={() => toggleUpvote(isUpvoted)}
          className="p-2 rounded-full bg-white shadow-md hover:bg-slate-100 flex items-center"
          title={isUpvoted ? "Unupvote" : "Upvote"}
          disabled={upvoteMutation.isLoading}
        >
          <svg
            className={`w-6 h-6 ${
              isUpvoted ? "text-teal-600 fill-teal-600" : "text-slate-600"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 15l7-7 7 7"
            />
          </svg>
          <span className="text-sm text-slate-600 ml-1">
            {post.upvotes || 0}
          </span>
        </button>
        <button
          onClick={shareLink}
          className="p-2 rounded-full bg-white shadow-md hover:bg-slate-100"
          title="Share"
        >
          <svg
            className="w-6 h-6 text-slate-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
        </button>
      </div>
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg font-inter mb-6">
          {error}
        </div>
      )}
      {/* Comments Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold font-poppins text-slate-800 mb-4">
          Comments
        </h2>
        {/* Add Comment Form */}
        {user ? (
          <form onSubmit={handleAddComment} className="mb-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-3 rounded-lg border border-slate-300 font-inter text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
              rows="4"
            />
            <button
              type="submit"
              disabled={addCommentMutation.isLoading}
              className={`mt-2 px-4 py-2 rounded-lg font-inter font-semibold ${
                addCommentMutation.isLoading
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : "bg-teal-600 text-white hover:bg-teal-500"
              } transition-colors`}
            >
              {addCommentMutation.isLoading ? "Posting..." : "Post Comment"}
            </button>
          </form>
        ) : (
          <p className="text-slate-600 font-inter mb-6">
            <Link to="/login" className="text-teal-600 hover:underline">
              Log in
            </Link>{" "}
            to post a comment.
          </p>
        )}
        {/* Comments List */}
        {commentsQuery.isLoading ? (
          <p className="text-slate-600 font-inter">Loading comments...</p>
        ) : commentsQuery.error ? (
          <p className="text-red-500 font-inter">
            Error loading comments: {commentsQuery.error.message}
          </p>
        ) : commentsQuery.data.length === 0 ? (
          <p className="text-slate-600 font-inter">No comments yet.</p>
        ) : (
          <div className="space-y-4">
            {commentsQuery.data.map((comment) => (
              <div
                key={comment.id}
                className="border-l-4 border-teal-600 pl-4 bg-slate-50 rounded-md p-4"
              >
                {editingCommentId === comment.id ? (
                  <form
                    onSubmit={(e) => handleSaveEdit(e, comment.id)}
                    className="mb-2"
                  >
                    <textarea
                      value={editingCommentText}
                      onChange={(e) => setEditingCommentText(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300 font-inter text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
                      rows="3"
                    />
                    <div className="flex space-x-2 mt-2">
                      <button
                        type="submit"
                        disabled={editCommentMutation.isLoading}
                        className={`px-3 py-1 rounded-lg font-inter font-semibold ${
                          editCommentMutation.isLoading
                            ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                            : "bg-teal-600 text-white hover:bg-teal-500"
                        } transition-colors`}
                      >
                        {editCommentMutation.isLoading ? "Saving..." : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingCommentId(null)}
                        className="px-3 py-1 rounded-lg font-inter font-semibold bg-slate-200 text-slate-600 hover:bg-slate-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <p className="text-slate-800 font-inter">
                      {comment.content}
                    </p>
                    <p className="text-sm text-slate-600 font-inter mt-1">
                      By {comment.createdBy} •{" "}
                      {new Date(
                        comment.datePosted?.seconds * 1000
                      ).toLocaleDateString()}
                      {comment.updatedAt && <span> (Edited)</span>}
                    </p>
                    {user && user.uid === comment.userId && (
                      <div className="flex space-x-2 mt-2">
                        <button
                          onClick={() => handleEditComment(comment)}
                          className="text-teal-600 font-inter text-sm hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-red-600 font-inter text-sm hover:underline"
                          disabled={deleteCommentMutation.isLoading}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PostDetails;
