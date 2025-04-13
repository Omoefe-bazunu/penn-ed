// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { auth, dbase } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDoc = await getDoc(doc(dbase, "users", currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          // Check expiry (30 days)
          const isSubscribed =
            data.subscribed && data.subscriptionDate
              ? new Date(data.subscriptionDate) >
                new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
              : false;
          setUserData({
            uid: currentUser.uid,
            ...data,
            subscribed: isSubscribed,
          });
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, userData, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
