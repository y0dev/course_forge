/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  GripVertical, 
  FileText,
  Clock,
  Play
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";

interface SectionEditorProps {
  sections: any[];
  onUpdateSection: (sectionId: string, updates: any) => void;
  onDeleteSection: (sectionId: string) => void;
  onSelectLesson: (lesson: any, sectionId: string) => void;
  onUpdateLesson: (sectionId: string, lessonId: string, updates: any) => void;
  onEditLesson?: (lesson: any, sectionId: string) => void;
  onPreviewLesson?: (lesson: any) => void;
}

export default function SectionEditor({ 
  sections, 
  onUpdateSection, 
  onDeleteSection, 
  onSelectLesson,
  onUpdateLesson,
  onEditLesson,
}: SectionEditorProps) {
  const [expandedSections, setExpandedSections] = useState(new Set());

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const addLesson = (sectionId: string) => {
    // This will be handled by the parent component to show the lesson creator
    onSelectLesson({ id: 'new', title: 'New Lesson' }, sectionId);
  };

  const deleteLesson = (sectionId: string, lessonId: string) => {
    const section = sections.find(s => s.id === sectionId);
    onUpdateSection(sectionId, {
      lessons: section.lessons.filter((lesson: any) => lesson.id !== lessonId)
    });
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getLessonType = (lesson: any) => {
    if (lesson.steps && lesson.steps.length > 0) {
      return "Step-based";
    }
    return "Markdown";
  };

  if (sections.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-600 mb-2">No sections yet</h3>
        <p className="text-slate-500">Create your first section to start organizing your course content.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {sections.map((section, index) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-slate-200">
              <Collapsible
                open={expandedSections.has(section.id)}
                onOpenChange={() => toggleSection(section.id)}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <GripVertical className="w-5 h-5 text-slate-400" />
                        <div>
                          <CardTitle className="text-lg">{section.title}</CardTitle>
                          <p className="text-sm text-slate-500 mt-1">
                            {section.lessons?.length || 0} lessons • {
                              formatTime(
                                section.lessons?.reduce((total: number, lesson: any) => 
                                  total + (lesson.estimatedTime || 0), 0
                                ) || 0
                              )
                            }
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteSection(section.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-slate-700">Section Title</label>
                          <Input
                            value={section.title}
                            onChange={(e) => {
                              const title = e.target.value;
                              const slug = generateSlug(title);
                              onUpdateSection(section.id, { title, slug });
                            }}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-700">Section Slug</label>
                          <Input
                            value={section.slug}
                            onChange={(e) => onUpdateSection(section.id, { slug: e.target.value })}
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-medium text-slate-700">Lessons</h4>
                          <Button
                            size="sm"
                            onClick={() => addLesson(section.id)}
                            variant="outline"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Lesson
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {section.lessons?.map((lesson: any) => (
                            <div
                              key={lesson.id}
                              className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors"
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <GripVertical className="w-4 h-4 text-slate-400" />
                                <div className="flex-1">
                                  <Input
                                    value={lesson.title}
                                    onChange={(e) => {
                                      const title = e.target.value;
                                      const slug = generateSlug(title);
                                      onUpdateLesson(section.id, lesson.id, { title, slug });
                                    }}
                                    className="border-none p-0 h-auto font-medium"
                                  />
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="text-xs">
                                      <Clock className="w-3 h-3 mr-1" />
                                      {lesson.estimatedTime || 15}m
                                    </Badge>
                                    <Badge variant="secondary" className="text-xs">
                                      {getLessonType(lesson)}
                                    </Badge>
                                    {lesson.difficulty && (
                                      <Badge variant="outline" className="text-xs">
                                        {lesson.difficulty}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => onSelectLesson(lesson, section.id)}
                                  title="Open in Content Editor"
                                >
                                  <Play className="w-4 h-4" />
                                </Button>
                                {onEditLesson && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => onEditLesson(lesson, section.id)}
                                    title="Edit Lesson"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => deleteLesson(section.id, lesson.id)}
                                  title="Delete Lesson"
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              </div>
                            </div>
                          )) || (
                            <p className="text-center text-slate-500 py-4 border border-dashed border-slate-200 rounded-lg">
                              No lessons yet. Click &quot;Add Lesson&quot; to create one.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}