import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig";
import StatsCard from "../../../common/StatsCards";

export default function AdminStatsCards() {
  const [stats, setStats] = useState({
    facultyCount: 0,
    totalIdeas: 0,
    totalAssignedStudents: 0,
    totalAvailableSlots: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const facultyQuery = query(collection(db, "users"), where("role", "==", "faculty"));
        const facultySnapshot = await getDocs(facultyQuery);
        const facultyCount = facultySnapshot.size;

        const ideasSnapshot = await getDocs(collection(db, "fypIdeas"));
        const totalIdeas = ideasSnapshot.size;

        const assignedStudents = ideasSnapshot.docs.filter(
          (doc) => doc.data().assignedSupervisorId
        ).length;

        const availableSlots = facultySnapshot.docs.reduce((total, doc) => {
          return total + (doc.data().availableSlots || 0);
        }, 0);

        setStats({
          facultyCount,
          totalIdeas,
          totalAssignedStudents: assignedStudents,
          totalAvailableSlots: availableSlots,
        });
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
      <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center justify-center text-center hover:shadow-2xl transition-shadow">
        <StatsCard label="Total Faculty" value={stats.facultyCount} />
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center justify-center text-center hover:shadow-2xl transition-shadow">
        <StatsCard label="Ideas Submitted" value={stats.totalIdeas} />
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center justify-center text-center hover:shadow-2xl transition-shadow">
        <StatsCard label="Assigned Students" value={stats.totalAssignedStudents} />
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center justify-center text-center hover:shadow-2xl transition-shadow">
        <StatsCard label="Available Slots" value={stats.totalAvailableSlots} />
      </div>
    </div>
  );
}
