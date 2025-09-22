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
        if (!userId) {
          console.error("No userId found in sessionStorage");
          return;
        }

        const res = await fetch(`/api/enrollments?userId=${userId}`);
        const data = await res.json();

        if (res.ok && data.enrollments) {
          console.log("Fetched enrollments:", data.enrollments); // Debug log
          
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
                console.log("Processing course:", enrollment.course._id, enrollment.course.title); // Debug log
                
                // Calculate real progress from database
                let progress = 0;
                try {
                  // Get user progress for this course
                  const progressRes = await fetch(`/api/progress?userId=${userId}&courseId=${enrollment.course._id}`);
                  // Get lessons to count total contents
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
                    
                    // Count valid completed content items
                    const completedContents = validProgress.length;
                    
                    // Calculate percentage
                    progress = totalContents > 0 ? Math.round((completedContents / totalContents) * 100) : 0;
                    
                    console.log(`=== PROGRESS CALCULATION FOR ${enrollment.course.title} ===`);
                    console.log(`Total progress entries: ${progressData.progress.length}`);
                    console.log(`Valid progress entries: ${completedContents}`);
                    console.log(`Invalid entries filtered out: ${progressData.progress.length - completedContents}`);
                    console.log(`Total contents: ${totalContents}`);
                    console.log(`Raw percentage: ${(completedContents / totalContents) * 100}`);
                    console.log(`Rounded percentage: ${progress}%`);
                    console.log(`Valid lesson IDs:`, Array.from(validLessonIds));
                    console.log(`Valid progress entries:`, validProgress.map(p => `${p.contentTitle} (${p.lessonId}:${p.contentIndex})`));
                    console.log(`=== END CALCULATION ===`);
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
                  enrollmentId: enrollment._id 
                };
              })
          );
          
          console.log("Final enrolled courses:", enrolledCourses); // Debug log
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
