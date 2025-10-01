"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { ArrowLeft, Plus, Edit, Users, DollarSign, Star, BookOpen, Clock, Eye, Trash2 } from "lucide-react"
import { CourseForm } from "@/components/courses/course-form";
import { LessonForm } from "@/components/lessons/lesson-form";

const demoCourses = [
  {
    id: "101",
    title: "React for Beginners",
    description: "Learn the basics of React and build interactive UIs.",
    level: "beginner",
    students: 42,
    rating: 4.7,
    price: 49,
    thumbnail:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    lessons: [],
  },
  {
    id: "102",
    title: "Advanced Node.js",
    description: "Deep dive into Node.js and backend architecture.",
    level: "advanced",
    students: 20,
    rating: 4.9,
    price: 79,
    thumbnail:
      "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=400&q=80",
    lessons: [],
  },
]

const getLevelColor = (level) => {
  switch (level) {
    case "beginner":
      return "bg-green-100 text-green-800"
    case "intermediate":
      return "bg-yellow-100 text-yellow-800"
    case "advanced":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function CoursePage() {
  const [showEditCourseForm, setShowEditCourseForm] = useState(false)
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lessons, setLessons] = useState([])
  const [showLessonForm, setShowLessonForm] = useState(false)
  const [editingLesson, setEditingLesson] = useState(null)
  const [images, setImages] = useState([])
  const [imageLoading, setImageLoading] = useState(false)
  const [enrolledStudents, setEnrolledStudents] = useState(0)
  const [newThumbnailFile, setNewThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const params = useParams()
  const router = useRouter()
  const courseId = params.id

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/courses/${courseId}`);
        const data = await res.json();
        if (data.course) {
          setCourse(data.course);
          // If lessons are not populated, fetch them from lessons API
          if (Array.isArray(data.course.lessons) && data.course.lessons.length > 0) {
            setLessons(data.course.lessons);
          } else {
            // Fetch lessons for this course
            const lessonsRes = await fetch(`/api/courses/${courseId}/lessons`);
            const lessonsData = await lessonsRes.json();
            setLessons(lessonsData.lessons || []);
          }
        } else {
          setCourse(demoCourses[0]); // fallback demo
        }
      } catch {
        setCourse(demoCourses[0]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
    // Fetch enrolled students count
    const fetchEnrolledStudents = async () => {
      try {
        const enrollmentsRes = await fetch(`/api/enrollments?courseId=${courseId}`);
        const enrollmentsData = await enrollmentsRes.json();
        setEnrolledStudents(Array.isArray(enrollmentsData.enrollments) ? enrollmentsData.enrollments.length : 0);
      } catch {
        setEnrolledStudents(0);
      }
    };
    fetchEnrolledStudents();
  }, [courseId]);

    // Fetch images from Azure Blob Storage using your API
    useEffect(() => {
      const fetchImages = async () => {
        setImageLoading(true);
        try {
          // Fetch image URLs from your API (no instructorId needed)
          const imagesRes = await fetch(`/api/get-images?courseId=${courseId}`);
          const imagesData = await imagesRes.json();
          console.log("Fetched image URLs:", imagesData.urls);
          setImages(imagesData.urls || []);
        } catch (err) {
          console.error("Error fetching images:", err);
          setImages([]);
        } finally {
          setImageLoading(false);
        }
      };
      fetchImages();
    }, [courseId]);

  const handleEditCourse = () => {
    setThumbnailPreview(images[0] || course?.thumbnail || "");
    setShowEditCourseForm(true);
  }
  const handleCancelEditCourse = () => setShowEditCourseForm(false)

  const handleSubmitEditCourse = async (updatedData) => {
    let thumbnailUrl = thumbnailPreview;
    // If a new image file is selected, replace the image in Azure
    if (newThumbnailFile) {
      const formData = new FormData();
      formData.append("courseId", courseId);
      formData.append("oldImageUrl", images[0] || course?.thumbnail || "");
      formData.append("newImage", newThumbnailFile);
      try {
        const res = await fetch("/api/replace-image", {
          method: "POST",
          body: formData
        });
        const data = await res.json();
        thumbnailUrl = data.url;
      } catch (err) {
        console.error("Image replace error", err);
      }
    }
    // Update course info with new thumbnail
    fetch(`/api/courses/${courseId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ...updatedData, thumbnail: thumbnailUrl })
    })
      .then(res => res.json())
      .then(data => {
        if (data.course) {
          setCourse(data.course);
        } else {
          setCourse((prev) => ({ ...prev, ...updatedData, thumbnail: thumbnailUrl }));
        }
        setShowEditCourseForm(false);
        setNewThumbnailFile(null);
        setThumbnailPreview("");
      })
      .catch(() => {
        setCourse((prev) => ({ ...prev, ...updatedData, thumbnail: thumbnailUrl }));
        setShowEditCourseForm(false);
        setNewThumbnailFile(null);
        setThumbnailPreview("");
      });
  }

  const handleCreateLesson = () => {
    setEditingLesson(null)
    setShowLessonForm(true)
  }

  const handleEditLesson = (lesson) => {
    // Map lesson.contents to subContents for the form
    const lessonForEdit = {
      ...lesson,
      subContents: Array.isArray(lesson.contents) ? lesson.contents : [],
    };
    setEditingLesson(lessonForEdit);
    setShowLessonForm(true);
  }

  const handleDeleteLesson = (id) => {
    if (confirm("Delete this lesson?")) {
      // Find the lesson object to get _id if available
      const lesson = lessons.find((l) => l.id === id || l._id === id);
      const lessonId = lesson?._id || lesson?.id || id;
      fetch(`/api/courses/${courseId}/lessons`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ lessonId })
      })
        .then(res => res.json())
        .then(data => {
          if (data.message) {
            setLessons(lessons.filter((l) => (l._id || l.id) !== lessonId));
          } else {
            alert("Failed to delete lesson.");
          }
        })
        .catch(() => {
          alert("Failed to delete lesson.");
        });
    }
  }

  const handleSubmitLesson = (lessonData) => {
    if (editingLesson) {
      // Send PUT request to update lesson and contents
      const lessonId = editingLesson._id || editingLesson.id;
      const payload = {
        lessonId,
        title: lessonData.title,
        order: lessonData.order,
        contents: lessonData.subContents || [],
      };
      fetch(`/api/courses/${courseId}/lessons`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
        .then(res => res.json())
        .then(data => {
          if (data.message) {
            // Refetch lessons for up-to-date info
            fetch(`/api/courses/${courseId}/lessons`)
              .then(res => res.json())
              .then(lessonsData => {
                setLessons(lessonsData.lessons || []);
              });
          } else {
            alert('Failed to update lesson.');
          }
          setShowLessonForm(false);
          setEditingLesson(null);
        })
        .catch(() => {
          alert('Failed to update lesson.');
          setShowLessonForm(false);
          setEditingLesson(null);
        });
    } else {
      // For new lesson, POST to API with correct payload
      const payload = {
        title: lessonData.title,
        order: lessonData.order,
        contents: lessonData.subContents || [],
      };
      fetch(`/api/courses/${courseId}/lessons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
        .then(res => res.json())
        .then(data => {
          if (data.lessonId) {
            // Add to local state (minimal info, ideally refetch lessons)
            setLessons([...lessons, {
              id: data.lessonId,
              title: payload.title,
              order: payload.order,
              contents: payload.contents
            }]);
          } else {
            // fallback: add locally
            setLessons([...lessons, { ...lessonData, id: String(Date.now()) }]);
          }
          setShowLessonForm(false);
          setEditingLesson(null);
        })
        .catch(() => {
          setLessons([...lessons, { ...lessonData, id: String(Date.now()) }]);
          setShowLessonForm(false);
          setEditingLesson(null);
        });
    }
  }

  if (loading) return <div className="p-8">Loading...</div>
  if (!course) return <div className="p-8">Course not found</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push("/instructor/courses")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md font-medium text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Courses
        </button>

        {/* Course Hero Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mt-6">
          <div className="relative">
            <img
              src={images[0] || course.thumbnail || "/placeholder.svg"}
              alt={course.title}
              className="w-full h-80 object-cover"
            />
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(course.level)} shadow-lg`}>
                    {course.level}
                  </span>
                  <h1 className="text-3xl font-bold text-white mt-2 drop-shadow-lg">{course.title}</h1>
                </div>
                <button
                  onClick={handleEditCourse}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/90 backdrop-blur-sm text-gray-900 rounded-lg hover:bg-white transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                >
                  <Edit className="h-4 w-4" /> 
                  Edit Course
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <p className="text-gray-600 text-lg leading-relaxed mb-8">{course.description}</p>

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-600 rounded-lg">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-purple-700 font-medium">Students</span>
                </div>
                <p className="text-2xl font-bold text-purple-900">{enrolledStudents}</p>
                <p className="text-purple-600 text-sm">Enrolled</p>
              </div>
              
              <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-600 rounded-lg">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-purple-700 font-medium">Price</span>
                </div>
                <p className="text-2xl font-bold text-purple-900">${course.price || 0}</p>
                <p className="text-purple-600 text-sm">Per enrollment</p>
              </div>
              
              <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-600 rounded-lg">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-purple-700 font-medium">Lessons</span>
                </div>
                <p className="text-2xl font-bold text-purple-900">{lessons.length}</p>
                <p className="text-purple-600 text-sm">Total content</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Lessons Section */}
        <div className="bg-white rounded-2xl shadow-xl mt-8 overflow-hidden">
          <div className="bg-purple-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Course Lessons</h3>
                  <p className="text-purple-100">Manage your course content and structure</p>
                </div>
              </div>
              <button
                onClick={handleCreateLesson}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/90 backdrop-blur-sm text-purple-900 rounded-lg hover:bg-white transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              >
                <Plus className="h-4 w-4" /> 
                Add Lesson
              </button>
            </div>
          </div>

          <div className="p-8">
            {lessons.length === 0 ? (
              <div className="text-center py-12">
                <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No lessons yet</h4>
                <p className="text-gray-500 mb-6">Start building your course by adding your first lesson</p>
                <button
                  onClick={handleCreateLesson}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                >
                  <Plus className="h-4 w-4" />
                  Create First Lesson
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {lessons
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map((lesson, index) => (
                    <div
                      key={lesson.id || lesson._id}
                      className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-10 h-10 bg-purple-100 text-purple-600 rounded-full font-bold">
                            {lesson.order || index + 1}
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">
                              {lesson.title || `Lesson ${lesson.id}`}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {lesson.contents?.length || 0} content sections
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                Lesson {lesson.order || index + 1}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditLesson(lesson)}
                            className="inline-flex items-center gap-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                          >
                            <Edit className="h-3 w-3" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteLesson(lesson.id)}
                            className="inline-flex items-center gap-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                          >
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Enhanced Edit Course Modal */}
      {showEditCourseForm && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 z-50 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCancelEditCourse();
            }
          }}
        >
          <div className="w-full max-w-5xl my-8">
            <CourseForm
              course={course}
              onSubmit={handleSubmitEditCourse}
              onCancel={handleCancelEditCourse}
              thumbnail={thumbnailPreview}
              onImageUpload={file => {
                setNewThumbnailFile(file);
                setThumbnailPreview(file ? URL.createObjectURL(file) : images[0] || course?.thumbnail || "");
              }}
            />
          </div>
        </div>
      )}

      {/* Enhanced Lesson Modal */}
      {showLessonForm && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 z-50 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowLessonForm(false);
              setEditingLesson(null);
            }
          }}
        >
          <div className="w-full max-w-5xl my-8">
            <LessonForm
              lesson={editingLesson}
              courseId={courseId}
              onSubmit={handleSubmitLesson}
              onCancel={() => {
                setShowLessonForm(false);
                setEditingLesson(null);
              }}
              maxOrder={lessons.length}
            />
          </div>
        </div>
      )}
    </div>
  )
}
