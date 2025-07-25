'use client';

import React, { useState, useEffect, Suspense, useRef } from "react";
import { Course, type Lesson, type Section } from "@/entities/Course";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, Eye, Download, Plus, FileText } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

import CourseDetailsForm from "@/components/editor/courseDetailsForm";
import SectionEditor from "@/components/editor/sectionEditor";
import MarkdownEditor from "@/components/editor/markdownEditor";
import StepBasedLessonPreview from "@/components/editor/StepBasedLessonPreview";
import LessonTemplateCreator from "@/components/editor/LessonTemplateCreator";
import CoursePreview from "@/components/editor/coursePreview";
import ExportDialog from "@/components/editor/exportDialog";
import { createEndiannessLesson } from "@/utils/lessonTemplates";

// Type for lessons with sectionId for internal use
type LessonWithSection = Lesson & { sectionId?: string };

function CourseEditorContent({ router, toast }: { router: ReturnType<typeof useRouter>, toast: ReturnType<typeof useToast>["toast"] }) {
  const searchParams = useSearchParams();
  const [courseData, setCourseData] = useState<Partial<Course>>({
    title: "",
    slug: "",
    description: "",
    category: "Beginner",
    author: "",
    tags: [],
    sections: []
  });
  const [activeTab, setActiveTab] = useState("details");
  const [selectedLesson, setSelectedLesson] = useState<LessonWithSection | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showLessonCreator, setShowLessonCreator] = useState(false);
  const [editingLesson, setEditingLesson] = useState<LessonWithSection | null>(null);
  const [targetSectionId, setTargetSectionId] = useState<string | null>(null);
  const lessonEditorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (editingLesson && lessonEditorRef.current) {
      lessonEditorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [editingLesson]);

  // Initialize courseData from localStorage draft if available
  useEffect(() => {
    const draft = localStorage.getItem('course_forge_draft');
    if (draft) {
      try {
        setCourseData(JSON.parse(draft));
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (courseData) {
      localStorage.setItem('course_forge_draft', JSON.stringify(courseData));
    }
  }, [courseData]);

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
      lessons: [],
      questions: [], // Ensure questions array is present
    };
    setCourseData(prev => ({
      ...prev,
      sections: [...(prev.sections || []), newSection],
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
    setActiveTab("structure"); // Changed from "content" to "structure"
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
    setActiveTab("structure"); // Changed from "content" to "structure"
  };

  const handleLessonEdit = (lesson: Lesson, sectionId: string) => {
    const lessonWithSection = { ...lesson, sectionId };
    setEditingLesson(lessonWithSection);
  };

  const handleLessonPreview = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setIsPreviewMode(true);
  };

  const onUpdateLesson = (updates: Partial<Lesson>) => {
    if (selectedLesson && selectedLesson.sectionId) {
      updateLesson(selectedLesson.sectionId, selectedLesson.id, updates);
      setCourseData(prev => {
        const updatedSections = (prev.sections || []).map(section => {
          if (section.id === selectedLesson.sectionId) {
            return {
              ...section,
              lessons: section.lessons.map(lesson =>
                lesson.id === selectedLesson.id ? { ...lesson, ...updates } : lesson
              ),
            };
          }
          return section;
        });
        const updated = { ...prev, sections: updatedSections };
        localStorage.setItem('course_forge_draft', JSON.stringify(updated));
        return updated;
      });
      setSelectedLesson(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const handleExport = async () => {
    // Refresh course data from localStorage before exporting to ensure we have the latest data
    if (courseId) {
      try {
        const freshCourseData = await Course.getById(courseId);
        if (freshCourseData) {
          setCourseData(freshCourseData);
        }
      } catch (error) {
        console.error('Error refreshing course data:', error);
      }
    }
    setShowExportDialog(true);
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
                onClick={handleExport}
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
          <CoursePreview courseData={courseData as Course} />
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
            <Button
              variant="outline"
              onClick={() => {
                setShowLessonCreator(false);
                setActiveTab("structure");
              }}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Structure
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
              onClick={handleExport}
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
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="details">Course Details</TabsTrigger>
            <TabsTrigger value="structure">Course Structure</TabsTrigger>
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
                {/* Inline lesson editor/preview below the structure */}
                {editingLesson && (
                  <div ref={lessonEditorRef} className="my-8 p-6 border rounded bg-white">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">Edit Lesson: {editingLesson.title}</h2>
                        <p className="text-sm text-slate-500">Section: {courseData.sections?.find(s => s.id === editingLesson.sectionId)?.title}</p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (editingLesson.sectionId) {
                            // Update lesson in courseData
                            setCourseData(prev => {
                              const updatedSections = (prev.sections || []).map(section => {
                                if (section.id === editingLesson.sectionId) {
                                  return {
                                    ...section,
                                    lessons: section.lessons.map(lesson =>
                                      lesson.id === editingLesson.id ? { ...lesson, ...editingLesson } : lesson
                                    ),
                                  };
                                }
                                return section;
                              });
                              const updated = { ...prev, sections: updatedSections };
                              localStorage.setItem('course_forge_draft', JSON.stringify(updated));
                              return updated;
                            });
                          }
                          setEditingLesson(null);
                          setSelectedLesson(editingLesson);
                        }}
                      >
                        Done Editing
                      </Button>
                    </div>
                    <LessonTemplateCreator
                      courseTitle={courseData.title || "Course"}
                      onSave={(updatedLesson) => {
                        if (editingLesson.sectionId) {
                          updateLesson(editingLesson.sectionId, editingLesson.id, updatedLesson);
                          setEditingLesson(null);
                          setSelectedLesson({ ...updatedLesson, sectionId: editingLesson.sectionId });
                        }
                      }}
                      onCancel={() => {
                        setEditingLesson(null);
                        setSelectedLesson(editingLesson);
                      }}
                      initialLesson={editingLesson}
                    />
                  </div>
                )}
                {selectedLesson && !editingLesson && (
                  <div className="my-8 p-6 border rounded bg-white">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">Preview Lesson: {selectedLesson.title}</h2>
                        <p className="text-sm text-slate-500">Section: {courseData.sections?.find(s => s.id === selectedLesson.sectionId)?.title}</p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedLesson(null)}
                      >
                        Close Preview
                      </Button>
                    </div>
                    {selectedLesson.steps && selectedLesson.steps.length > 0 ? (
                      <StepBasedLessonPreview lesson={selectedLesson} />
                    ) : (
                      <MarkdownEditor selectedLesson={selectedLesson} onUpdateLesson={onUpdateLesson} />
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Removed Content Editor Tab Content */}
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

export default function CourseEditor() {
  const router = useRouter();
  const { toast } = useToast();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CourseEditorContent router={router} toast={toast} />
    </Suspense>
  );
}