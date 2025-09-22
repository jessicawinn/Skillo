"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, Users, TrendingUp, Star, Target, MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react"
export default function InstructorInsights() {
  // Hardcoded mock user and course analytics
  const user = {
    id: "1",
    name: "Jane Doe",
    role: "instructor",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg"
  }
  const instructorCourses = [
    {
      id: "101",
      title: "React Fundamentals",
      description: "Learn the basics of React and build interactive UIs.",
      status: "published",
      enrolledStudents: 156,
      rating: 4.8,
      duration: "6h",
      price: 49,
      thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
      createdAt: "2025-09-01"
    },
    {
      id: "102",
      title: "Advanced JavaScript",
      description: "Deep dive into ES6+ features and async programming.",
      status: "draft",
      enrolledStudents: 134,
      rating: 4.6,
      duration: "8h",
      price: 59,
      thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80",
      createdAt: "2025-08-15"
    },
    {
      id: "103",
      title: "Node.js Backend",
      description: "Build scalable backend APIs with Node.js.",
      status: "published",
      enrolledStudents: 98,
      rating: 4.4,
      duration: "7h",
      price: 39,
      thumbnail: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
      createdAt: "2025-07-10"
    },
    {
      id: "104",
      title: "UI/UX Design",
      description: "Master the principles of UI/UX for web apps.",
      status: "published",
      enrolledStudents: 87,
      rating: 4.9,
      duration: "5h",
      price: 55,
      thumbnail: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
      createdAt: "2025-06-20"
    }
  ]

  const analytics = {
    totalRevenue: instructorCourses.reduce((acc, course) => acc + (course.price * course.enrolledStudents), 0),
    monthlyGrowth: 12.5,
    completionRate: 78,
    averageRating: (
      instructorCourses.reduce((acc, course) => acc + course.rating, 0) / instructorCourses.length
    ).toFixed(1),
    topPerformingCourse: instructorCourses.reduce((prev, current) => {
      return (prev.enrolledStudents > current.enrolledStudents) ? prev : current
    }, instructorCourses[0]),
    studentEngagement: 85,
  }

  // Mock data for charts
  const revenueData = [
    { month: "Jan", revenue: 2400, students: 45 },
    { month: "Feb", revenue: 3200, students: 62 },
    { month: "Mar", revenue: 2800, students: 55 },
    { month: "Apr", revenue: 4100, students: 78 },
    { month: "May", revenue: 3600, students: 68 },
    { month: "Jun", revenue: 4800, students: 89 },
  ]

  const coursePerformanceData = [
    { name: "React Fundamentals", students: 156, completion: 82, rating: 4.8 },
    { name: "Advanced JavaScript", students: 134, completion: 75, rating: 4.6 },
    { name: "Node.js Backend", students: 98, completion: 68, rating: 4.4 },
    { name: "UI/UX Design", students: 87, completion: 91, rating: 4.9 },
  ]

  const studentActivityData = [
    { name: "Active", value: 65, color: "#8b5cf6" },
    { name: "Inactive", value: 25, color: "#f59e0b" },
    { name: "Completed", value: 10, color: "#3b82f6" },
  ]

  const commonFeedbacks = [
    {
      category: "Positive",
      type: "positive",
      feedbacks: [
        { text: "Great explanations and examples", count: 45, percentage: 78 },
        { text: "Well-structured course content", count: 38, percentage: 66 },
        { text: "Excellent practical exercises", count: 32, percentage: 55 },
        { text: "Clear and engaging delivery", count: 28, percentage: 48 },
      ],
    },
    {
      category: "Areas for Improvement",
      type: "negative",
      feedbacks: [
        { text: "Could use more real-world examples", count: 15, percentage: 26 },
        { text: "Some sections feel rushed", count: 12, percentage: 21 },
        { text: "Need more interactive elements", count: 8, percentage: 14 },
        { text: "Audio quality could be better", count: 5, percentage: 9 },
      ],
    },
  ]

  const getMaxValue = (data, key) => Math.max(...data.map((item) => item[key]))

  // Always render analytics, no loading state
  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-balance">Analytics & Insights</h1>
        <p className="text-muted-foreground mt-2">Track your teaching performance and student engagement</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics.totalRevenue}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />+{analytics.monthlyGrowth}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.completionRate}%</div>
            <Progress value={analytics.completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.averageRating}</div>
            <div className="flex items-center text-xs text-yellow-600">
              <Star className="h-3 w-3 mr-1 fill-current" />
              Excellent performance
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Student Engagement</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.studentEngagement}%</div>
            <div className="flex items-center text-xs text-blue-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              Above average
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue and student enrollment over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <div className="flex justify-between text-xs text-muted-foreground mb-6 px-2">
                <span>Revenue ($)</span>
                <span>Students</span>
              </div>

              <div className="relative h-64 bg-gradient-to-t from-purple-50/30 to-transparent rounded-lg p-4">
                <svg className="w-full h-full" viewBox="0 0 400 200">
                  {/* Grid lines */}
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />

                  {/* Revenue line */}
                  <polyline
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points="20,160 80,120 140,140 200,80 260,100 320,60"
                    className="drop-shadow-sm"
                  />

                  {/* Students line */}
                  <polyline
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points="20,140 80,100 140,120 200,70 260,85 320,50"
                    className="drop-shadow-sm"
                  />

                  {/* Data points */}
                  {revenueData.map((data, index) => {
                    const x = 20 + index * 60
                    const revenueY = 160 - ((data.revenue - 2400) / (4800 - 2400)) * 100
                    const studentsY = 140 - ((data.students - 45) / (89 - 45)) * 90

                    return (
                      <g key={index}>
                        <circle cx={x} cy={revenueY} r="4" fill="#8b5cf6" className="drop-shadow-sm" />
                        <circle cx={x} cy={studentsY} r="4" fill="#10b981" className="drop-shadow-sm" />
                      </g>
                    )
                  })}
                </svg>

                {/* Month labels */}
                <div className="flex justify-between mt-4 text-xs text-muted-foreground">
                  {revenueData.map((data, index) => (
                    <span key={index} className="text-center">
                      {data.month}
                    </span>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full" />
                  <span className="text-sm font-medium">Revenue</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-sm font-medium">Students</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Student Activity</CardTitle>
            <CardDescription>Current student engagement status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-6">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r="60" fill="none" stroke="#e5e7eb" strokeWidth="20" />
                  {studentActivityData.map((item, index) => {
                    const prevPercentage = studentActivityData
                      .slice(0, index)
                      .reduce((acc, curr) => acc + curr.value, 0)
                    const circumference = 2 * Math.PI * 60
                    const strokeDasharray = `${(item.value / 100) * circumference} ${circumference}`
                    const strokeDashoffset = -((prevPercentage / 100) * circumference)

                    return (
                      <circle
                        key={index}
                        cx="80"
                        cy="80"
                        r="60"
                        fill="none"
                        stroke={item.color}
                        strokeWidth="20"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-700 ease-out"
                        strokeLinecap="round"
                      />
                    )
                  })}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-xl font-bold">100%</div>
                    <div className="text-xs text-muted-foreground">Students</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 w-full max-w-xs">
                {studentActivityData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Course Performance</CardTitle>
          <CardDescription>Detailed analytics for each of your courses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {coursePerformanceData.map((course, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{course.name}</h3>
                    <Badge variant="secondary">{course.students} students</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Completion Rate:</span>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={course.completion} className="flex-1" />
                        <span className="font-medium">{course.completion}%</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Rating:</span>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{course.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Common Feedbacks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-purple-600" />
            Common Student Feedbacks
          </CardTitle>
          <CardDescription>Most frequent feedback themes from your students</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {commonFeedbacks.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  {category.type === "positive" ? (
                    <ThumbsUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <ThumbsDown className="h-4 w-4 text-orange-600" />
                  )}
                  <h3 className="font-semibold text-lg">{category.category}</h3>
                </div>
                <div className="space-y-3">
                  {category.feedbacks.map((feedback, index) => (
                    <div key={index} className="p-3 border rounded-lg bg-muted/30">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium">{feedback.text}</p>
                        <Badge
                          variant={category.type === "positive" ? "default" : "secondary"}
                          className={
                            category.type === "positive"
                              ? "bg-green-100 text-green-800"
                              : "bg-orange-100 text-orange-800"
                          }
                        >
                          {feedback.count} mentions
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={feedback.percentage} className="flex-1 h-2" />
                        <span className="text-xs text-muted-foreground font-medium">{feedback.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Course */}
      {analytics.topPerformingCourse && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Top Performing Course
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="aspect-video w-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                <img
                  src={
                    analytics.topPerformingCourse.thumbnail ||
                    "/placeholder.svg?height=80&width=120&query=course thumbnail"
                  }
                  alt={analytics.topPerformingCourse.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none"
                    e.target.nextSibling.style.display = "flex"
                  }}
                />
                <div className="w-full h-full hidden items-center justify-center">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-1">
                      <span className="text-white text-xs font-bold">
                        {analytics.topPerformingCourse.title.charAt(0)}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">Course</span>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{analytics.topPerformingCourse.title}</h3>
                <p className="text-muted-foreground mb-2 text-sm">{analytics.topPerformingCourse.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <Badge className="bg-green-100 text-green-800">
                    {analytics.topPerformingCourse.enrolledStudents} students
                  </Badge>
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {analytics.topPerformingCourse.rating}
                  </span>
                  <span className="font-medium">${analytics.topPerformingCourse.price}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
