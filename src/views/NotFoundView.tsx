import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface NotFoundViewProps {
  onBackToHome: () => void;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({ onBackToHome }) => {
  return (
    <div className="py-24 text-center space-y-6">
      <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
        404 — Not Found
      </p>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
        This page does not exist.
      </h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
        The link you followed may be broken, or the post may have been renamed or removed.
      </p>
      <div>
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 text-xs font-medium hover:opacity-90 transition-opacity"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Homepage</span>
        </button>
      </div>
    </div>
  );
};
