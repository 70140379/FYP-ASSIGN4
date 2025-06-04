import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import StudentFypForm from "../components/layouts/views/dashboard/StudentFypForm";
import AdminStatsCards from "../components/layouts/views/admin/AdminStatsCards";
import UserList from "../components/layouts/views/admin/UserLists";
import FacultyManagement from "../components/layouts/views/admin/FacultyManagement";
import IdeaReviewList from "../components/layouts/views/admin/IdeaReviewList";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ideas, setIdeas] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [supervisors, setSupervisors] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          setUser(currentUser);

          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserRole(docSnap.data().role);
          } else {
            setUserRole("student");
          }

          if (docSnap.exists() && docSnap.data().role === "student") {
            const q = query(
              collection(db, "fypIdeas"),
              where("userId", "==", currentUser.uid)
            );
            const querySnapshot = await getDocs(q);
            const ideasData = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            setIdeas(ideasData);
          }

          // Fetch supervisors for dropdown
          try {
            const qSupervisors = query(
              collection(db, "users"),
              where("role", "==", "faculty")
            );
            const snapshot = await getDocs(qSupervisors);
            const supList = snapshot.docs.map((doc) => ({
              id: doc.id,
              name: doc.data().name,
            }));
            setSupervisors(supList);
          } catch (err) {
            console.error("Error fetching supervisors:", err);
          }

          setLoading(false);
        } else {
          navigate("/login");
        }
      });
    };

    fetchData();
  }, [navigate]);

  const handleSaveEdit = async (ideaId) => {
    try {
      const ideaRef = doc(db, "fypIdeas", ideaId);
      await updateDoc(ideaRef, {
        title: editTitle,
        description: editDescription,
        status: "pending",
      });
      setEditingId(null);
      alert("Idea updated successfully.");
      window.location.reload();
    } catch (error) {
      console.error("Error updating idea:", error);
      alert("Failed to update idea.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-green-600 font-semibold text-xl">Loading...</p>
      </div>
    );

  return (
    <div className="p-6 max-w-4xl mx-auto font-sans text-gray-800 text-center">
      <h1 className="text-4xl font-bold mb-8 text-green-900">Dashboard</h1>

      {userRole === "admin" && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-green-800">Admin Panel</h2>
          <p className="mb-6 text-green-700">
            Dashboard overview: Total faculty, students assigned, ideas submitted, and slot availability.
          </p>
          <AdminStatsCards />
          <UserList />
          <FacultyManagement />
          <IdeaReviewList currentUser={user} userRole={userRole} />
        </section>
      )}

      {userRole === "faculty" && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-green-800">Faculty Dashboard</h2>
          <p className="mb-6 text-green-700">View your assigned students and update your profile.</p>
          <IdeaReviewList currentUser={user} userRole={userRole} />
        </section>
      )}

      {userRole === "student" && (
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-green-800">Student Dashboard</h2>
          {ideas.length === 0 ? (
            <>
              <p className="mb-6 text-green-700">Submit your FYP idea below.</p>
              <StudentFypForm userId={user.uid} supervisors={supervisors} />
            </>
          ) : (
            <>
              <h3 className="text-xl font-semibold mb-4 text-green-800">Your Submitted Ideas</h3>
              <ul className="list-none p-0">
                {ideas.map((idea) => {
                  const isEditing = editingId === idea.id;
                  return (
                    <li
                      key={idea.id}
                      className="mb-4 p-4 border border-green-200 rounded-lg bg-green-50 shadow-sm text-center"
                    >
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            className="w-full p-2 mb-3 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                          />
                          <textarea
                            className="w-full p-2 mb-3 border border-green-300 rounded h-28 resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                          />
                          <div className="flex justify-center space-x-3">
                            <button
                              onClick={() => handleSaveEdit(idea.id)}
                              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="mb-2">
                            <strong>Title:</strong> {idea.title || idea.projectTitle}
                          </p>
                          <p className="mb-2">
                            <strong>Description:</strong> {idea.description || idea.projectDescription}
                          </p>
                          <p className="mb-2">
                            <strong>Status:</strong> {idea.status || "Pending"}
                          </p>
                          {idea.revisionComment && (
                            <p className="mb-2 text-red-600">
                              <strong>Revision Comments:</strong> {idea.revisionComment}
                            </p>
                          )}
                          <button
                            onClick={() => {
                              setEditingId(idea.id);
                              setEditTitle(idea.title || idea.projectTitle);
                              setEditDescription(idea.description || idea.projectDescription);
                            }}
                            className="mt-2 bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition"
                          >
                            Update Idea
                          </button>
                        </>
                      )}
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </section>
      )}

      {!["admin", "faculty", "student"].includes(userRole) && (
        <p className="text-red-600 font-semibold">Your user role is not defined. Contact admin.</p>
      )}
    </div>
  );
}
