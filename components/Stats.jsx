"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const Stats = () => {
    const [stats, setStats] = useState({
        completedCourses: 0,
        totalEnrolledCourses: 0,
        categoryProgress: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const userId = sessionStorage.getItem("userId");
                if (!userId) {
                    setLoading(false);
                    return;
                }

                const res = await fetch(`/api/enrollments?userId=${userId}`);
                const data = await res.json();

                if (res.ok && data.enrollments) {
                    // Process courses with progress and categorize
                    const coursesWithProgress = await Promise.all(
                        data.enrollments
                            .filter(enrollment => enrollment.course)
                            .map(async (enrollment) => {
                                let progress = 0;
                                try {
                                    const progressRes = await fetch(`/api/progress?userId=${userId}&courseId=${enrollment.course._id}`);
                                    const lessonsRes = await fetch(`/api/courses/${enrollment.course._id}/lessons`);
                                    
                                    if (progressRes.ok && lessonsRes.ok) {
                                        const progressData = await progressRes.json();
                                        const lessonsData = await lessonsRes.json();
                                        
                                        // Get valid lesson IDs and filter progress
                                        const validLessonIds = new Set(lessonsData.lessons.map(lesson => lesson._id));
                                        const validProgress = progressData.progress.filter(p => validLessonIds.has(p.lessonId));
                                        
                                        // Calculate percentage
                                        const totalContents = lessonsData.lessons.reduce((total, lesson) => total + (lesson.contents?.length || 0), 0);
                                        progress = totalContents > 0 ? Math.round((validProgress.length / totalContents) * 100) : 0;
                                    }
                                } catch (error) {
                                    console.error('Error calculating progress:', error);
                                }
                                
                                return { 
                                    ...enrollment.course, 
                                    progress,
                                    isCompleted: progress === 100
                                };
                            })
                    );

                    // Calculate stats
                    const completedCount = coursesWithProgress.filter(course => course.isCompleted).length;
                    const totalCount = coursesWithProgress.length;

                    // Group by category and calculate average progress
                    const categoryMap = {};
                    coursesWithProgress.forEach(course => {
                        const category = course.category || 'Other';
                        if (!categoryMap[category]) {
                            categoryMap[category] = { totalProgress: 0, count: 0, courses: [] };
                        }
                        categoryMap[category].totalProgress += course.progress;
                        categoryMap[category].count += 1;
                        categoryMap[category].courses.push(course);
                    });

                    const categoryProgress = Object.entries(categoryMap).map(([category, data]) => ({
                        category,
                        averageProgress: Math.round(data.totalProgress / data.count),
                        courseCount: data.count,
                        courses: data.courses
                    }));

                    setStats({
                        completedCourses: completedCount,
                        totalEnrolledCourses: totalCount,
                        categoryProgress
                    });
                }
            } catch (err) {
                console.error("Error fetching stats:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    // Simple pie chart colors
    const colors = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];

    if (loading) return <div className="p-8">Loading stats...</div>;
    return (
        <div className="flex gap-5 p-8">
            {/* Left side */}
            <div className="flex flex-col gap-5 flex-1">
                <div className="bg-gray-100 p-10 rounded h-24 flex items-center justify-start gap-4">
                    <Image
                        src="/Certificate.png"   
                        alt="Completed courses"
                        width={50}       
                        height={50}      
                        className="rounded-lg object-cover"
                    />
                    <div>
                        <div className="text-gray-600 text-sm">Completed Courses</div>
                        <div className="text-2xl font-bold text-purple-600">{stats.completedCourses}</div>
                    </div>
                </div>
                <div className="bg-gray-100 p-10 rounded h-24 flex items-center justify-start gap-4">
                    <Image
                        src="/Courses.png"   
                        alt="Total courses"
                        width={50}       
                        height={50}      
                        className="rounded-lg object-cover"
                    />
                    <div>
                        <div className="text-gray-600 text-sm">Total Enrolled</div>
                        <div className="text-2xl font-bold text-purple-600">{stats.totalEnrolledCourses}</div>
                    </div>
                </div>
            </div>

            {/* Right side - Category Progress */}
            <div className="flex-2">
                <div className="bg-gray-100 p-5 rounded h-56 flex flex-col">
                    <div className="text-lg font-semibold text-center mb-4">
                        Progress by Category
                    </div>
                    
                    {stats.categoryProgress.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center text-gray-500">
                            No enrolled courses
                        </div>
                    ) : (
                        <div className="flex flex-1">
                            {/* Simple visual representation */}
                            <div className="flex-1 flex flex-col justify-center space-y-3">
                                {stats.categoryProgress.slice(0, 4).map((category, index) => (
                                    <div key={category.category} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <div 
                                                className="w-4 h-4 rounded"
                                                style={{ backgroundColor: colors[index] }}
                                            ></div>
                                            <span className="text-sm font-medium">{category.category}</span>
                                            <span className="text-xs text-gray-500">({category.courseCount} courses)</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-16 bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className="h-2 rounded-full"
                                                    style={{ 
                                                        width: `${category.averageProgress}%`,
                                                        backgroundColor: colors[index]
                                                    }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-semibold">{category.averageProgress}%</span>
                                        </div>
                                    </div>
                                ))}
                                
                                {stats.categoryProgress.length > 4 && (
                                    <div className="text-xs text-gray-500 text-center">
                                        +{stats.categoryProgress.length - 4} more categories
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Stats
