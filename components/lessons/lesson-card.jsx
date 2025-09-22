"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Play, Edit, Trash2, CheckCircle } from "lucide-react";

export function LessonCard({ lesson, onEdit, onDelete, onPlay, isCompleted = false, showActions = true, isInstructor = false }) {
  return (
    <Card className={`hover:shadow-md transition-shadow ${isCompleted ? "bg-green-50 dark:bg-green-950" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">Lesson {lesson.order}</Badge>
              {!lesson.isPublished && (<Badge variant="secondary" className="text-xs">Draft</Badge>)}
              {isCompleted && <CheckCircle className="h-4 w-4 text-green-600" />}
            </div>
            <CardTitle className="text-lg">{lesson.title}</CardTitle>
            <CardDescription className="line-clamp-2">{lesson.description}</CardDescription>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{lesson.duration}</span>
          </div>
          {lesson.videoUrl && (
            <div className="flex items-center gap-1">
              <Play className="h-4 w-4" />
              <span>Video</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {showActions && (
          <div className="flex gap-2 mt-2">
            {isInstructor && (
              <Button size="sm" variant="outline" onClick={() => onEdit && onEdit(lesson)}>
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
            )}
            {isInstructor && (
              <Button size="sm" variant="destructive" onClick={() => onDelete && onDelete(lesson.id)}>
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            )}
            {!isInstructor && (
              <Button size="sm" onClick={() => onPlay && onPlay(lesson)}>
                <Play className="h-4 w-4 mr-1" /> Play
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
