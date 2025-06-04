import React from 'react';

const TestimonialBox = ({ testimonial, studentName, studentImage }) => (
  <div className="bg-white rounded shadow p-4 flex items-center space-x-4 max-w-md">
    <img src={studentImage} alt={studentName} className="w-12 h-12 rounded-full object-cover" />
    <div>
      <p className="text-sm italic">"{testimonial}"</p>
      <p className="text-xs font-semibold mt-1">{studentName}</p>
    </div>
  </div>
);

export default TestimonialBox;
  