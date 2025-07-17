import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Clock, 
  FileText, 
  ChevronRight,
  ChevronDown,
  User,
  Calendar
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { Course as CourseType, Lesson as LessonType, Section as SectionType } from "@/entities/Course";

interface CoursePreviewProps {
  courseData: CourseType;
}

export default function CoursePreview({ courseData }: CoursePreviewProps) {
  const [selectedLesson, setSelectedLesson] = useState<LessonType | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  // Early return if courseData is undefined
  if (!courseData) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-600 mb-2">
            No course data available
          </h2>
          <p className="text-slate-500">
            Please create or load a course to preview.
          </p>
        </div>
      </div>
    );
  }

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getTotalTime = () => {
    return courseData.sections?.reduce((total: number, section: SectionType) => 
      total + (section.lessons?.reduce((sectionTotal: number, lesson: LessonType) => 
        sectionTotal + (lesson.estimatedTime || 0), 0) || 0), 0) || 0;
  };

  const getTotalLessons = () => {
    return courseData.sections?.reduce((total: number, section: SectionType) => 
      total + (section.lessons?.length || 0), 0) || 0;
  };

  const categoryColors = {
    Beginner: "bg-green-100 text-green-800",
    Intermediate: "bg-yellow-100 text-yellow-800",
    Advanced: "bg-red-100 text-red-800"
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardContent className="p-6">
              <div className="mb-6">
                {/* Course Info Header with Back Button, Tags, and Time */}
                <div className="flex items-center gap-4 mb-4">
                  <button className="inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gray)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-[var(--gray)] bg-[var(--white)] text-[var(--primary)] hover:bg-[var(--gray-light)] h-10 w-10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left w-4 h-4" aria-hidden="true"><path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg>
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--gray)] focus:ring-offset-2 bg-[var(--primary)] text-[var(--white)] hover:bg-[color-mix(in srgb, var(--primary) 80%, var(--white) 20%)] bg-blue-100 text-blue-800">
                        {courseData.title || "Bare-Metal Programming"}
                      </div>
                      <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--gray)] focus:ring-offset-2 bg-[var(--primary)] text-[var(--white)] hover:bg-[color-mix(in srgb, var(--primary) 80%, var(--white) 20%)] bg-green-100 text-green-800">
                        {courseData.category || "Beginner"}
                      </div>
                      {courseData.tags?.map((tag: string, idx: number) => (
                        <div key={idx} className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--gray)] focus:ring-offset-2 bg-[var(--primary)] text-[var(--white)] hover:bg-[color-mix(in srgb, var(--primary) 80%, var(--white) 20%)] bg-slate-100 text-slate-800">
                          {tag}
                        </div>
                      ))}
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{courseData.title || "Understanding Endianness"}</h1>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-600 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock w-4 h-4" aria-hidden="true"><path d="M12 6v6l4 2"></path><circle cx="12" cy="12" r="10"></circle></svg>
                  <span className="text-sm">{getTotalTime()} min</span>
                </div>
                {courseData.description && (
                  <p className="text-slate-600 mb-4">{courseData.description}</p>
                )}
              </div>

              {/* Course Structure */}
              <div className="space-y-2">
                <h3 className="font-semibold text-slate-900 mb-3">Course Content</h3>
                {courseData.sections?.map((section: SectionType, index: number) => (
                  <div key={section.id} className="border border-slate-200 rounded-lg">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {expandedSections.has(section.id) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                        <span className="font-medium text-sm">{section.title}</span>
                      </div>
                      <span className="text-xs text-slate-500">
                        {section.lessons?.length || 0} lessons
                      </span>
                    </button>
                    <AnimatePresence>
                      {expandedSections.has(section.id) && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-slate-200">
                            {section.lessons?.map((lesson: LessonType, lessonIndex: number) => (
                              <button
                                key={lesson.id}
                                onClick={() => setSelectedLesson(lesson)}
                                className={`w-full flex items-center justify-between p-3 text-left hover:bg-slate-50 transition-colors`}
                              >
                                <span className="text-sm text-slate-700">{lesson.title}</span>
                                <span className="text-xs text-slate-500">
                                  {lesson.estimatedTime || 15}m
                                </span>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-8">
              {selectedLesson ? (
                <div>
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                      {selectedLesson.title}
                    </h1>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock w-4 h-4" aria-hidden="true"><path d="M12 6v6l4 2"></path><circle cx="12" cy="12" r="10"></circle></svg>
                      <span>Estimated time: {selectedLesson.estimatedTime || 15} minutes</span>
                    </div>
                  </div>
                  {/* Step progress bar */}
                  {selectedLesson.steps && selectedLesson.steps.length > 0 && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">
                          Step {selectedLesson.progress ? Math.round(selectedLesson.progress / 100 * selectedLesson.steps.length) : selectedLesson.steps.length} of {selectedLesson.steps.length}
                        </span>
                        <span className="text-sm text-slate-600">
                          {selectedLesson.progress || 100}% complete
                        </span>
                      </div>
                      <div className="w-full bg-[var(--gray)] rounded-full h-2">
                        <div className="bg-[var(--accent)] h-2 rounded-full transition-all duration-300" style={{ width: `${selectedLesson.progress || 100}%` }}></div>
                      </div>
                    </div>
                  )}
                  <div className="prose prose-slate max-w-none">
                    <ReactMarkdown>{selectedLesson.content || "No content available."}</ReactMarkdown>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-slate-600 mb-2">
                    Welcome to {courseData.title || "Your Course"}
                  </h2>
                  <p className="text-slate-500 mb-6">
                    Select a lesson from the sidebar to start learning.
                  </p>
                  {courseData.description && (
                    <div className="max-w-2xl mx-auto text-left">
                      <h3 className="font-semibold text-slate-900 mb-2">About this course</h3>
                      <p className="text-slate-600">{courseData.description}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}