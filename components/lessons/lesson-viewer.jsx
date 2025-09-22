"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Play, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";

export function LessonViewer({ lesson, isCompleted = false, onComplete, onNext, onPrevious, hasNext = false, hasPrevious = false, onBack }) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Course
            </Button>
          )}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline">Lesson {lesson.order}</Badge>
              {isCompleted && <CheckCircle className="h-4 w-4 text-green-600" />}
            </div>
            <h1 className="text-2xl font-bold">{lesson.title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{lesson.duration}</span>
        </div>
      </div>
      {/* Video Player */}
      {lesson.videoUrl && (
        <Card>
          <CardContent className="p-0">
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <video src={lesson.videoUrl} controls className="w-full h-full" />
            </div>
          </CardContent>
        </Card>
      )}
      {/* Content */}
      <Card>
        <CardContent>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: lesson.content }} />
        </CardContent>
      </Card>
      {/* Actions */}
      <div className="flex justify-between mt-6">
        <div>
          {hasPrevious && (
            <Button variant="outline" onClick={onPrevious}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Previous
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          {onComplete && !isCompleted && (
            <Button variant="success" onClick={onComplete}>
              <CheckCircle className="h-4 w-4 mr-2" /> Mark as Complete
            </Button>
          )}
          {hasNext && (
            <Button variant="outline" onClick={onNext}>
              Next <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
