"use client";
import React, { useState } from "react";
import LandingNavBar from "@/components/LandingNavBar";
import Footer from "@/components/Footer";

export default function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);
    alert("Thank you! Your message has been sent.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <LandingNavBar />

      <main className="flex-1 max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-purple-700 mb-6">Contact Us</h1>
        <p className="text-gray-700 mb-8">
          Have questions or feedback? Fill out the form below and we'll get back to you as soon as possible.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows="5"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            type="submit"
            className="bg-purple-700 text-white px-6 py-3 rounded-md hover:bg-purple-600 transition-colors"
          >
            Send Message
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}
