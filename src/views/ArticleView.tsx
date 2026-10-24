import React, { useState, useMemo } from 'react';
import { ArrowLeft, ArrowRight, Share2, Check, Calendar, Clock, User, List } from 'lucide-react';
import { BlogPost } from '../types';
import { siteConfig } from '../config/siteConfig';
import { MarkdownRenderer, extractTableOfContents } from '../utils/markdown';

interface ArticleViewProps {
  post: BlogPost;
  allPosts: BlogPost[];
  onSelectPost: (slug: string) => void;
  onBackToBlog: () => void;
  onTagSelect: (tag: string) => void;
}

export const ArticleView: React.FC<ArticleViewProps> = ({
  post,
  allPosts,
  onSelectPost,
  onBackToBlog,
  onTagSelect,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);

  // Extract table of contents
  const tableOfContents = useMemo(() => {
    return extractTableOfContents(post.content);
  }, [post.content]);

  // Find previous and next articles
  const publishedPosts = allPosts.filter((p) => !p.draft);
  const currentIndex = publishedPosts.findIndex((p) => p.slug === post.slug);
  const prevPost = currentIndex > 0 ? publishedPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < publishedPosts.length - 1 ? publishedPosts[currentIndex + 1] : null;

  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedUpdateDate = post.updatedAt
    ? new Date(post.updatedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <article className="py-8 space-y-10">
      {/* Back navigation & Share row */}
      <div className="flex items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-900 pb-4">
        <button
          onClick={onBackToBlog}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to writing</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyLink}
            aria-label="Copy article link"
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded border border-zinc-200 dark:border-zinc-800 transition-colors"
          >
            {copiedLink ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Link copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3 h-3" />
                <span>Share link</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Article Header */}
      <header className="space-y-4">
        {/* Unboxed Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-500">
            {post.tags.map((tag, idx) => (
              <React.Fragment key={tag}>
                {idx > 0 && <span>·</span>}
                <button
                  onClick={() => onTagSelect(tag)}
                  className="hover:text-zinc-900 dark:hover:text-zinc-200 hover:underline cursor-pointer"
                >
                  {tag}
                </button>
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 leading-tight">
          {post.title}
        </h1>

        {/* Subtitle / Description */}
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
          {post.description}
        </p>

        {/* Metadata Bar */}
        <div className="pt-2 flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-zinc-500 dark:text-zinc-500 border-t border-zinc-100 dark:border-zinc-900">
          <span className="flex items-center gap-1 text-zinc-700 dark:text-zinc-300 font-medium">
            <User className="w-3.5 h-3.5" />
            <span>{siteConfig.name}</span>
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <time dateTime={post.publishedAt}>{formattedDate}</time>
          </span>
          {formattedUpdateDate && (
            <>
              <span>·</span>
              <span className="italic">Updated {formattedUpdateDate}</span>
            </>
          )}
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{post.readTime}</span>
          </span>
        </div>
      </header>

      {/* Mobile Table of Contents Accordion */}
      {tableOfContents.length > 0 && (
        <div className="lg:hidden border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 bg-zinc-50/70 dark:bg-zinc-950/70">
          <button
            onClick={() => setTocOpen(!tocOpen)}
            className="flex items-center justify-between w-full text-xs font-semibold text-zinc-800 dark:text-zinc-200"
          >
            <span className="flex items-center gap-2">
              <List className="w-3.5 h-3.5" />
              <span>Table of Contents ({tableOfContents.length} sections)</span>
            </span>
            <span className="text-[10px] text-zinc-400">{tocOpen ? 'Hide' : 'Show'}</span>
          </button>
          {tocOpen && (
            <nav className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-800 space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
              {tableOfContents.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setTocOpen(false)}
                  className={`block hover:text-zinc-950 dark:hover:text-white transition-colors ${
                    item.level === 3 ? 'pl-4' : 'font-medium'
                  }`}
                >
                  {item.text}
                </a>
              ))}
            </nav>
          )}
        </div>
      )}

      {/* Main Layout (Content + Desktop Sticky TOC) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-12 items-start">
        {/* Main Article Content */}
        <div className="min-w-0 max-w-2xl">
          <MarkdownRenderer content={post.content} />
        </div>

        {/* Desktop Sticky Table of Contents */}
        {tableOfContents.length > 0 && (
          <aside className="hidden lg:block sticky top-24 space-y-3 text-xs">
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider text-[11px] font-mono">
              On this page
            </h4>
            <nav className="space-y-2 border-l border-zinc-200 dark:border-zinc-800 pl-3">
              {tableOfContents.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`block text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors line-clamp-1 ${
                    item.level === 3 ? 'pl-2 text-[11px]' : ''
                  }`}
                >
                  {item.text}
                </a>
              ))}
            </nav>
          </aside>
        )}
      </div>

      {/* Article Navigation (Previous / Next post) */}
      <div className="pt-10 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {prevPost ? (
          <button
            onClick={() => onSelectPost(prevPost.slug)}
            className="group p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-left transition-colors"
          >
            <span className="flex items-center gap-1 text-[11px] font-medium text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 mb-1">
              <ArrowLeft className="w-3 h-3" />
              <span>Previous article</span>
            </span>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1 group-hover:underline underline-offset-2">
              {prevPost.title}
            </p>
          </button>
        ) : (
          <div className="hidden sm:block" />
        )}

        {nextPost && (
          <button
            onClick={() => onSelectPost(nextPost.slug)}
            className="group p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-right transition-colors"
          >
            <span className="flex items-center justify-end gap-1 text-[11px] font-medium text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 mb-1">
              <span>Next article</span>
              <ArrowRight className="w-3 h-3" />
            </span>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1 group-hover:underline underline-offset-2">
              {nextPost.title}
            </p>
          </button>
        )}
      </div>

      {/* Return to blog link */}
      <div className="pt-4 text-center">
        <button
          onClick={onBackToBlog}
          className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 underline underline-offset-4"
        >
          ← Return to all published articles
        </button>
      </div>
    </article>
  );
};
