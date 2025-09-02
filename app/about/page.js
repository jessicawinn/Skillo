"use client";
import React from "react";
import LandingNavBar from "@/components/LandingNavBar";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingNavBar />
      
      <main className="flex-1 max-w-6xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-purple-700 mb-6">About Skillo</h1>
        <p className="text-gray-700 mb-4">
          Skillo is a modern online learning platform designed to provide access to high-quality courses anytime and anywhere. Our mission is to empower learners by offering a wide variety of courses across different fields.
        </p>
        <p className="text-gray-700 mb-4">
          We focus on interactive learning experiences, expert instructors, and flexible learning paths. Whether you're looking to enhance your skills or start a new career, Skillo is here to help you grow.
        </p>
        <p className="text-gray-700">
          Join thousands of learners and start your journey today!
        </p>
      </main>

      <Footer />
    </div>
  );
}
