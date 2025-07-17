import React, { useState, useRef } from "react";
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
// FormattingToolbar from StepBasedLessonEditor
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface FormattingToolbarProps {
  onFormat: (format: string, placeholder?: string) => void;
}

function FormattingToolbar({ onFormat }: FormattingToolbarProps) {
  const formatButtons = [
    { icon: Code2, label: "H1", format: "h1", placeholder: "Heading 1" },
    { icon: Code2, label: "H2", format: "h2", placeholder: "Heading 2" },
    { icon: Code2, label: "H3", format: "h3", placeholder: "Heading 3" },
    { icon: Code2, label: "P", format: "p", placeholder: "Paragraph" },
    { icon: Code2, label: "Bold", format: "strong", placeholder: "Bold text" },
    { icon: Code2, label: "Italic", format: "em", placeholder: "Italic text" },
    // List Block dropdown will be added below
    { icon: Code2, label: "Quote", format: "blockquote", placeholder: "Quote" },
    { icon: Code2, label: "Link", format: "a", placeholder: "Link text" },
    { icon: Code2, label: "Table", format: "table", placeholder: "Table" },
    { icon: Code2, label: "Demo", format: "demo", placeholder: "Interactive Demo" },
    { icon: Code2, label: "BR", format: "br", placeholder: "" },
    // Div dropdown below
  ];
  // List block color options
  const listBlockColors = [
    { label: "Blue", value: "blue-50", title: "Big-Endian Storage:", ulClass: "mt-2 space-y-1" },
    { label: "Green", value: "green-50", title: "Little-Endian Storage:", ulClass: "mt-2 space-y-1" },
  ];
  // More tags for dropdown
  const moreTags = [
    { label: "Horizontal Rule", format: "hr", placeholder: "" },
    { label: "Superscript", format: "sup", placeholder: "superscript" },
    { label: "Subscript", format: "sub", placeholder: "subscript" },
    { label: "Mark", format: "mark", placeholder: "highlighted" },
    { label: "Deleted", format: "del", placeholder: "deleted" },
    { label: "Keyboard", format: "kbd", placeholder: "Ctrl+C" },
    { label: "Abbreviation", format: "abbr", placeholder: "abbr" },
  ];
  // Code languages for dropdown
  const codeLanguages = [
    { label: "JavaScript", value: "javascript", placeholder: "console.log('Hello, world!');" },
    { label: "Python", value: "python", placeholder: "print('Hello, world!')" },
    { label: "C++", value: "cpp", placeholder: "#include <iostream>\nint main() { std::cout << \"Hello, world!\"; }" },
    { label: "Java", value: "java", placeholder: "public class Main { public static void main(String[] args) { System.out.println(\"Hello, world!\"); } }" },
    { label: "HTML", value: "html", placeholder: "<h1>Hello, world!</h1>" },
    { label: "CSS", value: "css", placeholder: "body { color: blue; }" },
    { label: "TypeScript", value: "typescript", placeholder: "let message: string = 'Hello, world!';" },
    { label: "Bash", value: "bash", placeholder: "echo 'Hello, world!'" },
    { label: "JSON", value: "json", placeholder: "{ \"message\": \"Hello, world!\" }" },
    { label: "Other", value: "plaintext", placeholder: "code here" },
  ];
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
    <div className="flex flex-wrap gap-1 p-2 bg-slate-50 border border-slate-200 rounded-md mb-2">
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
      {/* Code dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" title="Insert Code Block">
            <Code2 className="w-3 h-3 mr-1" />Code
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {codeLanguages.map((lang) => (
            <DropdownMenuItem
              key={lang.value}
              onClick={() => onFormat("codeblock", JSON.stringify(lang))}
            >
              {lang.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" title="Insert Div">
            <Code2 className="w-3 h-3 mr-1" />Div
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
      {/* List Block dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" title="Insert List Block">
            <Code2 className="w-3 h-3 mr-1" />List Block
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {listBlockColors.map((color) => (
            <DropdownMenuItem
              key={color.value}
              onClick={async () => {
                let title = prompt(`Enter list block title:`, color.title);
                if (!title) title = color.title;
                onFormat("listblock", JSON.stringify({ color: color.value, title, ulClass: color.ulClass }));
              }}
            >
              {color.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {/* More tags dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" title="More HTML Tags">
            <Code2 className="w-3 h-3 mr-1" />More
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {moreTags.map((tag) => (
            <DropdownMenuItem
              key={tag.format}
              onClick={() => onFormat(tag.format, tag.placeholder)}
            >
              {tag.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

interface LessonTemplateCreatorProps {
  courseTitle: string;
  onSave: (lesson: Lesson) => void;
  onCancel: () => void;
}

function getPreviewHtml(content: string): string {
  if (!content) return '';
  // Regex to find the first <h1>, <h2>, or <h3>
  const headerRegex = /<(h[1-3])[^>]*>([\s\S]*?)<\/h[1-3]>/i;
  const match = content.match(headerRegex);
  if (!match) return content;
  const headerText = match[2].trim();
  const customHeader = `<h3 class="text-lg font-semibold leading-none tracking-tight text-[var(--primary)] flex items-center gap-2"><div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open w-4 h-4 text-blue-600" aria-hidden="true"><path d="M12 7v14"></path><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path></svg></div>${headerText}</h3>`;
  // Split content into before header, header, and after header
  const headerStart = match.index!;
  const headerEnd = headerStart + match[0].length;
  const beforeHeader = content.slice(0, headerStart);
  const afterHeader = content.slice(headerEnd);
  // Wrap afterHeader in the requested divs
  const wrappedAfter = `<div class="p-6 pt-4 prose prose-slate max-w-none"><div class="space-y-4">${afterHeader}</div></div>`;
  return beforeHeader + customHeader + wrappedAfter;
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  function handleFormat(format: string, placeholder?: string) {
    if (!textareaRef.current || activeStepIndex < 0 || !lesson.steps || activeStepIndex >= lesson.steps.length) {
      return;
    }
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const currentContent = lesson.steps[activeStepIndex].content || "";
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
      case 'listblock':
        // placeholder param is a stringified color/title object
        let listBlock = { color: 'blue-50', title: 'List', ulClass: 'mt-2 space-y-1' };
        try {
          if (placeholder) listBlock = JSON.parse(placeholder);
        } catch {}
        newContent = currentContent.substring(0, start) +
          `<div class="bg-${listBlock.color} p-4 rounded-lg">\n  <h4 class="font-bold">${listBlock.title}</h4>\n  <ul class="${listBlock.ulClass}">\n    <li>Item 1</li>\n    <li>Item 2</li>\n    <li>Item 3</li>\n  </ul>\n</div>`
          + currentContent.substring(end);
        newCursorPos = start + 0;
        break;
      case 'table':
        newContent = currentContent.substring(0, start) + `<div class="bg-gray-100 p-4 rounded-lg my-4">\n  <h4>Same Example: Storing 0x12345678</h4>\n  <table class="w-full mt-2">\n    <tr class="bg-green-100">\n      <th class="p-2 border">Memory Address</th>\n      <th class="p-2 border">0x1000</th>\n      <th class="p-2 border">0x1001</th>\n      <th class="p-2 border">0x1002</th>\n      <th class="p-2 border">0x1003</th>\n    </tr>\n    <tr>\n      <td class="p-2 border font-bold">Byte Value</td>\n      <td class="p-2 border text-center">0x78</td>\n      <td class="p-2 border text-center">0x56</td>\n      <td class="p-2 border text-center">0x34</td>\n      <td class="p-2 border text-center">0x12</td>\n    </tr>\n  </table>\n</div>` + currentContent.substring(end);
        newCursorPos = start + 0;
        break;
      case 'div':
        let divHtml = placeholder || '<div class="bg-gray-100 p-4 rounded-lg my-4">Div content</div>';
        if (selectedText) {
          divHtml = divHtml.replace('Div content', selectedText);
        }
        newContent = currentContent.substring(0, start) + divHtml + currentContent.substring(end);
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
      case 'demo':
        newContent = currentContent.substring(0, start) + `<div class="flex flex-col space-y-1.5 p-6"><h3 class="text-lg font-semibold leading-none tracking-tight text-[var(--primary)] flex items-center gap-2 text-blue-900"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cpu w-5 h-5" aria-hidden="true"><path d="M12 20v2"></path><path d="M12 2v2"></path><path d="M17 20v2"></path><path d="M17 2v2"></path><path d="M2 12h2"></path><path d="M2 17h2"></path><path d="M2 7h2"></path><path d="M20 12h2"></path><path d="M20 17h2"></path><path d="M20 7h2"></path><path d="M7 20v2"></path><path d="M7 2v2"></path><rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="8" y="8" width="8" height="8" rx="1"></rect></svg>Interactive Demo</h3></div><div class="p-6 pt-4"><div class="bg-white p-4 rounded-lg"><h4 class="font-semibold mb-3">Memory Visualization Tool</h4><div class="grid grid-cols-4 gap-2 mb-4"><div class="text-center"><div class="text-xs text-slate-600 mb-1">0x1000</div><div class="bg-green-100 border-2 border-green-300 rounded p-2 font-mono">0x78</div></div><div class="text-center"><div class="text-xs text-slate-600 mb-1">0x1001</div><div class="bg-green-100 border-2 border-green-300 rounded p-2 font-mono">0x56</div></div><div class="text-center"><div class="text-xs text-slate-600 mb-1">0x1002</div><div class="bg-green-100 border-2 border-green-300 rounded p-2 font-mono">0x34</div></div><div class="text-center"><div class="text-xs text-slate-600 mb-1">0x1003</div><div class="bg-green-100 border-2 border-green-300 rounded p-2 font-mono">0x12</div></div></div><p class="text-sm text-slate-600"><strong>Little-Endian view:</strong> 0x12345678 stored in memory</p></div></div>` + currentContent.substring(end);
        newCursorPos = start + 0;
        break;
      case 'codeblock':
        // placeholder param is a stringified language object
        let langObj = { value: 'plaintext', label: 'Other', placeholder: 'code here' };
        try {
          if (placeholder) langObj = JSON.parse(placeholder);
        } catch {}
        const codeContent = selectedText || langObj.placeholder;
        // Escape code for data-code attribute
        const escapeForAttr = (str: string) => str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        newContent = currentContent.substring(0, start) +
          `<div class="rounded-lg shadow-lg overflow-hidden border border-slate-200 mb-4">
            <div class="flex items-center justify-between bg-blue-600 px-4 py-2">
              <span class="text-xs font-semibold uppercase tracking-wide text-white bg-blue-800 rounded px-2 py-1">${langObj.label}</span>
              <button class="copy-btn flex items-center gap-1 text-xs text-white hover:text-blue-200 transition" data-code="${escapeForAttr(codeContent)}" title="Copy code">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>
                Copy
              </button>
            </div>
            <pre class="bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto font-mono"><code class="language-${langObj.value}">${codeContent}</code></pre>
          </div>`
          + currentContent.substring(end);
        newCursorPos = start + 0;
        break;
      case 'br':
        newContent = currentContent.substring(0, start) + '<br />' + currentContent.substring(end);
        newCursorPos = start + 6;
        break;
      case 'hr':
        newContent = currentContent.substring(0, start) + '<hr />' + currentContent.substring(end);
        newCursorPos = start + 6;
        break;
      case 'sup':
        newContent = currentContent.substring(0, start) + `<sup>${selectedText || placeholder || ''}</sup>` + currentContent.substring(end);
        newCursorPos = start + 5 + (selectedText || placeholder || '').length + 6;
        break;
      case 'sub':
        newContent = currentContent.substring(0, start) + `<sub>${selectedText || placeholder || ''}</sub>` + currentContent.substring(end);
        newCursorPos = start + 5 + (selectedText || placeholder || '').length + 6;
        break;
      case 'mark':
        newContent = currentContent.substring(0, start) + `<mark>${selectedText || placeholder || ''}</mark>` + currentContent.substring(end);
        newCursorPos = start + 6 + (selectedText || placeholder || '').length + 7;
        break;
      case 'del':
        newContent = currentContent.substring(0, start) + `<del>${selectedText || placeholder || ''}</del>` + currentContent.substring(end);
        newCursorPos = start + 5 + (selectedText || placeholder || '').length + 6;
        break;
      case 'kbd':
        newContent = currentContent.substring(0, start) + `<kbd>${selectedText || placeholder || ''}</kbd>` + currentContent.substring(end);
        newCursorPos = start + 5 + (selectedText || placeholder || '').length + 6;
        break;
      case 'abbr':
        newContent = currentContent.substring(0, start) + `<abbr>${selectedText || placeholder || ''}</abbr>` + currentContent.substring(end);
        newCursorPos = start + 6 + (selectedText || placeholder || '').length + 7;
        break;
      default:
        return;
    }
    updateStep(activeStepIndex, { content: newContent });
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  }

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
              onChange={(e) => updateLesson({ difficulty: e.target.value as 'Beginner' | 'Intermediate' | 'Advanced' })}
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
                      <FormattingToolbar onFormat={handleFormat} />
                      {/* Formatting logic for HTML content */}
                      <textarea
                        ref={textareaRef}
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
                          __html: getPreviewHtml(lesson.steps![activeStepIndex].content)
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