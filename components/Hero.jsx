"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image'; // Import Next.js Image

const Hero = () => {
  const [userName, setUserName] = useState("Yoonie");

  useEffect(() => {
    const name = sessionStorage.getItem("userName");
    if (name) {
      setUserName(name);
    }
  })
  return (
    <div className="flex text-left p-8 bg-gray-100">
      <div className="w-2/3 m-10 flex flex-col gap-10">
        <h1 className="text-3xl font-bold">Welcome Back, {userName}!</h1>
        <p className="text-gray-600">
          Keep creating, learning, and sharing your work as you grow your portfolio. 
          Every project you upload brings you one step closer to mastering your craft. 
          Stay inspired, track your progress, and showcase your creativity to the world. 
          Let's turn your ideas into something amazing.
        </p>
      </div>
      
      <div className="w-1/3 flex items-center justify-center">
        <Image 
          src="/Hero.png"   // Direct path from /public
          alt="Hero banner"
          width={300}       // Must provide width
          height={300}      // Must provide height
          className="rounded-lg object-cover"
        />
      </div>
    </div>
  );
}

export default Hero;
