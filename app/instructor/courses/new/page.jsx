"use client"


import { useCourses } from "@/lib/course-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { CourseForm } from "@/components/courses/course-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function NewCoursePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

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
      <CourseForm onSubmit={handleSubmitCourse} onCancel={handleCancel} />
    </>
  );
}

