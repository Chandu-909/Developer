import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export const SiteFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-zinc-200 dark:border-zinc-800/80 transition-colors py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs text-zinc-500 dark:text-zinc-500">
        <div>
          <p>
            © {currentYear} {siteConfig.name}. All rights reserved.
          </p>
          <p className="mt-1 text-zinc-400 dark:text-zinc-600">
            Built with care · Minimalist developer journal
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-zinc-600 dark:text-zinc-400">
          <a
            href={siteConfig.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-0.5 hover:text-zinc-950 dark:hover:text-white transition-colors"
          >
            <span>GitHub</span>
            <ArrowUpRight className="w-3 h-3 opacity-60" />
          </a>
          <a
            href={siteConfig.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-0.5 hover:text-zinc-950 dark:hover:text-white transition-colors"
          >
            <span>LinkedIn</span>
            <ArrowUpRight className="w-3 h-3 opacity-60" />
          </a>
          <a
            href={`mailto:${siteConfig.email}`}
            className="hover:text-zinc-950 dark:hover:text-white transition-colors"
          >
            {siteConfig.email}
          </a>
        </div>
      </div>
    </footer>
  );
};
