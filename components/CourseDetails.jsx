"use client";

import React, { useEffect, useState } from "react";

const CourseDetails = ({ course }) => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  // Fetch lessons
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await fetch(`/api/courses/${course._id}/lessons`);
        if (!res.ok) throw new Error("Failed to fetch lessons");
        const data = await res.json();
        // Sort lessons by order in ascending order
        const sortedLessons = (data.lessons || []).sort((a, b) => (a.order || 0) - (b.order || 0));
        setLessons(sortedLessons);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [course._id]);

  // Check if user already enrolled
  useEffect(() => {
    const checkEnrollment = async () => {
      const userRes = await fetch("/api/auth/me", { credentials: "include" });
      if (!userRes.ok) return;
      const userData = await userRes.json();
      const userId = userData.user?.id;
      if (!userId) return;
      try {
        const res = await fetch(`/api/enrollments?userId=${userId}&courseId=${course._id}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.enrollments && data.enrollments.length > 0) setEnrolled(true);
      } catch (err) {
        console.error(err);
      }
    };
    checkEnrollment();
  }, [course._id]);

  // Handle enrollment
  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      const userRes = await fetch("/api/auth/me", { credentials: "include" });
      if (!userRes.ok) {
        alert("You must be logged in to enroll");
        setEnrolling(false);
        return;
      }
      const userData = await userRes.json();
      const userId = userData.user?.id;
      if (!userId) {
        alert("You must be logged in to enroll");
        setEnrolling(false);
        return;
      }
      const instructor_id = course.instructor_id;
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          courseId: course._id,
          instructor_id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setEnrolled(true);
        alert("Enrollment successful!");
      } else {
        alert(data.message || "Failed to enroll");
      }
    } catch (err) {
      console.error(err);
      alert("Error enrolling in course");
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white mt-20">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={course.image_url}
          alt={course.title}
          className="w-full md:w-1/2 h-64 md:h-80 object-cover rounded-lg"
        />
        <div className="flex-1">
          <span className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full mr-3">
            {course.category}
          </span>
          <span className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full">
            {course.level}
          </span>
          <h1 className="text-3xl font-bold mt-2">{course.title}</h1>
          <p className="text-purple-500 font-bold text-lg mt-1">{course.price} Baht</p>
          <div className="flex items-center mt-2">
            <span className="text-yellow-400 text-xl mr-2">★</span>
            <span className="font-semibold">{course.rating}</span>
            <span className="text-gray-500 text-sm ml-2">({course.reviews})</span>
          </div>
          <p className="text-gray-600 mt-3">{course.description}</p>

          <button
            onClick={handleEnroll}
            disabled={enrolled || enrolling}
            className={`rounded-xl px-5 py-3 mt-3 text-white text-md font-bold ${
              enrolled ? "bg-gray-400 cursor-not-allowed" : "bg-purple-700 hover:bg-purple-800"
            }`}
          >
            {enrolled ? "Enrolled" : enrolling ? "Enrolling..." : "Enroll Now"}
          </button>
        </div>
      </div>

      {/* What You Will Learn */}
      {course.learningPoints && course.learningPoints.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-3">What You Will Learn</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {course.learningPoints.map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Skills / Tools */}
      {course.tools && course.tools.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-3">Skills You Will Gain</h2>
          <div className="flex flex-wrap gap-2">
            {course.tools.map((tool, idx) => (
              <span
                key={idx}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Lessons Section */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-3">Lessons</h2>
        {loading ? (
          <p>Loading lessons...</p>
        ) : lessons.length === 0 ? (
          <p>No lessons available.</p>
        ) : (
          <div className="space-y-4">
            {lessons.map((lesson, idx) => (
              <details key={idx} className="border rounded-md">
                <summary className="cursor-pointer bg-gray-100 px-4 py-2 font-semibold">
                  {lesson.title}
                </summary>
                <div className="px-4 py-2 text-gray-700">
                  <ul className="list-disc list-inside space-y-1">
                    {lesson.contents.map((content, cidx) => (
                      <li key={cidx} className="mt-1">
                        <span className="font-semibold">{content.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;
