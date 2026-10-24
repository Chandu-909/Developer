import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { TableOfContentItem } from '../types';

export function calculateReadingTime(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

export function extractTableOfContents(markdown: string): TableOfContentItem[] {
  const lines = markdown.split('\n');
  const toc: TableOfContentItem[] = [];

  for (const line of lines) {
    const h2Match = line.match(/^##\s+(.+)$/);
    if (h2Match) {
      const text = h2Match[1].replace(/[`*]/g, '').trim();
      const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      toc.push({ id, text, level: 2 });
      continue;
    }

    const h3Match = line.match(/^###\s+(.+)$/);
    if (h3Match) {
      const text = h3Match[1].replace(/[`*]/g, '').trim();
      const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      toc.push({ id, text, level: 3 });
    }
  }

  return toc;
}

interface CodeBlockProps {
  code: string;
  language: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.trim().split('\n');

  return (
    <div className="my-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-950 text-zinc-100 overflow-hidden font-mono text-xs sm:text-sm">
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/70 text-zinc-400">
        <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">
          {language || 'text'}
        </span>
        <button
          onClick={handleCopy}
          aria-label="Copy code to clipboard"
          className="flex items-center gap-1.5 px-2 py-1 text-xs text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="p-4 overflow-x-auto leading-relaxed">
        <pre className="grid grid-cols-[auto_1fr] gap-x-4">
          <span className="select-none text-right text-zinc-600 font-mono text-xs sm:text-sm pr-2 border-r border-zinc-800/80">
            {lines.map((_, i) => (
              <span key={i} className="block leading-6">
                {i + 1}
              </span>
            ))}
          </span>
          <code className="text-zinc-200 block font-mono leading-6">
            {lines.map((line, i) => (
              <span key={i} className="block whitespace-pre">
                {highlightCodeLine(line, language)}
              </span>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
};

function highlightCodeLine(line: string, lang: string): React.ReactNode {
  // If line is empty
  if (!line) return '\n';

  // Comments
  if (line.trim().startsWith('//') || line.trim().startsWith('--') || line.trim().startsWith('#')) {
    return <span className="text-zinc-500 italic">{line}</span>;
  }

  // Common keywords regex
  const keywords = /\b(const|let|var|function|return|import|from|export|default|class|extends|async|await|try|catch|finally|throw|if|else|switch|case|break|for|while|do|typeof|instanceof|interface|type|public|private|static|new|SELECT|FROM|WHERE|INSERT|INTO|CREATE|TABLE|PRIMARY|KEY|DEFAULT|REFERENCES|ON|DELETE|CASCADE|JSONB|UUID|TIMESTAMPTZ|alias)\b/g;

  // Split line into tokens for basic syntax color
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  // Simple string matcher: "..." or '...' or `...`
  const strRegex = /(["'`])(?:(?=(\\?))\2.)*?\1/g;
  let match: RegExpExecArray | null;

  const segments: { start: number; end: number; type: 'string' | 'keyword' | 'text'; text: string }[] = [];

  while ((match = strRegex.exec(line)) !== null) {
    segments.push({
      start: match.index,
      end: match.index + match[0].length,
      type: 'string',
      text: match[0],
    });
  }

  // If no strings found, let's just highlight keywords
  if (segments.length === 0) {
    let kwMatch: RegExpExecArray | null;
    while ((kwMatch = keywords.exec(line)) !== null) {
      if (kwMatch.index > lastIndex) {
        parts.push(line.slice(lastIndex, kwMatch.index));
      }
      parts.push(
        <span key={kwMatch.index} className="text-zinc-100 font-semibold dark:text-zinc-100">
          {kwMatch[0]}
        </span>
      );
      lastIndex = kwMatch.index + kwMatch[0].length;
    }
    if (lastIndex < line.length) {
      parts.push(line.slice(lastIndex));
    }
    return parts.length > 0 ? parts : line;
  }

  // When strings are present
  let cursor = 0;
  for (const seg of segments) {
    if (seg.start > cursor) {
      const textChunk = line.slice(cursor, seg.start);
      parts.push(highlightKeywordsInChunk(textChunk, keywords, cursor));
    }
    parts.push(
      <span key={seg.start} className="text-zinc-400">
        {seg.text}
      </span>
    );
    cursor = seg.end;
  }
  if (cursor < line.length) {
    parts.push(highlightKeywordsInChunk(line.slice(cursor), keywords, cursor));
  }

  return parts;
}

function highlightKeywordsInChunk(chunk: string, regex: RegExp, baseIndex: number): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const localRegex = new RegExp(regex.source, 'g');

  while ((match = localRegex.exec(chunk)) !== null) {
    if (match.index > lastIndex) {
      parts.push(chunk.slice(lastIndex, match.index));
    }
    parts.push(
      <span key={baseIndex + match.index} className="text-zinc-100 font-semibold dark:text-zinc-100">
        {match[0]}
      </span>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < chunk.length) {
    parts.push(chunk.slice(lastIndex));
  }
  return parts.length > 0 ? parts : chunk;
}

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLanguage = '';
  let inList = false;
  let listItems: React.ReactNode[] = [];
  let listType: 'ul' | 'ol' = 'ul';

  const flushList = (key: string) => {
    if (listItems.length > 0) {
      if (listType === 'ul') {
        elements.push(
          <ul key={key} className="my-4 pl-6 space-y-2 list-disc list-outside text-zinc-700 dark:text-zinc-300">
            {listItems}
          </ul>
        );
      } else {
        elements.push(
          <ol key={key} className="my-4 pl-6 space-y-2 list-decimal list-outside text-zinc-700 dark:text-zinc-300">
            {listItems}
          </ol>
        );
      }
      listItems = [];
      inList = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code block delimiters
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        // End code block
        elements.push(
          <CodeBlock
            key={`code-${i}`}
            code={codeBuffer.join('\n')}
            language={codeLanguage}
          />
        );
        inCodeBlock = false;
        codeBuffer = [];
        codeLanguage = '';
      } else {
        // Start code block
        flushList(`list-${i}`);
        inCodeBlock = true;
        codeLanguage = line.slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // Heading 1
    if (line.startsWith('# ')) {
      flushList(`list-${i}`);
      const text = line.slice(2).trim();
      elements.push(
        <h1 key={`h1-${i}`} className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mt-8 mb-4">
          {renderInlineMarkdown(text)}
        </h1>
      );
      continue;
    }

    // Heading 2
    if (line.startsWith('## ')) {
      flushList(`list-${i}`);
      const text = line.slice(3).trim();
      const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      elements.push(
        <h2
          key={`h2-${i}`}
          id={id}
          className="group text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-10 mb-3 pt-4 scroll-mt-20 border-b border-zinc-100 dark:border-zinc-800/80 pb-2 flex items-center justify-between"
        >
          <span>{renderInlineMarkdown(text)}</span>
          <a
            href={`#${id}`}
            className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-sm ml-2 font-mono transition-opacity"
            aria-label={`Link to section ${text}`}
          >
            #
          </a>
        </h2>
      );
      continue;
    }

    // Heading 3
    if (line.startsWith('### ')) {
      flushList(`list-${i}`);
      const text = line.slice(4).trim();
      const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      elements.push(
        <h3
          key={`h3-${i}`}
          id={id}
          className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-200 mt-6 mb-2 scroll-mt-20"
        >
          {renderInlineMarkdown(text)}
        </h3>
      );
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      flushList(`list-${i}`);
      elements.push(
        <blockquote
          key={`quote-${i}`}
          className="my-5 pl-4 border-l-2 border-zinc-400 dark:border-zinc-600 italic text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed"
        >
          {renderInlineMarkdown(line.slice(2))}
        </blockquote>
      );
      continue;
    }

    // Unordered list item
    const ulMatch = line.match(/^(\*|-)\s+(.+)$/);
    if (ulMatch) {
      if (!inList || listType !== 'ul') {
        flushList(`list-switch-${i}`);
        inList = true;
        listType = 'ul';
      }
      listItems.push(
        <li key={`li-${i}`} className="leading-relaxed">
          {renderInlineMarkdown(ulMatch[2])}
        </li>
      );
      continue;
    }

    // Ordered list item
    const olMatch = line.match(/^(\d+)\.\s+(.+)$/);
    if (olMatch) {
      if (!inList || listType !== 'ol') {
        flushList(`list-switch-${i}`);
        inList = true;
        listType = 'ol';
      }
      listItems.push(
        <li key={`li-${i}`} className="leading-relaxed">
          {renderInlineMarkdown(olMatch[2])}
        </li>
      );
      continue;
    }

    // Blank line
    if (!line.trim()) {
      flushList(`list-flush-${i}`);
      continue;
    }

    // Regular paragraph
    flushList(`list-para-${i}`);
    elements.push(
      <p key={`p-${i}`} className="my-4 text-zinc-800 dark:text-zinc-300 leading-relaxed text-base">
        {renderInlineMarkdown(line)}
      </p>
    );
  }

  flushList('final-list');

  return <div className="markdown-prose leading-relaxed">{elements}</div>;
};

// Render inline Markdown (bold, italic, inline code, links)
export function renderInlineMarkdown(text: string): React.ReactNode {
  // Pattern matching for code, bold, link
  const tokens: React.ReactNode[] = [];
  let remaining = text;
  let keyIdx = 0;

  while (remaining.length > 0) {
    // 1. Inline Code `code`
    const codeMatch = remaining.match(/^`([^`]+)`/);
    if (codeMatch) {
      tokens.push(
        <code
          key={keyIdx++}
          className="px-1.5 py-0.5 rounded text-xs sm:text-sm font-mono bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/60"
        >
          {codeMatch[1]}
        </code>
      );
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    // 2. Bold **text**
    const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);
    if (boldMatch) {
      tokens.push(
        <strong key={keyIdx++} className="font-semibold text-zinc-900 dark:text-zinc-100">
          {boldMatch[1]}
        </strong>
      );
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // 3. Italic *text* or _text_
    const italicMatch = remaining.match(/^(\*|_)([^*_]+)\1/);
    if (italicMatch) {
      tokens.push(
        <em key={keyIdx++} className="italic text-zinc-800 dark:text-zinc-200">
          {italicMatch[2]}
        </em>
      );
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }

    // 4. Link [label](url)
    const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      tokens.push(
        <a
          key={keyIdx++}
          href={linkMatch[2]}
          target={linkMatch[2].startsWith('http') ? '_blank' : undefined}
          rel={linkMatch[2].startsWith('http') ? 'noopener noreferrer' : undefined}
          className="text-zinc-900 dark:text-zinc-100 underline decoration-zinc-400 hover:decoration-zinc-900 dark:decoration-zinc-600 dark:hover:decoration-zinc-200 underline-offset-4 transition-colors"
        >
          {linkMatch[1]}
        </a>
      );
      remaining = remaining.slice(linkMatch[0].length);
      continue;
    }

    // Normal text chunk up to the next special char
    const nextSpecial = remaining.search(/[`*_[\]]/);
    if (nextSpecial === -1) {
      tokens.push(remaining);
      break;
    } else if (nextSpecial === 0) {
      // Just emit single character if it didn't match patterns
      tokens.push(remaining[0]);
      remaining = remaining.slice(1);
    } else {
      tokens.push(remaining.slice(0, nextSpecial));
      remaining = remaining.slice(nextSpecial);
    }
  }

  return <>{tokens}</>;
}
