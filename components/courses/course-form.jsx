"use client";
import { useState } from "react";

export function CourseForm({ course, onSubmit, onCancel, isLoading = false }) {
  const [formData, setFormData] = useState({
    title: course?.title || "",
    description: course?.description || "",
    category: course?.category || "",
    level: course?.level || "beginner",
    duration: course?.duration || "",
    price: course?.price || 0,
    thumbnail: course?.thumbnail || "",
    isPublished: course?.isPublished || false,
    learningPoints: course?.learningPoints || [""],
    tools: course?.tools || [""],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-2">
        {course ? "Edit Course" : "Create New Course"}
      </h2>
      <p className="text-gray-600 mb-6">
        {course
          ? "Update your course information"
          : "Fill in the details to create a new course"}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block font-medium mb-1">
            Course Title
          </label>
          <input
            id="title"
            type="text"
            className="w-full border rounded px-3 py-2"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Enter course title"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block font-medium mb-1">
            Description
          </label>
          <textarea
            id="description"
            className="w-full border rounded px-3 py-2"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Enter course description"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block font-medium mb-1">
            Category
          </label>
          <input
            id="category"
            type="text"
            className="w-full border rounded px-3 py-2"
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
            placeholder="Enter course category"
            required
          />
        </div>

        {/* Level */}
        <div>
          <label htmlFor="level" className="block font-medium mb-1">
            Level
          </label>
          <select
            id="level"
            className="w-full border rounded px-3 py-2"
            value={formData.level}
            onChange={(e) => handleChange("level", e.target.value)}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {/* Duration */}
        <div>
          <label htmlFor="duration" className="block font-medium mb-1">
            Duration
          </label>
          <input
            id="duration"
            type="text"
            className="w-full border rounded px-3 py-2"
            value={formData.duration}
            onChange={(e) => handleChange("duration", e.target.value)}
            placeholder="Enter course duration"
            required
          />
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block font-medium mb-1">
            Price
          </label>
          <input
            id="price"
            type="number"
            className="w-full border rounded px-3 py-2"
            value={formData.price}
            onChange={(e) => handleChange("price", e.target.value)}
            placeholder="Enter course price"
            required
          />
        </div>

        {/* Thumbnail */}
        <div>
          <label htmlFor="thumbnail" className="block font-medium mb-1">
            Thumbnail URL
          </label>
          <input
            id="thumbnail"
            type="text"
            className="w-full border rounded px-3 py-2"
            value={formData.thumbnail}
            onChange={(e) => handleChange("thumbnail", e.target.value)}
            placeholder="Enter thumbnail URL"
          />
        </div>

        {/* Published */}
        <div className="flex items-center gap-2">
          <input
            id="isPublished"
            type="checkbox"
            checked={formData.isPublished}
            onChange={(e) => handleChange("isPublished", e.target.checked)}
          />
          <label htmlFor="isPublished" className="font-medium">
            Published
          </label>
        </div>

        {/* Learning Points */}
        <div>
          <label className="block font-medium mb-1">
            Learning Points (bullet points)
          </label>
          {formData.learningPoints.map((point, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="text"
                className="flex-1 border rounded px-3 py-2"
                value={point}
                onChange={(e) => {
                  const newPoints = [...formData.learningPoints];
                  newPoints[idx] = e.target.value;
                  handleChange("learningPoints", newPoints);
                }}
                placeholder={`Learning point #${idx + 1}`}
              />
              <button
                type="button"
                className="px-3 py-2 border rounded text-red-600"
                onClick={() => {
                  const newPoints = formData.learningPoints.filter(
                    (_, i) => i !== idx
                  );
                  handleChange("learningPoints", newPoints.length ? newPoints : [""]);
                }}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="px-3 py-2 bg-gray-100 rounded"
            onClick={() =>
              handleChange("learningPoints", [...formData.learningPoints, ""])
            }
          >
            Add Point
          </button>
        </div>

        {/* Tools/Skills */}
        <div>
          <label className="block font-medium mb-1">
            Tools / Skills
          </label>
          {formData.tools.map((tool, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="text"
                className="flex-1 border rounded px-3 py-2"
                value={tool}
                onChange={(e) => {
                  const newTools = [...formData.tools];
                  newTools[idx] = e.target.value;
                  handleChange("tools", newTools);
                }}
                placeholder={`Tool/Skill #${idx + 1}`}
              />
              <button
                type="button"
                className="px-3 py-2 border rounded text-red-600"
                onClick={() => {
                  const newTools = formData.tools.filter((_, i) => i !== idx);
                  handleChange("tools", newTools.length ? newTools : [""]);
                }}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="px-3 py-2 bg-gray-100 rounded"
            onClick={() => handleChange("tools", [...formData.tools, ""])}
          >
            Add Tool/Skill
          </button>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading
              ? "Saving..."
              : course
              ? "Update Course"
              : "Create Course"}
          </button>
          <button
            type="button"
            className="px-4 py-2 border rounded"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
