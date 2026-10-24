import React from 'react';
import { BlogPost } from '../types';

interface BlogCardProps {
  post: BlogPost;
  onSelect: (slug: string) => void;
  onTagSelect?: (tag: string) => void;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, onSelect, onTagSelect }) => {
  // Format readable date e.g. "March 10, 2026"
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article className="group py-6 border-b border-zinc-100 dark:border-zinc-800/60 first:pt-2 last:border-b-0 transition-colors">
      {/* Unboxed Metadata Line with typographic separators */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-500 mb-2">
        <time dateTime={post.publishedAt}>{formattedDate}</time>
        <span aria-hidden="true">·</span>
        <span>{post.readTime}</span>
        {post.tags && post.tags.length > 0 && (
          <>
            <span aria-hidden="true">·</span>
            <div className="inline-flex items-center gap-1.5">
              {post.tags.map((tag, idx) => (
                <React.Fragment key={tag}>
                  {idx > 0 && <span className="opacity-50">/</span>}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTagSelect?.(tag);
                    }}
                    className="hover:text-zinc-900 dark:hover:text-zinc-200 hover:underline transition-colors cursor-pointer"
                  >
                    {tag}
                  </button>
                </React.Fragment>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Title */}
      <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
        <button
          onClick={() => onSelect(post.slug)}
          className="text-left group-hover:underline group-hover:decoration-zinc-400 dark:group-hover:decoration-zinc-500 underline-offset-4 transition-all"
        >
          {post.title}
        </button>
      </h3>

      {/* Short Description */}
      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-2 max-w-2xl">
        {post.description}
      </p>

      {/* Read link */}
      <div className="mt-3">
        <button
          onClick={() => onSelect(post.slug)}
          className="inline-flex items-center gap-1 text-xs font-medium text-zinc-900 dark:text-zinc-200 group-hover:translate-x-0.5 transition-transform"
        >
          <span>Read post</span>
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </article>
  );
};
