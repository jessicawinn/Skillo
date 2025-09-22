"use client";
import { useState } from "react";
import { X, Plus, Minus, Upload, Eye } from "lucide-react";

export function CourseForm({ course, onSubmit, onCancel, isLoading = false }) {
  const [formData, setFormData] = useState({
    title: course?.title || "",
    description: course?.description || "",
    category: course?.category || "",
    level: course?.level || "beginner",
    duration: course?.duration || "",
    price: course?.price || 0,
    thumbnail: course?.thumbnail || "",
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
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-purple-600 px-8 py-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              {course ? "Edit Course" : "Create New Course"}
            </h2>
            <p className="text-blue-100 mt-1">
              {course
                ? "Update your course information"
                : "Fill in the details to create a new course"}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        {/* Basic Information Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
            Basic Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Course Title *
              </label>
              <input
                id="title"
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter an engaging course title"
                required
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Describe what students will learn in this course"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <input
                id="category"
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                placeholder="e.g., Programming, Design, Business"
                required
              />
            </div>

            {/* Level */}
            <div>
              <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level *
              </label>
              <select
                id="level"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={formData.level}
                onChange={(e) => handleChange("level", e.target.value)}
              >
                <option value="beginner">🟢 Beginner</option>
                <option value="intermediate">🟡 Intermediate</option>
                <option value="advanced">🔴 Advanced</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                Duration *
              </label>
              <input
                id="duration"
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={formData.duration}
                onChange={(e) => handleChange("duration", e.target.value)}
                placeholder="e.g., 4 hours, 2 weeks, 10 lessons"
                required
              />
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price (USD) *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={formData.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Media Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
            Course Media
          </h3>
          
          {/* Thumbnail */}
          <div>
            <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-2">
              Thumbnail Image URL
            </label>
            <div className="flex gap-3">
              <input
                id="thumbnail"
                type="url"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={formData.thumbnail}
                onChange={(e) => handleChange("thumbnail", e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
              {formData.thumbnail && (
                <button
                  type="button"
                  className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  title="Preview thumbnail"
                >
                  <Eye className="h-4 w-4" />
                </button>
              )}
            </div>
            {formData.thumbnail && (
              <div className="mt-3">
                <img
                  src={formData.thumbnail}
                  alt="Thumbnail preview"
                  className="w-32 h-20 object-cover rounded-lg border"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Course Content Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
            Course Content
          </h3>

          {/* Learning Points */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              What will students learn? *
            </label>
            <div className="space-y-3">
              {formData.learningPoints.map((point, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <div className="flex-1">
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={point}
                      onChange={(e) => {
                        const newPoints = [...formData.learningPoints];
                        newPoints[idx] = e.target.value;
                        handleChange("learningPoints", newPoints);
                      }}
                      placeholder={`Learning outcome #${idx + 1}`}
                    />
                  </div>
                  <button
                    type="button"
                    className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    onClick={() => {
                      const newPoints = formData.learningPoints.filter((_, i) => i !== idx);
                      handleChange("learningPoints", newPoints.length ? newPoints : [""]);
                    }}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                onClick={() => handleChange("learningPoints", [...formData.learningPoints, ""])}
              >
                <Plus className="h-4 w-4" /> Add Learning Outcome
              </button>
            </div>
          </div>

          {/* Tools/Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Required Tools & Skills
            </label>
            <div className="space-y-3">
              {formData.tools.map((tool, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <div className="flex-1">
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={tool}
                      onChange={(e) => {
                        const newTools = [...formData.tools];
                        newTools[idx] = e.target.value;
                        handleChange("tools", newTools);
                      }}
                      placeholder={`Tool or skill #${idx + 1}`}
                    />
                  </div>
                  <button
                    type="button"
                    className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    onClick={() => {
                      const newTools = formData.tools.filter((_, i) => i !== idx);
                      handleChange("tools", newTools.length ? newTools : [""]);
                    }}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                onClick={() => handleChange("tools", [...formData.tools, ""])}
              >
                <Plus className="h-4 w-4" /> Add Tool/Skill
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 sm:flex-none sm:px-8 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isLoading
              ? "Saving..."
              : course
              ? "Update Course"
              : "Create Course"}
          </button>
          <button
            type="button"
            className="flex-1 sm:flex-none sm:px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
