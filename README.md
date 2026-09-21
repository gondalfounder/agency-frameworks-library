<<<<<<< HEAD
# Agency Frameworks Library

A public, read-only web dashboard and documentation library for digital agency founders, engineers, and designers. Built with Next.js 15 (App Router, Static Site Generation), TypeScript, Tailwind CSS, Motion (`motion/react`), and unified/remark/rehype verbatim markdown rendering.

---

## 1. Quick Start (Run Locally)

### Prerequisites
- Node.js 18.18+ or 20+ (Node 24 tested)
- npm or pnpm or yarn

### Installation & Execution

```bash
# 1. Install dependencies
npm install

# 2. Run the development server (automatically triggers content index build)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 2. How to Add a New Framework in 2 Steps

Adding any new framework requires **zero code modifications**:

### Step 1: Drop your Markdown file into `content/frameworks/`
Place your `.md` or `.mdx` file into `content/frameworks/` (or in a category subfolder):

```markdown
---
name: your-framework-slug
description: A 2-3 sentence overview of the framework.
category: Agency Strategy
tags: [Growth, Operations, Sales]
---

# Your Framework Title

Your complete, unsummarized framework content goes here...
```

*Note: If multiple files are named `SKILL.md`, the pipeline uses the frontmatter `name` as the unique slug to prevent any collision.*

### Step 2: Build or Redeploy
```bash
npm run build
# Or start development
npm run dev
```
The automated build pipeline (`scripts/build-index.ts`) will:
- Parse metadata and headings (ignoring `#` lines inside code blocks)
- Generate the static reader page at `/frameworks/<slug>`
- Update the home grid, search palette, categories, and sitemap
- Export a downloadable raw copy to `/public/raw/<slug>.md`

---

## 3. Deployment on Vercel

This repository is optimized for Vercel Static Site Generation (SSG):

1. Push your repository to GitHub / GitLab.
2. In [Vercel Dashboard](https://vercel.com), click **"Add New Project"** and import the repository.
3. Keep default settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
4. Click **Deploy**.

---

## 4. Key Architectural Features

- **Verbatim Text Integrity**: 100% of each framework file's text is rendered word-by-word with zero AI summarization, alterations, or loss.
- **Lazy Search Palette (`Cmd+K` / `/`)**: Fuzzy instant search with Fuse.js across framework titles, tags, and heading hierarchy. Index is loaded on demand.
- **Editorial Design System**: Tailored Instrument Serif headings, Geist Sans UI, Geist Mono uppercase metadata labels, sage panels, and terracotta/orange accents.
- **3-Zone Reader**: Grouped category sidebar, 72ch centered verbatim content, sticky scroll-spy Table of Contents, and mobile bottom sheet drawer.
- **Code Block Actions**: Shiki syntax highlighting with language badge and 1-click clipboard copy.
- **Dark / Light Theme**: Built-in toggle with `localStorage` persistence.
- **Accessibility & Motion**: WCAG AA contrast, focus rings, skip links, and `prefers-reduced-motion` compliance.

---

## 5. Acceptance Criteria Checklist

- [x] All 10 files in `content/frameworks/` render with 100% verbatim text intact.
- [x] `SKILL.md` files with distinct frontmatter `name` work without slug collision.
- [x] Dropping a new `.md` and rebuilding adds it with zero code edits.
- [x] Search finds words across titles, descriptions, and headings.
- [x] Matches `design.md` visually (Instrument Serif, Geist, sage panels, circled arrows).
- [x] Works smoothly on mobile (375px) with no horizontal scroll.
- [x] Respects `prefers-reduced-motion`.
- [x] Production build passes with 0 TypeScript or lint errors.
=======
# agency-frameworks-library
>>>>>>> 768d1d40a818fe5c069f92495fcf23ff69883a8b
