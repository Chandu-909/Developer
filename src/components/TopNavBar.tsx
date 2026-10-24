import React, { useState } from 'react';
import { Search, Moon, Sun, Menu, X, ArrowUpRight } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { useTheme } from '../context/ThemeContext';

interface TopNavBarProps {
  currentPath: string;
  navigate: (path: string) => void;
  onOpenSearch: () => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({ currentPath, navigate, onOpenSearch }) => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Blog', path: '/blog' },
    { label: 'About', path: '/about' },
    { label: 'Studio', path: '/write' },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800/80 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => handleNavClick('/')}
          className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 hover:opacity-80 transition-opacity whitespace-nowrap shrink-0 flex items-center gap-1.5"
        >
          <span>{siteConfig.domain}</span>
        </button>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
            return (
              <button
                key={link.path}
                onClick={() => handleNavClick(link.path)}
                className={`whitespace-nowrap shrink-0 py-1 transition-colors text-sm ${
                  isActive
                    ? 'text-zinc-950 dark:text-white font-semibold underline underline-offset-8 decoration-zinc-900 dark:decoration-white'
                    : 'hover:text-zinc-950 dark:hover:text-zinc-100'
                }`}
              >
                {link.label}
              </button>
            );
          })}
          <a
            href={siteConfig.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-0.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors whitespace-nowrap shrink-0 text-sm"
          >
            <span>GitHub</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
          </a>
        </nav>

        {/* Zone 3: Actions (Search, Theme Toggle & Mobile Menu) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onOpenSearch}
            aria-label="Search posts and navigation"
            className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-md border border-zinc-200 dark:border-zinc-800 transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:inline-block font-mono text-[10px] text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">
              ⌘K
            </kbd>
          </button>

          <button
            onClick={toggleTheme}
            aria-label="Toggle dark and light theme"
            className="p-1.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-md transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-zinc-300 hover:text-white" />
            ) : (
              <Moon className="w-4 h-4 text-zinc-700 hover:text-zinc-950" />
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open mobile navigation menu"
            className="md:hidden p-1.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 rounded-md"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <button
                key={link.path}
                onClick={() => handleNavClick(link.path)}
                className={`w-full text-left py-2 px-3 text-sm rounded-md transition-colors ${
                  isActive
                    ? 'font-medium bg-zinc-100 dark:bg-zinc-900 text-zinc-950 dark:text-white'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                }`}
              >
                {link.label}
              </button>
            );
          })}
          <a
            href={siteConfig.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full py-2 px-3 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 rounded-md"
          >
            <span>GitHub Profile</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      )}
    </header>
  );
};
