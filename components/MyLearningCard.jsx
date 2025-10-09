"use client";
import React from "react";
import Link from "next/link";

const MyLearningCard = ({ id, title, image, progress }) => {
  const isComplete = progress === 100;

  return (
    <div className="m-4">
      <div className="rounded-lg border border-gray-300 shadow-md p-6 bg-white w-80">
        <img
          src={image}
          alt={title}
          className="w-full h-40 object-cover rounded-md mb-4"
        />

        <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div
            className={`h-2 rounded-full ${isComplete ? "bg-green-600" : "bg-purple-700"}`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-gray-600 text-sm mb-4">
          {isComplete ? "Completed" : `${progress}% Complete`}
        </p>

        {isComplete ? (
          <Link href={`/student/mylearning/${id}`} className="w-full">
            <button className="w-full py-2 rounded-lg text-white bg-green-600 hover:bg-green-700 transition">
              Review Course
            </button>
          </Link>
        ) : (
          <Link href={`/student/mylearning/${id}`} className="w-full">
            <button className="w-full py-2 rounded-lg text-white bg-purple-700 hover:bg-purple-800 transition">
              Continue
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default MyLearningCard;
