"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { CourseForm } from "@/components/courses/course-form"
import { Plus, Search, MoreVertical, Users, Star, Clock, BookOpen, Edit, Trash2, Eye } from "lucide-react"

export default function InstructorCoursesPage() {
  const [editLoading, setEditLoading] = useState(false);
  const demoCourses = [
    {
      id: "101",
      title: "React for Beginners",
      description: "Learn the basics of React and build interactive UIs.",
      status: "published",
      enrolledStudents: 42,
      rating: 4.7,
      duration: "6h",
      price: 49,
      thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
      createdAt: "2025-09-01"
    },
    {
      id: "102",
      title: "Advanced JavaScript",
      description: "Deep dive into ES6+ features and async programming.",
      status: "draft",
      enrolledStudents: 18,
      rating: 4.5,
      duration: "8h",
      price: 59,
      thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80",
      createdAt: "2025-08-15"
    }
  ]

  const [user, setUser] = useState(null)
  const [instructorCourses, setInstructorCourses] = useState(demoCourses)
  const [filteredCourses, setFilteredCourses] = useState(demoCourses)
  const [showCourseForm, setShowCourseForm] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userId = sessionStorage.getItem("userId")
      const name = sessionStorage.getItem("name")
      const role = sessionStorage.getItem("role")
      if (userId && role === "instructor") {
        setUser({ id: userId, name, role })
      }
    }
  }, [])

  useEffect(() => {
    if (!user) return
    const fetchCourses = async () => {
      try {
        const res = await fetch(`/api/courses?instructorId=${user.id}`)
        const data = await res.json()
        setInstructorCourses(data.courses || [])
      } catch {
        setInstructorCourses([])
      }
    }
    fetchCourses()
  }, [user])

  useEffect(() => {
    let filtered = [...instructorCourses]

    if (searchQuery) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((course) => course.status === statusFilter)
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "title":
          return a.title.localeCompare(b.title)
        case "students":
          return (b.enrolledStudents || 0) - (a.enrolledStudents || 0)
        default:
          return 0
      }
    })

    setFilteredCourses(filtered)
  }, [instructorCourses, searchQuery, statusFilter, sortBy])

  const router = useRouter()
  const handleCreateCourse = () => {
    router.push("/instructor/courses/new")
  }
  
  const handleEditCourse = async (course) => {
    console.log('Edit button clicked for course:', course);
    setEditLoading(true);
    
    try {
      // Try to fetch the full course data from the API
      const courseId = course._id || course.id;
      const res = await fetch(`/api/courses/${courseId}`);
      const data = await res.json();
      
      if (data.course) {
        setEditingCourse(data.course);
      } else {
        // Fallback to the course data we already have
        setEditingCourse(course);
      }
      setShowCourseForm(true);
    } catch (error) {
      console.error("Error fetching course:", error);
      // Fallback to the course data we already have
      setEditingCourse(course);
      setShowCourseForm(true);
    } finally {
      setEditLoading(false);
    }
  }
  
  const handleDeleteCourse = (courseId) => {
    if (confirm("Are you sure you want to delete this course?")) {
      fetch(`/api/courses/${courseId}`, {
        method: "DELETE"
      })
        .then(res => {
          if (res.ok) {
            setInstructorCourses(instructorCourses.filter((c) => (c._id || c.id) !== courseId))
          } else {
            alert("Failed to delete course.");
          }
        })
        .catch(() => {
          alert("Failed to delete course.");
        });
    }
  }
  
  const handleViewCourse = (courseId) => {
    router.push(`/instructor/courses/${courseId}`)
  }
  
  const handleSubmitCourse = (courseData) => {
    if (editingCourse) {
      // Update course in backend
      const courseId = editingCourse._id || editingCourse.id;
      fetch(`/api/courses/${courseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(courseData)
      })
        .then(res => res.json())
        .then(data => {
          if (data.course) {
            setInstructorCourses(
              instructorCourses.map((c) =>
                (c._id || c.id) === courseId
                  ? data.course
                  : c
              )
            );
          } else {
            // fallback: update local state only
            setInstructorCourses(
              instructorCourses.map((c) =>
                (c._id || c.id) === courseId
                  ? { ...editingCourse, ...courseData }
                  : c
              )
            );
          }
          setShowCourseForm(false);
          setEditingCourse(null);
        })
        .catch(() => {
          // fallback: update local state only
          setInstructorCourses(
            instructorCourses.map((c) =>
              (c._id || c.id) === courseId
                ? { ...editingCourse, ...courseData }
                : c
            )
          );
          setShowCourseForm(false);
          setEditingCourse(null);
        });
    } else {
      setInstructorCourses([
        ...instructorCourses,
        {
          ...courseData,
          id: String(Date.now()),
          instructorId: user.id,
          instructorName: user.name,
          status: "draft",
          enrolledStudents: 0,
          rating: 0,
          duration: "N/A",
          price: 0,
          thumbnail: "",
          createdAt: new Date().toISOString()
        }
      ]);
      setShowCourseForm(false);
      setEditingCourse(null);
    }
  }
  
  const handleCancelCourse = () => {
    setShowCourseForm(false)
    setEditingCourse(null)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Courses</h1>
          <p className="text-gray-500 mt-2">
            Manage and track all your courses • {instructorCourses.filter(c => c.status === "published").length} published / {instructorCourses.length} total
          </p>
        </div>
        <button
          onClick={handleCreateCourse}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Create New Course
        </button>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full border rounded-md px-3 py-2"
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border rounded-md px-3 py-2">
          <option value="all">All Courses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border rounded-md px-3 py-2">
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="title">Title A-Z</option>
          <option value="students">Most Students</option>
        </select>
      </div>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {searchQuery || statusFilter !== "all" ? "No courses found" : "No courses yet"}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your search or filters"
              : "Create your first course to get started"}
          </p>
          {!searchQuery && statusFilter === "all" && (
            <button onClick={handleCreateCourse} className="px-4 py-2 bg-blue-600 text-white rounded-md">
              Create Your First Course
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course._id || course.id} className="border rounded-lg shadow-sm hover:shadow-lg transition">
              {/* Thumbnail */}
              <div className="relative">
                <img
                  src={course.thumbnail || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full h-40 object-cover rounded-t-lg"
                />
                <span
                  className={`absolute top-2 right-2 px-2 py-1 rounded text-xs ${course.status === "published" ? "bg-green-600 text-white" : "bg-gray-300 text-black"
                    }`}
                >
                  {course.status}
                </span>
              </div>

              {/* Content */}
              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-lg">{course.title}</h3>
                <p className="text-sm text-gray-500">{course.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" /> {course.enrolledStudents} students
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" /> {course.rating}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" /> {course.duration}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-600">${course.price}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewCourse(course._id || course.id)}
                      className="px-2 py-1 border rounded hover:bg-gray-100"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEditCourse(course)}
                      className="px-2 py-1 border rounded hover:bg-gray-100"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course._id || course.id)}
                      className="px-2 py-1 border rounded text-red-600 hover:bg-gray-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Course Modal */}
      {showCourseForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingCourse ? "Edit Course" : "Create New Course"}
            </h2>
            {editLoading ? (
              <div className="text-center py-8 text-gray-500">Loading course data...</div>
            ) : (
              <CourseForm 
                course={editingCourse} 
                onSubmit={handleSubmitCourse} 
                onCancel={handleCancelCourse} 
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}