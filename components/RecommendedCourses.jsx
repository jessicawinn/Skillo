"use client"

import React, { useEffect, useState } from "react";
import Course from './Course';

const RecommendedCourses = ({ basePath = "" }) => {
  const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchCourses = async () => {
        try {
          const res = await fetch("/api/courses", { method: 'GET' }); // your GET API
          if (!res.ok) throw new Error("Failed to fetch courses");
          const data = await res.json();
          setCourses(data.courses || []);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
  
      fetchCourses();
    }, []);
  
    if (loading) return <p className="text-center mt-10">Loading courses...</p>;

  return (
    <div>
      {/* Header */}
      <div className="m-10 flex items-center justify-between">
        <div className="text-2xl font-semibold">Recommended Courses</div>
        <button className="bg-gray-100 hover:bg-purple-300 px-6 py-2 rounded-3xl shadow-md transition flex items-center">
          View All <span className="ml-2">&gt;</span>
        </button>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="flex overflow-x-auto space-x-6 px-10 py-4">
        {courses.map((course, index) => (
          <div key={index} className="flex-none">
            <Course course={course} basePath={basePath}/>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedCourses;
