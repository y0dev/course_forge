import React, { useState, useEffect, useRef } from "react";
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
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Type,
  Link,
  Quote
} from "lucide-react";
import { Lesson, LessonStep } from "@/entities/Course";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface StepBasedLessonEditorProps {
  selectedLesson: Lesson | null;
  onUpdateLesson: (updates: Partial<Lesson>) => void;
}

// Formatting toolbar component
interface FormattingToolbarProps {
  onFormat: (format: string, placeholder?: string) => void;
}

function FormattingToolbar({ onFormat }: FormattingToolbarProps) {
  const formatButtons = [
    { icon: Heading1, label: "H1", format: "h1", placeholder: "Heading 1" },
    { icon: Heading2, label: "H2", format: "h2", placeholder: "Heading 2" },
    { icon: Heading3, label: "H3", format: "h3", placeholder: "Heading 3" },
    { icon: Type, label: "P", format: "p", placeholder: "Paragraph" },
    { icon: Bold, label: "Bold", format: "strong", placeholder: "Bold text" },
    { icon: Italic, label: "Italic", format: "em", placeholder: "Italic text" },
    { icon: List, label: "UL", format: "ul", placeholder: "Unordered list" },
    { icon: ListOrdered, label: "OL", format: "ol", placeholder: "Ordered list" },
    { icon: Quote, label: "Quote", format: "blockquote", placeholder: "Quote" },
    { icon: Link, label: "Link", format: "a", placeholder: "Link text" },
    { icon: Type, label: "Table", format: "table", placeholder: "Table" },
    // Remove the old Div button, replace with dropdown below
  ];

  // Div design options
  const divDesigns = [
    {
      label: "Gray",
      value: "div-gray",
      html: '<div class="bg-gray-100 p-4 rounded-lg my-4">Div content</div>'
    },
    {
      label: "Red Alert",
      value: "div-red",
      html: '<div class="bg-red-50 p-4 rounded-lg border-l-4 border-red-500 my-4">Div content</div>'
    },
    {
      label: "Amber Alert",
      value: "div-amber",
      html: '<div class="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">Div content</div>'
    },
    {
      label: "Green Alert",
      value: "div-green",
      html: '<div class="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">Div content</div>'
    }
  ];

  return (
    <div className="flex flex-wrap gap-1 p-2 bg-slate-50 border border-slate-200 rounded-md">
      {formatButtons.map((button) => {
        const Icon = button.icon;
        return (
          <Button
            key={button.format}
            variant="ghost"
            size="sm"
            onClick={() => onFormat(button.format, button.placeholder)}
            className="h-8 px-2 text-xs"
            title={`Insert ${button.label}`}
          >
            <Icon className="w-3 h-3 mr-1" />
            {button.label}
          </Button>
        );
      })}
      {/* Div dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" title="Insert Div">
            <Type className="w-3 h-3 mr-1" />Div
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {divDesigns.map((design) => (
            <DropdownMenuItem
              key={design.value}
              onClick={() => onFormat("div", design.html)}
            >
              {design.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default function StepBasedLessonEditor({
  selectedLesson,
  onUpdateLesson
}: StepBasedLessonEditorProps) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (selectedLesson) {
      setLesson(selectedLesson);
      setActiveStepIndex(0);
    }
  }, [selectedLesson]);

  if (!lesson) {
    return (
      <div className="text-center py-12">
        <Target className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-600 mb-2">
          No lesson selected
        </h3>
        <p className="text-slate-500">
          Select a lesson from the course structure to start editing.
        </p>
      </div>
    );
  }

  const updateLesson = (updates: Partial<Lesson>) => {
    const updatedLesson = { ...lesson, ...updates };
    setLesson(updatedLesson);
    onUpdateLesson(updates);
  };

  const addStep = () => {
    const newStep: LessonStep = {
      title: "New Step",
      content: `<h3>Step Content</h3><p>Add your content here...</p>`
    };
    const updatedSteps = [...lesson.steps, newStep];
    updateLesson({ steps: updatedSteps });
    setActiveStepIndex(updatedSteps.length - 1);
  };

  const updateStep = (index: number, updates: Partial<LessonStep>) => {
    const updatedSteps = [...lesson.steps];
    updatedSteps[index] = { ...updatedSteps[index], ...updates };
    updateLesson({ steps: updatedSteps });
  };

  const deleteStep = (index: number) => {
    const updatedSteps = lesson.steps.filter((_, i) => i !== index);
    updateLesson({ steps: updatedSteps });
    if (activeStepIndex >= updatedSteps.length) {
      setActiveStepIndex(Math.max(0, updatedSteps.length - 1));
    }
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    const updatedSteps = [...lesson.steps];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex >= 0 && newIndex < updatedSteps.length) {
      [updatedSteps[index], updatedSteps[newIndex]] = [updatedSteps[newIndex], updatedSteps[index]];
      updateLesson({ steps: updatedSteps });
      setActiveStepIndex(newIndex);
    }
  };

  const handleContentChange = (index: number, content: string) => {
    updateStep(index, { content });
  };

  const handleFormat = (format: string, placeholder?: string) => {
    if (!textareaRef.current || activeStepIndex < 0 || activeStepIndex >= lesson.steps.length) {
      return;
    }

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const currentContent = lesson.steps[activeStepIndex].content;

    let newContent = '';
    let newCursorPos = start;

    switch (format) {
      case 'h1':
        newContent = currentContent.substring(0, start) + `<h1>${selectedText || placeholder || 'Heading 1'}</h1>` + currentContent.substring(end);
        newCursorPos = start + 4 + (selectedText || placeholder || 'Heading 1').length + 5;
        break;
      case 'h2':
        newContent = currentContent.substring(0, start) + `<h2>${selectedText || placeholder || 'Heading 2'}</h2>` + currentContent.substring(end);
        newCursorPos = start + 4 + (selectedText || placeholder || 'Heading 2').length + 5;
        break;
      case 'h3':
        newContent = currentContent.substring(0, start) + `<h3>${selectedText || placeholder || 'Heading 3'}</h3>` + currentContent.substring(end);
        newCursorPos = start + 4 + (selectedText || placeholder || 'Heading 3').length + 5;
        break;
      case 'p':
        newContent = currentContent.substring(0, start) + `<p>${selectedText || placeholder || 'Paragraph'}</p>` + currentContent.substring(end);
        newCursorPos = start + 3 + (selectedText || placeholder || 'Paragraph').length + 4;
        break;
      case 'strong':
        newContent = currentContent.substring(0, start) + `<strong>${selectedText || placeholder || 'Bold text'}</strong>` + currentContent.substring(end);
        newCursorPos = start + 8 + (selectedText || placeholder || 'Bold text').length + 9;
        break;
      case 'em':
        newContent = currentContent.substring(0, start) + `<em>${selectedText || placeholder || 'Italic text'}</em>` + currentContent.substring(end);
        newCursorPos = start + 4 + (selectedText || placeholder || 'Italic text').length + 5;
        break;
      case 'ul':
        newContent = currentContent.substring(0, start) + `<ul class="mt-2 space-y-1">\n  <li>${selectedText || placeholder || 'List item'}</li>\n</ul>` + currentContent.substring(end);
        newCursorPos = start + 31 + (selectedText || placeholder || 'List item').length + 9;
        break;
      case 'ol':
        newContent = currentContent.substring(0, start) + `<ol class="mt-2 space-y-1">\n  <li>${selectedText || placeholder || 'List item'}</li>\n</ol>` + currentContent.substring(end);
        newCursorPos = start + 31 + (selectedText || placeholder || 'List item').length + 9;
        break;
      case 'table':
        newContent = currentContent.substring(0, start) + `<div class="bg-gray-100 p-4 rounded-lg my-4">\n  <h4>Same Example: Storing 0x12345678</h4>\n  <table class="w-full mt-2">\n    <tr class="bg-green-100">\n      <th class="p-2 border">Memory Address</th>\n      <th class="p-2 border">0x1000</th>\n      <th class="p-2 border">0x1001</th>\n      <th class="p-2 border">0x1002</th>\n      <th class="p-2 border">0x1003</th>\n    </tr>\n    <tr>\n      <td class="p-2 border font-bold">Byte Value</td>\n      <td class="p-2 border text-center">0x78</td>\n      <td class="p-2 border text-center">0x56</td>\n      <td class="p-2 border text-center">0x34</td>\n      <td class="p-2 border text-center">0x12</td>\n    </tr>\n  </table>\n</div>` + currentContent.substring(end);
        newCursorPos = start + 0; // Place cursor at start of inserted block
        break;
      case 'div':
        // If placeholder is a full HTML string, use it directly, otherwise fallback to gray div
        let divHtml = placeholder || '<div class="bg-gray-100 p-4 rounded-lg my-4">Div content</div>';
        // If user selected text, replace 'Div content' with it
        if (selectedText) {
          divHtml = divHtml.replace('Div content', selectedText);
        }
        newContent = currentContent.substring(0, start) + divHtml + currentContent.substring(end);
        // Try to place cursor after the inserted div
        newCursorPos = start + divHtml.length;
        break;
      case 'blockquote':
        newContent = currentContent.substring(0, start) + `<blockquote>${selectedText || placeholder || 'Quote'}</blockquote>` + currentContent.substring(end);
        newCursorPos = start + 12 + (selectedText || placeholder || 'Quote').length + 13;
        break;
      case 'a':
        newContent = currentContent.substring(0, start) + `<a href="#" target="_blank">${selectedText || placeholder || 'Link text'}</a>` + currentContent.substring(end);
        newCursorPos = start + 9 + (selectedText || placeholder || 'Link text').length + 4;
        break;
      default:
        return;
    }

    // Update the content
    handleContentChange(activeStepIndex, newContent);

    // Set cursor position after the update
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  return (
    <div className="space-y-6">
      {/* Lesson Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lesson Editor</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {lesson.estimatedTime}m
              </Badge>
              <Badge variant="outline">
                {lesson.difficulty}
              </Badge>
              <Button onClick={() => onUpdateLesson(lesson)} size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
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
              onChange={(e) => updateLesson({ difficulty: e.target.value as 'Beginner' | 'Intermediate' | 'Advanced' })}
              className="w-full mt-1 p-2 order border-slate-200 rounded-md"
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
            <CardTitle>Lesson Steps ({lesson.steps.length})</CardTitle>
            <Button onClick={addStep} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Step
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {lesson.steps.length === 0 ? (
            <div className="text-center py-8">
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
                            {index + 1}
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
                            disabled={index === lesson.steps.length - 1}
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
                            className="text-red-50 hover:text-red-700"
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
                {activeStepIndex >= 0 && activeStepIndex < lesson.steps.length && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700">Step Title</label>
                      <Input
                        value={lesson.steps[activeStepIndex].title}
                        onChange={(e) => updateStep(activeStepIndex, { title: e.target.value })}
                        placeholder="Enter step title"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">Step Content (HTML)</label>
                      <FormattingToolbar onFormat={handleFormat} />
                      <textarea
                        ref={textareaRef}
                        value={lesson.steps[activeStepIndex].content}
                        onChange={(e) => handleContentChange(activeStepIndex, e.target.value)}
                        placeholder="Enter HTML content for this step..."
                        className="w-full mt-1 p-3 border border-slate-200 rounded-md h-64 font-mono text-sm"
                      />
                    </div>

                    {/* Content Preview */}
                    <div>
                      <label className="text-sm font-medium text-slate-700">Preview</label>
                      <div
                        className="mt-1 p-4 order border-slate-200 rounded-md bg-white min-h-32"
                        dangerouslySetInnerHTML={{
                          __html: lesson.steps[activeStepIndex].content
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
    </div>
  );
} 