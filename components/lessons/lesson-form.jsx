"use client";
import { useState } from "react";
import { Plus, Edit3, Trash2, Save, X, BookOpen, FileText, Hash } from "lucide-react";

export function LessonForm({ lesson, courseId, onSubmit, onCancel, isLoading = false, maxOrder }) {

  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: lesson?.title || "",
    order: lesson?.order || maxOrder + 1,
    subContents: lesson?.subContents || [],
  });
  const [showAddContent, setShowAddContent] = useState(false);
  const [showEditContentIdx, setShowEditContentIdx] = useState(null);
  const [contentForm, setContentForm] = useState({ title: "", text: "", order: 1 });

  // Open add content form
  const handleAddContentClick = () => {
    setContentForm({ title: "", text: "", order: formData.subContents.length + 1 });
    setShowAddContent(true);
    setShowEditContentIdx(null);
  };

  // Open edit content form
  const handleEditContentClick = (idx) => {
    setContentForm({
      title: formData.subContents[idx].title,
      text: formData.subContents[idx].text,
      order: formData.subContents[idx].order,
    });
    setShowEditContentIdx(idx);
    setShowAddContent(false);
  };

  // Save new content
  const handleSaveNewContent = () => {
    if (!contentForm.title || !contentForm.text) {
      setError("Please fill in both title and text for the content.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      subContents: [
        ...prev.subContents,
        { ...contentForm, order: prev.subContents.length + 1 },
      ],
    }));
    setShowAddContent(false);
    setContentForm({ title: "", text: "", order: 1 });
    setError("");
  };

  // Save edited content
  const handleSaveEditContent = () => {
    if (!contentForm.title || !contentForm.text) {
      setError("Please fill in both title and text for the content.");
      return;
    }
    setFormData((prev) => {
      const updated = [...prev.subContents];
      updated[showEditContentIdx] = { ...contentForm };
      return { ...prev, subContents: updated };
    });
    setShowEditContentIdx(null);
    setContentForm({ title: "", text: "", order: 1 });
    setError("");
  };

  // Remove content
  const handleRemoveSubContent = (idx) => {
    setFormData((prev) => ({
      ...prev,
      subContents: prev.subContents.filter((_, i) => i !== idx),
    }));
    setShowEditContentIdx(null);
    setShowAddContent(false);
    setError("");
  };

  // Main lesson submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (formData.subContents.length === 0) {
      setError("Please add at least one lesson content.");
      return;
    }
    onSubmit({ ...formData, courseId });
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6 text-white flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{lesson ? "Edit Lesson" : "Create New Lesson"}</h2>
            <p className="text-purple-100 mt-1">
              {lesson ? "Update your lesson content and materials" : "Add engaging content to help students learn"}
            </p>
          </div>
        </div>
      </div>
      
      <div className="p-8 overflow-y-auto flex-1">
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
              <div className="flex items-center">
                <X className="h-5 w-5 text-red-400 mr-2" />
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}
          
          {/* Basic Information Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-1">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Lesson Title *
                </label>
                <input
                  id="title"
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 hover:border-gray-400"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="Enter an engaging lesson title"
                  required
                />
              </div>
              
              <div className="md:col-span-1">
                <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <Hash className="h-4 w-4" />
                  Lesson Order *
                </label>
                <input
                  id="order"
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 hover:border-gray-400"
                  value={formData.order}
                  onChange={(e) => handleChange("order", e.target.value)}
                  min={1}
                  placeholder="e.g., 1, 2, 3..."
                  required
                />
              </div>
            </div>
          </div>

          {/* Lesson Contents Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-600" />
                Lesson Contents
              </h3>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {formData.subContents.length} {formData.subContents.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            
            <button 
              type="button" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              onClick={handleAddContentClick}
            >
              <Plus className="h-4 w-4" />
              Add New Content
            </button>
            
            {formData.subContents.length > 0 && (
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {formData.subContents.map((content, idx) => (
                  <div key={idx} className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 mr-6">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-purple-100 text-purple-600 rounded-full text-xs font-bold">
                            {content.order}
                          </span>
                          <h4 className="font-semibold text-gray-900 text-lg">{content.title}</h4>
                        </div>
                        <div className="text-gray-600 leading-relaxed mb-3 max-h-24 overflow-y-auto">
                          {content.text}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="bg-white px-2 py-1 rounded-md border">Order: {content.order}</span>
                          <span className="bg-white px-2 py-1 rounded-md border">{content.text.length} characters</span>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button 
                          type="button" 
                          className="inline-flex items-center gap-1 px-3 py-2 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
                          onClick={() => handleEditContentClick(idx)}
                        >
                          <Edit3 className="h-3 w-3" />
                          Edit
                        </button>
                        <button 
                          type="button" 
                          className="inline-flex items-center gap-1 px-3 py-2 text-sm bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-300 transition-all duration-200 font-medium"
                          onClick={() => handleRemoveSubContent(idx)}
                        >
                          <Trash2 className="h-3 w-3" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add/Edit Content Form */}
            {(showAddContent || showEditContentIdx !== null) && (
              <div className="bg-white border-2 border-purple-200 rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    {showAddContent ? <Plus className="h-4 w-4 text-purple-600" /> : <Edit3 className="h-4 w-4 text-purple-600" />}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    {showAddContent ? "Add New Content" : "Edit Content"}
                  </h4>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label htmlFor="content-title" className="block text-sm font-medium text-gray-700 mb-2">
                      Content Title *
                    </label>
                    <input
                      id="content-title"
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 hover:border-gray-400"
                      value={contentForm.title}
                      onChange={(e) => setContentForm((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter a descriptive title for this content"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="content-text" className="block text-sm font-medium text-gray-700 mb-2">
                      Content Description *
                    </label>
                    <textarea
                      id="content-text"
                      rows={5}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 resize-none hover:border-gray-400"
                      value={contentForm.text}
                      onChange={(e) => setContentForm((prev) => ({ ...prev, text: e.target.value }))}
                      placeholder="Describe what students will learn in this section..."
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">{contentForm.text.length} characters</p>
                  </div>
                  
                  <div className="w-32">
                    <label htmlFor="content-order" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                      <Hash className="h-4 w-4" />
                      Order *
                    </label>
                    <input
                      id="content-order"
                      type="number"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 hover:border-gray-400"
                      value={contentForm.order}
                      onChange={(e) => setContentForm((prev) => ({ ...prev, order: Number(e.target.value) }))}
                      min={1}
                      required
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    {showAddContent && (
                      <button 
                        type="button" 
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                        onClick={handleSaveNewContent}
                      >
                        <Save className="h-4 w-4" />
                        Save Content
                      </button>
                    )}
                    {showEditContentIdx !== null && (
                      <button 
                        type="button" 
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                        onClick={handleSaveEditContent}
                      >
                        <Save className="h-4 w-4" />
                        Update Content
                      </button>
                    )}
                    <button 
                      type="button" 
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
                      onClick={() => {
                        setShowAddContent(false);
                        setShowEditContentIdx(null);
                        setContentForm({ title: "", text: "", order: 1 });
                        setError("");
                      }}
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200">
            <button 
              type="submit" 
              disabled={isLoading}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {lesson ? "Update Lesson" : "Create Lesson"}
                </>
              )}
            </button>
            <button 
              type="button" 
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-md hover:shadow-lg"
              onClick={onCancel}
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
