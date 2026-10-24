import React, { useState, useEffect } from 'react';
import { BlogPost } from './types';
import { initialPosts } from './data/posts';
import { ThemeProvider } from './context/ThemeContext';
import { TopNavBar } from './components/TopNavBar';
import { SiteFooter } from './components/SiteFooter';
import { CommandPalette } from './components/CommandPalette';
import { HomeView } from './views/HomeView';
import { BlogIndexView } from './views/BlogIndexView';
import { ArticleView } from './views/ArticleView';
import { AboutView } from './views/AboutView';
import { WritingStudioView } from './views/WritingStudioView';
import { NotFoundView } from './views/NotFoundView';

export function AppContent() {
  // Load posts with localStorage override if user published new posts
  const [posts, setPosts] = useState<BlogPost[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('developer_blog_published_posts');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        } catch {
          // ignore
        }
      }
    }
    return initialPosts;
  });

  // Navigation state: derived from hash e.g. "#/blog" or "#/blog/my-post"
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      return window.location.hash.replace(/^#/, '') || '/';
    }
    return '/';
  });

  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchPaletteOpen, setSearchPaletteOpen] = useState(false);

  // Sync route with window hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#/, '') || '/';
      setCurrentPath(hash);
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
    setCurrentPath(path);
    window.scrollTo(0, 0);
  };

  // Keyboard shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchPaletteOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Tag selection helper
  const handleTagSelect = (tag: string | null) => {
    setSelectedTag(tag);
    navigate('/blog');
  };

  // Select article helper
  const handleSelectPost = (slug: string) => {
    navigate(`/blog/${slug}`);
  };

  // Publish new post
  const handlePublishPost = (newPost: BlogPost) => {
    setPosts((prev) => {
      const updated = [newPost, ...prev.filter((p) => p.slug !== newPost.slug)];
      localStorage.setItem('developer_blog_published_posts', JSON.stringify(updated));
      return updated;
    });
  };

  // Determine active view from currentPath
  const renderCurrentView = () => {
    if (currentPath === '/' || currentPath === '') {
      return (
        <HomeView
          posts={posts}
          onSelectPost={handleSelectPost}
          onNavigate={navigate}
          onTagSelect={handleTagSelect}
        />
      );
    }

    if (currentPath === '/blog') {
      return (
        <BlogIndexView
          posts={posts}
          selectedTag={selectedTag}
          onSelectTag={setSelectedTag}
          onSelectPost={handleSelectPost}
        />
      );
    }

    if (currentPath.startsWith('/blog/')) {
      const slug = currentPath.replace('/blog/', '');
      const post = posts.find((p) => p.slug === slug);
      if (post) {
        return (
          <ArticleView
            post={post}
            allPosts={posts}
            onSelectPost={handleSelectPost}
            onBackToBlog={() => navigate('/blog')}
            onTagSelect={handleTagSelect}
          />
        );
      }
      return <NotFoundView onBackToHome={() => navigate('/')} />;
    }

    if (currentPath === '/about') {
      return <AboutView />;
    }

    if (currentPath === '/write') {
      return (
        <WritingStudioView
          onPublishPost={handlePublishPost}
          onSelectPost={handleSelectPost}
        />
      );
    }

    return <NotFoundView onBackToHome={() => navigate('/')} />;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors selection:bg-zinc-200 dark:selection:bg-zinc-800">
      {/* Top Navbar */}
      <TopNavBar
        currentPath={currentPath}
        navigate={navigate}
        onOpenSearch={() => setSearchPaletteOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6">
        {renderCurrentView()}
      </main>

      {/* Footer */}
      <SiteFooter />

      {/* Global Cmd+K Search Palette */}
      <CommandPalette
        isOpen={searchPaletteOpen}
        onClose={() => setSearchPaletteOpen(false)}
        posts={posts.filter((p) => !p.draft)}
        onSelectPost={handleSelectPost}
        onNavigate={navigate}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
