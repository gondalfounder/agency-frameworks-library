import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface HeadingItem {
  level: number;
  text: string;
  id: string;
}

export interface FrameworkMetadata {
  slug: string;
  name: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  categories: string[];
  difficulty?: "Beginner" | "Intermediate" | "Advanced" | string;
  github?: string;
  docs?: string;
  tags: string[];
  icon?: string;
  lineCount: number;
  charCount: number;
  wordCount: number;
  readingTime: number; // in minutes
  updatedAt: string;
  sourcePath: string;
  headings: HeadingItem[];
  rawContent: string;
  frontmatter: Record<string, any>;
}

export interface SearchDoc {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  tags: string[];
  headings: string[];
  contentSample: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, "") // remove HTML tags
    .replace(/[^\w\s-]/g, "") // remove special chars
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function extractHeadings(content: string): HeadingItem[] {
  const lines = content.split("\n");
  let inCodeBlock = false;
  const headings: HeadingItem[] = [];
  const seenIds = new Set<string>();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith("```") || trimmed.startsWith("~~~")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (!inCodeBlock) {
      const match = line.match(/^(#{1,6})\s+(.*)$/);
      if (match) {
        const level = match[1].length;
        const rawText = match[2].trim();
        const cleanText = rawText
          .replace(/\*\*(.*?)\*\*/g, "$1")
          .replace(/\*(.*?)\*/g, "$1")
          .replace(/`(.*?)`/g, "$1")
          .replace(/\[(.*?)\]\(.*?\)/g, "$1")
          .trim();

        let id = slugify(cleanText);
        if (!id) id = `section-${i}`;
        let uniqueId = id;
        let counter = 1;
        while (seenIds.has(uniqueId)) {
          counter++;
          uniqueId = `${id}-${counter}`;
        }
        seenIds.add(uniqueId);

        headings.push({
          level,
          text: cleanText,
          id: uniqueId,
        });
      }
    }
  }

  return headings;
}

function formatCategoryName(cat: string): string {
  if (!cat || cat.toLowerCase() === "frameworks") return "General";
  return cat
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function inferCategory(
  frontmatterCat: any,
  parentFolder: string,
  baseFilename: string
): string {
  if (Array.isArray(frontmatterCat) && frontmatterCat.length > 0) {
    return formatCategoryName(String(frontmatterCat[0]));
  }
  if (typeof frontmatterCat === "string" && frontmatterCat.trim().length > 0) {
    return formatCategoryName(frontmatterCat);
  }
  if (parentFolder && parentFolder !== "frameworks" && parentFolder !== ".") {
    if (parentFolder === "motion-framer") return "Animation & Motion";
    if (parentFolder === "design-taste-frontend") return "Frontend & UI Design";
    return formatCategoryName(parentFolder);
  }
  if (baseFilename.toLowerCase().startsWith("phase")) {
    return "Agency Roadmap 2026";
  }
  return "General";
}

function inferTags(frontmatterTags: any, slug: string, category: string): string[] {
  if (Array.isArray(frontmatterTags)) {
    return frontmatterTags.map((t) => String(t).trim());
  }
  if (typeof frontmatterTags === "string") {
    return frontmatterTags.split(",").map((t) => t.trim());
  }

  const tags: Set<string> = new Set();
  tags.add(category);

  if (slug.includes("mindset")) tags.add("Mindset").add("Leadership").add("Founder");
  if (slug.includes("offer")) tags.add("Offer Design").add("Positioning").add("Strategy");
  if (slug.includes("pricing")) tags.add("Pricing").add("Retainers").add("Finance");
  if (slug.includes("brand")) tags.add("Personal Brand").add("Content").add("LinkedIn");
  if (slug.includes("client-acquisition") || slug.includes("acquisition")) tags.add("Cold Email").add("Lead Gen").add("Outreach");
  if (slug.includes("sales")) tags.add("Sales Calls").add("Closing").add("Objection Handling");
  if (slug.includes("operations")) tags.add("Operations").add("Fulfillment").add("SLAs");
  if (slug.includes("team")) tags.add("Hiring").add("Team Structure").add("Delegation");
  if (slug.includes("motion") || slug.includes("framer")) tags.add("Framer Motion").add("React").add("Animation").add("Gestures");
  if (slug.includes("taste") || slug.includes("frontend")) tags.add("Frontend").add("Design Systems").add("Anti-Slop").add("UI/UX");

  return Array.from(tags);
}

function scanMarkdownFiles(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;

  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of list) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      results.push(...scanMarkdownFiles(fullPath));
    } else if (
      file.isFile() &&
      (file.name.endsWith(".md") || file.name.endsWith(".mdx"))
    ) {
      results.push(fullPath);
    }
  }
  return results;
}

// In-memory cache for fast SSG lookups
let cachedFrameworks: FrameworkMetadata[] | null = null;

export function clearFrameworksCache() {
  cachedFrameworks = null;
}

export function getAllFrameworks(): FrameworkMetadata[] {
  if (cachedFrameworks) {
    return cachedFrameworks;
  }

  const contentDir = path.resolve(process.cwd(), "content/frameworks");
  const publicRawDir = path.resolve(process.cwd(), "public/raw");

  if (!fs.existsSync(publicRawDir)) {
    fs.mkdirSync(publicRawDir, { recursive: true });
  }

  const files = scanMarkdownFiles(contentDir);
  const usedSlugs = new Map<string, number>();
  const frameworks: FrameworkMetadata[] = [];

  for (const filePath of files) {
    const rawFileContent = fs.readFileSync(filePath, "utf8");
    const parsed = matter(rawFileContent);
    const data = parsed.data || {};
    const content = parsed.content || rawFileContent;

    const parentFolder = path.basename(path.dirname(filePath));
    const filenameNoExt = path.basename(filePath, path.extname(filePath));

    // Slug: frontmatter name -> parent folder -> filename without extension
    let baseSlug = "";
    if (data.name && typeof data.name === "string" && data.name.trim().length > 0) {
      baseSlug = slugify(data.name.trim());
    } else if (
      parentFolder &&
      parentFolder !== "frameworks" &&
      parentFolder !== "." &&
      parentFolder.trim().length > 0
    ) {
      baseSlug = slugify(parentFolder.trim());
    } else {
      baseSlug = slugify(filenameNoExt.trim());
    }

    let finalSlug = baseSlug;
    if (usedSlugs.has(baseSlug)) {
      const count = usedSlugs.get(baseSlug)! + 1;
      usedSlugs.set(baseSlug, count);
      finalSlug = `${baseSlug}-${count}`;
    } else {
      usedSlugs.set(baseSlug, 1);
    }

    const headings = extractHeadings(content);

    // Title: First H1 in markdown -> frontmatter title/name -> prettified slug
    let title = "";
    const firstH1 = headings.find((h) => h.level === 1);
    if (firstH1) {
      title = firstH1.text;
    } else if (data.title) {
      title = String(data.title);
    } else if (data.name) {
      title = String(data.name)
        .split(/[-_]/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    } else {
      title = finalSlug
        .split(/[-_]/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    }

    // Tagline / Description
    let tagline = data.tagline || data.description || "";
    if (!tagline) {
      const lines = content.split("\n");
      for (const line of lines) {
        const tr = line.trim();
        if (
          tr &&
          !tr.startsWith("#") &&
          !tr.startsWith("---") &&
          !tr.startsWith("```") &&
          !tr.startsWith(">") &&
          !tr.startsWith("*")
        ) {
          tagline = tr.slice(0, 160) + (tr.length > 160 ? "..." : "");
          break;
        }
      }
      if (!tagline) {
        tagline = `Complete reference documentation for ${title}.`;
      }
    }

    const category = inferCategory(data.category, parentFolder, filenameNoExt);
    const tags = inferTags(data.tags, finalSlug, category);

    const lines = rawFileContent.split("\n");
    const lineCount = lines.length;
    const charCount = rawFileContent.length;
    const wordCount = rawFileContent
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    let updatedAt = new Date().toISOString();
    try {
      const stats = fs.statSync(filePath);
      updatedAt = stats.mtime.toISOString();
    } catch {
      // ignore
    }

    const metadata: FrameworkMetadata = {
      slug: finalSlug,
      name: data.name || finalSlug,
      title,
      tagline,
      description: tagline,
      category,
      categories: Array.isArray(data.category) ? data.category : [category],
      difficulty: data.difficulty || "Intermediate",
      github: data.github,
      docs: data.docs,
      tags,
      icon: data.icon,
      lineCount,
      charCount,
      wordCount,
      readingTime,
      updatedAt,
      sourcePath: path.relative(process.cwd(), filePath).replace(/\\/g, "/"),
      headings,
      rawContent: rawFileContent, // Verbatim 100%
      frontmatter: data,
    };

    frameworks.push(metadata);

    // Ensure raw markdown copy exists in /public/raw/<slug>.md
    try {
      const targetRawPath = path.join(publicRawDir, `${finalSlug}.md`);
      fs.writeFileSync(targetRawPath, rawFileContent, "utf8");
    } catch {
      // ignore during build
    }
  }

  // Sort: Phase 1-8 in order, then others alphabetically
  frameworks.sort((a, b) => {
    const aMatch = a.slug.match(/phase(\d+)/);
    const bMatch = b.slug.match(/phase(\d+)/);
    if (aMatch && bMatch) {
      return parseInt(aMatch[1], 10) - parseInt(bMatch[1], 10);
    }
    if (aMatch) return -1;
    if (bMatch) return 1;
    return a.title.localeCompare(b.title);
  });

  cachedFrameworks = frameworks;
  return frameworks;
}

export function getFrameworkBySlug(slug: string): FrameworkMetadata | null {
  const frameworks = getAllFrameworks();
  return frameworks.find((f) => f.slug === slug) || null;
}

export function getAllCategories(): { category: string; count: number; slug: string }[] {
  const frameworks = getAllFrameworks();
  const categoryMap = new Map<string, number>();

  for (const f of frameworks) {
    const cat = f.category || "General";
    categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
  }

  return Array.from(categoryMap.entries()).map(([category, count]) => ({
    category,
    count,
    slug: slugify(category),
  }));
}

export function getFrameworksByCategory(categorySlug: string): FrameworkMetadata[] {
  const frameworks = getAllFrameworks();
  return frameworks.filter((f) => {
    const slug = slugify(f.category);
    return (
      slug === categorySlug.toLowerCase() ||
      f.category.toLowerCase() === categorySlug.toLowerCase()
    );
  });
}

export function getAllTags(): { tag: string; count: number }[] {
  const frameworks = getAllFrameworks();
  const tagMap = new Map<string, number>();

  for (const f of frameworks) {
    for (const tag of f.tags || []) {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    }
  }

  return Array.from(tagMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function getStats() {
  const frameworks = getAllFrameworks();
  const categories = getAllCategories();
  const totalLines = frameworks.reduce((acc, f) => acc + f.lineCount, 0);
  const totalWords = frameworks.reduce((acc, f) => acc + f.wordCount, 0);
  const totalReadingTime = frameworks.reduce((acc, f) => acc + f.readingTime, 0);

  return {
    frameworkCount: frameworks.length,
    categoryCount: categories.length,
    totalLines,
    totalWords,
    totalReadingTime,
  };
}

export function getSearchIndex(): SearchDoc[] {
  const frameworks = getAllFrameworks();
  return frameworks.map((f) => ({
    slug: f.slug,
    title: f.title,
    tagline: f.tagline,
    description: f.description,
    category: f.category,
    tags: f.tags,
    headings: f.headings.map((h) => h.text),
    contentSample: f.rawContent.slice(0, 500).replace(/\s+/g, " "),
  }));
}
