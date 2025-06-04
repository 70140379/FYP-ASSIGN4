import React from "react";
import { useNavigate } from "react-router-dom";

const CallToAction = () => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate("/signup");
  };

  return (
    <section className="bg-green-600 text-white py-16 px-6 text-center rounded-lg mx-auto max-w-4xl my-16">
      <h2 className="text-3xl font-bold mb-4">Ready to Find Your Supervisor?</h2>
      <p className="mb-8 max-w-xl mx-auto">
        Join thousands of students successfully connecting with top supervisors. Get started today!
      </p>
      <button
        onClick={handleSignUp}
        className="bg-white text-green-600 font-semibold py-3 px-8 rounded-full hover:bg-green-100 transition"
      >
        Sign Up Now
      </button>
    </section>
  );
};

export default CallToAction;
