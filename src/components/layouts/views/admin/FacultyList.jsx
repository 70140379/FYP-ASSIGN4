import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig";

const FacultyList = forwardRef(({ onEdit }, ref) => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFaculty = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "users"), where("role", "==", "faculty"));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFaculty(list);
    } catch (err) {
      console.error("Failed to fetch faculty:", err);
    }
    setLoading(false);
  };

  useImperativeHandle(ref, () => ({
    fetchFaculty,
  }));

  useEffect(() => {
    fetchFaculty();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this faculty?")) return;

    try {
      await deleteDoc(doc(db, "users", id));
      setFaculty(faculty.filter(f => f.id !== id));
    } catch (err) {
      console.error("Failed to delete faculty:", err);
      alert("Failed to delete faculty.");
    }
  };

  if (loading)
    return (
      <p className="text-center text-green-700 font-semibold my-6">Loading faculty...</p>
    );
  if (faculty.length === 0)
    return (
      <p className="text-center text-gray-500 font-medium my-6">No faculty found.</p>
    );

  return (
    <div className="overflow-x-auto rounded-lg shadow-md border border-green-300">
      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-green-100">
          <tr>
            {["Name", "Email", "Domain", "Slots", "Office Hours", "Actions"].map((header) => (
              <th
                key={header}
                className="border border-green-300 px-4 py-3 text-left text-green-800 font-semibold select-none"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {faculty.map(f => (
            <tr
              key={f.id}
              className="hover:bg-green-50 transition-colors cursor-default"
            >
              <td className="border border-green-300 px-4 py-3">{f.name || "N/A"}</td>
              <td className="border border-green-300 px-4 py-3">{f.email || "N/A"}</td>
              <td className="border border-green-300 px-4 py-3">{f.domain || "N/A"}</td>
              <td className="border border-green-300 px-4 py-3 text-center">{f.availableSlots || 0}</td>
              <td className="border border-green-300 px-4 py-3">{f.officeHours || "N/A"}</td>
              <td className="border border-green-300 px-4 py-3 space-x-3 whitespace-nowrap">
                <button
                  onClick={() => onEdit(f)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(f.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default FacultyList;
