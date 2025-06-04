import React from 'react';

const InfoBox = ({ title, description, icon }) => (
  <div className="bg-white shadow-md rounded-lg p-6 text-center max-w-sm mx-auto">
    <div className="text-green-600 mb-4">
      {icon}
    </div>
    <h3 className="font-semibold text-xl mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default InfoBox;
