import React, { useState } from "react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Here you can add form validation or integrate with backend/Firebase

    console.log("Contact form data:", formData);
    setSubmitted(true);

    // Clear form
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="max-w-3xl mx-auto my-16 px-6">
      <h1 className="text-4xl font-bold mb-8 text-center text-green-800">
        Contact Us
      </h1>

      {submitted && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-800 rounded">
          Thank you for reaching out! We will get back to you soon.
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-8"
        noValidate
      >
        <div className="mb-6">
          <label
            htmlFor="name"
            className="block mb-2 font-semibold text-green-700"
          >
            Name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Your full name"
            className="w-full p-3 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="email"
            className="block mb-2 font-semibold text-green-700"
          >
            Email <span className="text-red-600">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="your.email@example.com"
            className="w-full p-3 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="subject"
            className="block mb-2 font-semibold text-green-700"
          >
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Subject of your message"
            className="w-full p-3 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="message"
            className="block mb-2 font-semibold text-green-700"
          >
            Message <span className="text-red-600">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="6"
            placeholder="Write your message here..."
            className="w-full p-3 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 transition resize-none"
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white font-semibold py-3 px-8 rounded-full hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactPage;
