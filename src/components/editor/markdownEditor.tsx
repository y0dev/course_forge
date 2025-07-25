/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Save, 
  Eye, 
  Code, 
  Bold, 
  Italic, 
  Link, 
  List,
  Image,
  Quote,
  Clock
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Textarea } from "@/components/ui/textarea";

export default function MarkdownEditor({ selectedLesson, onUpdateLesson }: { selectedLesson: any, onUpdateLesson: (lesson: any) => void }) {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [estimatedTime, setEstimatedTime] = useState(15);
  const [activeTab, setActiveTab] = useState("edit");

  useEffect(() => {
    if (selectedLesson) {
      setContent(selectedLesson.content || "");
      setTitle(selectedLesson.title || "");
      setEstimatedTime(selectedLesson.estimatedTime || 15);
    }
  }, [selectedLesson]);

  const handleSave = () => {
    if (onUpdateLesson) {
      onUpdateLesson({
        title,
        content,
        estimatedTime
      });
    }
  };

  const insertMarkdown = (syntax: string) => {
    const textarea = document.querySelector('textarea[data-markdown-editor]');
    if (!textarea) return;

    const start = (textarea as HTMLTextAreaElement).selectionStart;
    const end = (textarea as HTMLTextAreaElement).selectionEnd;
    const selectedText = content.substring(start, end);
    
    let newText = "";
    
    switch (syntax) {
      case "bold":
        newText = `**${selectedText || "bold text"}**`;
        break;
      case "italic":
        newText = `*${selectedText || "italic text"}*`;
        break;
      case "link":
        newText = `[${selectedText || "link text"}](url)`;
        break;
      case "image":
        newText = `![${selectedText || "alt text"}](image-url)`;
        break;
      case "quote":
        newText = `> ${selectedText || "quoted text"}`;
        break;
      case "list":
        newText = `- ${selectedText || "list item"}`;
        break;
      case "code":
        newText = selectedText.includes('\n') 
          ? `\`\`\`\n${selectedText || "code block"}\n\`\`\``
          : `\`${selectedText || "code"}\``;
        break;
      default:
        return;
    }

    const newContent = content.substring(0, start) + newText + content.substring(end);
    setContent(newContent);
    
    setTimeout(() => {
      (textarea as HTMLTextAreaElement).focus();
      (textarea as HTMLTextAreaElement).setSelectionRange(start + newText.length, start + newText.length);
    }, 0);
  };

  if (!selectedLesson) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Code className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 mb-2">No lesson selected</h3>
          <p className="text-slate-500">Select a lesson from the course structure to start editing.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lesson Editor</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {estimatedTime}m
              </Badge>
              <Button onClick={handleSave} size="sm">
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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter lesson title"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Estimated Time (minutes)</label>
              <Input
                type="number"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(parseInt(e.target.value) || 15)}
                min="1"
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Content</CardTitle>
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => insertMarkdown("bold")}
              >
                <Bold className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => insertMarkdown("italic")}
              >
                <Italic className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => insertMarkdown("link")}
              >
                <Link className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => insertMarkdown("image")}
              >
                <Image className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => insertMarkdown("list")}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => insertMarkdown("quote")}
              >
                <Quote className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => insertMarkdown("code")}
              >
                <Code className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="edit" className="flex items-center gap-2">
                <Code className="w-4 h-4" />
                Edit
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Preview
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="edit">
              <Textarea
                data-markdown-editor
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your lesson content in Markdown..."
                className="h-96 font-mono"
              />
            </TabsContent>
            
            <TabsContent value="preview">
              <div className="h-96 overflow-auto border border-slate-200 rounded-lg p-4 bg-white">
                <div className="prose prose-slate max-w-none">
                  <ReactMarkdown>{content}</ReactMarkdown>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}