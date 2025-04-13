// src/pages/AdminDashboard/Index.jsx
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  deleteDoc,
} from "firebase/firestore";
import { dbase } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import CreateCompetitionForm from "../../components/forms/createCompetitionForm";
import CreateJobForm from "../../components/forms/CreateJobForm";
import CreateCourseForm from "../../components/forms/CreateCourseForm";
import UpdatePostForm from "../../components/forms/UpdatePostForms";
import UpdateCompetitionForm from "../../components/forms/UpdateCompetitionForm";
import UpdateCourseForm from "../../components/forms/UpdateCourseForm";
import UpdateJobForm from "../../components/forms/UpdateJobForm";

function AdminDashboard() {
  const { user, userData, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCompetitionFormOpen, setIsCompetitionFormOpen] = useState(false);
  const [isJobFormOpen, setIsJobFormOpen] = useState(false);
  const [isCourseFormOpen, setIsCourseFormOpen] = useState(false);
  const [updateItem, setUpdateItem] = useState(null);

  // Modal controls
  const openCompetitionForm = () => setIsCompetitionFormOpen(true);
  const closeCompetitionForm = () => setIsCompetitionFormOpen(false);
  const openJobForm = () => setIsJobFormOpen(true);
  const closeJobForm = () => setIsJobFormOpen(false);
  const openCourseForm = () => setIsCourseFormOpen(true);
  const closeCourseForm = () => setIsCourseFormOpen(false);
  const openUpdateForm = (item) => setUpdateItem(item);
  const closeUpdateForm = () => setUpdateItem(null);

  // Fetch pending receipts
  const fetchPendingReceipts = async () => {
    const querySnapshot = await getDocs(collection(dbase, "users"));
    return querySnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((user) => user.pendingReceipt);
  };

  const {
    data: usersWithReceipts = [],
    isLoading: receiptsLoading,
    error: receiptsError,
    refetch: refetchReceipts,
  } = useQuery({
    queryKey: ["pendingReceipts"],
    queryFn: fetchPendingReceipts,
  });

  // Search function
  const fetchSearchResults = async (query) => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    const collections = ["posts", "jobs", "courses", "competitions"];
    const results = [];

    for (const coll of collections) {
      const snapshot = await getDocs(collection(dbase, coll));
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (data.title?.toLowerCase().includes(lowerQuery)) {
          results.push({
            id: doc.id,
            type: coll,
            title: data.title,
            createdBy: data.createdBy,
            image: data.image,
          });
        }
      });
    }

    return results;
  };

  const {
    data: searchResults = [],
    isLoading: searchLoading,
    error: searchError,
    refetch: refetchSearch,
  } = useQuery({
    queryKey: ["search", searchQuery],
    queryFn: () => fetchSearchResults(searchQuery),
    enabled: !!searchQuery.trim(),
    staleTime: 1000 * 60, // Cache for 1 minute
  });

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery.trim()) {
        refetchSearch();
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery, refetchSearch]);

  const handleApprove = async (userId, receiptUrl, timestamp) => {
    try {
      await updateDoc(doc(dbase, "users", userId), {
        subscribed: true,
        subscriptionDate: timestamp,
        pendingReceipt: null,
        subscriptions: arrayUnion({
          receiptUrl,
          approved: true,
          date: timestamp,
        }),
      });
      alert("Subscription approved!");
      refetchReceipts();
    } catch (err) {
      setError("Failed to approve: " + err.message);
    }
  };

  const handleReject = async (userId, receiptUrl, timestamp) => {
    try {
      await updateDoc(doc(dbase, "users", userId), {
        pendingReceipt: null,
        subscriptions: arrayUnion({
          receiptUrl,
          approved: false,
          date: timestamp,
        }),
      });
      alert("Receipt rejected.");
      refetchReceipts();
    } catch (err) {
      setError("Failed to reject: " + err.message);
    }
  };

  const handleDelete = async (item) => {
    if (window.confirm(`Are you sure you want to delete ${item.title}?`)) {
      try {
        if (item.image) {
          const imageRef = ref(storage, item.image);
          await deleteObject(imageRef).catch(() => {});
        }
        await deleteDoc(doc(dbase, item.type, item.id));
        alert(`${item.type} deleted successfully!`);
        refetchSearch();
      } catch (err) {
        setError(`Failed to delete ${item.type}: ` + err.message);
      }
    }
  };

  if (authLoading) return <div className="text-center py-10">Loading...</div>;
  if (!user || userData?.email !== "raniem57@gmail.com") {
    return <Navigate to="/" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold font-poppins text-slate-800 mb-6">
        Admin Dashboard
      </h1>

      {/* Creation Buttons */}
      <div className="mb-6 flex flex-wrap gap-4">
        <button
          onClick={openCompetitionForm}
          className="bg-teal-600 text-white font-inter font-semibold py-2 px-4 rounded-lg hover:bg-teal-500 transition-colors"
        >
          Create Competition
        </button>
        <button
          onClick={openJobForm}
          className="bg-teal-600 text-white font-inter font-semibold py-2 px-4 rounded-lg hover:bg-teal-500 transition-colors"
        >
          Create Job
        </button>
        <button
          onClick={openCourseForm}
          className="bg-teal-600 text-white font-inter font-semibold py-2 px-4 rounded-lg hover:bg-teal-500 transition-colors"
        >
          Create Course
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold font-poppins text-slate-800 mb-2">
          Search Content
        </h2>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search posts, jobs, courses, competitions..."
          className="w-full p-2 border border-slate-300 rounded-md font-inter text-slate-800 focus:border-teal-600 focus:ring focus:ring-teal-200"
        />
      </div>

      {/* Search Results */}
      {error && <p className="text-red-500 font-inter mb-4">{error}</p>}
      {searchQuery && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold font-poppins text-slate-800 mb-4">
            Search Results
          </h2>
          {searchLoading ? (
            <div className="text-center py-10">Loading...</div>
          ) : searchError ? (
            <p className="text-red-500 font-inter">{searchError.message}</p>
          ) : searchResults.length === 0 ? (
            <p className="text-slate-600 font-inter">No results found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-md">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="p-4 text-left font-inter text-slate-600">
                      Type
                    </th>
                    <th className="p-4 text-left font-inter text-slate-600">
                      Title
                    </th>
                    <th className="p-4 text-left font-inter text-slate-600">
                      Created By
                    </th>
                    <th className="p-4 text-left font-inter text-slate-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.map((item) => (
                    <tr key={`${item.type}-${item.id}`} className="border-b">
                      <td className="p-4 text-slate-800 font-inter capitalize">
                        {item.type}
                      </td>
                      <td className="p-4 text-slate-800 font-inter">
                        {item.title}
                      </td>
                      <td className="p-4 text-slate-800 font-inter">
                        {item.createdBy}
                      </td>
                      <td className="p-4 flex space-x-2">
                        <button
                          onClick={() => openUpdateForm(item)}
                          className="text-teal-600 hover:text-teal-500"
                          title="Update"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="text-red-600 hover:text-red-500"
                          title="Delete"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4M9 7v12m6-12v12"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Pending Receipts */}
      <h2 className="text-xl font-semibold font-poppins text-slate-800 mb-4">
        Pending Receipt Approvals
      </h2>
      {receiptsLoading ? (
        <div className="text-center py-10">Loading...</div>
      ) : receiptsError ? (
        <div className="text-center py-10 text-red-500">
          {receiptsError.message}
        </div>
      ) : usersWithReceipts.length === 0 ? (
        <p className="text-slate-600 font-inter">No pending receipts.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-slate-100">
                <th className="p-4 text-left font-inter text-slate-600">
                  User
                </th>
                <th className="p-4 text-left font-inter text-slate-600">
                  Email
                </th>
                <th className="p-4 text-left font-inter text-slate-600">
                  Receipt
                </th>
                <th className="p-4 text-left font-inter text-slate-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {usersWithReceipts.map((u) => (
                <tr key={u.id} className="border-b">
                  <td className="p-4 text-slate-800 font-inter">{u.name}</td>
                  <td className="p-4 text-slate-800 font-inter">{u.email}</td>
                  <td className="p-4">
                    <a
                      href={u.pendingReceipt}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 font-inter hover:underline"
                    >
                      View Receipt
                    </a>
                  </td>
                  <td className="p-4 flex space-x-2">
                    <button
                      onClick={() =>
                        handleApprove(
                          u.id,
                          u.pendingReceipt,
                          new Date().toISOString()
                        )
                      }
                      className="bg-teal-600 text-white font-inter font-semibold py-1 px-3 rounded-lg hover:bg-teal-500 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() =>
                        handleReject(
                          u.id,
                          u.pendingReceipt,
                          new Date().toISOString()
                        )
                      }
                      className="bg-red-600 text-white font-inter font-semibold py-1 px-3 rounded-lg hover:bg-red-500 transition-colors"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <CreateCompetitionForm
        isOpen={isCompetitionFormOpen}
        onClose={closeCompetitionForm}
      />
      <CreateJobForm isOpen={isJobFormOpen} onClose={closeJobForm} />
      <CreateCourseForm isOpen={isCourseFormOpen} onClose={closeCourseForm} />
      {updateItem?.type === "posts" && (
        <UpdatePostForm
          isOpen={!!updateItem}
          onClose={closeUpdateForm}
          post={updateItem}
        />
      )}
      {updateItem?.type === "jobs" && (
        <UpdateJobForm
          isOpen={!!updateItem}
          onClose={closeUpdateForm}
          job={updateItem}
        />
      )}
      {updateItem?.type === "courses" && (
        <UpdateCourseForm
          isOpen={!!updateItem}
          onClose={closeUpdateForm}
          course={updateItem}
        />
      )}
      {updateItem?.type === "competitions" && (
        <UpdateCompetitionForm
          isOpen={!!updateItem}
          onClose={closeUpdateForm}
          competition={updateItem}
        />
      )}
    </div>
  );
}

export default AdminDashboard;
