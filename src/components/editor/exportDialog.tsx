import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileText, Loader2, Check, Code2, Archive } from "lucide-react";
import { Course } from "@/entities/Course";

interface ExportDialogProps {
  open: boolean;
  onClose: () => void;
  courseData: Partial<Course>;
}

export default function ExportDialog({ open, onClose, courseData }: ExportDialogProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [exportType, setExportType] = useState("html");

  const formatHTMLContent = (content: string) => {
    if (!content) return '';
    
    // Add newlines after closing tags for better readability
    const formatted = content
      // Add newlines after block-level closing tags
      .replace(/\/(h[1-6]|p|div|section|article|header|footer|nav|aside|main|blockquote|ul|ol|li|table|tr|td|th|form|fieldset|legend|figure|figcaption)>/g, '/$1>\n')
      // Add newlines after self-closing tags
      .replace(/\/(br|hr|img|input|meta|link|area|base|col|embed|source|track|wbr)>/g, '/$1>\n')
      // Add newlines before opening block tags
      .replace(/(\n|^)<(h[1-6]|p|div|section|article|header|footer|nav|aside|main|blockquote|ul|ol|li|table|tr|td|th|form|fieldset|legend|figure|figcaption)/g, '\n<$2')
      // Clean up multiple consecutive newlines
      .replace(/\n{3,}/g, '\n\n')
      // Trim leading/trailing whitespace
      .trim();
    
    return formatted;
  };

  const convertMarkdownToHTML = (markdown: string) => {
    let html = markdown || '';

    // Block elements
    html = html
      .replace(/```(\w+)?\n([\s\S]*?)```/g, (match: string, lang: string, code: string) => {
        const language = lang || 'plaintext';
        return `
<div class="code-block-container">
  <header>
    <span class="language">${language}</span>
    <button class="copy-btn" title="Copy code">Copy</button>
  </header>
  <pre><code class="language-${language}">${code.trim()}</code></pre>
</div>`;
      })
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^> (.*$)/gim, '<blockquote><p>$1</p></blockquote>')
      .replace(/!\[(.*?)\]\((.*?)\)/gim, '<figure class="image-container"><img src="$2" alt="$1"><figcaption>$1</figcaption></figure>')
      .replace(/<hr>/g, '<hr class="styled-hr">');

    // Lists
    html = html
      .replace(/^\s*\n\*/gm, '\n*') // Fix list spacing
      .replace(/^\s*\n-/gm, '\n-')
      .replace(/^\s*\n\d\./gm, '\n1.')
      .replace(/^( *)\d+\. (.*)/gm, (s: string) => `${s}\n`)
      .replace(/^( *)[*+-] (.*)/gm, (s: string) => `${s}\n`)
      .replace(/((\n( {2,4}|\t)[*+-] .*)+)/g, (m: string) => `<ul>${m}</ul>`)
      .replace(/((\n\d+\. .*)+)/g, (m: string) => `<ol>${m}</ol>`)
      .replace(/\n([*+-] |\d+\. )/g, '<li>')
      .replace(/<\/li>\n/g, '</li>');

    // Inline elements
    html = html
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" class="styled-link">$1</a>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/`(.*?)`/gim, '<code>$1</code>');
      
    // Paragraphs
    html = html.split('\n\n').map(p => p.trim() && !p.startsWith('<') ? `<p>${p}</p>` : p).join('');

    // Cleanup
    html = html.replace(/<p><(h[1-6]|ul|ol|li|blockquote|pre|figure|hr)/g, '<$1')
               .replace(/<\/(h[1-6]|ul|ol|li|blockquote|pre|figure|hr)><\/p>/g, '</$1>');

    return html;
  };

  const generateJSON = () => {
    // Temporary debug log
    console.log('Exporting course data:', courseData);
    console.log('Steps in first lesson:', courseData.sections?.[0]?.lessons?.[0]?.steps);
    
    const jsonData = {
      id: courseData.id || Date.now().toString(),
      title: courseData.title || "",
      slug: courseData.slug || "",
      description: courseData.description || "",
      category: courseData.category || "Beginner",
      author: courseData.author || "",
      tags: courseData.tags || [],
      template: courseData.template || "academic",
      customCSS: courseData.customCSS || "",
      createdAt: courseData.createdAt || new Date().toISOString(),
      updatedAt: courseData.updatedAt || new Date().toISOString(),
      sections: courseData.sections?.map(section => ({
        id: section.id || Date.now().toString(),
        title: section.title || "",
        slug: section.slug || "",
        lessons: section.lessons?.map(lesson => ({
          id: lesson.id || Date.now().toString(),
          title: lesson.title || "",
          slug: lesson.slug || "",
          course: lesson.course || courseData.title,
          estimatedTime: lesson.estimatedTime || 15,
          difficulty: lesson.difficulty || "Beginner",
          progress: lesson.progress || 0,
          steps: lesson.steps?.map(step => ({
            title: step.title || "",
            content: step.content || ""
          })) || [],
          content: lesson.content || ""
        })) || []
      })) || []
    };

    return JSON.stringify(jsonData, null, 2);
  };

  const generateStepBasedHTML = (lesson: {title?: string, content?: string, steps?: Array<{title?: string, content?: string}>, id?: string, slug?: string, estimatedTime?: number}, stepIndex: number | null = null) => {
    const styles = getTemplateStyles(courseData.template || "academic");
    const script = getTemplateScript();
    
    let content = '';
    let title = lesson.title || '';
    
    if (lesson.steps && lesson.steps.length > 0) {
      if (stepIndex !== null) {
        // Single step page
        const step = lesson.steps[stepIndex];
        content = `
          <div class="step-content">
            <h2>${step.title || ''}</h2>
            <div class="step-body">
              ${formatHTMLContent(step.content || '')}
            </div>
          </div>
        `;
        title = `${lesson.title || ''} - Step ${stepIndex + 1}: ${step.title || ''}`;
      } else {
        // All steps in one page
        content = lesson.steps.map((step: {title?: string, content?: string}, index: number) => `
          <div class="step-content" id="step-${index + 1}">
            <h2>Step ${index + 1}: ${step.title || ''}</h2>
            <div class="step-body">
              ${formatHTMLContent(step.content || '')}
            </div>
          </div>
        `).join('');
      }
    } else {
      // Legacy markdown content
      content = `
        <div class="lesson-body">
          ${convertMarkdownToHTML(lesson.content || '')}
        </div>
      `;
    }

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="course-title" content="${courseData.title || ''}">
    <title>${title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono&display=swap" rel="stylesheet">
    <style>${styles}</style>
</head>
<body>
    <div class="course-layout">
        <aside class="sidebar">
            <div class="sidebar-content">
                <h2 class="site-title">${courseData.title || ''}</h2>
                <nav class="course-navigation">
                    <h3 class="nav-title">Course Content</h3>
                    <div class="section">
                        <ul class="lesson-list">
                            <li><a href="index.html" class="lesson-link">Course Home</a></li>
                        </ul>
                    </div>
                    ${courseData.sections?.map(section => `
                      <div class="section">
                        <h3 class="section-title">${section.title || ''}</h3>
                        <ul class="lesson-list">
                          ${section.lessons?.map(l => `
                            <li class="lesson-item">
                              <a href="${l.slug || ''}.html" class="lesson-link ${l.id === lesson.id ? 'active' : ''}">
                                <span>${l.title || ''}</span>
                                <span class="lesson-time">${l.estimatedTime || 15}m</span>
                              </a>
                            </li>
                          `).join('') || ''}
                        </ul>
                      </div>
                    `).join('') || ''}
                </nav>
            </div>
        </aside>

        <div class="main-content-container" id="main-content">
            <main class="main-content">
                <h1>${lesson.title || ''}</h1>
                ${content}
            </main>
        </div>
    </div>
    <script>${script}</script>
</body>
</html>`;
  };

  const generateIndexHTML = () => {
    const styles = getTemplateStyles(courseData.template || "academic");
    const script = getTemplateScript();
    
    const navigationHTML = courseData.sections?.map(section => `
      <div class="section">
        <h3 class="section-title">${section.title || ''}</h3>
        <ul class="lesson-list">
          ${section.lessons?.map(lesson => `
            <li class="lesson-item">
              <a href="${lesson.slug || ''}.html" class="lesson-link">
                <span>${lesson.title || ''}</span>
                <span class="lesson-time">${lesson.estimatedTime || 15}m</span>
              </a>
            </li>
          `).join('') || ''}
        </ul>
      </div>
    `).join('') || '';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="course-title" content="${courseData.title || ''}">
    <title>${courseData.title || ''}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono&display=swap" rel="stylesheet">
    <style>${styles}</style>
</head>
<body>
    <div class="course-layout">
        <aside class="sidebar">
            <div class="sidebar-content">
                <h2 class="site-title">${courseData.title || ''}</h2>
                <nav class="course-navigation">
                    <h3 class="nav-title">Course Content</h3>
                    <div class="section">
                        <ul class="lesson-list">
                            <li><a href="index.html" class="lesson-link active">Course Home</a></li>
                        </ul>
                    </div>
                    ${navigationHTML}
                </nav>
            </div>
        </aside>

        <div class="main-content-container" id="main-content">
            <main class="main-content">
                <div id="course-home">
                    <h1>${courseData.title || ''}</h1>
                    ${courseData.description ? `<p class="course-description">${courseData.description}</p>` : ''}
                    <h2>Welcome!</h2>
                    <p>Select a lesson from the sidebar to begin.</p>
                    
                    <div class="course-stats">
                        <div class="stat-grid">
                            <div class="stat-item">
                                <h3>${courseData.sections?.length || 0}</h3>
                                <p>Sections</p>
                            </div>
                            <div class="stat-item">
                                <h3>${courseData.sections?.reduce((total, section) => total + (section.lessons?.length || 0), 0) || 0}</h3>
                                <p>Lessons</p>
                            </div>
                            <div class="stat-item">
                                <h3>${courseData.sections?.reduce((total, section) => 
                                  total + section.lessons?.reduce((lessonTotal, lesson) => 
                                    lessonTotal + (lesson.estimatedTime || 15), 0
                                  ) || 0, 0
                                ) || 0}m</h3>
                                <p>Total Time</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
    <script>${script}</script>
</body>
</html>`;
  };

  const createZIP = async (files: Array<{name: string, content: string}>) => {
    // For now, we'll create individual files since ZIP creation requires additional libraries
    // In a real implementation, you'd use a library like JSZip
    return files;
  };

  const getTemplateScript = () => `
    document.addEventListener('DOMContentLoaded', function() {
        // Copy button functionality
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('copy-btn')) {
                const pre = e.target.closest('.code-block-container').querySelector('pre');
                const code = pre.innerText;
                navigator.clipboard.writeText(code).then(() => {
                    e.target.textContent = 'Copied!';
                    setTimeout(() => { e.target.textContent = 'Copy'; }, 2000);
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                });
            }
        });
    });
  `;

  const getTemplateStyles = (template: string) => {
    const baseStyles = `
      :root { --primary-color: #1e293b; --secondary-color: #475569; --accent-color: #3b82f6; --bg-color: #f8fafc; --card-bg: #ffffff; --text-color: #334155; --border-color: #e2e8f0; }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: var(--text-color); background-color: var(--bg-color); transition: background-color 0.3s; animation: fadeIn 0.5s ease-in-out; }
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      .course-layout { display: flex; min-height: 100vh; }
      .sidebar { width: 320px; background: var(--card-bg); border-right: 1px solid var(--border-color); flex-shrink: 0; position: fixed; height: 100%; }
      .sidebar-content { padding: 2rem; height: 100%; overflow-y: auto; }
      .main-content-container { margin-left: 320px; flex: 1; overflow-y: auto; height: 100vh; }
      .main-content { max-width: 900px; margin: 0 auto; padding: 3rem 2rem; }

      .site-title { font-size: 1.25rem; font-weight: 700; color: var(--primary-color); margin-bottom: 2rem; }
      .nav-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; color: var(--secondary-color); letter-spacing: 0.05em; margin-bottom: 1rem; }
      .section-title { font-weight: 600; margin: 1.5rem 0 0.5rem 0; color: var(--primary-color); }
      .lesson-list { list-style: none; }
      .lesson-link { display: flex; justify-content: space-between; align-items: center; padding: 0.6rem 0.8rem; text-decoration: none; color: var(--secondary-color); border-radius: 0.375rem; transition: all 0.2s; border-left: 3px solid transparent; }
      .lesson-link:hover { background: #f1f5f9; color: var(--primary-color); }
      .lesson-link.active { background: #eef2ff; color: var(--accent-color); border-left-color: var(--accent-color); font-weight: 500; }
      .lesson-time { font-size: 0.8rem; opacity: 0.7; }

      h1 { font-size: 2.5rem; font-weight: 800; margin-bottom: 1rem; color: var(--primary-color); }
      h2 { font-size: 1.75rem; font-weight: 700; margin: 2rem 0 1rem; color: var(--primary-color); border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; }
      h3 { font-size: 1.25rem; font-weight: 600; margin: 1.5rem 0 1rem; }
      p { margin: 1rem 0; }
      strong { font-weight: 600; }
      em { font-style: italic; }

      .step-content { margin: 2rem 0; padding: 2rem; background: var(--card-bg); border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
      .step-content h2 { border-bottom: 2px solid var(--accent-color); padding-bottom: 0.5rem; }
      .step-body { margin-top: 1rem; }

      .course-stats { margin: 3rem 0; }
      .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 2rem; }
      .stat-item { text-align: center; padding: 1.5rem; background: var(--card-bg); border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
      .stat-item h3 { font-size: 2rem; font-weight: 700; color: var(--accent-color); margin-bottom: 0.5rem; }
      .stat-item p { color: var(--secondary-color); font-weight: 500; }

      /* Custom UI Elements */
      .styled-link { color: var(--accent-color); text-decoration: none; font-weight: 500; border-bottom: 1px solid transparent; transition: border-color 0.2s; }
      .styled-link:hover { border-bottom-color: var(--accent-color); }
      
      .code-block-container { background-color: #282c34; border-radius: 8px; margin: 1.5rem 0; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
      .code-block-container header { display: flex; justify-content: space-between; align-items: center; background-color: #21252b; padding: 0.5rem 1rem; border-top-left-radius: 8px; border-top-right-radius: 8px; }
      .code-block-container .language { color: #9da5b4; font-size: 0.8rem; text-transform: uppercase; }
      .code-block-container .copy-btn { background-color: #4b5563; color: white; border: none; padding: 0.3rem 0.6rem; border-radius: 4px; cursor: pointer; transition: background-color 0.2s; font-size: 0.8rem; }
      .code-block-container .copy-btn:hover { background-color: #6b7280; }
      .code-block-container pre { padding: 1rem; overflow-x: auto; color: #abb2bf; font-family: 'JetBrains Mono', monospace; font-size: 0.9rem; }

      .table-container { overflow-x: auto; margin: 1.5rem 0; border: 1px solid var(--border-color); border-radius: 8px; }
      .styled-table { width: 100%; border-collapse: collapse; }
      .styled-table th, .styled-table td { padding: 0.8rem 1rem; text-align: left; border-bottom: 1px solid var(--border-color); }
      .styled-table th { background-color: #f8fafc; font-weight: 600; }
      .styled-table tr:last-child td { border-bottom: none; }
      .styled-table tr:nth-child(even) { background-color: #f8fafc; }

      .image-container { margin: 2rem 0; text-align: center; }
      .image-container img { max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
      .image-container figcaption { margin-top: 0.5rem; font-size: 0.9rem; color: var(--secondary-color); font-style: italic; }

      ul, ol { padding-left: 2rem; margin: 1rem 0; }
      li { margin-bottom: 0.5rem; }
    `;
    return baseStyles;
  };
  
  const generateSPAHTML = () => {
    const styles = getTemplateStyles(courseData.template || "academic");
    const script = getTemplateScript();
    
    const navigationHTML = courseData.sections?.map(section => `
      <div class="section">
        <h3 class="section-title">${section.title || ''}</h3>
        <ul class="lesson-list">
          ${section.lessons?.map(lesson => `
            <li class="lesson-item">
              <a href="#${lesson.slug || ''}" class="lesson-link">
                <span>${lesson.title || ''}</span>
                <span class="lesson-time">${lesson.estimatedTime || 15}m</span>
              </a>
            </li>
          `).join('') || ''}
        </ul>
      </div>
    `).join('') || '';

    const lessonsContentHTML = courseData.sections?.flatMap(section => 
        section.lessons?.map(lesson => {
          let lessonContent = '';
          
          if (lesson.steps && lesson.steps.length > 0) {
            lessonContent = lesson.steps.map((step, index) => `
              <div class="step-content" id="step-${index + 1}">
                <h3>Step ${index + 1}: ${step.title || ''}</h3>
                <div class="step-body">
                  ${formatHTMLContent(step.content || '')}
                </div>
              </div>
            `).join('');
          } else {
            lessonContent = `
              <div class="lesson-body">
                ${convertMarkdownToHTML(lesson.content || '')}
              </div>
            `;
          }
          
          return `
            <div id="${lesson.slug || ''}" class="lesson-content-wrapper" style="display:none;">
              <h1>${lesson.title || ''}</h1>
              ${lessonContent}
            </div>
          `;
        }) || []
    ).join('');

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="course-title" content="${courseData.title || ''}">
    <title>${courseData.title || ''}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono&display=swap" rel="stylesheet">
    <style>${styles}</style>
</head>
<body>
    <div class="course-layout">
        <aside class="sidebar">
            <div class="sidebar-content">
                <h2 class="site-title">${courseData.title || ''}</h2>
                <nav class="course-navigation">
                    <h3 class="nav-title">Course Content</h3>
                    <div class="section">
                        <ul class="lesson-list">
                            <li><a href="#home" class="lesson-link">Course Home</a></li>
                        </ul>
                    </div>
                    ${navigationHTML}
                </nav>
            </div>
        </aside>

        <div class="main-content-container" id="main-content">
            <main class="main-content">
                <div id="course-home" style="display:block;">
                    <h1>${courseData.title || ''}</h1>
                    ${courseData.description ? `<p class="course-description">${courseData.description}</p>` : ''}
                    <h2>Welcome!</h2>
                    <p>Select a lesson from the sidebar to begin.</p>
                </div>
                ${lessonsContentHTML}
            </main>
        </div>
    </div>
    <script>${script}</script>
</body>
</html>`;
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (exportType === "html") {
        // Generate multi-page HTML files
        const files = [];
        
        // Add index.html
        files.push({
          name: 'index.html',
          content: generateIndexHTML()
        });
        
        // Add lesson files
        courseData.sections?.forEach(section => {
          section.lessons?.forEach(lesson => {
            files.push({
              name: `${lesson.slug}.html`,
              content: generateStepBasedHTML(lesson)
            });
          });
        });
        
        // For now, download the index.html file
        // In a real implementation, you'd create a ZIP with all files
        const blob = new Blob([files[0].content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${courseData.slug || 'course'}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Show message about multi-page export
        alert(`Generated ${files.length} HTML files. Currently downloading index.html. For full multi-page export, consider using a ZIP library.`);
        
      } else {
        // JSON export
        const content = generateJSON();
        const filename = `${courseData.slug || 'course'}.json`;
        const blob = new Blob([content], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      
      setExportComplete(true);
      setTimeout(() => {
        setExportComplete(false);
        setIsExporting(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Export Course</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">{courseData.title || "Untitled Course"}</h3>
              <div className="flex items-center gap-2 mb-2">
                <Badge>{courseData.category}</Badge>
                <Badge variant="outline">
                  {courseData.sections?.reduce((total, section) => 
                    total + (section.lessons?.length || 0), 0) || 0} lessons
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Tabs value={exportType} onValueChange={setExportType}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="html" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Static Website
              </TabsTrigger>
              <TabsTrigger value="json" className="flex items-center gap-2">
                <Code2 className="w-4 h-4" />
                JSON Data
              </TabsTrigger>
            </TabsList>

            <TabsContent value="html" className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Static Website Export</h4>
                <p className="text-sm text-slate-600 mb-4">
                  Generate a single, self-contained HTML file that acts like a multi-page website.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Multi-page navigation experience
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Code blocks with copy functionality
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Enhanced styling for tables, images, and lists
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Smooth animations and transitions
                  </li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="json" className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">JSON Data Export</h4>
                <p className="text-sm text-slate-600 mb-4">
                  Export your course data as structured JSON for integration with other systems.
                </p>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h5 className="font-medium text-sm mb-2">Preview:</h5>
                  <pre className="text-xs text-slate-600 overflow-x-auto">
{`{
  "id": "${courseData.id || Date.now().toString()}",
  "title": "${courseData.title || 'Course Title'}",
  "slug": "${courseData.slug || 'course-slug'}",
  "description": "${courseData.description || 'Course description'}",
  "category": "${courseData.category || 'Beginner'}",
  "author": "${courseData.author || ''}",
  "tags": ${JSON.stringify(courseData.tags || [])},
  "template": "${courseData.template || 'academic'}",
  "customCSS": "${courseData.customCSS || ''}",
  "createdAt": "${courseData.createdAt || new Date().toISOString()}",
  "updatedAt": "${courseData.updatedAt || new Date().toISOString()}",
  "sections": [
    {
      "id": "${courseData.sections?.[0]?.id || Date.now().toString()}",
      "title": "${courseData.sections?.[0]?.title || 'Section Title'}",
      "slug": "${courseData.sections?.[0]?.slug || 'section-slug'}",
      "lessons": [
        {
          "title": "${courseData.sections?.[0]?.lessons?.[0]?.title || 'Lesson Title'}",
          "slug": "${courseData.sections?.[0]?.lessons?.[0]?.slug || 'lesson-slug'}",
          "course": "${courseData.title || 'Course Title'}",
          "estimatedTime": ${courseData.sections?.[0]?.lessons?.[0]?.estimatedTime || 15},
          "difficulty": "${courseData.sections?.[0]?.lessons?.[0]?.difficulty || 'Beginner'}",
          "progress": ${courseData.sections?.[0]?.lessons?.[0]?.progress || 0},
          "steps": [
            {
              "title": "${courseData.sections?.[0]?.lessons?.[0]?.steps?.[0]?.title || 'Step Title'}",
              "content": "${courseData.sections?.[0]?.lessons?.[0]?.steps?.[0]?.content || '<h3>Step content...</h3>'}"
            }
          ]
        }
      ]
    }
  ]
}`}
                  </pre>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} disabled={isExporting}>
              Cancel
            </Button>
            <Button 
              onClick={handleExport}
              disabled={isExporting || !courseData.title}
              className="min-w-[120px]"
            >
              {isExporting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : exportComplete ? (
                <Check className="w-4 h-4" />
              ) : exportType === "html" ? (
                <Archive className="w-4 h-4" />
              ) : (
                <Code2 className="w-4 h-4" />
              )}
              <span className="ml-2">
                {isExporting ? 'Generating...' : exportComplete ? 'Done!' : `Export ${exportType.toUpperCase()}`}
              </span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}