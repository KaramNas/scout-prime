"use client";

import { useState } from "react";
import { ArrowRight } from "@phosphor-icons/react";

export default function ContactUsMain() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("Something went wrong. Please try again.");
      }
    } catch (error) {
      setStatus("Error sending message. Try again later.");
    }
  };

  return (
    <div
      className="w-full h-[700px] bg-cover bg-center bg-slate-600 flex flex-col items-center justify-center text-white"
      style={{ backgroundImage: "url('/backgrounds/blacktools.jpg')" }}
    >
      {/* Centered title and text */}
      <div className="text-center">
        <h1 className="text-5xl font-bold text-titletextyellow">Contact Us</h1>
      </div>

      {/* Contact Form */}
      <div className="mt-10 bg-gray-800 bg-opacity-50 p-8 rounded-lg shadow-lg w-[60%]">
        <h2 className="text-3xl font-bold text-titletextyellow text-center mb-4">
          Have an Inquiry? Feel Free to Contact Us!
        </h2>
        <p className="text-center text-paragraphtextgrey mb-4">
          This website is a collective effort by Scouts to document Lebanon’s diverse nature. If you have any questions, suggestions, or contributions, reach out to us!
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className="p-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-titletextyellow"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            className="p-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-titletextyellow"
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            rows="4"
            className="p-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-titletextyellow"
            required
          ></textarea>
          <button
            type="submit"
            className="bg-titletextyellow text-black font-bold py-3 rounded-lg hover:bg-yellow-500 transition"
          >
            Send Message
          </button>
        </form>
        {status && <p className="text-center mt-4 text-paragraphtextgrey">{status}</p>}
      </div>

      {/* Bottom Section with Contact Button */}
      <div className="flex justify-between items-center mt-10 w-[60%]">
        <p className="text-xl text-paragraphtextgrey">If you spot incorrect data or want to contribute, visit our contact page.</p>
        <a
          href="/contact"
          className="relative flex items-center border-2 border-titletextyellow rounded-lg overflow-hidden group"
        >
          <span className="absolute inset-0 bg-titletextyellow w-0 transition-all duration-300 group-hover:w-full"></span>
          <span className="relative flex items-center justify-start px-6 py-3 text-titletextyellow font-bold transition-all duration-300 group-hover:text-black w-full">
            <ArrowRight
              size={24}
              className="mr-2 transition-all duration-300 group-hover:translate-x-0 group-hover:mr-0"
            />
            Contact
          </span>
        </a>
      </div>
    </div>
  );
}
