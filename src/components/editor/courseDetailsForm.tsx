import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Course } from "@/entities/Course";

interface CourseDetailsFormProps {
  courseData: Partial<Course>;
  onChange: (data: Partial<Course>) => void;
}

export default function CourseDetailsForm({ courseData, onChange }: CourseDetailsFormProps) {
  const [newTag, setNewTag] = useState("");

  // Early return if courseData is undefined
  if (!courseData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Course Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-slate-500">No course data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    const slug = generateSlug(title);
    onChange({ ...courseData, title, slug });
  };

  const addTag = () => {
    if (newTag.trim() && !(courseData.tags || []).includes(newTag.trim())) {
      onChange({
        ...courseData,
        tags: [...(courseData.tags || []), newTag.trim()]
      });
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange({
      ...courseData,
      tags: (courseData.tags || []).filter((tag: string) => tag !== tagToRemove)
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title">Course Title *</Label>
            <Input
              id="title"
              value={courseData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter course title"
              className="bg-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">URL Slug</Label>
            <Input
              id="slug"
              value={courseData.slug}
              onChange={(e) => onChange({ ...courseData, slug: e.target.value })}
              placeholder="course-url-slug"
              className="bg-white"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={courseData.description}
            onChange={(e) => onChange({ ...courseData, description: e.target.value })}
            placeholder="Describe what students will learn in this course"
            className="h-24 bg-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="category">Difficulty Level</Label>
            <Select
              value={courseData.category || "Beginner"}
              onValueChange={(value) => onChange({ ...courseData, category: value as "Beginner" | "Intermediate" | "Advanced" })}
            >
              <SelectTrigger className="bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={courseData.author}
              onChange={(e) => onChange({ ...courseData, author: e.target.value })}
              placeholder="Course author name"
              className="bg-white"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 mt-4">
          <Switch
            id="isFree"
            checked={courseData.isFree}
            onCheckedChange={(checked) => onChange({ ...courseData, isFree: checked })}
            className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-slate-200"
          />
          <Label htmlFor="isFree" className="text-sm font-medium text-slate-700">Free Course</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="isRecommended"
            checked={courseData.isRecommended}
            onCheckedChange={(checked) => onChange({ ...courseData, isRecommended: checked })}
            className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-slate-200"
          />
          <Label htmlFor="isRecommended" className="text-sm font-medium text-slate-700">Recommended Course</Label>
        </div>

        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="flex flex-wrap gap-2 mb-3">
            {(courseData.tags || []).map((tag: string, index: number) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {tag}
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-auto p-0 w-4 h-4"
                  onClick={() => removeTag(tag)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a tag"
              className="bg-white"
              onKeyPress={(e) => e.key === 'Enter' && addTag()}
            />
            <Button onClick={addTag} variant="outline">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}