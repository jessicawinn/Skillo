"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { CourseForm } from "@/components/courses/course-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function NewCoursePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [thumbnail, setThumbnail] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [courseId, setCourseId] = useState(null);

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
    if (user.role !== "instructor") {
      router.push("/student/dashboard");
      return;
    }
  }, [user, router]);


  // Store file in state when selected
  const handleImageSelect = (file) => {
    setSelectedFile(file);
  };

  // Upload image after course creation
  const uploadImageAfterCourse = async (file, instructorId, courseId) => {
    if (!file || !instructorId || !courseId) return;
    const formDataObj = new FormData();
    formDataObj.append("file", file);
    formDataObj.append("instructorId", instructorId);
    formDataObj.append("courseId", courseId);
    try {
      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: formDataObj,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setThumbnail(data.url);
        return data.url;
      }
    } catch (err) {
      setThumbnail("");
    }
    return "";
  };

  // Submit course, then upload image if selected
  const handleSubmitCourse = async (courseData) => {
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...courseData,
          instructor_id: user.id,
          instructorName: user.name,
        }),
      });
      const result = await res.json();
      if (res.ok && result.courseId) {
        setCourseId(result.courseId);
        let imageUrl = "";
        // If file selected, upload image
        if (selectedFile) {
          imageUrl = await uploadImageAfterCourse(selectedFile, user.id, result.courseId);
        }
        // Optionally, PATCH course to add thumbnail
        if (imageUrl) {
          await fetch(`/api/courses/${result.courseId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ thumbnail: imageUrl }),
          });
        }
        router.push(`/instructor/courses/${result.courseId}`);
      } else {
        router.push("/instructor/courses");
      }
    } catch (error) {
      router.push("/instructor/courses");
    }
  };

  const handleCancel = () => {
    router.push("/instructor/courses");
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="mb-8">
        <Button variant="outline" onClick={() => router.push("/instructor/courses")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </Button>
      </div>
      <CourseForm
        onSubmit={handleSubmitCourse}
        onCancel={handleCancel}
        onImageUpload={handleImageSelect}
        thumbnail={thumbnail}
      />
    </>
  );
}

