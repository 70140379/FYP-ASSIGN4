import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig";

export default function IdeaReviewList({ currentUser, userRole }) {
  const [ideas, setIdeas] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [statusUpdates, setStatusUpdates] = useState({});
  const [commentUpdates, setCommentUpdates] = useState({});

  const fetchFaculty = async () => {
    try {
      const q = query(collection(db, "users"), where("role", "==", "faculty"));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setFacultyList(list);
    } catch (err) {
      console.error("Failed to fetch faculty", err);
    }
  };

  const fetchIdeas = async () => {
    setLoading(true);
    try {
      let q;
      if (userRole === "faculty") {
        q = query(
          collection(db, "fypIdeas"),
          where("assignedSupervisorId", "==", currentUser.uid)
        );
      } else if (userRole === "admin") {
        q = collection(db, "fypIdeas");
      } else {
        setIdeas([]);
        setLoading(false);
        return;
      }

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setIdeas(data);
    } catch (err) {
      console.error("Failed to fetch ideas:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  useEffect(() => {
    if (currentUser && userRole) {
      fetchIdeas();
    }
  }, [currentUser, userRole]);

  const updateFacultySlots = async (facultyId, increment) => {
    const facultyRef = doc(db, "users", facultyId);
    const facultySnap = await getDoc(facultyRef);
    if (facultySnap.exists()) {
      const currentSlots = facultySnap.data().availableSlots || 0;
      await updateDoc(facultyRef, {
        availableSlots: currentSlots + increment,
      });
    }
  };

  const handleAssignFaculty = async (idea, newFacultyId) => {
    setUpdatingId(idea.id);
    try {
      const oldFacultyId = idea.assignedSupervisorId;

      const ideaRef = doc(db, "fypIdeas", idea.id);
      await updateDoc(ideaRef, {
        assignedSupervisorId: newFacultyId || null,
      });

      if (oldFacultyId && oldFacultyId !== newFacultyId) {
        await updateFacultySlots(oldFacultyId, +1);
      }
      if (newFacultyId && oldFacultyId !== newFacultyId) {
        await updateFacultySlots(newFacultyId, -1);
      }

      alert("Faculty assigned successfully.");

      await fetchIdeas();
      await fetchFaculty();
    } catch (err) {
      console.error("Failed to assign faculty:", err);
      alert("Failed to assign faculty.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setStatusUpdates((prev) => ({ ...prev, [id]: newStatus }));
  };

  const handleCommentChange = (id, newComment) => {
    setCommentUpdates((prev) => ({ ...prev, [id]: newComment }));
  };

  const handleSave = async (id) => {
    setUpdatingId(id);
    try {
      const ideaRef = doc(db, "fypIdeas", id);
      await updateDoc(ideaRef, {
        status: statusUpdates[id] || ideas.find((idea) => idea.id === id)?.status,
        revisionComment: commentUpdates[id] || "",
      });
      alert("Idea updated successfully");

      setStatusUpdates((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      setCommentUpdates((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    } catch (err) {
      console.error("Failed to update idea:", err);
      alert("Failed to update idea");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading)
    return (
      <p className="text-center text-green-700 font-semibold my-6">Loading ideas...</p>
    );

  if (ideas.length === 0)
    return (
      <p className="text-center text-gray-500 font-medium my-6">No ideas to review.</p>
    );

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-green-800">FYP Idea Review</h2>
      <div className="overflow-x-auto rounded-lg border border-green-300 shadow-md">
        <table className="min-w-full border-collapse">
          <thead className="bg-green-100">
            <tr>
              {[
                "Title",
                "Description",
                "Status",
                "Revision Comment",
                "Assign Faculty",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  className="border border-green-300 px-3 py-2 text-left text-green-800 font-semibold select-none"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ideas.map((idea) => (
              <tr
                key={idea.id}
                className="hover:bg-green-50 transition-colors"
              >
                <td className="border border-green-300 px-3 py-2 align-top max-w-xs break-words">{idea.title || "N/A"}</td>
                <td className="border border-green-300 px-3 py-2 align-top max-w-xs break-words">{idea.description || "N/A"}</td>
                <td className="border border-green-300 px-3 py-2 align-top">
                  <select
                    value={statusUpdates[idea.id] || idea.status || "pending"}
                    onChange={(e) => handleStatusChange(idea.id, e.target.value)}
                    className="border border-green-400 rounded px-2 py-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                    <option value="revision">Revision Required</option>
                  </select>
                </td>
                <td className="border border-green-300 px-3 py-2 align-top">
                  <input
                    type="text"
                    placeholder="Add revision comment"
                    value={commentUpdates[idea.id] || idea.revisionComment || ""}
                    onChange={(e) => handleCommentChange(idea.id, e.target.value)}
                    className="border border-green-400 rounded px-2 py-1 w-full"
                  />
                </td>
                <td className="border border-green-300 px-3 py-2 align-top">
                  {userRole === "admin" ? (
                    <select
                      value={idea.assignedSupervisorId || ""}
                      onChange={(e) => handleAssignFaculty(idea, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="">Unassigned</option>
                      {facultyList
                        .filter(
                          (f) =>
                            (f.availableSlots || 0) > 0 ||
                            f.id === idea.assignedSupervisorId
                        )
                        .map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.name} (Slots: {f.availableSlots})
                          </option>
                        ))}
                    </select>
                  ) : (
                    <span>
                      {facultyList.find((f) => f.id === idea.assignedSupervisorId)
                        ?.name || "Unassigned"}
                    </span>
                  )}
                </td>
                <td className="border border-green-300 px-3 py-2 align-top whitespace-nowrap">
                  <button
                    disabled={updatingId === idea.id}
                    onClick={() => handleSave(idea.id)}
                    className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 disabled:opacity-50 transition"
                  >
                    {updatingId === idea.id ? "Saving..." : "Save"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
