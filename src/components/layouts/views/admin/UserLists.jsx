import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const usersData = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch users", err);
        setError("Failed to load users.");
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleRoleChange = (userId, newRole) => {
    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, role: newRole } : u))
    );
  };

  const handleSave = async (userId) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    setUpdatingUserId(userId);
    try {
      await updateDoc(doc(db, "users", userId), { role: user.role });
      alert(`Role updated to "${user.role}" successfully.`);
    } catch (err) {
      console.error("Error updating user role:", err);
      alert("Failed to update role.");
    } finally {
      setUpdatingUserId(null);
    }
  };

  if (loading)
    return (
      <p className="text-center text-green-700 font-semibold my-6">Loading users...</p>
    );
  if (error)
    return (
      <p className="text-center text-red-600 font-semibold my-6">{error}</p>
    );

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-green-800">User Management</h2>
      <div className="overflow-x-auto rounded-lg border border-green-300 shadow-md">
        <table className="min-w-full border-collapse">
          <thead className="bg-green-100">
            <tr>
              {["Name", "Email", "Role", "Action"].map((header) => (
                <th
                  key={header}
                  className="border border-green-300 px-6 py-3 text-left text-green-800 font-semibold select-none"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr
                key={user.id}
                className="hover:bg-green-50 transition-colors"
              >
                <td className="border border-green-300 px-6 py-3">{user.name || "N/A"}</td>
                <td className="border border-green-300 px-6 py-3">{user.email || "N/A"}</td>
                <td className="border border-green-300 px-6 py-3">
                  <select
                    value={user.role}
                    onChange={e => handleRoleChange(user.id, e.target.value)}
                    className="border border-green-400 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-400"
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="border border-green-300 px-6 py-3 whitespace-nowrap">
                  <button
                    disabled={updatingUserId === user.id}
                    onClick={() => handleSave(user.id)}
                    className="bg-green-600 text-white px-5 py-1 rounded hover:bg-green-700 disabled:opacity-50 transition focus:outline-none focus:ring-2 focus:ring-green-400"
                  >
                    {updatingUserId === user.id ? "Saving..." : "Save"}
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
