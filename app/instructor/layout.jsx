"use client"

import React, { useEffect, useState } from "react"
import { CourseProvider } from "@/lib/course-context"
import { useRouter } from "next/navigation"
import { InstructorNav } from "@/components/layout/instructor-nav"

export default function InstructorLayout({ children }) {
  const [loading, setLoading] = useState(true)
  const [isInstructor, setIsInstructor] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Delay to ensure sessionStorage is available
    const checkAuth = () => {
      const userId = typeof window !== "undefined" ? sessionStorage.getItem("userId") : null
      const role = typeof window !== "undefined" ? sessionStorage.getItem("role") : null

      if (!userId) {
        router.replace("/auth")
        return
      }
      if (role !== "instructor") {
        router.replace("/student/dashboard")
        return
      }
      setIsInstructor(true)
    }
    checkAuth()
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isInstructor) {
    return null
  }

  return (
    <CourseProvider>
      <div className="min-h-screen bg-background">
        <InstructorNav />
        <main className="container mx-auto px-4 py-8">{children}</main>
      </div>
    </CourseProvider>
  )
}
