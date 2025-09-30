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
        const userRes = await fetch("/api/auth/me", { credentials: "include" });
        if (!userRes.ok) {
          console.error("No userId found in API response");
          return;
        }
        const userData = await userRes.json();
        const userId = userData.user?.id;
        if (!userId) {
          console.error("No userId found in API response");
          return;
        }
        const res = await fetch(`/api/enrollments?userId=${userId}`);
        const data = await res.json();
        if (res.ok && data.enrollments) {
          // Use the populated course data from enrollments API
          const enrolledCourses = await Promise.all(
            data.enrollments
              .filter(enrollment => {
                if (!enrollment.course) {
                  console.warn("Enrollment missing course data:", enrollment);
                  return false;
                }
                if (!enrollment.course._id) {
                  console.warn("Course missing _id:", enrollment.course);
                  return false;
                }
                return true;
              })
              .map(async (enrollment) => {
                // Calculate real progress from database
                let progress = 0;
                let thumbnail = "";
                try {
                  // Get user progress for this course
                  const progressRes = await fetch(`/api/progress?userId=${userId}&courseId=${enrollment.course._id}`);
                  // Get lessons to count total contents
                  const lessonsRes = await fetch(`/api/courses/${enrollment.course._id}/lessons`);
                  // Get thumbnail from Azure Blob Storage
                  try {
                    const imagesRes = await fetch(`/api/get-images?courseId=${enrollment.course._id}`);
                    const imagesData = await imagesRes.json();
                    thumbnail = imagesData.urls && imagesData.urls.length > 0 ? imagesData.urls[0] : enrollment.course.thumbnail || "";
                  } catch {
                    thumbnail = enrollment.course.thumbnail || "";
                  }
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
                    // Count valid completed content items
                    const completedContents = validProgress.length;
                    // Calculate percentage
                    progress = totalContents > 0 ? Math.round((completedContents / totalContents) * 100) : 0;
                  } else {
                    console.error('Failed to fetch progress or lessons data');
                  }
                } catch (error) {
                  console.error('Error calculating progress for course:', enrollment.course._id, error);
                  progress = 0; // Default to 0 if calculation fails
                }
                return { 
                  ...enrollment.course, 
                  progress,
                  thumbnail,
                  enrollmentId: enrollment._id 
                };
              })
          );
          setCourses(enrolledCourses);
        } else {
          console.error("Failed to fetch enrollments:", data.message || "Unknown error");
        }
      } catch (err) {
        console.error("Error fetching enrolled courses:", err);
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
              id={course._id}
              title={course.title}
              image={course.thumbnail || "/placeholder.svg"}
              progress={course.progress}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default MyLearning;
