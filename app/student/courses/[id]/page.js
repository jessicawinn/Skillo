"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CourseDetails from "@/components/CourseDetails";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const CoursePage = () => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // If you are using Next.js dynamic route: /student/course/[id]
  const { id } = useParams();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/courses/get/${id}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Failed to fetch course");
          return;
        }

        // Merge with defaults for missing fields
        const defaultCourse = {
          category: "General",
          rating: 4.0,
          reviews: 0,
          shortDescription: "No description",
          lessonCount: 0,
          duration: "0 hrs",
          certificate: false,
          students: 0,
          about: "No details available",
          learningPoints: [],
          tools: [],
          curriculum: [],
          modules: [],
        };

        setCourse({ ...defaultCourse, ...data.course });
      } catch (err) {
        setError("Something went wrong");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) return <p>Loading course...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!course) return <p>No course found</p>;

  return (
    <>
      <NavBar />
      <CourseDetails course={course} />
      <Footer />
    </>
  );
};

export default CoursePage;
