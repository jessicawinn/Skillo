"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { User } from 'lucide-react';
import ProfileDropdown from './ProfileDropdown';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between px-6 py-4 shadow-md">
      <div className="text-2xl font-bold pl-10 text-purple-700">
        <Link href="/">Skillo</Link>
      </div>

      <div className="flex items-center justify-center space-x-6 pr-10">
        <Link href="/student" className="hover:text-gray-300 transition-colors">
          Dashboard
        </Link>
        <Link href="/student/courses" className="hover:text-gray-300 transition-colors">
          All courses
        </Link>
        <Link href="/student/mylearning" className="hover:text-gray-300 transition-colors">
          My Learning
        </Link>

        {/* Profile Icon with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-10 h-10 rounded-full bg-purple-700 flex items-center justify-center text-white hover:bg-purple-600 transition-colors"
          >
            <User size={20} />
          </button>
          {isOpen && <ProfileDropdown />}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
