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

export default function CoursePreview({ courseData }) {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [expandedSections, setExpandedSections] = useState(new Set());

  const toggleSection = (sectionId) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getTotalTime = () => {
    return courseData.sections?.reduce((total, section) => 
      total + (section.lessons?.reduce((sectionTotal, lesson) => 
        sectionTotal + (lesson.estimatedTime || 0), 0) || 0), 0) || 0;
  };

  const getTotalLessons = () => {
    return courseData.sections?.reduce((total, section) => 
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
                <h1 className="text-2xl font-bold text-slate-900 mb-2">
                  {courseData.title || "Untitled Course"}
                </h1>
                {courseData.description && (
                  <p className="text-slate-600 mb-4">{courseData.description}</p>
                )}
                <div className="flex items-center gap-2 mb-4">
                  <Badge className={categoryColors[courseData.category]}>
                    {courseData.category}
                  </Badge>
                  {courseData.tags?.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  {courseData.author && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{courseData.author}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>{getTotalLessons()} lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(getTotalTime())}</span>
                  </div>
                </div>
              </div>

              {/* Course Structure */}
              <div className="space-y-2">
                <h3 className="font-semibold text-slate-900 mb-3">Course Content</h3>
                {courseData.sections?.map((section, index) => (
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
                            {section.lessons?.map((lesson, lessonIndex) => (
                              <button
                                key={lesson.id}
                                onClick={() => setSelectedLesson(lesson)}
                                className={`w-full flex items-center justify-between p-3 text-left hover:bg-slate-50 transition-colors ${
                                  selectedLesson?.id === lesson.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                                }`}
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
                      <Clock className="w-4 h-4" />
                      <span>Estimated time: {selectedLesson.estimatedTime || 15} minutes</span>
                    </div>
                  </div>
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