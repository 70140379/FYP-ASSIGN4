import React from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/supervisors");
  };

  return (
    <section className="bg-gradient-to-r from-green-600 to-teal-500 text-white py-20 px-6 text-center">
      <h1 className="text-5xl font-extrabold mb-4">
        Find Your Perfect FYP Supervisor
      </h1>
      <p className="text-xl max-w-2xl mx-auto mb-8">
        Connect with experienced supervisors to guide your final year project.
      </p>
      <button
        onClick={handleGetStarted}
        className="bg-white text-green-600 font-bold py-3 px-8 rounded-full hover:bg-green-100 transition"
      >
        Get Started
      </button>
    </section>
  );
};

export default HeroSection;
