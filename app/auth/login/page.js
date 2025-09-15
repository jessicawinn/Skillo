"use client";
import Login from "@/components/modals/Login";

export default function LoginPage() {
  // You may want to manage modal state here, but for simplicity:
  return <Login isOpen={true} onClose={() => {}} onSwitchToSignup={() => {}} />;
}