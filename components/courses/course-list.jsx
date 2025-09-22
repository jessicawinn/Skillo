import { CourseCard } from "./course-card";

export function CourseList({
  courses,
  onEnroll,
  onView,
  showEnrollButton = true,
  enrolledCourseIds = [],
  emptyMessage = "No courses available",
}) {
  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          onEnroll={onEnroll}
          onView={onView}
          showEnrollButton={showEnrollButton}
          isEnrolled={enrolledCourseIds.includes(course.id)}
        />
      ))}
    </div>
  );
}
