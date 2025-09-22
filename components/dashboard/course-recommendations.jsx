"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseList } from "@/components/courses/course-list";

export function CourseRecommendations({ courses, onEnroll, onView, enrolledCourseIds }) {
  const recommendedCourses = courses
    .filter((course) => course.isPublished && !enrolledCourseIds.includes(course.id))
    .slice(0, 6);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended for You</CardTitle>
        <CardDescription>Discover new courses to expand your skills</CardDescription>
      </CardHeader>
      <CardContent>
        <CourseList
          courses={recommendedCourses}
          onEnroll={onEnroll}
          onView={onView}
          enrolledCourseIds={enrolledCourseIds}
          emptyMessage="No recommendations available at the moment"
        />
      </CardContent>
    </Card>
  );
}
