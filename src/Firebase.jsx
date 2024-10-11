import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBy-ctZTMEP9rrhwf8UpRC1WQizXJfnEl4",
  authDomain: "penned-aae02.firebaseapp.com",
  projectId: "penned-aae02",
  storageBucket: "penned-aae02.appspot.com",
  messagingSenderId: "161596346192",
  appId: "1:161596346192:web:c390e61e488ed9497ba655",
  measurementId: "G-XJS35J5JQS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const dbase = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { dbase, storage, auth, analytics, app as default };
