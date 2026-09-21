# DESIGN.md — Agency Frameworks Library

> Visual + UX source of truth. Every screen must follow this file exactly.
> Reference: the "Beyond" agency site (Landbook screenshots): calm, editorial, premium B2B agency feel.
> Reading: **Design Read** = "Documentation/library dashboard for developers and designers, editorial-serif + mono-label language, warm-neutral palette, one hot accent."

---

## 1. Design Personality

- Calm, confident, editorial. Looks like an agency's own site, not a SaaS template.
- Serif headlines (large, tight, elegant) + tiny UPPERCASE mono labels + small clean sans body.
- Lots of whitespace. Hairline borders. Almost no shadows.
- ONE accent color (orange-red) used sparingly: primary CTA, small dots, active states, highlights.
- Dark sections used as contrast bands (hero-adjacent stats band, footer).

### Forbidden (AI-slop)
- No purple/blue gradients, no glassmorphism, no neon glow, no mesh backgrounds.
- No three identical rounded "feature cards" with emoji icons.
- No Inter-only + slate look. No heavy drop shadows. No infinite looping animations.
- No emojis in UI.

---

## 2. Color Tokens

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#F5F4F1` | Page background (warm off-white) |
| `--surface-sage` | `#E4E8E2` | Main content sections / large panels (pale sage-grey) |
| `--surface-card` | `#FFFFFF` | Cards on sage panels |
| `--ink` | `#171F1E` | Primary text, dark sections, dark buttons (near-black green) |
| `--ink-2` | `#2F3536` | Secondary dark |
| `--muted` | `#7B8280` | Secondary text, captions |
| `--muted-2` | `#9AA09E` | Card descriptions, disabled |
| `--line` | `#D3D8D2` | Hairline borders / dividers |
| `--accent` | `#EE4B1F` | Primary CTA, active indicator, dot, highlights |
| `--accent-soft` | `#C96A55` | Terracotta secondary accent (tags, subtle fills) |
| `--forest` | `#2A3320` | Optional deep olive for badges |

### Dark mode
Invert to: bg `#0F1514`, sage panel `#171F1E`, card `#1E2726`, ink `#F1F2EE`, line `#2C3736`. Accent stays `#EE4B1F`. Dark mode is a toggle, default = light.

---

## 3. Typography

| Role | Font | Notes |
|---|---|---|
| Display / headings | **Instrument Serif** (fallback: `Newsreader`, `Georgia`) | Tight tracking `-0.02em`, line-height `1.05–1.1`, regular weight (never bold) |
| Body / UI | **Geist Sans** (fallback: `Inter`, system-ui) | 14–16px, line-height `1.6` |
| Labels / meta / code | **Geist Mono** (fallback: `JetBrains Mono`) | 11px, UPPERCASE, letter-spacing `0.08em` |

Scale:
- Hero H1: `clamp(44px, 6vw, 84px)`, serif. Last words of the headline colored `--accent` (like "business growth" in the reference).
- H2: `clamp(32px, 3.6vw, 52px)` serif.
- H3: `24px` serif.
- Body: `16px` sans, `--muted` for secondary.
- Label: `11px` mono uppercase, often with a tiny accent dot before it (`● WHY BEYOND`).

Markdown content (framework pages): body `16–17px`, max width `72ch`, headings serif, code mono.

---

## 4. Layout & Spacing

- Max content width: `1200px`, centered. Page side padding: `24px` mobile, `48px` desktop.
- Spacing scale (px): 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Section vertical padding: `96px` desktop / `56px` mobile.
- Big rounded "page panel": the sage panel sits inside the off-white page with `radius 16px` at outer corners (like the Beyond frame).
- Grid: 12 columns desktop, 4 mobile. Card grids: 3 cols desktop / 2 tablet / 1 mobile.
- Detail page: 3-zone layout — left sidebar (nav, 260px), center content (max 72ch), right "On this page" TOC (220px, sticky).

Radius: cards `4px` (sharp, editorial), buttons `2–4px`, panels `16px`, chips `999px`.
Borders: `1px solid var(--line)`. Shadows: none by default; hover uses border color change to `--ink`.

---

## 5. Components

### 5.1 Top Bar (sticky)
- Left: logo wordmark in serif (e.g. "Frameworks" + small mark). Center-left: nav links (Library, Categories, About). Center/right: search field with `/` keyboard hint pill. Right: theme toggle + "Add framework" (dark button) — hidden on public build if needed.
- Height `64px`, bg `--bg` with 1px bottom line. Becomes slightly translucent on scroll (no blur glass; just solid with fade).

### 5.2 Announcement strip (optional)
- Full-width `--ink` bar, 11px mono uppercase, red dot + text + "READ MORE →". Use for "NEW — 3 frameworks added".

### 5.3 Hero
- Left: serif H1 (last phrase accent), short paragraph (14px, muted), two buttons: primary (accent bg, white text, square) + text-link with circled arrow `How it works ⊙`.
- Right: a featured framework preview card OR animated stat block (count of frameworks, categories, last updated).
- Under hero: "TRUSTED BY"-style row → here: a muted row of framework/tool names as small logos/text (e.g. Framer Motion, Tailwind, shadcn/ui...) in grey.

### 5.4 Stats band (dark)
- `--ink` background, rounded 16px. Left: serif statement. Right: 3 big serif numbers (`600+` style) with tiny mono captions. Here: `Frameworks`, `Categories`, `Total lines`.
- Thin 4-color line at the top is NOT needed; use a 1px `--accent` line instead.

### 5.5 Framework Card
```
┌───────────────────────────────┐
│ ● CATEGORY (mono, 11px)       │
│                               │
│ Framework Name (serif 24px)   │
│ Short description, 2-3 lines  │
│ (muted-2, 13px)               │
│                               │
│ Open  ⊙               12 min  │
└───────────────────────────────┘
```
- White card on sage panel, `radius 4px`, `1px` line border, padding `24px`, min-height `220px`.
- Hover: border → `--ink`, arrow-circle nudges 4px right, no lift/shadow.
- Description text comes from frontmatter `description` (clamp to 3 lines).

### 5.6 "Not sure where to start?" CTA tile
- Accent-red tile with a subtle concentric-arc/wave graphic (SVG, dark red overlay), serif text, bottom-left link `Browse all ⊙`. Sits as the last tile in the card grid, same size as a card.

### 5.7 Buttons
- Primary: `--accent` bg, white text, 13px sans medium, padding `12px 20px`, radius 2px.
- Dark: `--ink` bg, white text.
- Ghost/text link: text + circled arrow icon (`ArrowRight` inside 14px circle outline).
- Copy / Download / Visit style pill buttons (like Landbook toolbar): white bg, 1px line, radius 999px, padding `8px 16px`.

### 5.8 Chips / tags
- Pill, `1px` line border, white bg, 13px sans, padding `8px 16px`. Active chip = `--ink` bg + white text.

### 5.9 Search (Cmd/Ctrl+K palette)
- Modal, centered, `640px` wide, white, radius 12px, 1px border. Results grouped by Framework > Section headings. Keyboard navigable (↑ ↓ Enter Esc).

### 5.10 Sidebar
- Grouped by category (mono uppercase labels), items 14px sans. Active item: 2px accent left bar + `--ink` text. Collapsible on mobile via drawer.

### 5.11 Markdown reader (most important screen)
- Title in serif H1, mono meta row (category · lines · last updated), action buttons: `Copy markdown`, `Download .md`, `Copy link`.
- Frontmatter shown as a small info card at top (name, description) — NOT as raw YAML.
- Headings: serif, with hover `#` anchor link.
- Code blocks: dark `--ink` bg, radius 8px, mono 13px, language label top-left in mono, `Copy` button top-right, horizontal scroll (never wrap).
- Tables: full width, hairline borders, sticky header, horizontal scroll container on mobile.
- Blockquote: 2px accent left border, muted italic serif.
- Inline code: sage bg, radius 4px, mono 0.9em.
- Long files (80k+ chars): must stay smooth — render sections lazily / virtualize if needed.

### 5.12 Footer
- Dark `--ink` panel, rounded 16px bottom. Top: mono label `● READY WHEN YOU ARE`, big centered serif "Add your next framework", accent button. Below: 5-column link grid (Library, Categories, Resources, About, Legal), hairline divider, copyright row with small icons.

---

## 6. Motion

Use **Motion (framer-motion)** — see the `motion-framer` framework file in `/content`. Keep it restrained.

- Page/section reveal: `opacity 0→1`, `y 16→0`, `0.5s`, ease `[0.22, 1, 0.36, 1]`, once, staggered `0.06s`.
- Card hover: arrow translate only. No scale bounce.
- Hero H1: line-by-line mask reveal (once on load).
- Numbers in stats band: count-up once when in view.
- Route change: soft fade `0.2s`.
- Always respect `prefers-reduced-motion` (disable all transforms).
- Animate only `transform` and `opacity`.

---

## 7. Responsive

| Breakpoint | Behaviour |
|---|---|
| `< 640px` | 1-col cards, sidebar becomes drawer, TOC hidden (button opens sheet), hero stacked |
| `640–1024px` | 2-col cards, sidebar drawer, TOC hidden |
| `> 1024px` | Full 3-zone layout |

Touch targets ≥ 44px. No horizontal page scroll ever (only inside tables/code).

---

## 8. Accessibility

- Contrast AA minimum (check `--muted` on white; darken if needed).
- Visible focus ring: `2px solid var(--accent)`, offset 2px.
- Semantic landmarks, skip-to-content link, heading order correct.
- Search palette and drawer trap focus; Esc closes.

---

## 9. Iconography

- `lucide-react`, stroke `1.5`, size 16–20. Circled arrow = custom small component.
- No icon-in-colored-square tiles.

---

## 10. Tailwind tokens (drop into config)

```ts
theme: {
  extend: {
    colors: {
      bg: "#F5F4F1", sage: "#E4E8E2", card: "#FFFFFF",
      ink: "#171F1E", "ink-2": "#2F3536",
      muted: "#7B8280", "muted-2": "#9AA09E", line: "#D3D8D2",
      accent: "#EE4B1F", terracotta: "#C96A55", forest: "#2A3320",
    },
    fontFamily: {
      serif: ["Instrument Serif", "Newsreader", "Georgia", "serif"],
      sans: ["Geist", "Inter", "system-ui", "sans-serif"],
      mono: ["Geist Mono", "JetBrains Mono", "ui-monospace", "monospace"],
    },
    borderRadius: { card: "4px", panel: "16px" },
  },
}
```

---

## 11. Final UI checklist

- [ ] Only ONE accent color visible per viewport (except the CTA tile)
- [ ] Headings are serif, labels are mono uppercase, body is sans
- [ ] Cards are white, sharp (4px), hairline border, no shadow
- [ ] Sage panel + dark band + off-white page rhythm is present
- [ ] Circled-arrow links used instead of plain "Read more"
- [ ] Markdown renders exactly as source (no lost text, no altered wording)
- [ ] Works on mobile at 375px, no horizontal scroll
- [ ] Reduced-motion respected
