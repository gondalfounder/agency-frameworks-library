"use client";

import React, { useState, useRef, useEffect, useId, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  FolderPlus,
  Tag,
  Layers,
  ArrowRight,
  GitCommit,
  Sparkles,
  Settings2,
  PlusCircle,
} from "lucide-react";
import { CircledArrow } from "@/components/ui/circled-arrow";
import { FrameworkManager } from "@/components/admin/framework-manager";

interface CategoryOption {
  category: string;
  count: number;
}

function UploadContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialTab = searchParams.get("tab") === "manage" ? "manage" : "upload";
  const [activeTab, setActiveTab] = useState<"upload" | "manage">(initialTab);

  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [level, setLevel] = useState<"BEGINNER" | "INTERMEDIATE" | "ADVANCED">(
    "INTERMEDIATE"
  );
  const [tags, setTags] = useState("");

  const [existingCategories, setExistingCategories] = useState<CategoryOption[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [successData, setSuccessData] = useState<{
    path: string;
    fileName: string;
    commit?: string | null;
    frontmatter?: any;
    warning?: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const customCategoryInputId = useId();

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "manage" || tabParam === "upload") {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const switchTab = (tab: "upload" | "manage") => {
    setActiveTab(tab);
    router.replace(`/upload?tab=${tab}`, { scroll: false });
  };

  // Load existing categories dynamically from search index or fallback
  useEffect(() => {
    fetch("/api/search")
      .then((res) => res.json())
      .then((docs: any[]) => {
        const catMap = new Map<string, number>();
        docs.forEach((doc) => {
          if (doc.category) {
            catMap.set(doc.category, (catMap.get(doc.category) || 0) + 1);
          }
        });
        const list = Array.from(catMap.entries()).map(([category, count]) => ({
          category,
          count,
        }));
        if (list.length === 0) {
          list.push({ category: "Agency Roadmap 2026", count: 8 }, { category: "Sales", count: 1 });
        }
        setExistingCategories(list);
        if (list.length > 0 && !selectedCategory) {
          setSelectedCategory(list[0].category);
        }
      })
      .catch(() => {
        const fallback = [
          { category: "Agency Roadmap 2026", count: 8 },
          { category: "Sales", count: 1 },
          { category: "Frontend & UI Design", count: 1 },
        ];
        setExistingCategories(fallback);
        if (!selectedCategory) {
          setSelectedCategory(fallback[0].category);
        }
      });
  }, []);

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.name.endsWith(".md") && !selectedFile.name.endsWith(".mdx")) {
      setErrorMessage("Only markdown files (.md, .mdx) are accepted.");
      return;
    }
    setFile(selectedFile);
    setFileName(selectedFile.name.replace(/\.mdx?$/i, ""));
    setErrorMessage("");
    setStatus("idle");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setErrorMessage("Please select a markdown file to upload.");
      return;
    }

    const finalCategory = isCustomCategory ? customCategory.trim() : selectedCategory;
    if (!finalCategory) {
      setErrorMessage("Please select or specify a category.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", finalCategory);
      if (fileName.trim()) {
        formData.append("fileName", fileName.trim());
      }
      if (title.trim()) {
        formData.append("title", title.trim());
      }
      formData.append("level", level);
      if (tags.trim()) {
        formData.append("tags", tags.trim());
      }

      const res = await fetch("/api/upload-framework", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to commit framework to GitHub.");
      }

      setSuccessData(data);
      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(
        err.message || "An unexpected error occurred during submission."
      );
    }
  };

  const handleReset = () => {
    setFile(null);
    setFileName("");
    setTitle("");
    setTags("");
    setIsCustomCategory(false);
    setCustomCategory("");
    setStatus("idle");
    setSuccessData(null);
    setErrorMessage("");
  };

  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Header */}
      <div className="space-y-4 border-b border-border-light pb-8">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-secondary font-medium">
            Admin Portal & Operations
          </span>
        </div>

        <h1 className="font-serif italic text-4xl sm:text-5xl text-text-primary tracking-tight font-normal">
          {activeTab === "upload" ? "Upload Framework" : "Framework Management"}
        </h1>

        <p className="text-sm sm:text-base text-text-secondary font-sans leading-relaxed max-w-2xl">
          {activeTab === "upload"
            ? "Contribute battle-tested operational frameworks to the agency repository. Uploaded markdown files are frontmatter-normalized, committed to GitHub, and automatically deployed live across the library within ~90 seconds via Vercel SSG rebuild."
            : "Review, filter, and delete registered frameworks or entire categories. Actions directly sync with GitHub repository contents."}
        </p>

        {/* Tab Navigation */}
        <div className="pt-4 flex items-center gap-2">
          <div className="inline-flex p-1 rounded-card bg-bg-secondary/70 border border-border-light">
            <button
              type="button"
              onClick={() => switchTab("upload")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-[2px] font-sans text-xs font-medium transition-all cursor-pointer ${
                activeTab === "upload"
                  ? "bg-text-primary text-bg-primary shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Upload New</span>
            </button>

            <button
              type="button"
              onClick={() => switchTab("manage")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-[2px] font-sans text-xs font-medium transition-all cursor-pointer ${
                activeTab === "manage"
                  ? "bg-text-primary text-bg-primary shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span>Manage Existing</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab 2: Manage Existing Frameworks */}
      {activeTab === "manage" && <FrameworkManager />}

      {/* Tab 1: Upload New Framework */}
      {activeTab === "upload" && (
        <div className="bg-bg-primary rounded-panel border border-border-light p-6 sm:p-10 shadow-sm">
          {status === "success" && successData ? (
            /* Success State */
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 text-center py-4"
            >
              <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 text-accent flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 stroke-[1.5]" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="font-serif text-2xl sm:text-3xl text-text-primary font-normal">
                  Framework Committed Successfully
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary font-sans leading-relaxed">
                  Your markdown document has been normalized and committed to{" "}
                  <code className="bg-bg-secondary px-1.5 py-0.5 rounded font-mono text-[11px] text-text-primary">
                    {successData.path}
                  </code>
                </p>
              </div>

              {/* Commit Meta Card */}
              <div className="bg-bg-secondary/60 rounded-card border border-border-light p-5 max-w-lg mx-auto text-left space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono uppercase tracking-wider text-text-secondary text-[11px]">
                    Category:
                  </span>
                  <span className="font-sans font-medium text-accent">
                    {successData.frontmatter?.category || "General"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono uppercase tracking-wider text-text-secondary text-[11px]">
                    Slug:
                  </span>
                  <span className="font-mono text-text-primary text-[11px]">
                    {successData.fileName}
                  </span>
                </div>
                {successData.commit && (
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-border-light">
                    <span className="font-mono uppercase tracking-wider text-text-secondary text-[11px] flex items-center gap-1">
                      <GitCommit className="w-3.5 h-3.5" /> Commit:
                    </span>
                    <span className="font-mono text-text-primary text-[11px]">
                      {successData.commit.slice(0, 7)}
                    </span>
                  </div>
                )}
              </div>

              {/* Vercel Notice */}
              <div className="bg-accent/10 border border-accent/20 rounded-card p-4 max-w-lg mx-auto text-xs text-text-primary flex items-start gap-3 text-left">
                <Sparkles className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Vercel is rebuilding your site.</strong> Your framework will be
                  live across the homepage grid, category indices, and search palette in
                  approximately ~90 seconds.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-5 py-2.5 rounded-[2px] bg-text-primary text-bg-primary font-sans text-xs font-medium hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Upload Another Framework
                </button>

                <button
                  type="button"
                  onClick={() => switchTab("manage")}
                  className="px-5 py-2.5 rounded-[2px] border border-border-light bg-bg-secondary hover:border-border-medium font-sans text-xs font-medium text-text-primary transition-colors cursor-pointer"
                >
                  View All Frameworks
                </button>

                <Link
                  href="/frameworks"
                  className="inline-flex items-center gap-2 text-xs font-sans font-medium text-text-primary hover:text-accent transition-colors py-2 px-3"
                >
                  <span>Browse Library</span>
                  <CircledArrow size={14} />
                </Link>
              </div>
            </motion.div>
          ) : (
            /* Form State */
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Error Message */}
              {errorMessage && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 p-4 rounded-card text-xs flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium">Upload Error</p>
                    <p>{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* 1. Drag & Drop File Zone */}
              <div className="space-y-2">
                <label className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-secondary block font-semibold">
                  01 · Markdown Document (.md, .mdx) *
                </label>

                {!file ? (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-card p-8 sm:p-12 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${
                      isDragging
                        ? "border-accent bg-accent/5"
                        : "border-border-medium hover:border-text-primary bg-bg-secondary/30"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".md,.mdx,text/markdown"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          handleFileSelect(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                    />
                    <div className="w-12 h-12 rounded-full bg-bg-secondary flex items-center justify-center text-text-secondary">
                      <UploadCloud className="w-6 h-6 stroke-[1.5]" />
                    </div>
                    <div>
                      <p className="font-sans text-sm font-medium text-text-primary">
                        Click to select or drag and drop your markdown file
                      </p>
                      <p className="font-mono text-[11px] text-text-secondary mt-1 uppercase tracking-wider">
                        Supports .md and .mdx formats
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Selected File Card */
                  <div className="bg-bg-secondary/60 border border-border-light rounded-card p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-mono text-xs font-semibold text-text-primary truncate">
                          {file.name}
                        </p>
                        <p className="font-mono text-[11px] text-text-secondary">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs font-sans text-text-secondary hover:text-text-primary underline px-2 py-1 cursor-pointer"
                      >
                        Replace
                      </button>
                      <button
                        type="button"
                        onClick={() => setFile(null)}
                        className="p-1 rounded text-text-secondary hover:text-red-500 transition-colors cursor-pointer"
                        aria-label="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Category Selection */}
              <div className="space-y-3 pt-2 border-t border-border-light">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-secondary block font-semibold">
                    02 · Category *
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCustomCategory((prev) => !prev)}
                    className="font-mono text-[11px] uppercase tracking-wider text-accent hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {isCustomCategory ? "← Select Existing Category" : "+ Create New Category"}
                  </button>
                </div>

                {!isCustomCategory ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {existingCategories.map((cat) => {
                      const isSelected = selectedCategory === cat.category;
                      return (
                        <button
                          key={cat.category}
                          type="button"
                          onClick={() => setSelectedCategory(cat.category)}
                          className={`text-left p-3 rounded-card border transition-all flex items-center justify-between gap-2 cursor-pointer ${
                            isSelected
                              ? "bg-text-primary text-bg-primary border-text-primary font-medium shadow-sm"
                              : "bg-bg-secondary/40 border-border-light hover:border-border-medium text-text-secondary hover:text-text-primary"
                          }`}
                        >
                          <span className="text-xs font-sans truncate">
                            {cat.category}
                          </span>
                          <span
                            className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                              isSelected
                                ? "bg-bg-primary/20 text-bg-primary"
                                : "bg-bg-secondary text-text-secondary"
                            }`}
                          >
                            {cat.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <input
                      id={customCategoryInputId}
                      type="text"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="e.g. Sales, Frontend, Operations, AI Voice Engineering"
                      className="w-full bg-bg-secondary/40 border border-border-medium focus:border-text-primary rounded-card px-4 py-2.5 text-xs sm:text-sm font-sans text-text-primary placeholder:text-text-muted outline-none transition-colors"
                    />
                    <p className="font-mono text-[10.5px] text-text-secondary">
                      New category will automatically create a dedicated section in the library.
                    </p>
                  </div>
                )}
              </div>

              {/* 3. Optional Metadata Fields */}
              <div className="space-y-4 pt-2 border-t border-border-light">
                <label className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-secondary block font-semibold">
                  03 · Metadata & Overrides (Optional)
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Level / Difficulty */}
                  <div className="space-y-1.5">
                    <span className="font-mono text-[10.5px] uppercase tracking-wider text-text-secondary block">
                      Difficulty Level
                    </span>
                    <div className="flex gap-2">
                      {(["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const).map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setLevel(lvl)}
                          className={`flex-1 py-2 text-[10.5px] font-mono uppercase tracking-wider rounded-card border transition-all cursor-pointer ${
                            level === lvl
                              ? "bg-text-primary text-bg-primary border-text-primary font-semibold"
                              : "bg-bg-secondary/40 border-border-light hover:border-border-medium text-text-secondary"
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Slug / File Name */}
                  <div className="space-y-1.5">
                    <span className="font-mono text-[10.5px] uppercase tracking-wider text-text-secondary block">
                      Target Slug / File Name
                    </span>
                    <input
                      type="text"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      placeholder="e.g. client-acquisition-engine"
                      className="w-full bg-bg-secondary/40 border border-border-light focus:border-text-primary rounded-card px-3.5 py-2 text-xs font-mono text-text-primary placeholder:text-text-muted outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Custom Title Override */}
                <div className="space-y-1.5">
                  <span className="font-mono text-[10.5px] uppercase tracking-wider text-text-secondary block">
                    Title Override (defaults to markdown H1)
                  </span>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. High-Ticket Client Acquisition Engine"
                    className="w-full bg-bg-secondary/40 border border-border-light focus:border-text-primary rounded-card px-3.5 py-2 text-xs font-sans text-text-primary placeholder:text-text-muted outline-none transition-colors"
                  />
                </div>

                {/* Tags */}
                <div className="space-y-1.5">
                  <span className="font-mono text-[10.5px] uppercase tracking-wider text-text-secondary block">
                    Tags (comma separated)
                  </span>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g. sales, outreach, enterprise, pricing"
                    className="w-full bg-bg-secondary/40 border border-border-light focus:border-text-primary rounded-card px-3.5 py-2 text-xs font-mono text-text-primary placeholder:text-text-muted outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-border-light flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="font-mono text-[10.5px] text-text-secondary uppercase tracking-wider">
                  Direct GitHub Sync · Zero DB Configuration
                </p>

                <button
                  type="submit"
                  disabled={status === "loading" || !file}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-[2px] bg-accent text-white font-sans text-xs font-medium transition-all ${
                    status === "loading" || !file
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:opacity-90 shadow-sm cursor-pointer"
                  }`}
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Committing to GitHub...</span>
                    </>
                  ) : (
                    <>
                      <span>Commit & Publish Framework</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default function UploadPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center">
          <Loader2 className="w-6 h-6 animate-spin text-accent mx-auto" />
        </div>
      }
    >
      <UploadContent />
    </Suspense>
  );
}
