"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Signup from "@/components/modals/Signup";
import Login from "@/components/modals/Login";

const VerifyContent = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    const [status, setStatus] = useState("pending");
    const [message, setMessage] = useState("");
    const [showLogin, setShowLogin] = useState(false);

    useEffect(() => {
        if (!token || !email) {
            setStatus("error");
            setMessage("Missing verification token or email.");
            return;
        }
        // Call backend verification API
        fetch(`/api/auth/verify-email?token=${token}&email=${email}`)
            .then(res => res.json())
            .then(data => {
                if (data.message === "Email verified successfully!") {
                    setStatus("success");
                    setMessage("Your email has been verified! You can now log in.");
                    setTimeout(() => setShowLogin(true), 1200);
                } else {
                    setStatus("error");
                    setMessage(data.message || "Verification failed.");
                }
            })
            .catch(() => {
                setStatus("error");
                setMessage("Verification failed. Please try again.");
            });
    }, [token, email]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded shadow-lg w-full max-w-md text-center">
                <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
                {status === "pending" && <p>Verifying your email...</p>}
                {status === "success" && <p className="text-green-600 font-semibold">{message}</p>}
                {status === "error" && <p className="text-red-600 font-semibold">{message}</p>}
            </div>
            {/* Show login modal if verification is successful */}
            {showLogin && <Login isOpen={true} onClose={() => setShowLogin(false)} />}
        </div>
    );
};

const VerifyPage = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded shadow-lg w-full max-w-md text-center">
                    <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
                    <p>Loading...</p>
                </div>
            </div>
        }>
            <VerifyContent />
        </Suspense>
    );
};

export default VerifyPage;
