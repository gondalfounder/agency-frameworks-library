"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Trash2,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  ExternalLink,
  Layers,
  FileText,
  Search,
  RefreshCw,
  FolderMinus,
  Sparkles,
  X,
} from "lucide-react";

export interface ManagedFramework {
  slug: string;
  title: string;
  name: string;
  category: string;
  difficulty?: string;
  lineCount: number;
  readingTime: number;
  sourcePath: string;
  fileName: string;
  updatedAt?: string;
}

interface DeleteModalState {
  isOpen: boolean;
  type: "framework" | "category";
  targetTitle: string;
  targetIdentifier: string; // slug for framework, category name for category
  frameworkCount?: number;
  fileName?: string;
}

export function FrameworkManager() {
  const [frameworks, setFrameworks] = useState<ManagedFramework[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteModal, setDeleteModal] = useState<DeleteModalState>({
    isOpen: false,
    type: "framework",
    targetTitle: "",
    targetIdentifier: "",
  });
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchFrameworks = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/delete-framework", { cache: "no-store" });
      if (!res.ok) {
        throw new Error("Failed to retrieve framework registry.");
      }
      const data = await res.json();
      setFrameworks(data.frameworks || []);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to load frameworks.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFrameworks();
  }, []);

  const openDeleteFrameworkModal = (framework: ManagedFramework) => {
    setDeleteModal({
      isOpen: true,
      type: "framework",
      targetTitle: framework.title,
      targetIdentifier: framework.slug,
      fileName: framework.fileName,
    });
  };

  const openDeleteCategoryModal = (categoryName: string, count: number) => {
    setDeleteModal({
      isOpen: true,
      type: "category",
      targetTitle: categoryName,
      targetIdentifier: categoryName,
      frameworkCount: count,
    });
  };

  const closeModal = () => {
    if (!isDeleting) {
      setDeleteModal((prev) => ({ ...prev, isOpen: false }));
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setErrorMessage(null);
    setSuccessNotice(null);

    try {
      const body =
        deleteModal.type === "category"
          ? { category: deleteModal.targetIdentifier }
          : { slug: deleteModal.targetIdentifier };

      const res = await fetch("/api/delete-framework", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await res.json();

      if (!res.ok || result.error) {
        throw new Error(result.error || result.message || "Deletion failed.");
      }

      // Optimistically update list
      if (deleteModal.type === "category") {
        setFrameworks((prev) =>
          prev.filter((f) => f.category.toLowerCase() !== deleteModal.targetIdentifier.toLowerCase())
        );
        setSuccessNotice(
          `Category "${deleteModal.targetTitle}" and all associated frameworks deleted from GitHub. Vercel rebuild will update the site shortly.`
        );
      } else {
        setFrameworks((prev) =>
          prev.filter((f) => f.slug !== deleteModal.targetIdentifier)
        );
        setSuccessNotice(
          `"${deleteModal.targetTitle}" deleted from GitHub. Vercel rebuild will update the site shortly.`
        );
      }

      setDeleteModal((prev) => ({ ...prev, isOpen: false }));
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred during deletion.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter frameworks by search query
  const filteredFrameworks = frameworks.filter((f) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      f.title.toLowerCase().includes(q) ||
      f.slug.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q) ||
      f.fileName.toLowerCase().includes(q)
    );
  });

  // Group by category
  const categoriesMap = new Map<string, ManagedFramework[]>();
  for (const item of filteredFrameworks) {
    const cat = item.category || "General";
    if (!categoriesMap.has(cat)) {
      categoriesMap.set(cat, []);
    }
    categoriesMap.get(cat)!.push(item);
  }

  const categoryEntries = Array.from(categoriesMap.entries());

  return (
    <div className="space-y-8">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, slug, or category..."
            className="w-full pl-9 pr-4 py-2 bg-bg-secondary/40 border border-border-light focus:border-text-primary rounded-card text-xs sm:text-sm font-sans text-text-primary placeholder:text-text-muted outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchFrameworks}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-card border border-border-light hover:border-border-medium bg-bg-secondary/40 text-xs font-mono text-text-secondary hover:text-text-primary transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Success Alert */}
      <AnimatePresence>
        {successNotice && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="bg-accent/10 border border-accent/20 rounded-card p-4 flex items-start justify-between gap-3 text-xs text-text-primary"
          >
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-semibold text-accent font-sans">GitHub Auto-Sync Executed</p>
                <p className="text-text-primary font-sans leading-relaxed">{successNotice}</p>
              </div>
            </div>
            <button
              onClick={() => setSuccessNotice(null)}
              className="p-1 text-text-secondary hover:text-text-primary rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Alert */}
      {errorMessage && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 p-4 rounded-card text-xs flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-semibold font-sans">Operation Failed</p>
              <p className="font-sans leading-relaxed">{errorMessage}</p>
            </div>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="p-1 text-red-500 hover:opacity-80 rounded"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="py-16 text-center space-y-3">
          <Loader2 className="w-6 h-6 animate-spin text-accent mx-auto" />
          <p className="font-mono text-xs text-text-secondary uppercase tracking-wider">
            Loading framework registry...
          </p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && categoryEntries.length === 0 && (
        <div className="py-16 text-center space-y-3 border border-dashed border-border-medium rounded-panel p-8">
          <Layers className="w-8 h-8 text-text-muted mx-auto" />
          <h3 className="font-serif text-lg text-text-primary">No frameworks match your filter</h3>
          <p className="text-xs text-text-secondary font-sans max-w-sm mx-auto">
            {searchQuery
              ? `No results found for "${searchQuery}". Try clearing the search query.`
              : "No frameworks found in content/frameworks/."}
          </p>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="text-xs font-mono text-accent hover:underline pt-2 inline-block"
            >
              Clear search filter
            </button>
          )}
        </div>
      )}

      {/* Grouped Categories List */}
      {!isLoading &&
        categoryEntries.map(([categoryName, items]) => (
          <div
            key={categoryName}
            className="bg-bg-primary rounded-panel border border-border-light overflow-hidden shadow-sm"
          >
            {/* Category Header */}
            <div className="bg-bg-secondary/50 px-5 py-4 border-b border-border-light flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-accent" />
                <h2 className="font-serif text-lg sm:text-xl text-text-primary tracking-tight font-normal">
                  {categoryName}
                </h2>
                <span className="font-mono text-[10.5px] px-2 py-0.5 rounded-full bg-bg-secondary border border-border-light text-text-secondary">
                  {items.length} {items.length === 1 ? "framework" : "frameworks"}
                </span>
              </div>

              <button
                type="button"
                onClick={() => openDeleteCategoryModal(categoryName, items.length)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] border border-red-500/30 hover:border-red-500 bg-red-500/5 hover:bg-red-500/10 text-red-600 dark:text-red-400 font-mono text-[11px] uppercase tracking-wider transition-colors cursor-pointer self-start sm:self-auto"
                title={`Delete entire ${categoryName} category`}
              >
                <FolderMinus className="w-3.5 h-3.5" />
                <span>Delete Category</span>
              </button>
            </div>

            {/* Frameworks List in Category */}
            <div className="divide-y divide-border-light">
              {items.map((framework) => (
                <div
                  key={framework.slug}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-bg-secondary/20 transition-colors"
                >
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/frameworks/${framework.slug}`}
                        target="_blank"
                        className="font-serif text-base font-medium text-text-primary hover:text-accent transition-colors flex items-center gap-1.5 group"
                      >
                        <span className="truncate">{framework.title}</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-accent shrink-0" />
                      </Link>

                      {framework.difficulty && (
                        <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded bg-bg-secondary text-text-secondary border border-border-light">
                          {framework.difficulty}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-text-secondary">
                      <span className="text-text-muted">Slug:</span>
                      <code className="text-[11px] text-text-primary bg-bg-secondary/60 px-1.5 py-0.5 rounded">
                        {framework.slug}
                      </code>
                      <span className="text-border-medium">·</span>
                      <span className="text-[11px]">{framework.lineCount} lines</span>
                      <span className="text-border-medium">·</span>
                      <span className="text-[11px]">{framework.readingTime} min read</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <Link
                      href={`/frameworks/${framework.slug}`}
                      className="px-3 py-1.5 rounded-[2px] border border-border-light hover:border-border-medium text-xs font-sans text-text-secondary hover:text-text-primary transition-colors inline-flex items-center gap-1"
                    >
                      <span>View</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => openDeleteFrameworkModal(framework)}
                      className="px-3 py-1.5 rounded-[2px] border border-red-500/20 hover:border-red-500 bg-red-500/5 hover:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-sans font-medium transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                      title="Delete framework"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

      {/* Confirmation Modal */}
      <AnimatePresence>
        {deleteModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              className="bg-bg-primary border border-border-light rounded-panel max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-5"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shrink-0">
                  <AlertTriangle className="w-5 h-5 stroke-[1.75]" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-xl text-text-primary font-normal">
                    {deleteModal.type === "category"
                      ? "Delete Entire Category?"
                      : "Delete Framework?"}
                  </h3>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-text-secondary">
                    Irreversible GitHub Deletion
                  </p>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-text-secondary font-sans leading-relaxed space-y-2 bg-bg-secondary/40 p-4 rounded-card border border-border-light">
                {deleteModal.type === "category" ? (
                  <p>
                    Are you sure you want to delete the entire{" "}
                    <strong className="text-text-primary">
                      &quot;{deleteModal.targetTitle}&quot;
                    </strong>{" "}
                    category? This will permanently delete{" "}
                    <strong className="text-red-500 font-semibold">
                      all {deleteModal.frameworkCount} framework document(s)
                    </strong>{" "}
                    in this category from the GitHub repository.
                  </p>
                ) : (
                  <p>
                    Are you sure you want to delete{" "}
                    <strong className="text-text-primary">
                      &quot;{deleteModal.targetTitle}&quot;
                    </strong>
                    ?
                    {deleteModal.fileName && (
                      <span className="block mt-1 font-mono text-xs text-text-muted">
                        File: content/frameworks/{deleteModal.fileName}
                      </span>
                    )}
                  </p>
                )}
                <p className="text-[11px] text-text-muted font-mono pt-1">
                  Once deleted, a Vercel rebuild will update the static library within ~90 seconds.
                </p>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-[2px] border border-border-light hover:border-border-medium text-xs font-sans text-text-secondary hover:text-text-primary transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="px-5 py-2 rounded-[2px] bg-red-600 hover:bg-red-700 text-white text-xs font-sans font-medium transition-colors inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Deleting from GitHub...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Confirm Delete</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
