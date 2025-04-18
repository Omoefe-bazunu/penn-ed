import { createContext, useContext, useEffect, useState } from "react";
import { auth, dbase } from "../firebase";
import {
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification as firebaseSendEmailVerification,
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDoc = await getDoc(doc(dbase, "users", currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          const isSubscribed =
            data.subscribed && data.subscriptionDate
              ? new Date(data.subscriptionDate) >
                new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
              : false;
          setUserData({
            uid: currentUser.uid,
            ...data,
            subscribed: isSubscribed,
            emailVerified: currentUser.emailVerified,
          });
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const checkEmailExists = async (email) => {
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      return methods.length > 0;
    } catch (error) {
      console.error("Error checking email:", error);
      return false;
    }
  };

  const signup = async (email, password, name) => {
    try {
      setLoading(true);
      setAuthError(null);

      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        throw new Error("auth/email-already-in-use");
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const newUser = userCredential.user;

      try {
        await Promise.race([
          firebaseSendEmailVerification(newUser),
          new Promise((_, reject) =>
            setTimeout(
              () => reject(new Error("Verification email timeout")),
              10000
            )
          ),
        ]);
      } catch (verificationError) {
        console.error("Verification email error:", verificationError);
      }

      await updateProfile(newUser, {
        displayName: name || newUser.email.split("@")[0],
      });

      const userData = {
        name: name || newUser.email.split("@")[0],
        email: newUser.email,
        emailVerified: false,
        profilePicture: null,
        bio: "",
        contactInfo: { phone: "", address: "" },
        socialLinks: { twitter: "", linkedin: "", instagram: "" },
        comments: [],
        posts: [],
        series: [],
        chats: [],
        community: [],
        upvotedPosts: [],
        pendingReceipt: null,
        subscriptions: [],
        subscribed: false,
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(dbase, "users", newUser.uid), userData);

      return {
        success: true,
        user: newUser,
        message: "Account created! Please check your email for verification.",
      };
    } catch (error) {
      let errorMessage = "Signup failed. Please try again.";

      switch (error.code || error.message) {
        case "auth/email-already-in-use":
          errorMessage = "Email already in use.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many attempts. Please try again later.";
          break;
        case "auth/weak-password":
          errorMessage = "Password should be at least 6 characters.";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address.";
          break;
        default:
          errorMessage = error.message || errorMessage;
      }

      setAuthError(errorMessage);
      return {
        success: false,
        error: errorMessage,
        code: error.code,
      };
    } finally {
      setLoading(false);
    }
  };

  const sendEmailVerification = async () => {
    try {
      if (!auth.currentUser) throw new Error("No user logged in");
      await firebaseSendEmailVerification(auth.currentUser);
      return { success: true, message: "Verification email sent." };
    } catch (error) {
      let errorMessage = "Failed to send verification email.";
      if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many attempts. Please try again later.";
      }
      return { success: false, error: errorMessage };
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setAuthError(null);

      // Log inputs for debugging
      console.log("Login attempt with:", {
        email,
        passwordLength: password.length,
      });

      // Validate inputs
      if (
        !email ||
        typeof email !== "string" ||
        !password ||
        typeof password !== "string"
      ) {
        throw new Error("auth/invalid-arguments");
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (!userCredential.user.emailVerified) {
        await signOut(auth);
        throw new Error("auth/email-not-verified");
      }

      return { success: true };
    } catch (error) {
      console.error("Login error details:", {
        code: error.code,
        message: error.message,
        stack: error.stack,
      });

      let errorMessage = "Login failed. Please try again.";
      let errorCode = error.code;

      switch (error.code || error.message) {
        case "auth/email-not-verified":
          errorMessage = "Email not verified. Please check your inbox.";
          break;
        case "auth/user-not-found":
        case "auth/wrong-password":
          errorMessage = "Invalid email or password.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many attempts. Please try again later.";
          break;
        case "auth/user-disabled":
          errorMessage = "Account disabled. Please contact support.";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address.";
          break;
        case "auth/invalid-credential":
          errorMessage =
            "Invalid credentials. Please check your email and password.";
          break;
        case "auth/invalid-arguments":
          errorMessage = "Invalid email or password format.";
          break;
        default:
          errorMessage = error.message || errorMessage;
          errorCode = errorCode || "auth/unknown-error";
      }

      setAuthError(errorMessage);
      return {
        success: false,
        error: errorMessage,
        code: errorCode,
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAuthError(null);
    return signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        signup,
        login,
        logout,
        loading,
        authError,
        sendEmailVerification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
