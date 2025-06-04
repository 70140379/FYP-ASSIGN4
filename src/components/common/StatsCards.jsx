// src/components/common/StatsCard.jsx
import React from "react";

export default function StatsCard({ label, value, icon }) {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 flex items-center gap-4">
      {icon && <div className="text-3xl text-blue-500">{icon}</div>}
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-semibold text-blue-700">{value}</p>
      </div>
    </div>
  );
}
