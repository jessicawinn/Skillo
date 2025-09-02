"use client";
import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const courses = [
  { id: "1", title: "React for Beginners", content: "Learn React from scratch..." },
  { id: "2", title: "Advanced Node.js", content: "Deep dive into Node.js..." },
  { id: "3", title: "JavaScript Basics", content: "Master JS fundamentals..." }
];

const CourseLearning = () => {
  const { id } = useParams();
  const course = courses.find(c => c.id === id);

  if (!course) return <p className="p-10">Course not found</p>;

  return (
    <div className="p-10">
      <Link href="/student/mylearning" className="text-purple-700 underline mb-4 inline-block">
        ← Back to My Learning
      </Link>

      <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
      <p className="text-gray-700 mb-6">{course.content}</p>

      <div className="bg-gray-100 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Lesson 1: Introduction</h2>
        <p>Here is some content for the first lesson...</p>
      </div>
    </div>
  );
};

export default CourseLearning;
