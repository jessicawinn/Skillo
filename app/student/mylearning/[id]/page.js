"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, Circle } from "lucide-react";

const StudyPage = () => {
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [completedContents, setCompletedContents] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  const params = useParams();
  const router = useRouter();
  const courseId = params.id;

  useEffect(() => {
    // Get userId from sessionStorage
    const storedUserId = sessionStorage.getItem("userId");
    if (!storedUserId) {
      setError("Please log in to access this course");
      setLoading(false);
      return;
    }
    setUserId(storedUserId);

    const fetchCourseAndLessons = async () => {
      try {
        // Fetch course details
        const courseRes = await fetch(`/api/courses/${courseId}`);
        if (!courseRes.ok) throw new Error("Failed to fetch course");
        const courseData = await courseRes.json();
        setCourse(courseData.course);

        // Fetch lessons
        const lessonsRes = await fetch(`/api/courses/${courseId}/lessons`);
        if (!lessonsRes.ok) throw new Error("Failed to fetch lessons");
        const lessonsData = await lessonsRes.json();
        
        // Sort lessons by order
        const sortedLessons = (lessonsData.lessons || []).sort((a, b) => (a.order || 0) - (b.order || 0));
        setLessons(sortedLessons);

        // Fetch user progress for this course
        const progressRes = await fetch(`/api/progress?userId=${storedUserId}&courseId=${courseId}`);
        if (progressRes.ok) {
          const progressData = await progressRes.json();
          const completedSet = new Set();
          
          // Create a map of lessonId -> lesson index for faster lookup
          const lessonIdToIndex = {};
          sortedLessons.forEach((lesson, index) => {
            lessonIdToIndex[lesson._id] = index;
          });

          progressData.progress.forEach(p => {
            const lessonIndex = lessonIdToIndex[p.lessonId];
            if (lessonIndex !== undefined) {
              completedSet.add(`${lessonIndex}-${p.contentIndex}`);
            }
          });
          
          setCompletedContents(completedSet);
        }
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndLessons();
  }, [courseId]);

  const currentLesson = lessons[currentLessonIndex];
  const currentContent = currentLesson?.contents?.[currentContentIndex];
  const totalContents = lessons.reduce((total, lesson) => total + (lesson.contents?.length || 0), 0);
  const progressPercentage = Math.round((completedContents.size / totalContents) * 100) || 0;

  const markContentComplete = async () => {
    if (currentContent && userId) {
      const contentKey = `${currentLessonIndex}-${currentContentIndex}`;
      
      // Update local state immediately for better UX
      setCompletedContents(prev => new Set([...prev, contentKey]));

      try {
        // Save to database
        const response = await fetch('/api/progress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId,
            courseId: courseId,
            lessonId: currentLesson._id,
            contentIndex: currentContentIndex,
            contentTitle: currentContent.title
          })
        });

        if (!response.ok) {
          // If API call fails, revert the local state
          setCompletedContents(prev => {
            const newSet = new Set(prev);
            newSet.delete(contentKey);
            return newSet;
          });
          
          const errorData = await response.json();
          console.error('Failed to save progress:', errorData.message);
          alert('Failed to save progress. Please try again.');
        }
      } catch (error) {
        // If API call fails, revert the local state
        setCompletedContents(prev => {
          const newSet = new Set(prev);
          newSet.delete(contentKey);
          return newSet;
        });
        
        console.error('Error saving progress:', error);
        alert('Failed to save progress. Please check your connection.');
      }
    }
  };

  const isContentCompleted = (lessonIdx, contentIdx) => {
    return completedContents.has(`${lessonIdx}-${contentIdx}`);
  };

  const goToNextContent = () => {
    if (!currentLesson) return;

    if (currentContentIndex < currentLesson.contents.length - 1) {
      setCurrentContentIndex(currentContentIndex + 1);
    } else if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setCurrentContentIndex(0);
    }
  };

  const goToPreviousContent = () => {
    if (currentContentIndex > 0) {
      setCurrentContentIndex(currentContentIndex - 1);
    } else if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
      setCurrentContentIndex(lessons[currentLessonIndex - 1]?.contents?.length - 1 || 0);
    }
  };

  const goToContent = (lessonIdx, contentIdx) => {
    setCurrentLessonIndex(lessonIdx);
    setCurrentContentIndex(contentIdx);
  };

  if (loading) return <div className="p-8 text-center">Loading course...</div>;
  if (error) return <div className="p-8 text-center text-red-600">Error: {error}</div>;
  if (!course || lessons.length === 0) return <div className="p-8 text-center">No course content available</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/student/mylearning")}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to My Learning</span>
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{course.title}</h1>
                <p className="text-sm text-gray-600">{progressPercentage}% Complete</p>
              </div>
            </div>
            <div className="w-64">
              <div className="bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-700 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar - Course Content */}
        <div className="w-80 bg-white shadow-sm h-screen overflow-y-auto">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-gray-900">Course Content</h2>
          </div>
          <div className="p-4 space-y-4">
            {lessons.map((lesson, lessonIdx) => (
              <div key={lesson._id || lessonIdx} className="space-y-2">
                <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                <div className="space-y-1">
                  {lesson.contents?.map((content, contentIdx) => (
                    <button
                      key={`${lessonIdx}-${contentIdx}`}
                      onClick={() => goToContent(lessonIdx, contentIdx)}
                      className={`w-full flex items-center space-x-3 p-2 rounded text-left text-sm transition-colors ${
                        currentLessonIndex === lessonIdx && currentContentIndex === contentIdx
                          ? "bg-purple-100 text-purple-800"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {isContentCompleted(lessonIdx, contentIdx) ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Circle className="h-4 w-4" />
                      )}
                      <span className="truncate">{content.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-8">
          {currentContent ? (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm p-8">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {currentContent.title}
                  </h1>
                  <p className="text-gray-600">
                    Lesson {currentLessonIndex + 1}: {currentLesson.title}
                  </p>
                </div>

                <div className="prose prose-lg max-w-none mb-8">
                  <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {currentContent.text}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t">
                  <button
                    onClick={goToPreviousContent}
                    disabled={currentLessonIndex === 0 && currentContentIndex === 0}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  <div className="flex items-center space-x-4">
                    {!isContentCompleted(currentLessonIndex, currentContentIndex) && (
                      <button
                        onClick={markContentComplete}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Mark Complete
                      </button>
                    )}
                    
                    {(currentLessonIndex < lessons.length - 1 || currentContentIndex < currentLesson.contents.length - 1) && (
                      <button
                        onClick={goToNextContent}
                        className="px-6 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors"
                      >
                        Next
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-600">
              Select a lesson from the sidebar to begin studying.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyPage;