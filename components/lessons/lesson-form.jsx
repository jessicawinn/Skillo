"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{lesson ? "Edit Lesson" : "Create New Lesson"}</CardTitle>
        <CardDescription>{lesson ? "Update your lesson content" : "Add a new lesson to your course"}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="text-red-600 text-sm mb-2">{error}</div>
          )}
          <div className="space-y-2">
            <Label htmlFor="title">Lesson Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter lesson title"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="order">Order</Label>
            <Input
              id="order"
              type="number"
              value={formData.order}
              onChange={(e) => handleChange("order", e.target.value)}
              min={1}
              required
            />
          </div>

          {/* Lesson Contents Section */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">Lesson Contents</h3>
            <Button type="button" className="mb-4" onClick={handleAddContentClick}>
              Add Content
            </Button>
            {formData.subContents.length > 0 && (
              <ul className="mb-4 space-y-2">
                {formData.subContents.map((content, idx) => (
                  <li key={idx} className="border rounded p-3 flex justify-between items-center">
                    <div>
                      <div className="font-medium">{content.title}</div>
                      <div className="text-gray-600 text-sm">{content.text}</div>
                      <div className="text-xs text-gray-400">Order: {content.order}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => handleEditContentClick(idx)}>
                        Edit
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => handleRemoveSubContent(idx)}>
                        Remove
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* Add/Edit Content Form */}
            {(showAddContent || showEditContentIdx !== null) && (
              <div className="space-y-2 border rounded p-4 mb-4">
                <Label htmlFor="content-title">Content Title</Label>
                <Input
                  id="content-title"
                  value={contentForm.title}
                  onChange={(e) => setContentForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter content title"
                  required
                />
                <Label htmlFor="content-text">Content Text</Label>
                <Textarea
                  id="content-text"
                  value={contentForm.text}
                  onChange={(e) => setContentForm((prev) => ({ ...prev, text: e.target.value }))}
                  placeholder="Enter content text"
                  required
                />
                <Label htmlFor="content-order">Order</Label>
                <Input
                  id="content-order"
                  type="number"
                  value={contentForm.order}
                  onChange={(e) => setContentForm((prev) => ({ ...prev, order: Number(e.target.value) }))}
                  min={1}
                  required
                />
                <div className="flex gap-2 mt-2">
                  {showAddContent && (
                    <Button type="button" onClick={handleSaveNewContent}>
                      Save Content
                    </Button>
                  )}
                  {showEditContentIdx !== null && (
                    <Button type="button" onClick={handleSaveEditContent}>
                      Update Content
                    </Button>
                  )}
                  <Button type="button" variant="outline" onClick={() => {
                    setShowAddContent(false);
                    setShowEditContentIdx(null);
                    setContentForm({ title: "", text: "", order: 1 });
                    setError("");
                  }}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4 mt-6">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : lesson ? "Update Lesson" : "Create Lesson"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
