import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Save,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Clock,
  Target,
  Code2,
  FileText
} from "lucide-react";
import { Lesson, LessonStep } from "@/entities/Course";

interface LessonTemplateCreatorProps {
  courseTitle: string;
  onSave: (lesson: Lesson) => void;
  onCancel: () => void;
}

export default function LessonTemplateCreator({ 
  courseTitle, 
  onSave, 
  onCancel 
}: LessonTemplateCreatorProps) {
  const [lesson, setLesson] = useState<Partial<Lesson>>({
    title: "",
    course: courseTitle,
    estimatedTime: 15,
    difficulty: "Beginner",
    progress: 0,
    steps: []
  });
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const updateLesson = (updates: Partial<Lesson>) => {
    setLesson(prev => ({ ...prev, ...updates }));
  };

  const addStep = () => {
    const newStep: LessonStep = {
      title: "New Step",
      content: `<h3>Step Content</h3><p>Add your content here...</p>`
    };
    const updatedSteps = [...(lesson.steps || []), newStep];
    updateLesson({ steps: updatedSteps });
    setActiveStepIndex(updatedSteps.length - 1);
  };

  const updateStep = (index: number, updates: Partial<LessonStep>) => {
    const updatedSteps = [...(lesson.steps || [])];
    updatedSteps[index] = { ...updatedSteps[index], ...updates };
    updateLesson({ steps: updatedSteps });
  };

  const deleteStep = (index: number) => {
    const updatedSteps = (lesson.steps || []).filter((_, i) => i !== index);
    updateLesson({ steps: updatedSteps });
    if (activeStepIndex >= updatedSteps.length) {
      setActiveStepIndex(Math.max(0, updatedSteps.length - 1));
    }
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    const updatedSteps = [...(lesson.steps || [])];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < updatedSteps.length) {
      [updatedSteps[index], updatedSteps[newIndex]] = [updatedSteps[newIndex], updatedSteps[index]];
      updateLesson({ steps: updatedSteps });
      setActiveStepIndex(newIndex);
    }
  };

  const handleSave = () => {
    if (lesson.title && lesson.steps && lesson.steps.length > 0) {
      const newLesson: Lesson = {
        id: Date.now().toString(),
        title: lesson.title,
        course: lesson.course || courseTitle,
        estimatedTime: lesson.estimatedTime || 15,
        difficulty: lesson.difficulty || "Beginner",
        progress: lesson.progress || 0,
        steps: lesson.steps,
        slug: `lesson-${Date.now()}`,
      };
      onSave(newLesson);
    }
  };

  const canSave = lesson.title && lesson.steps && lesson.steps.length > 0;

  return (
    <div className="space-y-6">
      {/* Lesson Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Create New Lesson</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {lesson.estimatedTime}m
              </Badge>
              <Badge variant="outline">
                {lesson.difficulty}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-slate-700">Lesson Title</label>
              <Input
                value={lesson.title}
                onChange={(e) => updateLesson({ title: e.target.value })}
                placeholder="Enter lesson title"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Estimated Time (minutes)</label>
              <Input
                type="number"
                value={lesson.estimatedTime}
                onChange={(e) => updateLesson({ estimatedTime: parseInt(e.target.value) || 15 })}
                min="1"
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Difficulty</label>
            <select
              value={lesson.difficulty}
              onChange={(e) => updateLesson({ difficulty: e.target.value as any })}
              className="w-full mt-1 p-2 border border-slate-200 rounded-md"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Steps Editor */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lesson Steps ({lesson.steps?.length || 0})</CardTitle>
            <Button onClick={addStep} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Step
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!lesson.steps || lesson.steps.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 mb-4">No steps yet. Add your first step to get started!</p>
              <Button onClick={addStep}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Step
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Steps List */}
              <div className="lg:col-span-1">
                <h4 className="font-medium text-slate-700 mb-3">Steps</h4>
                <div className="space-y-2">
                  {lesson.steps.map((step, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        activeStepIndex === index
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      onClick={() => setActiveStepIndex(index)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {index + 1}. {step.title}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              moveStep(index, 'up');
                            }}
                            disabled={index === 0}
                          >
                            <MoveUp className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              moveStep(index, 'down');
                            }}
                            disabled={index === lesson.steps!.length - 1}
                          >
                            <MoveDown className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteStep(index);
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step Editor */}
              <div className="lg:col-span-2">
                {activeStepIndex >= 0 && activeStepIndex < (lesson.steps?.length || 0) && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700">Step Title</label>
                      <Input
                        value={lesson.steps![activeStepIndex].title}
                        onChange={(e) => updateStep(activeStepIndex, { title: e.target.value })}
                        placeholder="Enter step title"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">Step Content (HTML)</label>
                      <textarea
                        value={lesson.steps![activeStepIndex].content}
                        onChange={(e) => updateStep(activeStepIndex, { content: e.target.value })}
                        placeholder="Enter HTML content for this step..."
                        className="w-full mt-1 p-3 border border-slate-200 rounded-md h-64 font-mono text-sm"
                      />
                    </div>
                    
                    {/* Content Preview */}
                    <div>
                      <label className="text-sm font-medium text-slate-700">Preview</label>
                      <div 
                        className="mt-1 p-4 border border-slate-200 rounded-md bg-white min-h-32"
                        dangerouslySetInnerHTML={{ 
                          __html: lesson.steps![activeStepIndex].content 
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!canSave}>
          <Save className="w-4 h-4 mr-2" />
          Create Lesson
        </Button>
      </div>
    </div>
  );
} 