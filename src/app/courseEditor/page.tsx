'use client';

import React, { useState, useEffect } from "react";
import { Course } from "@/entities/Course";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, Eye, Download, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

import CourseDetailsForm from "../components/editor/CourseDetailsForm";
import SectionEditor from "../components/editor/SectionEditor";
import MarkdownEditor from "../components/editor/MarkdownEditor";
import CoursePreview from "../components/editor/CoursePreview";
import ExportDialog from "../components/editor/ExportDialog";

export default function CourseEditor() {
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState({
    title: "",
    slug: "",
    description: "",
    category: "Beginner",
    author: "",
    tags: [],
    sections: [],
    template: "academic",
    customCSS: ""
  });
  const [activeTab, setActiveTab] = useState("details");
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get('id');

  useEffect(() => {
    if (courseId) {
      loadCourse();
    }
  }, [courseId]);

  const loadCourse = async () => {
    try {
      const courses = await Course.list();
      const course = courses.find(c => c.id === courseId);
      if (course) {
        setCourseData(course);
      }
    } catch (error) {
      console.error("Error loading course:", error);
    }
  };

  const saveCourse = async () => {
    setIsSaving(true);
    try {
      if (courseId) {
        await Course.update(courseId, courseData);
      } else {
        const newCourse = await Course.create(courseData);
        navigate(createPageUrl("CourseEditor") + `?id=${newCourse.id}`);
      }
    } catch (error) {
      console.error("Error saving course:", error);
    }
    setIsSaving(false);
  };

  const addSection = () => {
    const newSection = {
      id: Date.now().toString(),
      title: "New Section",
      slug: `section-${Date.now()}`,
      lessons: []
    };
    setCourseData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  const updateSection = (sectionId, updates) => {
    setCourseData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      )
    }));
  };

  const deleteSection = (sectionId) => {
    setCourseData(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId)
    }));
  };

  const updateLesson = (sectionId, lessonId, updates) => {
    setCourseData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              lessons: section.lessons.map(lesson =>
                lesson.id === lessonId ? { ...lesson, ...updates } : lesson
              )
            }
          : section
      )
    }));
  };

  if (isPreviewMode) {
    return (
      <div className="min-h-screen bg-white">
        <div className="border-b border-slate-200 p-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <Button
              variant="outline"
              onClick={() => setIsPreviewMode(false)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Editor
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowExportDialog(true)}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
        <CoursePreview courseData={courseData} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between p-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Link to={createPageUrl("Dashboard")}>
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                {courseId ? "Edit Course" : "Create New Course"}
              </h1>
              <p className="text-sm text-slate-500">
                {courseData.title || "Untitled Course"}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsPreviewMode(true)}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowExportDialog(true)}
              disabled={!courseData.title}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              onClick={saveCourse}
              disabled={isSaving || !courseData.title}
              className="bg-slate-800 hover:bg-slate-700"
            >
              {isSaving ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Course
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="details">Course Details</TabsTrigger>
            <TabsTrigger value="structure">Course Structure</TabsTrigger>
            <TabsTrigger value="content">Content Editor</TabsTrigger>
            <TabsTrigger value="settings">Export Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <CourseDetailsForm
              courseData={courseData}
              onChange={setCourseData}
            />
          </TabsContent>

          <TabsContent value="structure">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Course Structure</CardTitle>
                  <Button onClick={addSection} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Section
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <SectionEditor
                  sections={courseData.sections}
                  onUpdateSection={updateSection}
                  onDeleteSection={deleteSection}
                  onSelectLesson={setSelectedLesson}
                  onUpdateLesson={updateLesson}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <MarkdownEditor
              selectedLesson={selectedLesson}
              onUpdateLesson={(updates) => {
                if (selectedLesson) {
                  updateLesson(selectedLesson.sectionId, selectedLesson.id, updates);
                }
              }}
            />
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Export Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Template</label>
                    <select
                      value={courseData.template}
                      onChange={(e) => setCourseData(prev => ({ ...prev, template: e.target.value }))}
                      className="w-full mt-1 p-2 border border-slate-200 rounded-md"
                    >
                      <option value="academic">Academic</option>
                      <option value="modern">Modern</option>
                      <option value="minimal">Minimal</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Custom CSS</label>
                    <textarea
                      value={courseData.customCSS}
                      onChange={(e) => setCourseData(prev => ({ ...prev, customCSS: e.target.value }))}
                      placeholder="Add custom CSS for your exported course..."
                      className="w-full mt-1 p-2 border border-slate-200 rounded-md h-32"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <ExportDialog
        open={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        courseData={courseData}
      />
    </div>
  );
}