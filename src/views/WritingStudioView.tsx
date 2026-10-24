import React, { useState, useEffect } from 'react';
import { Download, Save, Eye, Edit3, Plus, Check, FileDown, Trash2 } from 'lucide-react';
import { BlogPost } from '../types';
import { MarkdownRenderer, calculateReadingTime } from '../utils/markdown';

interface WritingStudioViewProps {
  onPublishPost: (post: BlogPost) => void;
  onSelectPost: (slug: string) => void;
}

const DEFAULT_SAMPLE_MD = `# Title of Your New Article

Write an engaging opening paragraph introducing your topic and why it matters to developers.

## The Problem

Explain the challenge or architectural hurdle you faced:

\`\`\`typescript
function calculateThroughput(requests: number, durationSeconds: number): number {
  if (durationSeconds <= 0) return 0;
  return Number((requests / durationSeconds).toFixed(2));
}
\`\`\`

## Key Takeaways

- First core insight or pattern learned.
- How to avoid common pitfalls in production.
- Resources and next steps for the reader.

> Simplicity is prerequisite for reliability. — Edsger W. Dijkstra
`;

export const WritingStudioView: React.FC<WritingStudioViewProps> = ({
  onPublishPost,
  onSelectPost,
}) => {
  const [title, setTitle] = useState('Building Lightweight Web Applications in 2026');
  const [description, setDescription] = useState(
    'A look into reducing bundle dependencies, native browser APIs, and prioritizing performance.'
  );
  const [slug, setSlug] = useState('building-lightweight-web-apps-2026');
  const [tagsInput, setTagsInput] = useState('Web Standards, Performance, Architecture');
  const [content, setContent] = useState(DEFAULT_SAMPLE_MD);
  const [isDraft, setIsDraft] = useState(false);
  const [mode, setMode] = useState<'split' | 'edit' | 'preview'>('split');
  const [savedStatus, setSavedStatus] = useState<string | null>(null);

  // Auto-slugify title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    const generatedSlug = val
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    setSlug(generatedSlug);
  };

  // Word count & reading time
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const readTime = calculateReadingTime(content);

  // Export markdown file
  const handleExportFile = () => {
    const frontmatter = `---
title: "${title}"
description: "${description}"
publishedAt: "${new Date().toISOString().split('T')[0]}"
readTime: "${readTime}"
tags: [${tagsInput
      .split(',')
      .map((t) => `"${t.trim()}"`)
      .join(', ')}]
draft: ${isDraft}
---

${content}`;

    const blob = new Blob([frontmatter], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slug || 'article'}.md`;
    a.click();
    URL.revokeObjectURL(url);
    showNotice('Downloaded .md file');
  };

  const showNotice = (msg: string) => {
    setSavedStatus(msg);
    setTimeout(() => setSavedStatus(null), 3000);
  };

  // Save to LocalStorage drafts
  const handleSaveDraft = () => {
    const draftData = {
      title,
      description,
      slug,
      tagsInput,
      content,
      isDraft,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem('developer_blog_studio_draft', JSON.stringify(draftData));
    showNotice('Saved to local draft');
  };

  // Load draft on mount if available
  useEffect(() => {
    const saved = localStorage.getItem('developer_blog_studio_draft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.title) setTitle(parsed.title);
        if (parsed.description) setDescription(parsed.description);
        if (parsed.slug) setSlug(parsed.slug);
        if (parsed.tagsInput) setTagsInput(parsed.tagsInput);
        if (parsed.content) setContent(parsed.content);
        if (parsed.isDraft !== undefined) setIsDraft(parsed.isDraft);
      } catch {
        // ignore
      }
    }
  }, []);

  // Publish to session posts
  const handlePublish = () => {
    if (!title.trim() || !content.trim()) {
      showNotice('Please provide a title and content.');
      return;
    }

    const newPost: BlogPost = {
      slug: slug || `post-${Date.now()}`,
      title,
      description: description || title,
      publishedAt: new Date().toISOString().split('T')[0],
      readTime,
      tags: tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      content,
      draft: isDraft,
    };

    onPublishPost(newPost);
    showNotice('Published to blog!');
    setTimeout(() => {
      onSelectPost(newPost.slug);
    }, 500);
  };

  return (
    <div className="py-8 space-y-6">
      {/* Studio Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Writing Studio
          </h1>
          <p className="text-xs text-zinc-500 font-mono mt-0.5">
            Markdown Authoring · {words} words · {readTime}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {savedStatus && (
            <span className="text-emerald-500 font-medium flex items-center gap-1 mr-2 animate-fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>{savedStatus}</span>
            </span>
          )}

          {/* View Mode Toggle */}
          <div className="flex items-center rounded border border-zinc-200 dark:border-zinc-800 p-0.5 bg-zinc-100 dark:bg-zinc-900">
            <button
              onClick={() => setMode('edit')}
              className={`px-2 py-1 rounded transition-colors ${
                mode === 'edit'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white font-medium'
                  : 'text-zinc-500'
              }`}
            >
              Edit
            </button>
            <button
              onClick={() => setMode('split')}
              className={`hidden md:inline px-2 py-1 rounded transition-colors ${
                mode === 'split'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white font-medium'
                  : 'text-zinc-500'
              }`}
            >
              Split
            </button>
            <button
              onClick={() => setMode('preview')}
              className={`px-2 py-1 rounded transition-colors ${
                mode === 'preview'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white font-medium'
                  : 'text-zinc-500'
              }`}
            >
              Preview
            </button>
          </div>

          <button
            onClick={handleSaveDraft}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>

          <button
            onClick={handleExportFile}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 transition-colors"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Export .md</span>
          </button>

          <button
            onClick={handlePublish}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-medium hover:opacity-90 transition-opacity"
          >
            <span>Publish Post</span>
          </button>
        </div>
      </div>

      {/* Frontmatter metadata fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 text-xs">
        <div className="space-y-1">
          <label className="font-semibold text-zinc-700 dark:text-zinc-300">Article Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded text-zinc-900 dark:text-zinc-100"
          />
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-zinc-700 dark:text-zinc-300">Slug URL</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded text-zinc-900 dark:text-zinc-100 font-mono text-[11px]"
          />
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-zinc-700 dark:text-zinc-300">Description / Subtitle</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded text-zinc-900 dark:text-zinc-100"
          />
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-zinc-700 dark:text-zinc-300">Tags (comma-separated)</label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="TypeScript, Architecture"
            className="w-full px-2.5 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded text-zinc-900 dark:text-zinc-100"
          />
        </div>
      </div>

      {/* Editor & Preview Pane */}
      <div
        className={`grid gap-6 ${
          mode === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
        }`}
      >
        {/* Editor Pane */}
        {(mode === 'edit' || mode === 'split') && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
              <span>MARKDOWN SOURCE</span>
              <span>Monospace</span>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing markdown..."
              rows={22}
              className="w-full p-4 font-mono text-xs sm:text-sm bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:border-zinc-400 dark:focus:border-zinc-600 resize-y leading-relaxed"
            />
          </div>
        )}

        {/* Live Preview Pane */}
        {(mode === 'preview' || mode === 'split') && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
              <span>TYPOGRAPHY PREVIEW</span>
              <span>{readTime}</span>
            </div>
            <div className="p-6 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg min-h-[500px] overflow-y-auto max-h-[700px]">
              <div className="border-b border-zinc-100 dark:border-zinc-900 pb-4 mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                  {title || 'Untitled Post'}
                </h1>
                {description && (
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {description}
                  </p>
                )}
                <div className="mt-3 flex items-center gap-2 text-xs text-zinc-400">
                  <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <span>·</span>
                  <span>{readTime}</span>
                  {tagsInput && (
                    <>
                      <span>·</span>
                      <span>{tagsInput}</span>
                    </>
                  )}
                </div>
              </div>

              <MarkdownRenderer content={content} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
