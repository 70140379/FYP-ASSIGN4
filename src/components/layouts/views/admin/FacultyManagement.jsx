import React, { useState, useRef } from "react";
import FacultyList from "./FacultyList";
import FacultyForm from "./FacultyForm";

export default function FacultyManagement() {
  const [showForm, setShowForm] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const facultyListRef = useRef(null);

  // Open form for adding new faculty
  const handleAddNew = () => {
    setSelectedFaculty(null);
    setShowForm(true);
  };

  // Open form for editing existing faculty
  const handleEdit = (faculty) => {
    setSelectedFaculty(faculty);
    setShowForm(true);
  };

  // Close the form
  const handleCloseForm = () => {
    setShowForm(false);
  };

  // Refresh list after save (call fetchFaculty in FacultyList via ref)
  const handleSaved = () => {
    if (facultyListRef.current) {
      facultyListRef.current.fetchFaculty();
    }
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-green-800">Faculty Management</h2>
        <button
          onClick={handleAddNew}
          className="bg-green-600 text-white px-5 py-2 rounded-full hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          Add New Faculty
        </button>
      </div>

      <FacultyList ref={facultyListRef} onEdit={handleEdit} />

      {showForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full relative">
            <button
              className="absolute top-3 right-3 text-gray-700 hover:text-gray-900 font-bold text-3xl leading-none focus:outline-none"
              onClick={handleCloseForm}
              aria-label="Close form"
            >
              &times;
            </button>
            <FacultyForm
              existingFaculty={selectedFaculty}
              onClose={handleCloseForm}
              onSaved={handleSaved}
            />
          </div>
        </div>
      )}
    </div>
  );
}
