import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Form fields state
  const [name, setName] = useState("");
  const [availableSlots, setAvailableSlots] = useState("");
  const [officeHours, setOfficeHours] = useState("");
  const [domain, setDomain] = useState("");

  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate("/login");
        return;
      }

      try {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData(data);
          setUserRole(data.role || "");
          setName(data.name || "");
          setAvailableSlots(data.availableSlots !== undefined ? data.availableSlots : "");
          setOfficeHours(data.officeHours || "");
          setDomain(data.domain || "");
        } else {
          // No user doc found - maybe redirect or create empty user profile here
          setUserRole("");
        }
      } catch (err) {
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const docRef = doc(db, "users", auth.currentUser.uid);

      const updateData = {
        name: name.trim(),
      };

      // Only faculty can update slots, office hours, domain
      if (userRole === "faculty") {
        updateData.availableSlots = Number(availableSlots);
        updateData.officeHours = officeHours.trim();
        updateData.domain = domain.trim();
      }

      await updateDoc(docRef, updateData);
      alert("Profile updated successfully");
    } catch (err) {
      setError("Failed to update profile");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h2 className="text-2xl mb-6 font-semibold">Your Profile</h2>

      {error && <p className="mb-4 text-red-600">{error}</p>}

      <form onSubmit={handleSave} className="flex flex-col gap-4">
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border p-2 rounded w-full"
          />
        </label>

        <label>
          Email (read-only)
          <input
            type="email"
            value={userData?.email || ""}
            readOnly
            className="border p-2 rounded w-full bg-gray-100 cursor-not-allowed"
          />
        </label>

        {userRole === "faculty" && (
          <>
            <label>
              Available Slots
              <input
                type="number"
                min="0"
                value={availableSlots}
                onChange={(e) => setAvailableSlots(e.target.value)}
                className="border p-2 rounded w-full"
                required
              />
            </label>

            <label>
              Office Hours
              <input
                type="text"
                value={officeHours}
                onChange={(e) => setOfficeHours(e.target.value)}
                className="border p-2 rounded w-full"
                placeholder="e.g., Mon-Wed 2pm-4pm"
              />
            </label>

            <label>
              Domain / Department
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="border p-2 rounded w-full"
                placeholder="e.g., Computer Science"
              />
            </label>
          </>
        )}

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
