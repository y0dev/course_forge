'use client';

import React, { useState, useEffect } from "react";
import { Course, type Course as CourseType, type Lesson, type Section } from "@/entities/Course";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, Eye, Download, Plus, FileText } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

import CourseDetailsForm from "@/components/editor/courseDetailsForm";
import SectionEditor from "@/components/editor/sectionEditor";
import MarkdownEditor from "@/components/editor/markdownEditor";
import StepBasedLessonEditor from "@/components/editor/StepBasedLessonEditor";
import StepBasedLessonPreview from "@/components/editor/StepBasedLessonPreview";
import LessonTemplateCreator from "@/components/editor/LessonTemplateCreator";
import CoursePreview from "@/components/editor/coursePreview";
import ExportDialog from "@/components/editor/exportDialog";
import { createEndiannessLesson, createSampleLesson } from "@/utils/lessonTemplates";

// Type for lessons with sectionId for internal use
type LessonWithSection = Lesson & { sectionId?: string };

export default function CourseEditor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [courseData, setCourseData] = useState<Partial<Course>>({
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
  const [selectedLesson, setSelectedLesson] = useState<LessonWithSection | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showLessonCreator, setShowLessonCreator] = useState(false);
  const [editingLesson, setEditingLesson] = useState<LessonWithSection | null>(null);
  const [targetSectionId, setTargetSectionId] = useState<string | null>(null);

  const courseId = searchParams.get('id');

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
      toast({
        title: "Error",
        description: "Failed to load course. Please try again.",
        variant: "destructive",
      });
    }
  };

  const saveCourse = async () => {
    if (!courseData.title || !courseData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a course title before saving.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      if (courseId) {
        await Course.update(courseId, courseData);
        toast({
          title: "Success",
          description: "Course updated successfully!",
        });
      } else {
        const newCourse = await Course.create(courseData);
        toast({
          title: "Success",
          description: "Course created successfully!",
        });
        router.push(`/courseEditor?id=${newCourse.id}`);
      }
    } catch (error) {
      console.error("Error saving course:", error);
      toast({
        title: "Error",
        description: "Failed to save course. Please try again.",
        variant: "destructive",
      });
    }
    setIsSaving(false);
  };

  const addSection = () => {
    const newSection: Section = {
      id: Date.now().toString(),
      title: "New Section",
      slug: `section-${Date.now()}`,
      lessons: []
    };
    setCourseData(prev => ({
      ...prev,
      sections: [...(prev.sections || []), newSection]
    }));
  };

  const updateSection = (sectionId: string, updates: Partial<Section>) => {
    setCourseData(prev => ({
      ...prev,
      sections: (prev.sections || []).map((section: Section) =>
        section.id === sectionId ? { ...section, ...updates } : section
      )
    }));
  };

  const deleteSection = (sectionId: string) => {
    setCourseData(prev => ({
      ...prev,
      sections: (prev.sections || []).filter((section: Section) => section.id !== sectionId)
    }));
  };

  const addLesson = (sectionId: string) => {
    setShowLessonCreator(true);
  };

  const handleLessonCreated = (newLesson: Lesson & { sectionId?: string }) => {
    if (!targetSectionId) {
      console.error("No target section ID for new lesson");
      return;
    }

    // Add the new lesson to the appropriate section
    setCourseData(prev => ({
      ...prev,
      sections: (prev.sections || []).map((section: Section) =>
        section.id === targetSectionId
          ? {
              ...section,
              lessons: [...(section.lessons || []), newLesson]
            }
          : section
      )
    }));
    
    // Select the new lesson for editing
    setSelectedLesson({
      ...newLesson,
      sectionId: targetSectionId
    });
    setActiveTab("content");
    setShowLessonCreator(false);
    setTargetSectionId(null);
  };

  const updateLesson = (sectionId: string, lessonId: string, updates: Partial<Lesson>) => {
    setCourseData(prev => ({
      ...prev,
      sections: (prev.sections || []).map((section: Section) =>
        section.id === sectionId
          ? {
              ...section,
              lessons: (section.lessons || []).map((lesson: Lesson) =>
                lesson.id === lessonId ? { ...lesson, ...updates } : lesson
              )
            }
          : section
      )
    }));
  };

  const handleLessonSelect = (lesson: Lesson, sectionId: string) => {
    // Check if this is a new lesson creation request
    if (lesson.id === 'new') {
      setTargetSectionId(sectionId);
      setShowLessonCreator(true);
      return;
    }
    
    const lessonWithSection = { ...lesson, sectionId };
    setSelectedLesson(lessonWithSection);
    setActiveTab("content");
  };

  const handleLessonEdit = (lesson: Lesson, sectionId: string) => {
    const lessonWithSection = { ...lesson, sectionId };
    setEditingLesson(lessonWithSection);
    setActiveTab("content");
  };

  const handleLessonPreview = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setIsPreviewMode(true);
  };

  const onUpdateLesson = (updates: Partial<Lesson>) => {
    if (selectedLesson && selectedLesson.sectionId) {
      updateLesson(selectedLesson.sectionId, selectedLesson.id, updates);
      setSelectedLesson(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const addSampleLesson = () => {
    const sampleLesson = createEndiannessLesson(courseData.title || "Course");
    if (targetSectionId) {
      // If we're in lesson creation mode, use the target section
      handleLessonCreated(sampleLesson);
    } else {
      // If no target section, show lesson creator
      setShowLessonCreator(true);
    }
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
        {selectedLesson && selectedLesson.steps ? (
          <StepBasedLessonPreview lesson={selectedLesson} />
        ) : (
          <CoursePreview courseData={courseData} />
        )}
      </div>
    );
  }

  if (showLessonCreator) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              onClick={() => setShowLessonCreator(false)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Editor
            </Button>
            <h1 className="text-xl font-bold text-slate-900">Create New Lesson</h1>
          </div>
          <LessonTemplateCreator
            courseTitle={courseData.title || "Course"}
            onSave={handleLessonCreated}
            onCancel={() => setShowLessonCreator(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between p-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/">
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
                  sections={courseData.sections || []}
                  onUpdateSection={updateSection}
                  onDeleteSection={deleteSection}
                  onSelectLesson={handleLessonSelect}
                  onUpdateLesson={updateLesson}
                  onEditLesson={handleLessonEdit}
                  onPreviewLesson={handleLessonPreview}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            {selectedLesson ? (
              selectedLesson.steps && selectedLesson.steps.length > 0 ? (
                <StepBasedLessonEditor
                  selectedLesson={selectedLesson}
                  onUpdateLesson={onUpdateLesson}
                />
              ) : (
                <MarkdownEditor
                  selectedLesson={selectedLesson}
                  onUpdateLesson={onUpdateLesson}
                />
              )
            ) : (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 mb-2">
                  No lesson selected
                </h3>
                <p className="text-slate-500 mb-6">
                  Select a lesson from the course structure to start editing, or create a new one.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={() => setShowLessonCreator(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Lesson
                  </Button>
                  <Button variant="outline" onClick={addSampleLesson}>
                    <FileText className="w-4 h-4 mr-2" />
                    Add Sample Lesson
                  </Button>
                </div>
              </div>
            )}
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
                      value={courseData.template || "academic"}
                      onChange={(e) => setCourseData(prev => ({ 
                        ...prev, 
                        template: e.target.value as "academic" | "modern" | "minimal" 
                      }))}
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