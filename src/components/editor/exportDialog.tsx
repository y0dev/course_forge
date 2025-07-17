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
import { Download, FileText, Loader2, Check } from "lucide-react";

export default function ExportDialog({ open, onClose, courseData }) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const convertMarkdownToHTML = (markdown) => {
    let html = markdown || '';

    // Block elements
    html = html
      .replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
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
      .replace(/^( *)\d+\. (.*)/gm, (s) => `${s}\n`)
      .replace(/^( *)[*+-] (.*)/gm, (s) => `${s}\n`)
      .replace(/((\n( {2,4}|\t)[*+-] .*)+)/g, (m) => `<ul>${m}</ul>`)
      .replace(/((\n\d+\. .*)+)/g, (m) => `<ol>${m}</ol>`)
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

  const getTemplateScript = () => `
    document.addEventListener('DOMContentLoaded', function() {
        const mainContent = document.getElementById('main-content');
        const courseHome = document.getElementById('course-home');
        const lessonContents = document.querySelectorAll('.lesson-content-wrapper');

        function showContent(hash) {
            lessonContents.forEach(el => el.style.display = 'none');
            
            if (!hash || hash === '#home') {
                courseHome.style.display = 'block';
                document.title = document.querySelector('meta[name="course-title"]').content;
            } else {
                courseHome.style.display = 'none';
                const targetId = hash.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.style.display = 'block';
                    document.title = targetElement.querySelector('h1').textContent;
                    
                    document.querySelectorAll('.lesson-link').forEach(l => l.classList.remove('active'));
                    const activeLink = document.querySelector('a[href="' + hash + '"]');
                    if(activeLink) activeLink.classList.add('active');
                }
            }
            mainContent.scrollTop = 0;
        }

        window.addEventListener('hashchange', () => showContent(window.location.hash));
        showContent(window.location.hash);

        // Copy button functionality
        mainContent.addEventListener('click', function(e) {
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

  const getTemplateStyles = (template) => {
    // Shared base styles for structure and custom elements
    const baseStyles = \`
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
    \`;
    return baseStyles;
  };
  
  const generateSPAHTML = () => {
    const styles = getTemplateStyles(courseData.template);
    const script = getTemplateScript();
    
    const navigationHTML = courseData.sections?.map(section => `
      <div class="section">
        <h3 class="section-title">${section.title}</h3>
        <ul class="lesson-list">
          ${section.lessons?.map(lesson => `
            <li class="lesson-item">
              <a href="#${lesson.slug}" class="lesson-link">
                <span>${lesson.title}</span>
                <span class="lesson-time">${lesson.estimatedTime || 15}m</span>
              </a>
            </li>
          `).join('') || ''}
        </ul>
      </div>
    `).join('') || '';

    const lessonsContentHTML = courseData.sections?.flatMap(section => 
        section.lessons?.map(lesson => `
          <div id="${lesson.slug}" class="lesson-content-wrapper" style="display:none;">
            <h1>${lesson.title}</h1>
            <div class="lesson-body">
              ${convertMarkdownToHTML(lesson.content)}
            </div>
          </div>
        `) || []
    ).join('');

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="course-title" content="${courseData.title}">
    <title>${courseData.title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono&display=swap" rel="stylesheet">
    <style>${styles}</style>
</head>
<body>
    <div class="course-layout">
        <aside class="sidebar">
            <div class="sidebar-content">
                <h2 class="site-title">${courseData.title}</h2>
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
                    <h1>${courseData.title}</h1>
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
      const html = generateSPAHTML();
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${courseData.slug || 'course'}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export Course to HTML</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">{courseData.title || "Untitled Course"}</h3>
              <p className="text-sm text-slate-600">
                This will generate a single, self-contained HTML file that acts like a multi-page website.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h4 className="font-medium">New Features in this Export:</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Multi-page navigation experience</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Code blocks with a "Copy" button</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Enhanced styling for tables, images, and lists</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Smooth animations and transitions</li>
            </ul>
          </div>

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
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span className="ml-2">
                {isExporting ? 'Generating...' : exportComplete ? 'Done!' : 'Export'}
              </span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}