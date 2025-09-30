"use client";

import React, { useState, useEffect } from "react";

const MyCourses = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const userRes = await fetch("/api/auth/me", { credentials: "include" });
        if (!userRes.ok) {
          setError("Please log in to view your courses");
          setLoading(false);
          return;
        }
        const userData = await userRes.json();
        const userId = userData.user?.id;
        if (!userId) {
          setError("Please log in to view your courses");
          setLoading(false);
          return;
        }
        const res = await fetch(`/api/enrollments?userId=${userId}`);
        const data = await res.json();
        if (res.ok && data.enrollments) {
          // Process courses with progress
          const coursesWithProgress = await Promise.all(
            data.enrollments
              .filter(enrollment => enrollment.course)
              .map(async (enrollment) => {
                // Calculate real progress from database
                let progress = 0;
                try {
                  const progressRes = await fetch(`/api/progress?userId=${userId}&courseId=${enrollment.course._id}`);
                  const lessonsRes = await fetch(`/api/courses/${enrollment.course._id}/lessons`);
                  if (progressRes.ok && lessonsRes.ok) {
                    const progressData = await progressRes.json();
                    const lessonsData = await lessonsRes.json();
                    // Get valid lesson IDs
                    const validLessonIds = new Set(lessonsData.lessons.map(lesson => lesson._id));
                    // Filter progress to only include entries for lessons that exist
                    const validProgress = progressData.progress.filter(p => validLessonIds.has(p.lessonId));
                    // Count total content items
                    const totalContents = (lessonsData.lessons || []).reduce(
                      (total, lesson) => total + (lesson.contents?.length || 0), 
                      0
                    );
                    // Calculate percentage
                    progress = totalContents > 0 ? Math.round((validProgress.length / totalContents) * 100) : 0;
                  }
                } catch (error) {
                  console.error('Error calculating progress:', error);
                  progress = 0;
                }
                return { 
                  ...enrollment.course, 
                  progress,
                  enrollmentId: enrollment._id,
                  enrolledAt: enrollment.enrolledAt,
                  isCompleted: progress === 100
                };
              })
          );
          setCourses(coursesWithProgress);
        } else {
          setError("Failed to fetch courses");
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("An error occurred while fetching courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Group courses by month
  const groupCoursesByMonth = (coursesList) => {
    const grouped = {};
    
    coursesList.forEach(course => {
      const date = new Date(course.enrolledAt);
      const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      
      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }
      grouped[monthYear].push(course);
    });
    
    return grouped;
  };

  const filteredCourses = courses.filter(course => 
    activeTab === "completed" ? course.isCompleted : !course.isCompleted
  );

  const groupedCourses = groupCoursesByMonth(filteredCourses);

  if (loading) return <div className="p-5">Loading courses...</div>;
  if (error) return <div className="p-5 text-red-600">Error: {error}</div>;

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">My Courses</h2>

      {/* Toggle Buttons */}
      <div className="flex bg-gray-200 rounded-full w-48 mb-6">
        <button 
          className={`flex-1 py-1 rounded-full ${activeTab === "upcoming" ? "bg-purple-500 text-white" : ""}`}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming ({courses.filter(c => !c.isCompleted).length})
        </button>
        <button 
          className={`flex-1 py-1 rounded-full ${activeTab === "completed" ? "bg-purple-500 text-white" : ""}`}
          onClick={() => setActiveTab("completed")}
        >
          Completed ({courses.filter(c => c.isCompleted).length})
        </button>
      </div>

      {/* Course List */}
      {Object.keys(groupedCourses).length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No {activeTab} courses found.
        </div>
      ) : (
        Object.entries(groupedCourses)
          .sort(([a], [b]) => new Date(b) - new Date(a)) // Sort by month (newest first)
          .map(([month, monthCourses]) => (
            <div key={month} className="mb-8">
              <div className="text-center mb-4 text-gray-500">{month}</div>

              {monthCourses.map((course) => (
                <div
                  key={course._id}
                  className="flex justify-between items-center bg-gray-100 p-4 mb-3 rounded hover:bg-gray-200 cursor-pointer"
                  onClick={() => window.location.href = `/student/mylearning/${course._id}`}
                >
                  <div className="border-l-4 border-purple-500 pl-3 flex-1">
                    <div className="font-medium">
                      {new Date(course.enrolledAt).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="font-semibold">{course.title}</div>
                    <div className="text-gray-500 text-sm">
                      {course.category} • {course.level}
                    </div>
                    <div className="text-sm mt-1">
                      <span className={`font-medium ${course.isCompleted ? 'text-green-600' : 'text-purple-600'}`}>
                        {course.progress}% Complete
                      </span>
                      {course.isCompleted && (
                        <span className="ml-2 text-green-600">✓ Completed</span>
                      )}
                    </div>
                  </div>
                  <div className="text-purple-500 font-bold text-lg ml-4">{">"}</div>
                </div>
              ))}
            </div>
          ))
      )}
    </div>
  );
};

export default MyCourses;
