import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getAllFrameworks, clearFrameworksCache } from "@/lib/frameworks";

const REPO_OWNER = "gondalfounder";
const REPO_NAME = "agency-frameworks-library";

// Helper to delete a file from GitHub Contents API
async function deleteFromGitHub(filePath: string, token: string, commitMessage: string) {
  const githubApiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`;

  // 1. Get current file SHA
  const checkRes = await fetch(githubApiUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "AgencyFrameworks-App",
    },
    cache: "no-store",
  });

  if (!checkRes.ok) {
    if (checkRes.status === 404) {
      // File does not exist on GitHub, treat as already deleted
      return { success: true, warning: "File not found on GitHub remote." };
    }
    const errBody = await checkRes.json().catch(() => ({}));
    throw new Error(`Failed to fetch file SHA from GitHub: ${JSON.stringify(errBody)}`);
  }

  const fileData = await checkRes.json();
  const sha = fileData.sha;

  if (!sha) {
    throw new Error("Could not find file SHA from GitHub API response.");
  }

  // 2. Send DELETE request to GitHub Contents API
  const deleteRes = await fetch(githubApiUrl, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "AgencyFrameworks-App",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: commitMessage,
      sha: sha,
      branch: "main",
    }),
  });

  if (!deleteRes.ok) {
    const errorData = await deleteRes.json().catch(() => ({}));
    throw new Error(`GitHub DELETE failed (${deleteRes.status}): ${JSON.stringify(errorData)}`);
  }

  return await deleteRes.json();
}

// Helper to remove local file if present
function deleteFromLocal(filePath: string, slug?: string) {
  try {
    const localFullPath = path.resolve(process.cwd(), filePath);
    if (fs.existsSync(localFullPath)) {
      fs.unlinkSync(localFullPath);
    }
  } catch {
    // Ignore local file deletion errors in serverless environments
  }

  if (slug) {
    try {
      const rawPath = path.resolve(process.cwd(), `public/raw/${slug}.md`);
      if (fs.existsSync(rawPath)) {
        fs.unlinkSync(rawPath);
      }
    } catch {
      // Ignore
    }
  }
}

// GET: Returns list of frameworks and categories for management view
export async function GET() {
  try {
    clearFrameworksCache();
    const frameworks = getAllFrameworks();

    const grouped: Record<string, typeof frameworks> = {};
    for (const f of frameworks) {
      const cat = f.category || "General";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(f);
    }

    return NextResponse.json({
      frameworks: frameworks.map((f) => ({
        slug: f.slug,
        title: f.title,
        name: f.name,
        category: f.category,
        difficulty: f.difficulty,
        lineCount: f.lineCount,
        readingTime: f.readingTime,
        sourcePath: f.sourcePath,
        fileName: path.basename(f.sourcePath),
        updatedAt: f.updatedAt,
      })),
      grouped,
      totalCount: frameworks.length,
      categoryCount: Object.keys(grouped).length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to load frameworks list", message: error?.message },
      { status: 500 }
    );
  }
}

// Main handler for single or bulk category deletion
async function handleDelete(request: Request) {
  try {
    let payload: {
      slug?: string;
      fileName?: string;
      category?: string;
      path?: string;
    } = {};

    if (request.method === "POST" || request.method === "DELETE") {
      try {
        payload = await request.json();
      } catch {
        // Parse from URL params if JSON body is empty
        const url = new URL(request.url);
        payload = {
          slug: url.searchParams.get("slug") || undefined,
          fileName: url.searchParams.get("fileName") || undefined,
          category: url.searchParams.get("category") || undefined,
          path: url.searchParams.get("path") || undefined,
        };
      }
    }

    const { slug, fileName, category, path: customPath } = payload;

    if (!slug && !fileName && !category && !customPath) {
      return NextResponse.json(
        { error: "Missing required parameter: provide 'slug', 'fileName', or 'category'." },
        { status: 400 }
      );
    }

    clearFrameworksCache();
    const allFrameworks = getAllFrameworks();
    const token = process.env.GITHUB_ACCESS_TOKEN || process.env.GITHUB_TOKEN;

    const deletedItems: Array<{
      slug: string;
      title: string;
      path: string;
      category: string;
    }> = [];

    // --- Scenario A: Category deletion (Bulk) ---
    if (category && typeof category === "string" && category.trim().length > 0) {
      const normalizedCat = category.trim().toLowerCase();
      const matching = allFrameworks.filter(
        (f) =>
          f.category.toLowerCase() === normalizedCat ||
          f.category.toLowerCase().replace(/[\s_]+/g, "-") === normalizedCat.replace(/[\s_]+/g, "-")
      );

      if (matching.length === 0) {
        return NextResponse.json(
          {
            error: `No frameworks found under category "${category}".`,
          },
          { status: 404 }
        );
      }

      for (const item of matching) {
        const filePath = item.sourcePath || `content/frameworks/${item.slug}.md`;
        const commitMsg = `feat/content: delete framework ${item.title || item.slug} (bulk category removal)`;

        if (token) {
          await deleteFromGitHub(filePath, token, commitMsg);
        }
        deleteFromLocal(filePath, item.slug);

        deletedItems.push({
          slug: item.slug,
          title: item.title,
          path: filePath,
          category: item.category,
        });
      }

      clearFrameworksCache();

      return NextResponse.json({
        success: true,
        type: "category",
        category,
        deletedCount: deletedItems.length,
        deleted: deletedItems,
        message: `Successfully deleted category "${category}" and ${deletedItems.length} associated framework(s).`,
        tokenConfigured: Boolean(token),
      });
    }

    // --- Scenario B: Single framework deletion ---
    let target = allFrameworks.find(
      (f) =>
        (slug && f.slug.toLowerCase() === slug.toLowerCase()) ||
        (fileName && path.basename(f.sourcePath).toLowerCase() === fileName.toLowerCase()) ||
        (customPath && f.sourcePath.toLowerCase() === customPath.toLowerCase())
    );

    let targetFilePath = target?.sourcePath;
    let targetSlug = target?.slug || slug || "";
    let targetTitle = target?.title || targetSlug;
    let targetCategory = target?.category || "General";

    if (!targetFilePath) {
      // Fallback: construct file path directly
      const rawName = fileName || (slug ? `${slug}.md` : customPath || "");
      const normalizedName = rawName.endsWith(".md") || rawName.endsWith(".mdx") ? rawName : `${rawName}.md`;
      targetFilePath = `content/frameworks/${normalizedName}`;
    }

    const commitMsg = `feat/content: delete framework ${targetTitle || targetSlug}`;

    if (token) {
      await deleteFromGitHub(targetFilePath, token, commitMsg);
    }
    deleteFromLocal(targetFilePath, targetSlug);

    deletedItems.push({
      slug: targetSlug,
      title: targetTitle,
      path: targetFilePath,
      category: targetCategory,
    });

    clearFrameworksCache();

    return NextResponse.json({
      success: true,
      type: "framework",
      deletedCount: 1,
      deleted: deletedItems,
      message: `Successfully deleted framework "${targetTitle}".`,
      tokenConfigured: Boolean(token),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to delete framework.",
        message: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  return handleDelete(request);
}

export async function DELETE(request: Request) {
  return handleDelete(request);
}
