import React, { useState, useEffect } from 'react';
// Removed Link import to avoid nested anchor tags

const Course = ({ course, enrolled = false, width = "w-72", basePath = ""}) => {
    const [lessonCount, setLessonCount] = useState(0);
    const buttonText = enrolled ? "Go to courses" : "View Courses";

    useEffect(() => {
        const fetchLessonCount = async () => {
            try {
                const res = await fetch(`/api/courses/${course._id}/lessons`);
                if (res.ok) {
                    const data = await res.json();
                    setLessonCount(data.lessons ? data.lessons.length : 0);
                }
            } catch (error) {
                console.error('Error fetching lesson count:', error);
                setLessonCount(0);
            }
        };

        if (course._id) {
            fetchLessonCount();
        }
    }, [course._id]);

    return (
        <div className={`${width} bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition p-4`}>
            <img
                src={course.thumbnail || "/placeholder.svg"}
                alt={course.title}
                className="w-full h-48 object-cover rounded-md"
            />

            <div className="mt-4">
                <h2 className="text-lg font-semibold text-gray-800">{course.title}</h2>

                <div className="flex items-center mt-2">
                    {/* <span className="text-yellow-400 mr-2">★ {course.rating}</span> */}
                    {/* <span className="text-gray-500 text-sm">({course.reviews} reviews)</span> */}
                </div>

                <div className="mt-2">
                    <span className="text-gray-800 font-bold text-lg">${course.price}</span>
                </div>

                <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>{lessonCount} lessons</span>
                    {/* <span>{course.hours} hours</span> */}
                </div>

                <div className="mt-4 flex justify-center">
                    <button className="w-full bg-purple-700 rounded-2xl text-white py-2 hover:bg-purple-800 transition">
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Course;
