# Minimalist Developer Blog Website

A distraction-free, typography-first personal developer blog and portfolio inspired by editorial design and clean engineering journals. It provides a pure monochrome (#000000 / #FFFFFF / subtle neutral grays) reading and writing experience with Markdown content, syntax-highlighted code blocks, live search, tag filtering, and an optional in-browser writing studio.

### User Review & Critical Decisions

> [!IMPORTANT]
> The clarifying questionnaire in Phase 1 was skipped, so the following recommended defaults have been selected based on your specification:
> - **Content & Authoring**: Built-in interactive Markdown drafting studio with real-time preview, word/reading-time statistics, local persistence, and .md file export, alongside pre-loaded high-quality technical sample articles.
> - **Visual Identity**: Pure high-contrast monochrome (#000000, #FFFFFF, and subtle #E4E4E7 / #27272A borders). Zero pills, no gradients, no AI slop, no thick colored borders, and clean unboxed metadata with dot separators (`·`).
> - **Search & Navigation**: Dual search experience featuring an instant global command palette (`Cmd+K` / `Ctrl+K`) plus an inline search input with live tag filtering on the dedicated `/blog` listing page.
> - **Sample Identity**: Configured via a central `siteConfig.ts` file with yourname.dev placeholders easily customizable with your real links and bio.

---

## 1. Overview & Core Concept

- **What It Does**: A personal developer website containing a curated home view, a full chronological article catalog (`/blog`), rich individual post pages (`/blog/[slug]`) with deep-linking headings and table of contents, an about page (`/about`), and a markdown writing playground (`/write`) to draft and export new posts seamlessly.
- **Target Audience / Persona**: Software engineers, technical readers, tech recruiters, and engineering leaders seeking thoughtful, long-form technical writing and project insights.
- **Key Value**: A fast, distraction-free reading experience that lets the code and prose shine, with zero fluff or generic dashboard bloat.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Home Experience (`/`)**:
   - Top Bar: Wordmark `yourname.dev`, links to `Home`, `Blog`, `About`, `Writing`, and external `GitHub`, plus quick search icon (`⌘K`).
   - Hero: Understated typographical greeting ("Hey, I'm Your Name."), focused lead sentence, status line ("Currently building and learning."), and quick links to "Read my writing" and "GitHub".
   - Latest Writing: Clean vertical list showing publication date, post title with subtle hover underline, summary, reading time, and topic tag (unboxed text with typographic `·` separators).
   - About Snapshot: Concise personal philosophy, current tech stack, and contact links.
   - Minimal Footer: Copyright, GitHub, LinkedIn, Email, and quiet "Built with care" signoff separated by a hairline border.
2. **Blog Index (`/blog`)**:
   - Clean header with search input and interactive tag filter bar (`All`, `React`, `TypeScript`, `Architecture`, `Workflow`).
   - Chronological list sorted newest first.
   - Real-time instant query filtering across titles, summaries, tags, and full body content.
   - Graceful zero-state fallback with a "Clear search filters" quick action.
3. **Article Page (`/blog/[slug]`)**:
   - Article Header: Back to all posts link (`← Back to writing`), title with balanced line wrapping, subtitle, author, date, last updated date, and estimated reading time.
   - Interactive Table of Contents (collapsible or sticky side rail for desktop) highlighting current scroll position.
   - Markdown Body: Clean prose typesetting, clear headings (h1, h2, h3) with anchor copy links, custom blockquotes, inline `code`, and syntax-highlighted code blocks with line numbering and one-click copy button.
   - Article Footer: Previous/Next post navigation cards, copy link feedback toast, and social share shortcuts.
4. **Interactive Markdown Studio (`/write`)**:
   - Clean split-view editor: live Markdown input on the left and typography-rendered article preview on the right.
   - Live reading time and word count calculator.
   - "Download .md" and "Save to Local Drafts" actions to make drafting new posts effortless.
5. **Global Command Palette (`⌘K`)**:
   - Accessible via keyboard shortcut or header button.
   - Instant search across all articles, navigation routes, and social links with arrow key selection.

### Visual Identity & Theme
- **Aesthetic Direction**: Minimalist developer editorial. High typographical discipline, generous whitespace, strict hairline dividers (`1px solid #E4E4E7` in light / `#27272A` in dark mode).
- **Color Distribution (60-30-10)**:
  - 60% Canvas: Pure white (`#FFFFFF`) or deep pitch black (`#000000`).
  - 30% Structural: Subdued hairline dividers (`zinc-200` / `zinc-800`), muted secondary text (`zinc-500` / `zinc-400`), code background (`zinc-950` / `zinc-900`).
  - 10% Accent: Pure monochrome contrast (solid black buttons in light mode, solid white buttons in dark mode).
- **Typography**:
  - Primary UI & Headings: Clean geometric sans-serif (`Plus Jakarta Sans` or system sans) with tight tracking (`tracking-tight`).
  - Body Prose: High-legibility sans/serif rendering with comfortable `max-w-2xl` reading width (65–75ch) and generous line-height (`leading-relaxed`).
  - Code & Telemetry: Monospace (`JetBrains Mono` / `ui-monospace`) with tabular numerals.
- **Anti-Slop Restraints**:
  - Zero pills: tags rendered as unboxed text separated by `·`.
  - Zero thick colored left accent borders on callouts or blockquotes.
  - Zero decorative pulsing dots or fake version engine numbers.
  - Minimal motion: subtle opacity transitions $\le 150\text{ms}$.

---

## 3. Key Product Decisions & Trade-Offs

- **Client-Side SPA Architecture with Rich History / Hash Routing**:
  - *Chosen Approach*: Use client-side state and navigation (`/`, `/blog`, `/blog/:slug`, `/about`, `/write`, `404`) with browser history support.
  - *Why*: Provides instant page transitions, offline capability, zero layout shift, and instant live filtering without requiring external server dependencies.
  - *Alternatives Considered*: Server-rendered multi-page routing was rejected because Vite SPA delivers instant client-side response and enables live in-browser article preview and command palette.
- **Integrated Markdown Parsing & Code Syntax Highlighting**:
  - *Chosen Approach*: High-performance, lightweight markdown parser with custom code block renderer featuring syntax token styling, line highlighting, and copy-to-clipboard.
  - *Why*: Eliminates heavy bloated dependencies while providing crisp dark code themes and robust Markdown formatting.
- **Site Configuration Decoupling (`src/config/siteConfig.ts`)**:
  - *Chosen Approach*: Centralize all user details (author name, handle, bio, social URLs, status, navigation links) in a single configuration file.
  - *Why*: Allows replacing `yourname.dev` with real credentials in 30 seconds.

---

## 4. Technical Architecture & Data Strategy

### System & Component Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                       App Container                         │
│   (Theme Context, Navigation Router, Command Palette Cmd+K) │
└──────────────────────────────┬──────────────────────────────┘
                               │
       ┌───────────────────────┼───────────────────────┐
       ▼                       ▼                       ▼
┌──────────────┐        ┌──────────────┐        ┌──────────────┐
│  TopNavBar   │        │ Active View  │        │  SiteFooter  │
│ - Wordmark   │        │ Router/State │        │ - Socials    │
│ - Nav Links  │        └──────┬───────┘        │ - Copyright  │
│ - Search/Dark│               │                └──────────────┘
└──────────────┘               │
       ┌───────────────┬───────┴───────┬───────────────┬───────────────┐
       ▼               ▼               ▼               ▼               ▼
┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐
│  HomeView  │  │  BlogIndex │  │ ArticleView│  │  AboutView │  │ WriterView │
│ - Hero     │  │ - Search   │  │ - TOC Side │  │ - Bio & Stk│  │ - Split Ed │
│ - Recent   │  │ - Tag Fltr │  │ - MD Render│  │ - Timeline │  │ - Live Prv │
│ - Bio snap │  │ - PostList │  │ - CodeBlock│  │ - Contact  │  │ - Exporter │
└────────────┘  └────────────┘  └────────────┘  └────────────┘  └────────────┘
                                       │
                                ┌──────┴──────┐
                                ▼             ▼
                         ┌────────────┐ ┌────────────┐
                         │Prev/NextNav│ │Share/Copy  │
                         └────────────┘ └────────────┘
```

### Data Model & Post Schema
```typescript
export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string; // ISO date string e.g. "2026-03-15"
  updatedAt?: string;
  readTime: string;    // e.g. "5 min read"
  tags: string[];      // e.g. ["React", "TypeScript", "Performance"]
  content: string;     // Full Markdown text
  draft?: boolean;
  featured?: boolean;
}
```

### Interactive Component & State Mapping
- **Search & Filter State**: Live reactive query string + active tag filter updating filtered post list instantaneously with highlighted text matches.
- **Article Reader State**: Heading observer tracks active section in Table of Contents as user scrolls; copy button provides instantaneous visual confirmation ("Copied!").
- **Command Palette (`Cmd+K`)**: Keyboard event listener (`metaKey + k`, `Escape`, `ArrowUp`, `ArrowDown`, `Enter`) managing modal focus and routing.
- **In-Browser Writer Studio**: Two-way data binding updating live markdown preview, character/word counters, and local draft persistence.
