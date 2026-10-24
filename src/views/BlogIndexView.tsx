import React, { useState, useMemo } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { BlogPost } from '../types';
import { BlogCard } from '../components/BlogCard';

interface BlogIndexViewProps {
  posts: BlogPost[];
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
  onSelectPost: (slug: string) => void;
}

export const BlogIndexView: React.FC<BlogIndexViewProps> = ({
  posts,
  selectedTag,
  onSelectTag,
  onSelectPost,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    posts.forEach((p) => p.tags?.forEach((t) => tagsSet.add(t)));
    return Array.from(tagsSet).sort();
  }, [posts]);

  // Filter posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Exclude draft if any
      if (post.draft) return false;

      // Filter by tag
      if (selectedTag && !post.tags?.includes(selectedTag)) {
        return false;
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = post.title.toLowerCase().includes(q);
        const matchesDesc = post.description.toLowerCase().includes(q);
        const matchesContent = post.content.toLowerCase().includes(q);
        const matchesTags = post.tags?.some((t) => t.toLowerCase().includes(q));
        return matchesTitle || matchesDesc || matchesContent || matchesTags;
      }

      return true;
    });
  }, [posts, selectedTag, searchQuery]);

  return (
    <div className="py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Writing
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Thoughts, technical deep dives, architectural reflections, and things I learn along the way.
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="space-y-4">
        {/* Search Input Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search articles by title, content, or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-hidden focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              aria-label="Clear search query"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Tag Filters (Functional interactive buttons) */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <button
            onClick={() => onSelectTag(null)}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              selectedTag === null
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-semibold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800'
            }`}
          >
            All
          </button>
          {allTags.map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => onSelectTag(isSelected ? null : tag)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  isSelected
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-semibold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Post count and status */}
      <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-500 pt-2 border-t border-zinc-100 dark:border-zinc-900">
        <span>
          Showing {filteredPosts.length} of {posts.filter((p) => !p.draft).length} articles
        </span>
        {(selectedTag || searchQuery) && (
          <button
            onClick={() => {
              onSelectTag(null);
              setSearchQuery('');
            }}
            className="text-zinc-600 dark:text-zinc-400 hover:underline cursor-pointer"
          >
            Reset filters
          </button>
        )}
      </div>

      {/* Articles List */}
      {filteredPosts.length > 0 ? (
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
          {filteredPosts.map((post) => (
            <BlogCard
              key={post.slug}
              post={post}
              onSelect={onSelectPost}
              onTagSelect={(t) => onSelectTag(t)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 text-center space-y-3 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg">
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-200">
            No articles found
          </p>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Try adjusting your search terms or clearing the selected tag filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              onSelectTag(null);
            }}
            className="mt-2 px-3 py-1.5 text-xs font-medium text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-md transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};
