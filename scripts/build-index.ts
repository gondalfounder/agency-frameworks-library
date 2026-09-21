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
  description: string;
  category: string;
  tags: string[];
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
        // Strip bold, italic, inline code and links from heading text for display
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

function formatCategory(category: string): string {
  if (!category || category.toLowerCase() === "frameworks") return "General";
  return category
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function inferCategory(
  frontmatterCategory: string | undefined,
  parentDir: string,
  filePath: string,
  title: string
): string {
  if (frontmatterCategory && frontmatterCategory.trim().length > 0) {
    return formatCategory(frontmatterCategory);
  }

  const normalizedParent = parentDir.replace(/\\/g, "/");
  const parentFolder = path.basename(normalizedParent);

  if (parentFolder && parentFolder !== "frameworks" && parentFolder !== ".") {
    if (parentFolder === "motion-framer") return "Animation & Motion";
    if (parentFolder === "design-taste-frontend") return "Frontend & UI Design";
    return formatCategory(parentFolder);
  }

  const baseFile = path.basename(filePath).toLowerCase();
  if (baseFile.startsWith("phase")) {
    return "Agency Roadmap 2026";
  }

  return "General";
}

function inferTags(
  frontmatterTags: any,
  slug: string,
  category: string,
  content: string
): string[] {
  if (Array.isArray(frontmatterTags)) {
    return frontmatterTags.map((t) => String(t).trim());
  }
  if (typeof frontmatterTags === "string") {
    return frontmatterTags.split(",").map((t) => t.trim());
  }

  const tags: Set<string> = new Set();
  tags.add(category);

  if (slug.includes("mindset")) tags.add("Mindset").add("Leadership").add("Founder");
  if (slug.includes("offer")) tags.add("Offer Architecture").add("Positioning").add("Strategy");
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

export function buildContentIndex() {
  const contentDir = path.resolve(process.cwd(), "content/frameworks");
  const generatedDir = path.resolve(process.cwd(), ".generated");
  const publicRawDir = path.resolve(process.cwd(), "public/raw");

  if (!fs.existsSync(generatedDir)) {
    fs.mkdirSync(generatedDir, { recursive: true });
  }
  if (!fs.existsSync(publicRawDir)) {
    fs.mkdirSync(publicRawDir, { recursive: true });
  }

  const files = scanMarkdownFiles(contentDir);
  const usedSlugs = new Map<string, number>();
  const frameworks: FrameworkMetadata[] = [];
  const searchDocs: SearchDoc[] = [];

  for (const filePath of files) {
    const rawFileContent = fs.readFileSync(filePath, "utf8");
    const parsed = matter(rawFileContent);
    const data = parsed.data || {};
    const content = parsed.content || rawFileContent;

    // Rule 2 for Slug: frontmatter `name` -> parent folder name -> filename.
    // On collision append -2, -3. Log a warning. Never use filename first for SKILL.md.
    let baseSlug = "";
    const parentFolder = path.basename(path.dirname(filePath));
    const filenameNoExt = path.basename(filePath, path.extname(filePath));

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
      console.warn(
        `[Warning] Slug collision for "${baseSlug}" in file ${filePath}. Renamed to "${finalSlug}".`
      );
    } else {
      usedSlugs.set(baseSlug, 1);
    }

    // Headings
    const headings = extractHeadings(content);

    // Title: First H1 in markdown -> frontmatter title -> prettified name
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

    // Description: Frontmatter description -> first non-empty paragraph -> fallback
    let description = "";
    if (data.description && typeof data.description === "string") {
      description = data.description.trim();
    } else {
      // Find first paragraph after H1
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
          description = tr.slice(0, 160) + (tr.length > 160 ? "..." : "");
          break;
        }
      }
      if (!description) {
        description = `Complete reference documentation for ${title}.`;
      }
    }

    const category = inferCategory(data.category, path.dirname(filePath), filePath, title);
    const tags = inferTags(data.tags, finalSlug, category, content);

    const lines = rawFileContent.split("\n");
    const lineCount = lines.length;
    const charCount = rawFileContent.length;
    const wordCount = rawFileContent
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    const stats = fs.statSync(filePath);
    const updatedAt = stats.mtime.toISOString();

    const metadata: FrameworkMetadata = {
      slug: finalSlug,
      name: data.name || finalSlug,
      title,
      description,
      category,
      tags,
      lineCount,
      charCount,
      wordCount,
      readingTime,
      updatedAt,
      sourcePath: path.relative(process.cwd(), filePath).replace(/\\/g, "/"),
      headings,
      rawContent: rawFileContent, // Verbatim original content preserved 100%
      frontmatter: data,
    };

    frameworks.push(metadata);

    // Search document (lightweight)
    searchDocs.push({
      slug: finalSlug,
      title,
      description,
      category,
      tags,
      headings: headings.map((h) => h.text),
      contentSample: content.slice(0, 500).replace(/\s+/g, " "),
    });

    // Copy raw markdown to /public/raw/<slug>.md
    const targetRawPath = path.join(publicRawDir, `${finalSlug}.md`);
    fs.writeFileSync(targetRawPath, rawFileContent, "utf8");
  }

  // Sort frameworks: Phase 1-8 first in order, then others alphabetically
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

  // Write index.json
  const indexPath = path.join(generatedDir, "index.json");
  fs.writeFileSync(indexPath, JSON.stringify(frameworks, null, 2), "utf8");

  // Write search-index.json
  const searchIndexPath = path.join(generatedDir, "search-index.json");
  fs.writeFileSync(searchIndexPath, JSON.stringify(searchDocs, null, 2), "utf8");

  return frameworks;
}

// Run when executed directly
if (require.main === module || process.argv[1]?.includes("build-index")) {
  const frameworks = buildContentIndex();
  console.log("\n--- CONTENT PIPELINE: PARSED FILES SUMMARY ---");
  console.table(
    frameworks.map((f) => ({
      Path: f.sourcePath,
      Slug: f.slug,
      Name: f.name,
      Lines: f.lineCount,
      Headings: f.headings.length,
      Category: f.category,
    }))
  );
  console.log(`Total Frameworks indexed: ${frameworks.length}\n`);
}
