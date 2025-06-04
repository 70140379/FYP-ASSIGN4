import React, { useState } from "react";
import { db } from "../../../../firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function StudentFypForm({ userId, supervisors }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [supervisor, setSupervisor] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title || !description || !supervisor) {
      setError("Please fill all fields");
      return;
    }

    try {
      await addDoc(collection(db, "fypIdeas"), {
        userId,
        title,
        description,
        supervisor,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      setSuccess("FYP idea submitted successfully!");
      setTitle("");
      setDescription("");
      setSupervisor("");
    } catch (err) {
      setError("Failed to submit idea: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-md mx-auto bg-white p-6 rounded shadow-md">
      <input
        type="text"
        placeholder="Project Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border border-green-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
        required
      />
      <textarea
        placeholder="Project Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border border-green-300 p-3 rounded h-32 resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
        required
      />

      <select
        value={supervisor}
        onChange={(e) => setSupervisor(e.target.value)}
        className="border border-green-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
        required
      >
        <option value="" disabled>
          -- Select Supervisor --
        </option>
        {supervisors && supervisors.length > 0 ? (
          supervisors.map((sup) => (
            <option key={sup.id} value={sup.id}>
              {sup.name}
            </option>
          ))
        ) : (
          <option disabled>No supervisors available</option>
        )}
      </select>

      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}

      <button
        type="submit"
        className="bg-green-600 text-white py-3 rounded-full hover:bg-green-700 transition font-semibold"
      >
        Submit Idea
      </button>
    </form>
  );
}

export default StudentFypForm;
