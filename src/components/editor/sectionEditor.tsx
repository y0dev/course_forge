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
  Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { LESSON_TEMPLATES } from "./stepTemplates";

interface SectionEditorProps {
  sections: any[];
  onUpdateSection: (sectionId: string, updates: any) => void;
  onDeleteSection: (sectionId: string) => void;
  onSelectLesson: (lesson: any, sectionId: string) => void;
  onUpdateLesson: (sectionId: string, lessonId: string, updates: any) => void;
  onEditLesson?: (lesson: any, sectionId: string) => void;
  onPreviewLesson?: (lesson: any) => void;
  onAddLessonWithTemplate?: (sectionId: string, template: any) => void;
}

export default function SectionEditor({ 
  sections, 
  onUpdateSection, 
  onDeleteSection, 
  onSelectLesson,
  onUpdateLesson,
  onEditLesson,
  onPreviewLesson,
  onAddLessonWithTemplate
}: SectionEditorProps) {
  const [expandedSections, setExpandedSections] = useState(new Set());
  // Remove quizSectionId and quizDraft, use questionSectionId and questionDraft
  const [questionSectionId, setQuestionSectionId] = useState<string | null>(null);
  const [questionDraft, setQuestionDraft] = useState<any>(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState<string | null>(null);

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
    // Show template selector instead of directly creating lesson
    setShowTemplateSelector(sectionId);
  };

  const handleTemplateSelect = (sectionId: string, template: any) => {
    if (onAddLessonWithTemplate) {
      onAddLessonWithTemplate(sectionId, template);
    } else {
      // Fallback to regular lesson creation
      onSelectLesson({ id: 'new', title: 'New Lesson' }, sectionId);
    }
    setShowTemplateSelector(null);
  };

  const addLessonDirectly = (sectionId: string) => {
    onSelectLesson({ id: 'new', title: 'New Lesson' }, sectionId);
    setShowTemplateSelector(null);
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

  // Add this function to handle quiz save
  // Remove handleSaveQuiz, add handleSaveQuestions
  const handleSaveQuestions = (sectionId: string, questions: any[]) => {
    onUpdateSection(sectionId, { questions });
    setQuestionSectionId(null);
    setQuestionDraft(null);
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
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => addLesson(section.id)}
                              variant="outline"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Lesson
                            </Button>
                          </div>
                        </div>
                        
                        {/* Template Selector */}
                        {showTemplateSelector === section.id && (
                          <div className="mb-4 p-4 border border-blue-200 rounded-lg bg-blue-50">
                            <h5 className="font-medium text-blue-900 mb-3">Choose a Lesson Template</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                              {LESSON_TEMPLATES.map((template) => (
                                <button
                                  key={template.value}
                                  onClick={() => handleTemplateSelect(section.id, template)}
                                  className="flex items-center gap-3 p-3 text-left border border-blue-200 rounded-lg bg-white hover:bg-blue-50 transition-colors"
                                >
                                  <div className={`w-8 h-8 rounded-full bg-${template.color}-100 flex items-center justify-center`}>
                                    <span className="text-sm font-medium text-${template.color}-600">
                                      {template.label.charAt(0)}
                                    </span>
                                  </div>
                                  <div>
                                    <div className="font-medium text-sm text-gray-900">{template.label}</div>
                                    <div className="text-xs text-gray-600">{template.description}</div>
                                  </div>
                                </button>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => addLessonDirectly(section.id)}
                              >
                                Create Blank Lesson
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setShowTemplateSelector(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}
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
                                  variant="outline"
                                  onClick={() => onPreviewLesson && onPreviewLesson({ ...lesson, sectionId: section.id })}
                                  title="Preview Lesson"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
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

                      {/* Questions Editor */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium text-slate-700">Questions</h4>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setQuestionSectionId(section.id);
                              setQuestionDraft(section.questions || []);
                            }}
                          >
                            {section.questions && section.questions.length > 0 ? "Edit Questions" : "Add Questions"}
                          </Button>
                        </div>
                        {section.questions && section.questions.length > 0 && (
                          <div className="space-y-2">
                            {section.questions.map((q: any, idx: number) => (
                              <div key={q._id || q.id || idx} className="p-2 border rounded text-xs">
                                <div><b>Q{idx + 1}:</b> {q.prompt} <span className="ml-2 italic">[{q.type}]</span></div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Questions Modal/Inline Editor */}
                      {questionSectionId === section.id && (
                        <div className="p-4 border rounded bg-gray-50 mt-2">
                          <h5 className="font-semibold mb-2">Edit Questions</h5>
                          {(questionDraft || []).map((q: any, idx: number) => (
                            <div key={q._id || q.id || idx} className="mb-2 p-2 border rounded">
                              <Input
                                className="mb-1"
                                value={q.prompt}
                                onChange={e => {
                                  const updated = [...questionDraft];
                                  updated[idx].prompt = e.target.value;
                                  setQuestionDraft(updated);
                                }}
                                placeholder="Question prompt"
                              />
                              <Select
                                value={q.type}
                                onValueChange={value => {
                                  const updated = [...questionDraft];
                                  updated[idx].type = value;
                                  setQuestionDraft(updated);
                                }}
                              >
                                <SelectTrigger className="mb-1">
                                  <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                                  <SelectItem value="fill-in-the-blank">Fill in the Blank</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              {q.type === "multiple-choice" && (
                                <div>
                                  {(q.options || []).map((opt: string, oidx: number) => (
                                    <div key={oidx} className="flex mb-1">
                                      <Input
                                        className="flex-1"
                                        value={opt}
                                        onChange={e => {
                                          const updated = [...questionDraft];
                                          updated[idx].options[oidx] = e.target.value;
                                          setQuestionDraft(updated);
                                        }}
                                        placeholder={`Option ${oidx + 1}`}
                                      />
                                      <Button size="sm" variant="ghost" onClick={() => {
                                        const updated = [...questionDraft];
                                        updated[idx].options.splice(oidx, 1);
                                        setQuestionDraft(updated);
                                      }}>Remove</Button>
                                    </div>
                                  ))}
                                  <Button size="sm" variant="outline" onClick={() => {
                                    const updated = [...questionDraft];
                                    updated[idx].options = [...(updated[idx].options || []), ""];
                                    setQuestionDraft(updated);
                                  }}>Add Option</Button>
                                </div>
                              )}
                              <div className="mt-1">
                                <Input
                                  value={q.answer || ""}
                                  onChange={e => {
                                    const updated = [...questionDraft];
                                    updated[idx].answer = e.target.value;
                                    setQuestionDraft(updated);
                                  }}
                                  placeholder="Answer(s)"
                                />
                              </div>
                              <Textarea
                                className="w-full mt-1"
                                value={q.explanation || ""}
                                onChange={e => {
                                  const updated = [...questionDraft];
                                  updated[idx].explanation = e.target.value;
                                  setQuestionDraft(updated);
                                }}
                                placeholder="Explanation (optional)"
                              />
                              <Button size="sm" variant="ghost" onClick={() => {
                                const updated = [...questionDraft];
                                updated.splice(idx, 1);
                                setQuestionDraft(updated);
                              }}>Delete Question</Button>
                            </div>
                          ))}
                          <Button size="sm" variant="outline" onClick={() => {
                            setQuestionDraft([...(questionDraft || []), { _id: Date.now().toString(), type: "multiple-choice", prompt: "", options: [""], answer: "", explanation: "" }]);
                          }}>Add Question</Button>
                          <div className="flex gap-2 mt-2">
                            <Button size="sm" variant="default" onClick={() => handleSaveQuestions(section.id, questionDraft)}>Save Questions</Button>
                            <Button size="sm" variant="ghost" onClick={() => { setQuestionSectionId(null); setQuestionDraft(null); }}>Cancel</Button>
                          </div>
                        </div>
                      )}
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