"use client";
import { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";

const Signup = ({ isOpen, onClose, onSwitchToLogin }) => {
    const [role, setRole] = useState("student"); // New: student or instructor
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState(""); // For API feedback
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = "hidden";
        } else {
            const timer = setTimeout(() => {
                setIsVisible(false);
                document.body.style.overflow = "unset";
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage("Password do not match");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: fullName,
                    email,
                    password,
                    role
                })
            })

            const data = await res.json();

            if (!res.ok) {
                setMessage(data.message || "Signup failed");
            } else {
                setMessage("Signup successful! You can now log in.");
                // Optionally, close modal after a short delay
                setTimeout(() => {
                    onClose();
                    setFullName("");
                    setEmail("");
                    setPassword("");
                    setConfirmPassword("");
                    setRole("student");
                    setMessage("");
                }, 1500);
            }
        } catch (error) {

        }
    };

    const handleGoogleSignup = () => {
        console.log("Google signup clicked", role);
    };

    if (!isVisible) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex justify-center items-center transition-all duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
            onClick={onClose}
        >
            <div className="fixed inset-0 bg-black/30"></div>
            <div className="fixed inset-0 backdrop-blur-sm"></div>

            <div
                className={`relative bg-white p-6 rounded-lg shadow-2xl w-96 max-w-full mx-4 z-50 transform transition-all duration-300 ${isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"}`}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-lg transition-colors"
                >
                    ✕
                </button>

                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
                    Sign up for Skillo
                </h2>

                {/* Role selector */}
                <div className="flex justify-center gap-4 mb-6">
                    <button
                        type="button"
                        className={`px-4 py-2 rounded-md font-medium transition-colors ${role === "student" ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-700"}`}
                        onClick={() => setRole("student")}
                    >
                        Student
                    </button>
                    <button
                        type="button"
                        className={`px-4 py-2 rounded-md font-medium transition-colors ${role === "instructor" ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-700"}`}
                        onClick={() => setRole("instructor")}
                    >
                        Instructor
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <input
                            id="fullName"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Enter your full name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="signupEmail" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            id="signupEmail"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="signupPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            id="signupPassword"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm your password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-colors font-medium"
                    >
                        Sign Up
                    </button>
                </form>

                <div className="flex items-center my-4">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="mx-4 text-gray-500">or</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <button
                    type="button"
                    onClick={handleGoogleSignup}
                    className="w-full flex items-center justify-center border border-gray-300 py-2 rounded-md hover:bg-gray-50 transition-colors font-medium"
                >
                    <FcGoogle className="w-5 h-5 mr-2" />
                    Continue with Google
                </button>

                <p className="text-center text-sm text-gray-600 mt-4">
                    Already have an account?{" "}
                    <button
                        type="button"
                        onClick={() => {
                            onClose();
                            onSwitchToLogin();
                        }}
                        className="text-purple-600 hover:underline font-medium transition-colors"
                    >
                        Log in
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Signup;
