import { LessonCard } from "./lesson-card";

export function LessonList({
  lessons,
  onEdit,
  onDelete,
  onPlay,
  completedLessons = [],
  showActions = true,
  isInstructor = false,
  emptyMessage = "No lessons available",
}) {
  if (lessons.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {lessons.map((lesson) => (
        <LessonCard
          key={lesson.id}
          lesson={lesson}
          onEdit={onEdit}
          onDelete={onDelete}
          onPlay={onPlay}
          isCompleted={completedLessons.includes(lesson.id)}
          showActions={showActions}
          isInstructor={isInstructor}
        />
      ))}
    </div>
  );
}
