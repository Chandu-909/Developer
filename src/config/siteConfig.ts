import { SiteConfig } from '../types';

export const siteConfig: SiteConfig = {
  name: "Your Name",
  handle: "yourname",
  domain: "yourname.dev",
  role: "Full-Stack Software Engineer",
  bioShort: "I'm a developer who enjoys building things for the web, exploring new technologies, and writing about what I learn.",
  bioLong: [
    "I focus on building resilient web applications, developer tooling, and thoughtful user interfaces. I believe software engineering is at its best when clarity, ergonomics, and simplicity take center stage.",
    "Over the past few years, I've spent time designing distributed backend microservices, refining frontend design systems, and digging deep into browser performance and compilers.",
    "When I am not writing code, I am usually reading technical monographs, experimenting with local AI inference workflows, and contributing to open-source software."
  ],
  statusText: "Currently building and learning.",
  email: "hello@yourname.dev",
  githubUrl: "https://github.com/yourname",
  linkedinUrl: "https://linkedin.com/in/yourname",
  twitterUrl: "https://twitter.com/yourname",
  skills: [
    {
      title: "Languages",
      skills: ["TypeScript", "JavaScript", "Rust", "Go", "Python", "SQL"]
    },
    {
      title: "Frontend & UI",
      skills: ["React 19", "Next.js", "Tailwind CSS", "Vite", "Web Standards", "Accessibility (WCAG)"]
    },
    {
      title: "Backend & Systems",
      skills: ["Node.js", "Express", "PostgreSQL", "Redis", "REST & GraphQL", "Docker"]
    },
    {
      title: "Practices",
      skills: ["System Architecture", "Performance Optimization", "Clean Code", "CI/CD Pipelines", "API Design"]
    }
  ],
  journey: [
    {
      year: "2025 — Present",
      role: "Senior Software Engineer",
      organization: "Independent & Open Source",
      description: "Building production web applications, open source developer tools, and documenting full-stack architectures."
    },
    {
      year: "2023 — 2025",
      role: "Full-Stack Developer",
      organization: "Tech Labs",
      description: "Spearheaded frontend performance initiatives, reduced bundle sizes by 40%, and architected scalable backend microservices."
    },
    {
      year: "2021 — 2023",
      role: "Frontend Engineer",
      organization: "Digital Systems",
      description: "Engineered responsive, accessible component libraries and high-throughput dashboard interfaces for enterprise users."
    }
  ]
};
