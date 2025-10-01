"use client"

import { useCourses } from "@/lib/course-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { InstructorStats } from "@/components/dashboard/instructor-stats"
import { InstructorCourses } from "@/components/dashboard/instructor-courses"
import { CourseForm } from "@/components/courses/course-form"

export default function InstructorDashboard() {
  const { courses, createCourse, updateCourse, deleteCourse } = useCourses()
  const router = useRouter()

  const [user, setUser] = useState(null)
  const [instructorCourses, setInstructorCourses] = useState([])
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
  })
  const [showCourseForm, setShowCourseForm] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)

  // Get user from secure API
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" })
        if (!res.ok) throw new Error("Failed to fetch user info")
        const data = await res.json()
        if (data && data.user && data.user.role === "instructor") {
          setUser({ id: data.user._id || data.user.id, name: data.user.name, role: data.user.role })
        } else {
          setUser(null)
        }
      } catch (err) {
        setUser(null)
      }
    }
    fetchUser()
  }, [])

  // Fetch instructor courses and stats
  useEffect(() => {
    if (!user) return
    
    const fetchData = async () => {
      try {
        // Fetch courses
        const coursesRes = await fetch(`/api/courses?instructorId=${user.id}`)
        const coursesData = await coursesRes.json()
        setInstructorCourses(coursesData.courses || [])

        // Fetch real stats based on enrollments
        const statsRes = await fetch(`/api/users/${user.id}?stats=true`)
        const statsData = await statsRes.json()
        setStats(statsData)
      } catch (error) {
        console.error('Error fetching instructor data:', error)
        setInstructorCourses([])
        setStats({
          totalCourses: 0,
          totalStudents: 0,
          totalRevenue: 0,
        })
      }
    }
    
    fetchData()
  }, [user])

  // Handlers
  const handleCreateCourse = () => {
    setEditingCourse(null)
    setShowCourseForm(true)
  }

  const handleEditCourse = (course) => {
    setEditingCourse(course)
    setShowCourseForm(true)
  }

  const handleDeleteCourse = (courseId) => {
    if (confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      deleteCourse(courseId)
      setInstructorCourses(prev => prev.filter(c => (c._id || c.id) !== courseId))
    }
  }

  const handleViewCourse = (courseId) => {
    router.push(`/instructor/courses/${courseId}`)
  }

  const handleSubmitCourse = (courseData) => {
    if (editingCourse) {
      updateCourse(editingCourse.id, courseData)
      setInstructorCourses(prev =>
        prev.map(c => (c.id === editingCourse.id ? { ...c, ...courseData } : c))
      )
    } else {
      const newCourse = {
        ...courseData,
        instructorId: user.id,
        instructorName: user.name,
      }
      createCourse(newCourse)
      setInstructorCourses(prev => [...prev, newCourse])
    }
    setShowCourseForm(false)
    setEditingCourse(null)
  }

  const handleCancelCourse = () => {
    setShowCourseForm(false)
    setEditingCourse(null)
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-balance">Instructor Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage your courses and track your teaching performance</p>
      </div>

      <div className="space-y-8">
        {/* Stats */}
        <div className="shadow-lg rounded-xl bg-white p-6">
          <InstructorStats {...stats} />
        </div>

        {/* Courses */}
        <div className="shadow-lg rounded-xl bg-white p-6">
          <InstructorCourses
            courses={instructorCourses}
            onDelete={handleDeleteCourse}
            onView={handleViewCourse}
            onCreate={handleCreateCourse}
          />
        </div>
      </div>

      {/* Course Form Modal (no components/ui) */}
      {showCourseForm && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 z-50 overflow-y-auto"
          onClick={e => {
            if (e.target === e.currentTarget) {
              handleCancelCourse();
            }
          }}
        >
          <CourseForm
            course={editingCourse || null}
            onSubmit={handleSubmitCourse}
            onCancel={handleCancelCourse}
          />
        </div>
      )}
    </>
  )
}
