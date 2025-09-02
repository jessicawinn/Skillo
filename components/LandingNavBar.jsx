// components/LandingNavBar.js
"use client";
import React from "react";
import Link from "next/link";

const LandingNavBar = ({ onLoginClick, onSignupClick }) => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 shadow-md sticky top-0 bg-white z-40">
      <div className="text-2xl font-bold text-purple-700">
        <Link href="/">Skillo</Link>
      </div>

      <div className="flex items-center space-x-4">
        <Link href="/" className="hover:text-purple-500 transition-colors">
          Home
        </Link>
        <Link href="/courses" className="hover:text-purple-500 transition-colors">
          Courses
        </Link>
        <Link href="/about" className="hover:text-purple-500 transition-colors">
          About
        </Link>
        <Link href="/contactus" className="hover:text-purple-500 transition-colors">
          Contact Us
        </Link>

        <button
          onClick={onLoginClick}
          className="text-purple-700 hover:bg-purple-100 transition-colors rounded-md border border-purple-300 px-4 py-2"
        >
          Log in
        </button>
        <button 
            onClick={onSignupClick}
            className="text-white bg-purple-700 hover:bg-purple-600 transition-colors rounded-md px-4 py-2">
          Sign up
        </button>
      </div>
    </nav>
  );
};

export default LandingNavBar;