import {
  runTransaction,
  doc,
  increment,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { dbase } from "../firebase";

export const toggleUpvote = async (userId, postId) => {
  const postRef = doc(dbase, "posts", postId);
  const userRef = doc(dbase, "users", userId);

  try {
    let isUpvoted = false;

    await runTransaction(dbase, async (transaction) => {
      const postSnap = await transaction.get(postRef);
      const userSnap = await transaction.get(userRef);

      if (!postSnap.exists()) throw new Error("Post does not exist");
      if (!userSnap.exists()) throw new Error("User does not exist");

      const upvotedPosts = userSnap.data().upvotedPosts || [];
      isUpvoted = upvotedPosts.includes(postId);

      if (isUpvoted) {
        // User already upvoted - remove upvote
        transaction.update(postRef, { upvotes: increment(-1) });
        transaction.update(userRef, { upvotedPosts: arrayRemove(postId) });
      } else {
        // User hasn't upvoted - add upvote
        transaction.update(postRef, { upvotes: increment(1) });
        transaction.update(userRef, { upvotedPosts: arrayUnion(postId) });
      }
    });

    return { success: true, isUpvoted: !isUpvoted };
  } catch (error) {
    console.error("Upvote error:", error);
    return { success: false, error: error.message };
  }
};
