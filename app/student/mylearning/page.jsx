"use client";

import MyLearning from "@/components/MyLearning";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function MyLearningPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <NavBar />
            <div className="flex-grow">
                <MyLearning />
            </div>
            <Footer />
        </div>
    );
}