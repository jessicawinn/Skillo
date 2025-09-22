"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Play, Clock } from "lucide-react";

export function EnrolledCourses({ enrollments, onContinue }) {
  if (enrollments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Courses</CardTitle>
          <CardDescription>You haven't enrolled in any courses yet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Browse available courses to start learning!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Courses</CardTitle>
        <CardDescription>Continue your learning journey</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {enrollments.map((enrollment) => (
            <div key={enrollment.id} className="flex items-center space-x-4 p-4 border rounded-lg">
              <div className="aspect-video w-24 bg-muted rounded overflow-hidden flex-shrink-0">
                <img
                  src={enrollment.course.thumbnail || "/placeholder.svg"}
                  alt={enrollment.course.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className="font-semibold truncate">{enrollment.course.title}</h3>
                    <p className="text-sm text-muted-foreground">by {enrollment.course.instructorName}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{enrollment.course.duration}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {enrollment.course.level}
                      </Badge>
                    </div>
                  </div>
                  <Button onClick={() => onContinue(enrollment.course.id)} size="sm">
                    <Play className="h-4 w-4 mr-1" /> Continue
                  </Button>
                </div>
                <Progress value={enrollment.progress} className="mt-2" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
