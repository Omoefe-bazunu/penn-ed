import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { dbase } from "../../firebase";
import { Link, useNavigate } from "react-router-dom";
import SubscriptionModal from "../../components/subscriptionModal";
import PostFormModal from "../../components/forms/PostFormModal";

function Dashboard() {
  const { user, userData, loading } = useAuth();
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);
  const navigate = useNavigate();

  // Handle navigation in useEffect to prevent render-phase updates
  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login", { replace: true });
      } else if (user && !user.emailVerified) {
        navigate("/verify-email", { replace: true });
      }
    }
  }, [user, loading, navigate]);

  const openSubscriptionModal = () => setIsSubscriptionOpen(true);
  const closeSubscriptionModal = () => setIsSubscriptionOpen(false);
  const openPostForm = () => setIsPostFormOpen(true);
  const closePostForm = () => setIsPostFormOpen(false);

  const handleCancelSubscription = async () => {
    if (!user) return;
    try {
      await updateDoc(doc(dbase, "users", user.uid), {
        subscribed: false,
        subscriptionDate: null,
      });
      alert("Subscription cancelled.");
    } catch (err) {
      alert("Error cancelling subscription: " + err.message);
    }
  };

  const getSubscriptionStatus = () => {
    if (userData?.pendingReceipt) return "Pending Approval";
    if (userData?.subscribed) return "Active";
    return "Not Subscribed";
  };

  // Show loading state while checking auth status
  if (loading) return <div className="text-center py-10">Loading...</div>;

  // Return null if not authenticated (navigation will handle redirect)
  if (!user || !user.emailVerified) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold font-poppins text-slate-800 mb-6">
        Dashboard
      </h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold font-poppins text-slate-800 mb-4">
          Welcome, {userData?.name || user?.email || "User"}
        </h2>

        <div className="mb-4">
          <p className="text-slate-600 font-inter">
            Subscription Status:{" "}
            <span
              className={
                userData?.subscribed
                  ? "text-teal-600"
                  : userData?.pendingReceipt
                  ? "text-yellow-500"
                  : "text-red-500"
              }
            >
              {getSubscriptionStatus()}
            </span>
          </p>
          {!userData?.subscribed && !userData?.pendingReceipt && (
            <>
              <button
                onClick={openSubscriptionModal}
                className="mt-2 bg-teal-600 text-white font-inter font-semibold py-2 px-4 rounded-lg hover:bg-teal-500 transition-colors"
              >
                Subscribe
              </button>
              <p className="text-slate-600 font-inter text-sm mt-2">
                Subscribe to access exclusive courses and participate in writing
                competitions.
              </p>
            </>
          )}
          {userData?.subscribed && (
            <button
              onClick={handleCancelSubscription}
              className="mt-2 bg-red-600 text-white font-inter font-semibold py-2 px-4 rounded-lg hover:bg-red-500 transition-colors"
            >
              Cancel Subscription
            </button>
          )}
          {userData?.pendingReceipt && (
            <p className="text-slate-600 font-inter text-sm mt-2">
              Your receipt is under review. You will be notified once approved.
            </p>
          )}
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold font-poppins text-slate-800 mb-4">
            Your Dashboard
          </h3>
          <p className="text-slate-600 font-inter mb-4">
            Manage your content and explore platform features:
          </p>
          <div className="mb-6">
            <button
              onClick={openPostForm}
              className="bg-teal-600 text-white font-inter font-semibold py-2 px-4 rounded-lg hover:bg-teal-500 transition-colors"
            >
              Create Post
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to="/dashboard/portfolio"
              className="bg-slate-100 rounded-lg shadow-md p-4 hover:bg-slate-200 transition-colors"
            >
              <h4 className="text-teal-600 font-poppins font-semibold text-lg">
                View Portfolio
              </h4>
              <p className="text-slate-600 font-inter text-sm">
                See your posts and series.
              </p>
            </Link>
            <Link
              to="/dashboard/settings"
              className="bg-slate-100 rounded-lg shadow-md p-4 hover:bg-slate-200 transition-colors"
            >
              <h4 className="text-teal-600 font-poppins font-semibold text-lg">
                Account Settings
              </h4>
              <p className="text-slate-600 font-inter text-sm">
                Update your profile information.
              </p>
            </Link>
            <Link
              to="/posts"
              className="bg-slate-100 rounded-lg hidden shadow-md p-4 hover:bg-slate-200 transition-colors"
            >
              <h4 className="text-teal-600 font-poppins font-semibold text-lg">
                Manage Posts
              </h4>
              <p className="text-slate-600 font-inter text-sm">
                Edit or delete your posts.
              </p>
            </Link>
          </div>
        </div>
      </div>
      <SubscriptionModal
        isOpen={isSubscriptionOpen}
        onClose={closeSubscriptionModal}
      />
      <PostFormModal isOpen={isPostFormOpen} onClose={closePostForm} />
    </div>
  );
}

export default Dashboard;
