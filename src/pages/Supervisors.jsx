import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";

export default function Supervisors() {
  const [facultyList, setFacultyList] = useState([]);
  const [filteredFaculty, setFilteredFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const q = query(collection(db, "users"), where("role", "==", "faculty"));
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setFacultyList(list);
        setFilteredFaculty(list);
      } catch (err) {
        console.error("Failed to fetch faculty:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFaculty();
  }, []);

  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = facultyList.filter(
      (f) =>
        (f.name && f.name.toLowerCase().includes(lowerSearch)) ||
        (f.domain && f.domain.toLowerCase().includes(lowerSearch))
    );
    setFilteredFaculty(filtered);
  }, [searchTerm, facultyList]);

  const handleSelectSupervisor = (facultyId) => {
    const user = auth.currentUser;

    if (!user) {
      navigate("/login");
      return;
    }

    navigate("/dashboard");
  };

  if (loading)
    return (
      <div className="flex justify-center mt-20">
        <div className="loader border-4 border-green-400 border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
        <span className="ml-3 text-green-700 font-semibold">Loading supervisors...</span>
      </div>
    );

  if (facultyList.length === 0)
    return (
      <p className="text-center text-gray-600 mt-20 font-medium">
        No supervisors found.
      </p>
    );

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-green-800">
        Our Supervisors
      </h1>

      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search by name or domain"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-xl p-3 rounded-lg border-2 border-green-300 focus:border-green-600 focus:ring-2 focus:ring-green-400 transition outline-none"
          aria-label="Search supervisors by name or domain"
        />
      </div>

      {filteredFaculty.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No supervisors match your search.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredFaculty.map((faculty) => (
            <div
              key={faculty.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 flex flex-col items-center text-center"
              aria-label={`Supervisor profile card for ${faculty.name}`}
            >
              <img
                src={
                  faculty.photoURL ||
                  "https://via.placeholder.com/150?text=No+Image"
                }
                alt={faculty.name || "Supervisor"}
                className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-green-100"
              />
              <h2 className="text-xl font-semibold text-green-900">{faculty.name || "Unnamed"}</h2>
              <p className="text-green-700 mt-1">{faculty.domain || "No domain info"}</p>
              <p className="text-green-700 mt-2">
                <strong>Office Hours:</strong> {faculty.officeHours || "Not set"}
              </p>
              <p className="text-green-700">
                <strong>Available Slots:</strong> {faculty.availableSlots ?? "N/A"}
              </p>
              <button
                onClick={() => handleSelectSupervisor(faculty.id)}
                className="mt-6 bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-400"
                aria-label={`Select supervisor ${faculty.name}`}
              >
                {auth.currentUser ? "Select Supervisor" : "Login to Select"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
