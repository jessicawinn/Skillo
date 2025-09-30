"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { CourseForm } from "@/components/courses/course-form"
import { Plus, Search, DollarSign, Users, Star, Clock, BookOpen, Edit, Trash2, Eye } from "lucide-react"

export default function InstructorCoursesPage() {
  const [editLoading, setEditLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(null)
  const [instructorCourses, setInstructorCourses] = useState([])
  const [filteredCourses, setFilteredCourses] = useState([])
  const [showCourseForm, setShowCourseForm] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" })
        if (!res.ok) return
        const data = await res.json()
        if (data.user && data.user.role === "instructor") {
          setUser({ id: data.user._id || data.user.id, name: data.user.name, role: data.user.role })
        }
      } catch (err) {}
    }
    fetchUser()
  }, [])

  useEffect(() => {
    if (!user) return;
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/courses?instructorId=${user.id}`);
        const data = await res.json();
        const courses = data.courses || [];
        // For each course, fetch its thumbnail from storage
        const coursesWithThumbnails = await Promise.all(
          courses.map(async (course) => {
            try {
              const courseId = course._id || course.id;
              const imagesRes = await fetch(`/api/get-images?courseId=${courseId}`);
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
        setInstructorCourses(coursesWithThumbnails);
      } catch {
        setInstructorCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [user]);

  useEffect(() => {
    let filtered = [...instructorCourses]

    if (searchQuery) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
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
  }, [instructorCourses, searchQuery, sortBy])

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
            Manage and track all your courses • {instructorCourses.length} total
          </p>
        </div>
        <button
          onClick={handleCreateCourse}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
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
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border rounded-md px-3 py-2">
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="title">Title A-Z</option>
          <option value="students">Most Students</option>
        </select>
      </div>

      {/* Course Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold mb-2">Loading courses...</h3>
          <p className="text-gray-500">Please wait while we fetch your courses</p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {searchQuery ? "No courses found" : "No courses yet"}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchQuery
              ? "Try adjusting your search"
              : "Create your first course to get started"}
          </p>
          {!searchQuery && (
            <button onClick={handleCreateCourse} className="px-4 py-2 bg-purple-600 text-white rounded-md">
              Create Your First Course
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course._id || course.id} className="relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
              {/* Thumbnail */}
              <div className="relative">
                <img
                  src={course.thumbnail || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Course
                  </span>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{course.rating || 0}</span>
                  </div>
                </div>
                
                <h3 className="font-semibold text-lg mb-2 text-gray-900 line-clamp-2">{course.title}</h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{course.description}</p>
                
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{course.enrolledStudents || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    <span>${course.price || 0}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewCourse(course._id || course.id)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 flex-1 justify-center"
                  >
                    <Eye className="h-4 w-4 mr-1" /> View
                  </button>
                  <button
                    onClick={() => handleEditCourse(course)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 flex-1 justify-center"
                  >
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course._id || course.id)}
                    className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Course Modal */}
      {showCourseForm && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 z-50 overflow-y-auto"
          onClick={e => {
            if (e.target === e.currentTarget) {
              handleCancelCourse();
            }
          }}
        >
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
      )}
    </div>
  )
}