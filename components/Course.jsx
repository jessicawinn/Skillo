import React from 'react';
import Link from 'next/link';

const Course = ({ course, width = "w-72", basePath = ""}) => {
    const courseLink = `${basePath}/courses/${course._id}`;
    return (
        <div className={`${width} bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition p-4`}>
            <img
                src={course.image_url}
                alt={course.title}
                className="w-full h-48 object-cover rounded-md"
            />

            <div className="mt-4">
                <h2 className="text-lg font-semibold text-gray-800">{course.title}</h2>

                <div className="flex items-center mt-2">
                    <span className="text-yellow-400 mr-2">★ {course.rating}</span>
                    <span className="text-gray-500 text-sm">({course.reviews} reviews)</span>
                </div>

                <div className="mt-2">
                    <span className="text-gray-800 font-bold text-lg">${course.price}</span>
                </div>

                <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>{course.lesson} lessons</span>
                    <span>{course.hours} hours</span>
                </div>

                <div className="mt-4 flex justify-center">
                    <Link href={courseLink} className="w-[95%]">
                        <button className="w-full bg-purple-700 rounded-2xl text-white py-2 hover:bg-purple-800 transition">
                            View Course
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Course;
