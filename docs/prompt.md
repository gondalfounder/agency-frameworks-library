# PROMPT.md — Build the "Agency Frameworks Library" Web Dashboard

You are a senior full-stack engineer + designer. Build a public, read-only web dashboard that turns a folder of Markdown framework/skill files into a beautiful, searchable, readable library. Follow this prompt AND `design.md` exactly.

Before writing code, output one line:
**"Reading this as: documentation/library dashboard for developers & designers, editorial serif + mono-label language, leaning toward Next.js + Tailwind + Motion."**

---

## 1. Goal

I (agency owner) have many `.md` framework files (e.g. Motion/Framer Motion, design-taste-frontend, and more coming). I want:

1. Every file shown in a clean, readable web UI — anyone who visits the site can read them.
2. **Adding a new framework in the future = just drop a new `.md` file into `/content/frameworks/`**. No code changes. The dashboard picks it up automatically.
3. UI/UX must match `design.md` exactly.

---

## 2. Critical content rules (DO NOT BREAK)

1. **Render content verbatim.** Read each file's text fully, word by word. Do NOT summarize, shorten, paraphrase, reorder, or "fix" wording. What is in the `.md` must appear on the page.
2. Files are large (one is ~87 KB / 1,000+ lines). Handle them fully, no truncation.
3. **File names are not unique** — many files are literally called `SKILL.md`. So:
   - Slug = frontmatter `name` (e.g. `motion-framer`, `design-taste-frontend`).
   - If no frontmatter `name`, slug = filename (or parent folder name); if a slug collides, append `-2`, `-3`.
4. Parse YAML frontmatter (`name`, `description`, optional `category`, `tags`, `icon`, `order`) and show it as a UI info block, not raw YAML.
5. **Ignore `#` lines inside fenced code blocks** when building headings/TOC (some files have shell comments starting with `# `).
6. Support: GFM tables, task lists, fenced code with syntax highlighting, blockquotes, nested lists, links, images, inline HTML (sanitized), footnotes.

---

## 3. Tech stack

- **Next.js (App Router) + TypeScript**, static generation (SSG) so it can be hosted free on Vercel/Netlify.
- **Tailwind CSS** with tokens from `design.md` §10.
- **Motion** (`framer-motion`) for animations — follow `design.md` §6.
- Markdown: `gray-matter`, `unified/remark/rehype` (`remark-gfm`, `rehype-slug`, `rehype-autolink-headings`, `rehype-sanitize`) + `shiki` (or `rehype-pretty-code`) for code highlighting. Use `next-mdx-remote` only if needed; plain Markdown is fine.
- Search: `fuse.js` (or `flexsearch`) with an index generated at build time.
- Icons: `lucide-react`.
- Fonts: Instrument Serif, Geist, Geist Mono via `next/font`.
- No database. No login. No backend.

---

## 4. Content pipeline

Create `scripts/build-index.ts` (runs on `predev` and `prebuild`) that:

1. Recursively scans `/content/frameworks/**/*.md` (and `.mdx`).
2. For each file extracts: `slug`, `name`, `title` (frontmatter `name` prettified, or first H1), `description`, `category` (frontmatter → parent folder name → "General"), `tags`, `headings[]` (level, text, id — ignoring code blocks), `lineCount`, `charCount`, `readingTime`, `updatedAt` (file mtime), `sourcePath`, raw content.
3. Writes `/.generated/index.json` (metadata) and search index (title, description, headings, plain text).
4. Copies raw `.md` to `/public/raw/<slug>.md` for the "Download .md" button.
5. Logs a warning for duplicate slugs or files with broken frontmatter (never crash — fall back gracefully).

Adding a framework later: user drops a file in `/content/frameworks/` (optionally inside a category subfolder) → `npm run dev` / redeploy → it appears everywhere (home grid, sidebar, search, sitemap).

---

## 5. Pages & routes

| Route | Content |
|---|---|
| `/` | Hero, stats band (frameworks / categories / total lines), category chips filter, framework card grid (+ "Not sure where to start?" CTA tile), footer |
| `/frameworks` | Full library: search input, category + tag filters, sort (A–Z, recently updated, longest), grid/list toggle |
| `/frameworks/[slug]` | Reader: sidebar (grouped by category), rendered markdown, right-side "On this page" TOC with scroll-spy, prev/next framework links |
| `/categories/[category]` | Frameworks in a category |
| `/about` | Short page: what this library is, how to add a framework |
| `not-found` | On-brand 404 |

Global: sticky top bar, `Ctrl/Cmd+K` search palette, dark/light toggle (persist in localStorage), footer, `sitemap.xml`, `robots.txt`, OG metadata per framework page (title + description from frontmatter).

---

## 6. Reader features (framework page)

- Title (serif), mono meta row: category · lines · reading time · updated date.
- Buttons: **Copy markdown**, **Download .md**, **Copy link**.
- Code blocks: language label + Copy button, horizontal scroll.
- Heading anchors (`#`) on hover; URL hash scrolls correctly under the sticky header.
- Scroll-spy TOC; on mobile the TOC opens as a bottom sheet.
- Reading progress bar (thin accent line at the top).
- Very long files must stay fast: memoize rendering, lazy-load below-the-fold sections or use content-visibility, no layout jank.

---

## 7. Design

Implement `design.md` fully: colors, typography, components (top bar, hero, stats band, cards, CTA tile, chips, search palette, sidebar, reader, footer), motion rules, responsive rules, accessibility. If something is not specified, choose the calmer/more editorial option. Never use the forbidden AI-slop patterns listed there.

---

## 8. Project structure (create this)

```
agency-frameworks-dashboard/
├── content/
│   └── frameworks/            # <-- user drops .md files here
│       ├── motion-framer/SKILL.md
│       └── design-taste-frontend/SKILL.md
├── docs/
│   ├── prompt.md
│   ├── design.md
│   └── reference/             # screenshots (Beyond / Landbook)
├── public/
│   └── raw/                   # auto-generated copies of .md
├── scripts/
│   └── build-index.ts
├── src/
│   ├── app/                   # routes
│   ├── components/            # ui/, layout/, markdown/, search/
│   ├── lib/                   # content loader, search, utils
│   └── styles/
├── .generated/                # auto-generated index (gitignored)
├── tailwind.config.ts
├── package.json
└── README.md
```

`README.md` must explain: run locally, add a new framework (2 steps), deploy to Vercel.

---

## 9. Quality bar / acceptance criteria

- [ ] All files in `/content/frameworks/` appear with 100% of their text intact.
- [ ] Two `SKILL.md` files with different `name` values both work (no slug clash).
- [ ] Dropping a new `.md` and restarting adds it with no code edits.
- [ ] Search finds words inside headings and body text.
- [ ] Matches `design.md` visually (fonts, palette, cards, dark band, circled-arrow links).
- [ ] Lighthouse: Performance ≥ 90, Accessibility ≥ 95 on the home and a long framework page.
- [ ] Works at 375px width; no horizontal scroll.
- [ ] `prefers-reduced-motion` respected.
- [ ] Production build passes with zero TypeScript errors.

---

## 10. Working method

1. Read `/docs/design.md` and every file in `/content/frameworks/` first.
2. Plan the component tree, then scaffold the project.
3. Build the content pipeline first and print a table of parsed files (slug, name, lines, headings count) so I can verify.
4. Build UI page by page: layout → home → library → reader → search → polish/motion.
5. Run the build, fix errors, then give me: how to run, how to add a framework, how to deploy.

Ask me at most ONE question, and only if truly blocked. Otherwise proceed.

## Autonomous Git Sync Protocol
Whenever you add, modify, or delete a framework in `content/frameworks/` or make code adjustments:
1. Verify frontmatter metadata integrity.
2. Stage all modifications: `git add .`
3. Commit with a descriptive conventional commit message: `git commit -m "feat/content: <short summary of changes>"`
4. Push directly to remote: `git push origin main`
5. Report the commit hash and updated framework slug to the user.