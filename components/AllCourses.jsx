"use client";

import React, { useEffect, useState } from "react";
import Course from "./Course";

const AllCourses = ({ basePath = "" }) => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/courses", { method: 'GET' }); // your GET API
        if (!res.ok) throw new Error("Failed to fetch courses");
        const data = await res.json();
        setCourses(data.courses || []);
        setFilteredCourses(data.courses || []); // initial load shows all
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Handle search on input change
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = courses.filter((course) =>
      course.title.toLowerCase().includes(query) ||
      (course.description && course.description.toLowerCase().includes(query))
    );

    setFilteredCourses(filtered);
  };

  if (loading) return <p className="text-center mt-10">Loading courses...</p>;

  return (
    <div className="px-10 py-6">
      <h1 className="text-3xl text-center font-bold mb-4">Courses</h1>

      {/* Search bar */}
      <div className="flex justify-center">
        <div className="flex w-full max-w-2xl mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="What would you like to learn today"
            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none"
          />
          <button className="bg-purple-400 text-white px-4 py-2 rounded-r-lg hover:bg-purple-500 transition">
            Search Courses
          </button>
        </div>
      </div>

      <div className="flex justify-center space-x-6 text-gray-600 font-medium mb-6">
        <button className="border-b-2 border-purple-400 pb-1">All</button>
        <button>Problem Solving Skills</button>
        <button>Interpersonal Skills</button>
        <button>Technological Skills</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-10">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <Course
              key={course._id}
              course={course}
              width="w-100"
              basePath={basePath}
            />
          ))
        ) : (
          <p className="col-span-full text-center">No courses available.</p>
        )}
      </div>
    </div>
  );
};

export default AllCourses;
