import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  BookOpen, 
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { Course as CourseType, Lesson as LessonType, Section as SectionType } from "@/entities/Course";

// Helper to format step HTML similar to StepBasedLessonPreview
const formatStepContent = (content: string): string => {
  if (!content) return '';
  const headerRegex = /<(h[1-3])[^>]*>([\s\S]*?)<\/h[1-3]>/i;
  const match = content.match(headerRegex);
  if (!match) return content;
  const headerText = match[2].trim();
  const headerStart = match.index!;
  const headerEnd = headerStart + match[0].length;
  const styledHeader = `<div class="flex flex-col space-y-1.5 p-6"><h3 class="text-lg font-semibold leading-none tracking-tight text-[var(--primary)] flex items-center gap-2"><div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open w-4 h-4 text-blue-600" aria-hidden="true"><path d="M12 7v14"></path><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path></svg></div>${headerText}</h3></div>`;
  const beforeHeader = content.slice(0, headerStart);
  const afterHeader = content.slice(headerEnd);
  const wrappedAfterHeader = afterHeader.trim() ? `<div class="p-6 pt-4 prose prose-slate max-w-none"><div class="space-y-4">${afterHeader}</div></div>` : '';
  return beforeHeader + styledHeader + wrappedAfterHeader;
};

interface CoursePreviewProps {
  courseData: CourseType;
}

export default function CoursePreview({ courseData }: CoursePreviewProps) {
  const [selectedLesson, setSelectedLesson] = useState<LessonType | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

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

  // time formatter removed (unused)

  const getTotalTime = () => {
    return courseData.sections?.reduce((total: number, section: SectionType) => 
      total + (section.lessons?.reduce((sectionTotal: number, lesson: LessonType) => 
        sectionTotal + (lesson.estimatedTime || 0), 0) || 0), 0) || 0;
  };

  // total lessons helper removed (unused)

  // Helper to get all lessons in order
  const getAllLessons = (): LessonType[] => {
    return courseData.sections?.flatMap(section => section.lessons || []) || [];
  };

  // Helper to find current lesson index
  const getCurrentLessonIndex = (): number => {
    if (!selectedLesson) return -1;
    const allLessons = getAllLessons();
    return allLessons.findIndex(lesson => lesson.id === selectedLesson.id);
  };

  // Helper to get next/previous lesson
  const getNextLesson = (): LessonType | null => {
    const allLessons = getAllLessons();
    const currentIndex = getCurrentLessonIndex();
    return currentIndex >= 0 && currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  };

  const getPreviousLesson = (): LessonType | null => {
    const allLessons = getAllLessons();
    const currentIndex = getCurrentLessonIndex();
    return currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  };

  const onSelectLesson = (lesson: LessonType) => {
    setSelectedLesson(lesson);
    setCurrentStepIndex(0);
  };

  const goToNextStep = () => {
    if (!selectedLesson || !selectedLesson.steps) return;
    
    if (currentStepIndex < selectedLesson.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // All steps complete, go to next lesson
      const nextLesson = getNextLesson();
      if (nextLesson) {
        onSelectLesson(nextLesson);
      }
    }
  };

  const goToPreviousStep = () => {
    if (!selectedLesson || !selectedLesson.steps) return;
    
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    } else {
      // At first step, go to previous lesson's last step
      const prevLesson = getPreviousLesson();
      if (prevLesson && prevLesson.steps && prevLesson.steps.length > 0) {
        onSelectLesson(prevLesson);
        setCurrentStepIndex(prevLesson.steps.length - 1);
      }
    }
  };

  const canGoNext = () => {
    if (!selectedLesson || !selectedLesson.steps) return false;
    return currentStepIndex < selectedLesson.steps.length - 1 || getNextLesson() !== null;
  };

  const canGoPrevious = () => {
    if (!selectedLesson || !selectedLesson.steps) return false;
    return currentStepIndex > 0 || getPreviousLesson() !== null;
  };

  // categoryColors removed (unused)

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
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800">
                        {courseData.title || "Bare-Metal Programming"}
                      </div>
                      <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800">
                        {courseData.category || "Beginner"}
                      </div>
                      {courseData.tags?.map((tag: string, idx: number) => (
                        <div key={idx} className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-slate-100 text-slate-800">
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
                {courseData.sections?.map((section: SectionType) => (
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
                            {section.lessons?.map((lesson: LessonType) => (
                              <button
                                key={lesson.id}
                                onClick={() => onSelectLesson(lesson)}
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
                          Step {currentStepIndex + 1} of {selectedLesson.steps.length}
                        </span>
                        <span className="text-sm text-slate-600">
                          {Math.round(((currentStepIndex + 1) / selectedLesson.steps.length) * 100)}% complete
                        </span>
                      </div>
                      <div className="w-full bg-[var(--gray)] rounded-full h-2">
                        <div className="bg-[var(--accent)] h-2 rounded-full transition-all duration-300" style={{ width: `${((currentStepIndex + 1) / selectedLesson.steps.length) * 100}%` }}></div>
                      </div>
                    </div>
                  )}
                  {selectedLesson.steps && selectedLesson.steps.length > 0 ? (
                    <div>
                      <div className="mb-4 flex flex-wrap gap-2">
                        {selectedLesson.steps.map((s, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentStepIndex(idx)}
                            className={`px-3 py-1 text-xs rounded border ${idx === currentStepIndex ? 'bg-[var(--accent)] text-white border-[var(--accent)]' : 'bg-white text-slate-700 border-slate-200'} transition-colors`}
                          >
                            Step {idx + 1}
                          </button>
                        ))}
                      </div>
                      <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 mb-3">{selectedLesson.steps[currentStepIndex].title}</h2>
                        <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: formatStepContent(selectedLesson.steps[currentStepIndex].content) }} />
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                        {canGoPrevious() && (
                          <button 
                            className="px-3 py-2 text-sm rounded border border-slate-200 hover:bg-slate-50 transition-colors" 
                            onClick={goToPreviousStep}
                          >
                            Previous
                          </button>
                        )}
                        {canGoNext() && (
                          <button 
                            className="px-3 py-2 text-sm rounded border border-slate-200 hover:bg-slate-50 transition-colors" 
                            onClick={goToNextStep}
                          >
                            {currentStepIndex === selectedLesson.steps.length - 1 ? 'Next Lesson' : 'Next'}
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="prose prose-slate max-w-none">
                      <ReactMarkdown>{selectedLesson.content || "No content available."}</ReactMarkdown>
                    </div>
                  )}
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