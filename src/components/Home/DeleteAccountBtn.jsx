import { auth, dbase } from "../../Firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { deleteUser } from "firebase/auth";

const DeleteAccountButton = () => {
  const handleDeleteAccount = async () => {
    const user = auth.currentUser;

    if (user) {
      try {
        // Delete user document from Firestore
        const userDocRef = doc(dbase, "users", user.uid);
        await deleteDoc(userDocRef);

        // Delete user authentication record
        await deleteUser(user);

        alert("Your account has been deleted.");
      } catch (error) {
        console.error("Error deleting account: ", error);
        alert("Failed to delete account. Please try again.");
      }
    } else {
      alert("No user is currently signed in.");
    }
  };

  return <button onClick={handleDeleteAccount}>Delete Account</button>;
};

export default DeleteAccountButton;
