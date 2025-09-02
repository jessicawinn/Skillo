"use client";

import React, { useState, useEffect } from "react";
import MyLearningCard from "./MyLearningCard";

const MyLearning = () => {
  const [active, setActive] = useState("progress");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const userId = sessionStorage.getItem("userId");
        if (!userId) return;

        const res = await fetch(`/api/enrollments?userId=${userId}`);
        const data = await res.json();

        if (res.ok && data.enrollments) {
          const enrolledCourses = await Promise.all(
            data.enrollments.map(async (enroll) => {
              const courseRes = await fetch(`/api/courses/${enroll.courseId}`);
              const courseData = await courseRes.json();
              return { ...courseData.course, progress: 0 }; // you can compute progress later
            })
          );
          setCourses(enrolledCourses);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  const filteredCourse = courses.filter(course =>
    active === "progress" ? course.progress < 100 : course.progress === 100
  );

  return (
    <div>
      <h1 className="text-3xl font-bold m-10 mb-5">My Learning</h1>

      <div className="flex space-x-6 ml-10 mb-6">
        <button
          onClick={() => setActive("progress")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            active === "progress" ? "bg-purple-700 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          In Progress
        </button>
        <button
          onClick={() => setActive("complete")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            active === "complete" ? "bg-purple-700 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Complete
        </button>
      </div>

      <div className="flex flex-wrap justify-center">
        {loading ? (
          <p>Loading courses...</p>
        ) : filteredCourse.length === 0 ? (
          <p>No courses found.</p>
        ) : (
          filteredCourse.map(course => (
            <MyLearningCard
              key={course._id}
              id={course._id} // use real _id
              title={course.title}
              image={course.image_url}
              progress={course.progress}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default MyLearning;
