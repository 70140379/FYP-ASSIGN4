import React, { useState, useEffect } from "react";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig";

export default function FacultyForm({ existingFaculty, onClose, onSaved }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [domain, setDomain] = useState("");
  const [availableSlots, setAvailableSlots] = useState(1);
  const [officeHours, setOfficeHours] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (existingFaculty) {
      setName(existingFaculty.name || "");
      setEmail(existingFaculty.email || "");
      setDomain(existingFaculty.domain || "");
      setAvailableSlots(existingFaculty.availableSlots || 1);
      setOfficeHours(existingFaculty.officeHours || "");
    } else {
      setName("");
      setEmail("");
      setDomain("");
      setAvailableSlots(1);
      setOfficeHours("");
    }
  }, [existingFaculty]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!name || !email) {
      alert("Name and Email are required.");
      setLoading(false);
      return;
    }

    try {
      if (existingFaculty) {
        const docRef = doc(db, "users", existingFaculty.id);
        await updateDoc(docRef, {
          name,
          email,
          domain,
          availableSlots: Number(availableSlots),
          officeHours,
        });
        alert("Faculty updated successfully.");
      } else {
        await addDoc(collection(db, "users"), {
          name,
          email,
          domain,
          availableSlots: Number(availableSlots),
          officeHours,
          role: "faculty",
        });
        alert("New faculty added successfully.");
      }
      onSaved();
      onClose();
    } catch (error) {
      console.error("Error saving faculty:", error);
      alert("Failed to save faculty.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md p-6 border rounded-lg shadow-lg bg-white mx-auto"
    >
      <h3 className="text-2xl font-semibold mb-6 text-green-800">
        {existingFaculty ? "Edit Faculty" : "Add New Faculty"}
      </h3>

      <label className="block mb-4">
        Name <span className="text-red-500">*</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border border-green-300 p-3 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </label>

      <label className="block mb-4">
        Email <span className="text-red-500">*</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-green-300 p-3 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </label>

      <label className="block mb-4">
        Domain
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          className="w-full border border-green-300 p-3 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </label>

      <label className="block mb-4">
        Available Slots
        <input
          type="number"
          value={availableSlots}
          min={0}
          onChange={(e) => setAvailableSlots(e.target.value)}
          className="w-full border border-green-300 p-3 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </label>

      <label className="block mb-6">
        Office Hours
        <input
          type="text"
          value={officeHours}
          onChange={(e) => setOfficeHours(e.target.value)}
          placeholder="E.g. Mon-Fri 9am-5pm"
          className="w-full border border-green-300 p-3 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </label>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="px-5 py-2 border rounded-md hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          {loading ? "Saving..." : existingFaculty ? "Update" : "Add"}
        </button>
      </div>
    </form>
  );
}
