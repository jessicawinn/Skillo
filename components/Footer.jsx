"use client";
import React from 'react'
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-300 py-4 mt-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
        <p className="mb-2 md:mb-0">&copy; {new Date().getFullYear()} Skillo. All rights reserved.</p>
        <div className="flex space-x-4">
          <Link href="/privacy" className="hover:text-black">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-black">Terms of Service</Link>
          <Link href="/contact" className="hover:text-black">Contact</Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
