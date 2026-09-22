import { NextResponse } from "next/server";
import matter from "gray-matter";
import fs from "fs";
import path from "path";

function slugifyFileName(name: string): string {
  const base = name.replace(/\.mdx?$/i, "");
  const clean = base
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
  return (clean || "framework") + ".md";
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const categoryInput = formData.get("category");
    const fileNameInput = formData.get("fileName");

    if (!file) {
      return NextResponse.json(
        { error: "No file provided in the request." },
        { status: 400 }
      );
    }

    let rawContent = "";
    let originalName = "uploaded-framework.md";

    if (typeof file === "string") {
      rawContent = file;
    } else if (file && typeof file === "object" && "text" in file && typeof (file as any).text === "function") {
      rawContent = await (file as any).text();
      if ("name" in file && typeof (file as any).name === "string" && (file as any).name) {
        originalName = (file as any).name;
      }
    } else {
      return NextResponse.json(
        { error: "Invalid file format." },
        { status: 400 }
      );
    }

    if (!rawContent.trim()) {
      return NextResponse.json(
        { error: "File content cannot be empty." },
        { status: 400 }
      );
    }

    // Determine target file name
    const rawFileName =
      typeof fileNameInput === "string" && fileNameInput.trim().length > 0
        ? fileNameInput.trim()
        : originalName;

    const sanitizedFileName = slugifyFileName(rawFileName);

    // Parse and update frontmatter
    const parsed = matter(rawContent);
    const data = parsed.data || {};

    if (typeof categoryInput === "string" && categoryInput.trim().length > 0) {
      data.category = categoryInput.trim();
    } else if (!data.category) {
      data.category = "General";
    }

    if (!data.name) {
      data.name = sanitizedFileName.replace(/\.md$/i, "");
    }

    if (!data.date) {
      data.date = new Date().toISOString().split("T")[0];
    }

    if (!data.level && !data.difficulty) {
      data.level = "INTERMEDIATE";
    }

    const updatedMarkdown = matter.stringify(parsed.content || "", data);
    const base64Content = Buffer.from(updatedMarkdown, "utf8").toString("base64");

    const repoOwner = "gondalfounder";
    const repoName = "agency-frameworks-library";
    const filePath = `content/frameworks/${sanitizedFileName}`;
    const token =
      process.env.GITHUB_ACCESS_TOKEN || process.env.GITHUB_TOKEN;

    // If running in local or Node server environment, also persist locally
    try {
      const localDirPath = path.resolve(process.cwd(), "content/frameworks");
      if (!fs.existsSync(localDirPath)) {
        fs.mkdirSync(localDirPath, { recursive: true });
      }
      const localFilePath = path.join(localDirPath, sanitizedFileName);
      fs.writeFileSync(localFilePath, updatedMarkdown, "utf8");
    } catch {
      // Ignore local write failure in read-only environments (e.g. Vercel)
    }

    if (!token) {
      return NextResponse.json(
        {
          success: true,
          warning:
            "GITHUB_ACCESS_TOKEN not configured. File saved locally (if supported), but GitHub sync was skipped.",
          path: filePath,
          fileName: sanitizedFileName,
          frontmatter: data,
        },
        { status: 200 }
      );
    }

    // Check if the file already exists on GitHub to obtain its SHA
    let existingSha: string | undefined;
    const githubApiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

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

    if (checkRes.ok) {
      const fileData = await checkRes.json();
      existingSha = fileData.sha;
    }

    // PUT request to GitHub Contents API
    const putPayload: Record<string, any> = {
      message: `feat(frameworks): upload ${sanitizedFileName}`,
      content: base64Content,
      branch: "main",
    };

    if (existingSha) {
      putPayload.sha = existingSha;
    }

    const putRes = await fetch(githubApiUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "AgencyFrameworks-App",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(putPayload),
    });

    if (!putRes.ok) {
      const errorData = await putRes.json().catch(() => ({}));
      return NextResponse.json(
        {
          error: "Failed to commit file to GitHub.",
          details: errorData,
        },
        { status: putRes.status }
      );
    }

    const githubResponse = await putRes.json();

    return NextResponse.json(
      {
        success: true,
        path: filePath,
        fileName: sanitizedFileName,
        commit: githubResponse.commit?.sha || null,
        frontmatter: data,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Internal server error while processing framework upload.",
        message: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
