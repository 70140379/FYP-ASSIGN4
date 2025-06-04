import React from 'react';

const SupervisorCard = ({ name, title, department, image, expertise }) => (
  <div className="bg-white p-4 rounded shadow text-center max-w-xs">
    <img src={image} alt={`${name}`} className="w-24 h-24 rounded-full mx-auto mb-3 object-cover" />
    <h3 className="font-semibold text-lg">{name}</h3>
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-xs text-gray-400">{department}</p>
    <p className="mt-2 text-xs text-green-700">{expertise}</p>
  </div>
);

export default SupervisorCard;
