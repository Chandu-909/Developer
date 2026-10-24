import { BlogPost } from '../types';

export const initialPosts: BlogPost[] = [
  {
    slug: 'what-i-learned-building-my-first-full-stack-app',
    title: 'What I Learned Building My First Full-Stack App',
    description: 'Reflections on bridging frontend ergonomics with backend persistence, managing state boundaries, and surviving production database migrations.',
    publishedAt: '2026-03-10',
    updatedAt: '2026-03-15',
    readTime: '6 min read',
    tags: ['Architecture', 'Full-Stack', 'Node.js'],
    featured: true,
    content: `# What I Learned Building My First Full-Stack App

When I transitioned from writing isolated client-side React components to owning the full end-to-end lifecycle of an application, my mental model underwent a radical shift. Here are the core insights, architectural hard knocks, and patterns that reshaped how I think about software.

## 1. The Fallacy of the Perfect Schema

Early on, I spent days drafting an intricate relational schema before writing a single line of business logic. Every foreign key was indexed, and every constraint was etched in stone.

\`\`\`sql
-- What I thought was a masterpiece
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);
\`\`\`

Within forty-eight hours of user testing, three assumptions broke:
1. Profiles needed multi-tenant ownership, not 1-to-1 strict association.
2. Querying inside loose JSONB columns without generated virtual columns led to sluggish seq scans.
3. Migrations without backward compatibility caused zero-downtime deploy headaches.

> **Key Takeaway**: Schema evolution is not a failure of upfront planning; it is the natural consequence of learning your domain. Keep early schemas lean, write reversible migrations, and treat database changes as high-stakes versioning.

## 2. State Boundaries Belong Close to the Source

In purely frontend apps, it is tempting to dump everything into a client state management store. When the backend entered the picture, I quickly fell into the trap of syncing server state into local state stores.

\`\`\`typescript
// Anti-pattern: Double caching server data in client state
function useUserStore() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  return { users };
}
\`\`\`

The moment two browser tabs updated the same resource, cache invalidation became an impossible nightmare.

Treating server state as an asynchronous cache rather than application state—using deterministic query keys and mutation revalidation—simplified my codebase by hundreds of lines.

## 3. Graceful Error Handling Is an Art

In a production environment, network failures, timeouts, and validation errors are not exceptional—they are guaranteed daily occurrences.

\`\`\`typescript
export async function handleApiRequest<T>(
  promise: Promise<T>
): Promise<[T | null, Error | null]> {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    return [null, error instanceof Error ? error : new Error(String(error))];
  }
}
\`\`\`

Adopting tuple-based error returns or explicit Result types made error boundaries predictable and user-facing recovery instantaneous.

## 4. Conclusion

Building full-stack software is less about mastering any single framework and more about understanding the contract between systems: how data flows, where truth lives, and how failures are communicated. Keep your architecture honest, test the edges, and never stop questioning abstractions.`
  },
  {
    slug: 'understanding-javascript-closures',
    title: 'Understanding JavaScript Closures',
    description: 'A deep dive into lexical scoping, execution contexts, and how JavaScript engines preserve variables in memory across asynchronous lifecycles.',
    publishedAt: '2026-02-18',
    readTime: '5 min read',
    tags: ['JavaScript', 'Web Standards'],
    featured: true,
    content: `# Understanding JavaScript Closures

Closures are frequently described as one of JavaScript's most confounding features. Yet at their core, they emerge naturally from how functions and lexical scope are represented in memory.

## What Is Lexical Scope?

Lexical scope means that variable access is determined by the physical position of functions and blocks in your source code. When JavaScript compiles your code, it creates an environment record for every scope.

\`\`\`javascript
function createCounter(initialValue = 0) {
  let count = initialValue;

  return {
    increment() {
      count += 1;
      return count;
    },
    decrement() {
      count -= 1;
      return count;
    },
    get value() {
      return count;
    }
  };
}

const counter = createCounter(10);
console.log(counter.increment()); // 11
console.log(counter.increment()); // 12
console.log(counter.value);       // 12
\`\`\`

Notice that \`count\` remains accessible to \`increment\` and \`decrement\`, even though \`createCounter\` finished executing and returned.

## The Heap vs. The Call Stack

Why wasn't \`count\` garbage-collected when \`createCounter\` exited?

1. When a function executes, its execution context is pushed onto the **Call Stack**.
2. Normally, when the function returns, its stack frame is popped.
3. However, if an inner function retains a reference to an outer variable, the engine moves that environment record to the **Heap**.
4. The inner function carries a hidden \`[[Scopes]]\` reference to that heap record.

> A closure is simply the combination of a function bundled together with references to its surrounding lexical state.

## Practical Pattern: Memoization

Closures enable high-performance function memoization without polluting global namespaces:

\`\`\`javascript
function memoize(fn) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const expensiveCalculation = memoize((n) => {
  let sum = 0;
  for (let i = 0; i < n; i++) sum += i;
  return sum;
});
\`\`\`

## Common Pitfall: Stale Closures in Hooks

In modern React, closures are at the heart of Hooks. If an event handler or \`useEffect\` captures state without proper dependencies, it retains a snapshot of older variables:

\`\`\`typescript
// Stale closure warning
useEffect(() => {
  const interval = setInterval(() => {
    // If count is not in deps, this always reads the initial 0
    console.log('Current count:', count);
  }, 1000);

  return () => clearInterval(interval);
}, []); // Missing count dependency
\`\`\`

Understanding that closures capture variable bindings rather than static values is crucial for writing clean, bug-free concurrent JavaScript.`
  },
  {
    slug: 'a-practical-guide-to-react-server-components',
    title: 'A Practical Guide to React Server Components',
    description: 'Demystifying RSC architecture: how streaming wire formats work, separating data fetching from client interactivity, and writing faster apps.',
    publishedAt: '2026-01-24',
    readTime: '8 min read',
    tags: ['React', 'Performance', 'Architecture'],
    featured: true,
    content: `# A Practical Guide to React Server Components

React Server Components (RSC) represent the biggest paradigm shift in the React ecosystem since Hooks debuted in 2018. Rather than being just another data fetching mechanism, RSC alters where component code runs and how bundles are transmitted over the wire.

## The Problem RSC Solves

Traditionally, single-page React apps shipped all component logic to the user's browser. Even if an entire page consisted of a static markdown blog or read-only marketing copy, client devices parsed megabytes of JavaScript before first interaction.

With Server Components:
- **Zero Client Bundle Size**: Server components do not ship to the client bundle.
- **Direct Backend Resource Access**: Server components can query databases, read disk files, and access secret environment tokens natively.
- **Automatic Code Splitting**: Heavy dependencies like markdown parsers or syntax highlighters remain on the server.

\`\`\`tsx
// This runs exclusively on the server!
import db from '@/lib/db';
import { MarkdownRenderer } from '@/components/Markdown';

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await db.post.findUnique({
    where: { slug: params.slug }
  });

  if (!post) return <NotFound />;

  return (
    <article className="prose">
      <h1>{post.title}</h1>
      <MarkdownRenderer content={post.content} />
    </article>
  );
}
\`\`\`

## The Wire Format: What Gets Streamed?

When a Server Component renders, React does not output HTML strings like traditional SSR. Instead, it streams a special JSON-like serialized graph known as the **Flight Data Stream**.

Each line in the stream represents a serialized element or a suspended promise:

\`\`\`json
0:{"name":"PostPage","props":{"slug":"closures"}}
1:I["./components/InteractiveLikeButton.js",["client"],"LikeButton"]
M1:{"id":"./components/InteractiveLikeButton.js","chunks":["client"]}
\`\`\`

Client components are serialized as client references (\`M1\`), instructing the browser to hydrate only that exact leaf node while leaving the rest static.

## When to Use "use client"

A common misconception is that \`"use client"\` means "render this only on the client". In reality:

> \`"use client"\` marks the boundary where server code ends and client-side interactivity (state, effects, browser events) begins.

Use \`"use client"\` only when your component needs:
- Interactive event listeners (\`onClick\`, \`onChange\`)
- State and lifecycle hooks (\`useState\`, \`useEffect\`)
- Browser APIs (\`localStorage\`, \`window\`, geolocation)

Keep client leaves as small and focused as possible at the edge of your component tree.

## Mental Model Summary

1. **Default to Server**: Write components as server components first.
2. **Push Interactivity Down**: Carve out interactive widgets into tiny client leaf components.
3. **Pass Server Components as Children**: Client components can accept Server Components as \`children\` without forcing the children into the client bundle.`
  },
  {
    slug: 'my-current-developer-workflow',
    title: 'My Current Developer Workflow & Tooling Setup',
    description: 'A pragmatic overview of my local editor configurations, terminal shortcuts, Git habits, and deliberate practices for deep technical focus.',
    publishedAt: '2026-01-05',
    readTime: '4 min read',
    tags: ['Workflow', 'Tooling'],
    featured: false,
    content: `# My Current Developer Workflow & Tooling Setup

Tools do not make a craftsman, but friction in tooling robs focus. Over the years, I have steadily stripped away complex IDE plugins and bloated dashboards in favor of a fast, distraction-free environment.

## 1. Editor Discipline

I spend 90% of my writing and coding time in VS Code with a custom monochrome dark theme and zero status bar clutter.

- **Font**: *JetBrains Mono* with stylistic ligatures disabled.
- **Line Numbers**: Relative line numbers for rapid vertical navigation.
- **Breadcrumbs & Mini-map**: Disabled to maximize horizontal column focus.
- **Format on Save**: Enforced via \`Prettier\` and \`Biome\` with zero manual formatting debates.

\`\`\`json
// settings.json snippet
{
  "editor.fontSize": 14,
  "editor.lineHeight": 1.6,
  "editor.minimap.enabled": false,
  "workbench.colorTheme": "Default Dark Modern",
  "editor.formatOnSave": true
}
\`\`\`

## 2. Terminal & Shell Ergonomics

A few small alias improvements deliver disproportionate compounding speed:

\`\`\`bash
# Concise git log with graph and dates
alias glog="git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"

# Fast directory jumping
alias ..="cd .."
alias ...="cd ../.."
\`\`\`

I favor interactive Git rebases (\`git rebase -i\`) before pushing branches to maintain linear, readable project histories.

## 3. The 90-Minute Focus Block

Beyond keyboard shortcuts, the highest-leverage productivity practice is scheduling two uninterrupted 90-minute deep work blocks every day:

1. Close Slack and email tabs completely.
2. Put the phone in grayscale mode in another room.
3. Write down a single sentence objective on a physical notepad (e.g., *"Implement query cache invalidation for user avatars"*).
4. Code until the timer rings.

Simplicity in software begins with simplicity in environment.`
  },
  {
    slug: 'designing-for-the-web-the-beauty-of-whitespace',
    title: 'Designing for the Web: The Beauty of Whitespace',
    description: 'Why the best developer and editorial websites prioritize spatial rhythm, strict typography, and deliberate restraint over decoration.',
    publishedAt: '2025-12-14',
    readTime: '5 min read',
    tags: ['Design', 'Typography', 'Web Standards'],
    featured: false,
    content: `# Designing for the Web: The Beauty of Whitespace

In visual design, silence is as critical as sound in music. Too many developer tools and personal blogs fall victim to the "everything container" impulse: surrounding every bit of text with bordered pill boxes, colored cards, glowing shadows, and decorative badges.

## The Role of Negative Space

Negative space—or whitespace—is not empty space; it is structural architecture. It tells the reader's eye:
- What belongs together (Gestalt law of proximity).
- Where a concept begins and concludes.
- How to breathe between dense technical arguments.

\`\`\`css
/* Clean, readable editorial measure */
.article-body {
  max-width: 68ch;
  line-height: 1.7;
  margin-inline: auto;
}
\`\`\`

When line length is constrained to approximately 65 to 75 characters per line, reader fatigue drops dramatically.

## Anti-Slop: Removing the Pills

Compare these two approaches to rendering metadata:

### Cluttered (The Candy Box)
Wrapping categories, tags, dates, and reading times in colored pill badges turns an informative header into a visual circus of competing buttons.

### Refined (The Typographic Separator)
Using clean, unboxed text separated by subtle typographic dots:
\`\`\`text
Architecture · March 10, 2026 · 6 min read
\`\`\`

The result is quiet, dignified, and effortlessly readable.

## The Monochrome Discipline

Working within pure black (#000000), crisp white (#FFFFFF), and subtle grays forces you to solve design problems through hierarchy, size, weight, and spacing rather than relying on bright colors to rescue weak layouts.

Once you master monochrome balance, color becomes an intentional scalpel rather than a crutch.`
  }
];
