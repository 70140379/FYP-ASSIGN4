import React, { useEffect, useState } from "react";
import { db } from "../../../../firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function StudentIdeaStatus({ userId }) {
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIdea = async () => {
      try {
        const q = query(collection(db, "fypIdeas"), where("studentId", "==", userId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setIdea(querySnapshot.docs[0].data());
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching idea:", err);
        setLoading(false);
      }
    };

    fetchIdea();
  }, [userId]);

  if (loading) return <p>Loading your idea status...</p>;

  if (!idea) return <p>You haven’t submitted an FYP idea yet.</p>;

  return (
    <div className="mt-6 border-t pt-4">
      <h3 className="text-lg font-semibold mb-2">Your Submitted FYP Idea</h3>
      <p><strong>Title:</strong> {idea.title}</p>
      <p><strong>Description:</strong> {idea.description}</p>
      <p><strong>Status:</strong> <span className="capitalize">{idea.status}</span></p>
      {idea.revisionComment && (
        <p className="text-yellow-700 mt-2"><strong>Admin Comment:</strong> {idea.revisionComment}</p>
      )}
    </div>
  );
}
