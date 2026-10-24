import React from 'react';
import { ArrowUpRight, Mail, Github, Linkedin, Terminal, Sparkles } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export const AboutView: React.FC = () => {
  return (
    <div className="py-8 space-y-16">
      {/* Header */}
      <section className="space-y-4 border-b border-zinc-200 dark:border-zinc-800 pb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          About Me
        </h1>
        <p className="text-base text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
          {siteConfig.bioShort}
        </p>
      </section>

      {/* Narrative & Philosophy */}
      <section className="space-y-4 max-w-2xl">
        <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Background & Principles
        </h2>
        <div className="space-y-4 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
          {siteConfig.bioLong.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </section>

      {/* Technologies & Stack */}
      <section className="space-y-6">
        <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Technologies & Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {siteConfig.skills.map((category) => (
            <div
              key={category.title}
              className="p-5 rounded-lg border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/50 space-y-3"
            >
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {category.title}
              </h3>
              <ul className="space-y-1 text-sm text-zinc-800 dark:text-zinc-200">
                {category.skills.map((skill) => (
                  <li key={skill} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-zinc-400 dark:bg-zinc-600" />
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Career & Journey Timeline */}
      <section className="space-y-6">
        <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Experience & Milestones
        </h2>
        <div className="space-y-8 relative before:absolute before:inset-0 before:left-3.5 before:w-px before:bg-zinc-200 dark:before:bg-zinc-800">
          {siteConfig.journey.map((item, index) => (
            <div key={index} className="relative pl-10 space-y-1.5">
              <span className="absolute left-2 top-1.5 w-3 h-3 rounded-full bg-white dark:bg-black border-2 border-zinc-400 dark:border-zinc-600" />
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-500">
                <span>{item.year}</span>
                <span>·</span>
                <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                  {item.organization}
                </span>
              </div>
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                {item.role}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Connect / Contact */}
      <section className="border-t border-zinc-200 dark:border-zinc-800 pt-8 space-y-4">
        <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Get in Touch
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-xl">
          Feel free to reach out to discuss distributed systems, frontend engineering, or collaboration opportunities.
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-2 text-sm">
          <a
            href={`mailto:${siteConfig.email}`}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-medium hover:opacity-90 transition-opacity"
          >
            <Mail className="w-4 h-4" />
            <span>{siteConfig.email}</span>
          </a>
          <a
            href={siteConfig.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
          </a>
          <a
            href={siteConfig.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
          >
            <Linkedin className="w-4 h-4" />
            <span>LinkedIn</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
          </a>
        </div>
      </section>
    </div>
  );
};
