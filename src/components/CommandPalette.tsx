import React, { useState, useEffect, useRef } from 'react';
import { Search, FileText, ArrowRight, ExternalLink, Compass } from 'lucide-react';
import { BlogPost } from '../types';
import { siteConfig } from '../config/siteConfig';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  posts: BlogPost[];
  onSelectPost: (slug: string) => void;
  onNavigate: (path: string) => void;
}

interface PaletteItem {
  id: string;
  title: string;
  category: 'Articles' | 'Navigation' | 'Social';
  subtitle?: string;
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  posts,
  onSelectPost,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Build searchable items list
  const navigationItems: PaletteItem[] = [
    {
      id: 'nav-home',
      title: 'Home',
      category: 'Navigation',
      subtitle: 'Overview, latest writing, and about intro',
      action: () => {
        onNavigate('/');
        onClose();
      },
    },
    {
      id: 'nav-blog',
      title: 'All Articles',
      category: 'Navigation',
      subtitle: 'Complete chronological catalog of posts',
      action: () => {
        onNavigate('/blog');
        onClose();
      },
    },
    {
      id: 'nav-about',
      title: 'About Me',
      category: 'Navigation',
      subtitle: 'Background, stack, journey, and principles',
      action: () => {
        onNavigate('/about');
        onClose();
      },
    },
    {
      id: 'nav-write',
      title: 'Markdown Studio',
      category: 'Navigation',
      subtitle: 'Write, preview, and export new posts',
      action: () => {
        onNavigate('/write');
        onClose();
      },
    },
    {
      id: 'social-github',
      title: 'GitHub Profile',
      category: 'Social',
      subtitle: siteConfig.githubUrl,
      action: () => {
        window.open(siteConfig.githubUrl, '_blank');
        onClose();
      },
    },
    {
      id: 'social-linkedin',
      title: 'LinkedIn',
      category: 'Social',
      subtitle: siteConfig.linkedinUrl,
      action: () => {
        window.open(siteConfig.linkedinUrl, '_blank');
        onClose();
      },
    },
  ];

  const postItems: PaletteItem[] = posts.map((post) => ({
    id: `post-${post.slug}`,
    title: post.title,
    category: 'Articles',
    subtitle: `${post.readTime} · ${post.tags.join(', ')}`,
    action: () => {
      onSelectPost(post.slug);
      onClose();
    },
  }));

  const allItems = [...postItems, ...navigationItems];

  const filteredItems = allItems.filter((item) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(q))
    );
  });

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-2xl overflow-hidden transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input bar */}
        <div className="flex items-center px-4 border-b border-zinc-200 dark:border-zinc-800">
          <Search className="w-4 h-4 text-zinc-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search articles, pages, or links..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full py-3.5 bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-hidden"
          />
          <kbd className="hidden sm:inline-block font-mono text-[10px] text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-800">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-zinc-100 dark:divide-zinc-900/60">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-500">
              No results found for "{query}"
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-950 dark:text-white'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900/40'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    {item.category === 'Articles' ? (
                      <FileText className="w-4 h-4 text-zinc-400 shrink-0" />
                    ) : item.category === 'Navigation' ? (
                      <Compass className="w-4 h-4 text-zinc-400 shrink-0" />
                    ) : (
                      <ExternalLink className="w-4 h-4 text-zinc-400 shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      {item.subtitle && (
                        <p className="text-xs text-zinc-500 dark:text-zinc-500 truncate">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-600 shrink-0">
                    {item.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Helper footer */}
        <div className="px-4 py-2 border-t border-zinc-100 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-between text-[11px] text-zinc-400 dark:text-zinc-500">
          <span>
            Navigate with <kbd className="font-mono">↑</kbd> <kbd className="font-mono">↓</kbd>
          </span>
          <span>
            Select with <kbd className="font-mono">↵</kbd>
          </span>
        </div>
      </div>
    </div>
  );
};
