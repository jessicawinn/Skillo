"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { ArrowLeft, Plus, Edit } from "lucide-react"
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
    isPublished: true,
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
    isPublished: false,
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
  }, [courseId]);

  const handleEditCourse = () => setShowEditCourseForm(true)
  const handleCancelEditCourse = () => setShowEditCourseForm(false)

  const handleSubmitEditCourse = (updatedData) => {
    // Update course in backend
    fetch(`/api/courses/${courseId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedData)
    })
      .then(res => res.json())
      .then(data => {
        if (data.course) {
          setCourse(data.course);
        } else {
          // fallback: update local state only
          setCourse((prev) => ({ ...prev, ...updatedData }));
        }
        setShowEditCourseForm(false);
      })
      .catch(() => {
        // fallback: update local state only
        setCourse((prev) => ({ ...prev, ...updatedData }));
        setShowEditCourseForm(false);
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
        {/* Back */}
        <button
          onClick={() => router.push("/instructor/courses")}
          className="flex items-center gap-2 px-3 py-2 border rounded hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Courses
        </button>

        {/* Course Card */}
        <div className="bg-white shadow rounded mt-6">
          <img
            src={course.thumbnail || "/placeholder.svg"}
            alt={course.title}
            className="w-full h-64 object-cover rounded-t"
          />
          <div className="p-6">
            <div className="flex justify-between">
              <div>
                <span className={`px-2 py-1 text-sm rounded ${getLevelColor(course.level)}`}>
                  {course.level}
                </span>
                {!course.isPublished && (
                  <span className="ml-2 px-2 py-1 text-sm bg-gray-200 rounded">Draft</span>
                )}
                <h2 className="text-2xl font-bold mt-2">{course.title}</h2>
                <p className="mt-2 text-gray-600">{course.description}</p>
              </div>
              <button
                onClick={handleEditCourse}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <Edit className="h-4 w-4" /> Edit Course
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div>
                <p className="font-medium">Students</p>
                <p>{course.students}</p>
              </div>
              <div>
                <p className="font-medium">Price</p>
                <p>${course.price}</p>
              </div>
              <div>
                <p className="font-medium">Rating</p>
                <p>{course.rating}/5</p>
              </div>
              <div>
                <p className="font-medium">Lessons</p>
                <p>{lessons.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lessons */}
        <div className="bg-white shadow rounded mt-8 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Course Lessons</h3>
              <p className="text-gray-500">Manage your course content</p>
            </div>
            <button
              onClick={handleCreateLesson}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              <Plus className="h-4 w-4" /> Add Lesson
            </button>
          </div>

          {lessons.length === 0 ? (
            <p className="text-gray-500 mt-4">No lessons yet. Add one!</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {lessons.map((lesson) => (
                <li
                  key={lesson.id}
                  className="flex justify-between items-center border p-3 rounded"
                >
                  <span>{lesson.title || `Lesson ${lesson.id}`}</span>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEditLesson(lesson)}
                      className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteLesson(lesson.id)}
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      {/* Edit Course Modal using CourseForm */}
      {showEditCourseForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto p-4">
          <div className="bg-white w-full max-w-2xl p-6 rounded shadow">
            <CourseForm
              course={course}
              onSubmit={handleSubmitEditCourse}
              onCancel={handleCancelEditCourse}
            />
          </div>
        </div>
      )}

      {/* Lesson Modal */}
      {showLessonForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto p-4">
          <div className="bg-white w-full max-w-2xl p-6 rounded shadow">
            {/* Use LessonForm component for lesson creation/editing */}
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
