"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

// Course, Lesson, Enrollment shapes as JSDoc comments
/**
 * @typedef {Object} Course
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} instructorId
 * @property {string} instructorName
 * @property {string} category
 * @property {"beginner"|"intermediate"|"advanced"} level
 * @property {string} duration
 * @property {number} price
 * @property {string} thumbnail
 * @property {number} enrolledStudents
 * @property {number} rating
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {boolean} isPublished
 */

/**
 * @typedef {Object} Lesson
 * @property {string} id
 * @property {string} courseId
 * @property {string} title
 * @property {string} description
 * @property {string} content
 * @property {string=} videoUrl
 * @property {string} duration
 * @property {number} order
 * @property {boolean} isPublished
 */

/**
 * @typedef {Object} Enrollment
 * @property {string} id
 * @property {string} studentId
 * @property {string} courseId
 * @property {string} enrolledAt
 * @property {number} progress
 * @property {string[]} completedLessons
 */

const CourseContext = createContext(undefined)

// Mock data
const mockCourses = [
  {
    id: "1",
    title: "React Fundamentals",
    description: "Learn the basics of React including components, props, state, and hooks.",
    instructorId: "2",
    instructorName: "Jane Instructor",
    category: "Web Development",
    level: "beginner",
    duration: "8 hours",
    price: 99,
    thumbnail: "/react-course-thumbnail.png",
    enrolledStudents: 245,
    rating: 4.8,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
    isPublished: true,
  },
  {
    id: "2",
    title: "Advanced JavaScript",
    description: "Master advanced JavaScript concepts including closures, prototypes, and async programming.",
    instructorId: "2",
    instructorName: "Jane Instructor",
    category: "Programming",
    level: "advanced",
    duration: "12 hours",
    price: 149,
    thumbnail: "/javascript-advanced-course.png",
    enrolledStudents: 189,
    rating: 4.9,
    createdAt: "2024-02-01",
    updatedAt: "2024-02-05",
    isPublished: true,
  },
  {
    id: "3",
    title: "UI/UX Design Principles",
    description: "Learn the fundamentals of user interface and user experience design.",
    instructorId: "2",
    instructorName: "Jane Instructor",
    category: "Design",
    level: "intermediate",
    duration: "10 hours",
    price: 129,
    thumbnail: "/ui-ux-design-course.png",
    enrolledStudents: 156,
    rating: 4.7,
    createdAt: "2024-01-20",
    updatedAt: "2024-01-25",
    isPublished: true,
  },
]

const mockLessons = [
  {
    id: "1",
    courseId: "1",
    title: "Introduction to React",
    description: "What is React and why use it?",
    content: "React is a JavaScript library for building user interfaces...",
    videoUrl: "https://example.com/video1",
    duration: "15 min",
    order: 1,
    isPublished: true,
  },
  {
    id: "2",
    courseId: "1",
    title: "Components and JSX",
    description: "Learn about React components and JSX syntax",
    content: "Components are the building blocks of React applications...",
    videoUrl: "https://example.com/video2",
    duration: "20 min",
    order: 2,
    isPublished: true,
  },
  {
    id: "3",
    courseId: "1",
    title: "Props and State",
    description: "Understanding props and state in React",
    content: "Props are how components communicate with each other...",
    videoUrl: "https://example.com/video3",
    duration: "25 min",
    order: 3,
    isPublished: true,
  },
]

const mockEnrollments = [
  {
    id: "1",
    studentId: "1",
    courseId: "1",
    enrolledAt: "2024-02-10",
    progress: 66,
    completedLessons: ["1", "2"],
  },
]

export function CourseProvider({ children }) {
  const [courses, setCourses] = useState([])
  const [lessons, setLessons] = useState([])
  const [enrollments, setEnrollments] = useState([])

  useEffect(() => {
    // Load mock data
    setCourses(mockCourses)
    setLessons(mockLessons)
    setEnrollments(mockEnrollments)
  }, [])

  const createCourse = async (courseData) => {
    try {
      // Map frontend field names to backend expected names
      const payload = {
        ...courseData,
        instructor_id: courseData.instructorId,
        instructor_name: courseData.instructorName,
      };
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.courseId) {
        // Add new course to state
        setCourses((prev) => [
          ...prev,
          {
            ...courseData,
            _id: data.courseId,
            enrolledStudents: 0,
            rating: 0,
            createdAt: new Date().toISOString().split("T")[0],
            updatedAt: new Date().toISOString().split("T")[0],
          },
        ]);
      } else {
        alert(data.message || "Failed to create course.");
      }
    } catch (error) {
      alert("Failed to create course.");
    }
  }

  const updateCourse = (id, updates) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.id === id ? { ...course, ...updates, updatedAt: new Date().toISOString().split("T")[0] } : course,
      ),
    )
  }

  const deleteCourse = (id) => {
    // Try to delete from backend first
    fetch(`/api/courses/${id}`, {
      method: "DELETE"
    })
      .then(res => {
        if (res.ok) {
          setCourses((prev) => prev.filter((course) => (course._id || course.id) !== id))
          setLessons((prev) => prev.filter((lesson) => lesson.courseId !== id))
        } else {
          alert("Failed to delete course from server.");
        }
      })
      .catch(() => {
        alert("Failed to delete course from server.");
      });
  }

  const createLesson = (lessonData) => {
    const newLesson = {
      ...lessonData,
      id: Date.now().toString(),
    }
    setLessons((prev) => [...prev, newLesson])
  }

  const updateLesson = (id, updates) => {
    setLessons((prev) => prev.map((lesson) => (lesson.id === id ? { ...lesson, ...updates } : lesson)))
  }

  const deleteLesson = (id) => {
    setLessons((prev) => prev.filter((lesson) => lesson.id !== id))
  }

  const enrollInCourse = (studentId, courseId) => {
    const existingEnrollment = enrollments.find((e) => e.studentId === studentId && e.courseId === courseId)
    if (!existingEnrollment) {
      const newEnrollment = {
        id: Date.now().toString(),
        studentId,
        courseId,
        enrolledAt: new Date().toISOString().split("T")[0],
        progress: 0,
        completedLessons: [],
      }
      setEnrollments((prev) => [...prev, newEnrollment])

      // Update course enrolled students count
      setCourses((prev) =>
        prev.map((course) =>
          course.id === courseId ? { ...course, enrolledStudents: course.enrolledStudents + 1 } : course,
        ),
      )
    }
  }

  const updateProgress = (studentId, courseId, lessonId) => {
    setEnrollments((prev) =>
      prev.map((enrollment) => {
        if (enrollment.studentId === studentId && enrollment.courseId === courseId) {
          const completedLessons = [...enrollment.completedLessons]
          if (!completedLessons.includes(lessonId)) {
            completedLessons.push(lessonId)
          }

          const courseLessons = lessons.filter((l) => l.courseId === courseId)
          const progress = Math.round((completedLessons.length / courseLessons.length) * 100)

          return { ...enrollment, completedLessons, progress }
        }
        return enrollment
      }),
    )
  }

  const getCoursesByInstructor = (instructorId) => {
    return courses.filter((course) => course.instructorId === instructorId)
  }

  const getEnrollmentsByStudent = (studentId) => {
    return enrollments.filter((enrollment) => enrollment.studentId === studentId)
  }

  const getLessonsByCourse = (courseId) => {
    return lessons.filter((lesson) => lesson.courseId === courseId).sort((a, b) => a.order - b.order)
  }

  return (
    <CourseContext.Provider
      value={{
        courses,
        lessons,
        enrollments,
        createCourse,
        updateCourse,
        deleteCourse,
        createLesson,
        updateLesson,
        deleteLesson,
        enrollInCourse,
        updateProgress,
        getCoursesByInstructor,
        getEnrollmentsByStudent,
        getLessonsByCourse,
      }}
    >
      {children}
    </CourseContext.Provider>
  )
}

export function useCourses() {
  const context = useContext(CourseContext)
  if (context === undefined) {
    throw new Error("useCourses must be used within a CourseProvider")
  }
  return context
}
