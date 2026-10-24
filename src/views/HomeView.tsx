import React from 'react';
import { ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';
import { BlogPost } from '../types';
import { siteConfig } from '../config/siteConfig';
import { BlogCard } from '../components/BlogCard';

interface HomeViewProps {
  posts: BlogPost[];
  onSelectPost: (slug: string) => void;
  onNavigate: (path: string) => void;
  onTagSelect: (tag: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  posts,
  onSelectPost,
  onNavigate,
  onTagSelect,
}) => {
  // Show recent published posts (max 4)
  const recentPosts = posts.filter((p) => !p.draft).slice(0, 4);

  return (
    <div className="space-y-16 sm:space-y-20 py-8">
      {/* Hero Section */}
      <section className="space-y-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center font-mono text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight select-none">
            {siteConfig.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Hey, I'm {siteConfig.name}.
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-500 font-mono mt-0.5">
              {siteConfig.role}
            </p>
          </div>
        </div>

        <p className="text-base sm:text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed max-w-2xl">
          {siteConfig.bioShort}
        </p>

        {/* Status Line */}
        <div className="pt-1 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
          <span>{siteConfig.statusText}</span>
        </div>

        {/* Action Links */}
        <div className="pt-2 flex flex-wrap items-center gap-5 text-sm font-medium">
          <button
            onClick={() => onNavigate('/blog')}
            className="inline-flex items-center gap-1.5 text-zinc-950 dark:text-white hover:underline underline-offset-4 font-semibold transition-all group"
          >
            <span>Read my writing</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
          <a
            href={siteConfig.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
          >
            <span>GitHub</span>
            <ArrowUpRight className="w-4 h-4 opacity-70" />
          </a>
          <button
            onClick={() => onNavigate('/about')}
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
          >
            About Me
          </button>
        </div>
      </section>

      {/* Latest Writing */}
      <section className="space-y-6">
        <div className="flex items-baseline justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Latest Writing
          </h2>
          <button
            onClick={() => onNavigate('/blog')}
            className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>View all posts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
          {recentPosts.map((post) => (
            <BlogCard
              key={post.slug}
              post={post}
              onSelect={onSelectPost}
              onTagSelect={onTagSelect}
            />
          ))}
        </div>

        <div className="pt-2 text-center sm:text-left">
          <button
            onClick={() => onNavigate('/blog')}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
          >
            <span>Browse archive & categories</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>

      {/* Brief About Section */}
      <section className="border-t border-zinc-200 dark:border-zinc-800/80 pt-10 space-y-4">
        <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          About
        </h2>
        <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
          <p>{siteConfig.bioLong[0]}</p>
          <p>{siteConfig.bioLong[1]}</p>
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
          <button
            onClick={() => onNavigate('/about')}
            className="font-medium text-zinc-900 dark:text-zinc-200 hover:underline underline-offset-4"
          >
            Full bio, stack & journey →
          </button>
        </div>
      </section>
    </div>
  );
};
