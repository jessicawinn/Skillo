"use client"

import React, { useEffect, useState } from "react";
import Course from './Course';

const RecommendedCourses = ({ basePath = "" }) => {
  const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchCourses = async () => {
        try {
          const res = await fetch("/api/courses", { method: 'GET' });
          if (!res.ok) throw new Error("Failed to fetch courses");
          const data = await res.json();
          const normalizedCourses = (data.courses || []).map(c => ({
            ...c,
            _id: c._id.toString()
          }));
          // Fetch thumbnail from Azure for each course
          const coursesWithThumbnails = await Promise.all(
            normalizedCourses.map(async (course) => {
              try {
                const imagesRes = await fetch(`/api/get-images?courseId=${course._id}`);
                const imagesData = await imagesRes.json();
                return {
                  ...course,
                  thumbnail: imagesData.urls && imagesData.urls.length > 0 ? imagesData.urls[0] : course.thumbnail || ""
                };
              } catch {
                return {
                  ...course,
                  thumbnail: course.thumbnail || ""
                };
              }
            })
          );
          setCourses(coursesWithThumbnails);
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
