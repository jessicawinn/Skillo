"use client";
import { useState } from "react";
import LandingNavBar from "@/components/LandingNavBar";
import AllCourses from "@/components/AllCourses";
import Footer from "@/components/Footer";
import Login from "@/components/modals/Login";
import Signup from "@/components/modals/Signup";

export default function Home() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  return (
    <>
      <LandingNavBar
        onLoginClick={() => setLoginOpen(true)}
        onSignupClick={() => setSignupOpen(true)} // FIXED
      />
      <AllCourses basePath="" fetchEnrollments={false} />
      <Footer />
      <Login
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSwitchToSignup={() => setSignupOpen(true)} // NEW
      />
      <Signup isOpen={signupOpen}
        onClose={() => setSignupOpen(false)}
        onSwitchToLogin={() => setLoginOpen(true)} />
    </>
  );
}
