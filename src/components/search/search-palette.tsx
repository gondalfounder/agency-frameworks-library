"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, Hash, BookOpen, ArrowRight, CornerDownLeft } from "lucide-react";
import { SearchDoc } from "@/lib/content";

interface SearchPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResultItem {
  type: "framework" | "heading";
  slug: string;
  title: string;
  category: string;
  headingText?: string;
  headingId?: string;
  description?: string;
}

export function SearchPalette({ isOpen, onClose }: SearchPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [searchDocs, setSearchDocs] = useState<SearchDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Lazy load search index only when palette is opened
  useEffect(() => {
    if (isOpen && searchDocs.length === 0 && !loading) {
      setLoading(true);
      fetch("/api/search")
        .then((res) => res.json())
        .then((data: SearchDoc[]) => {
          setSearchDocs(data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [isOpen, searchDocs.length, loading]);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Global keydown listeners for escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Initialize Fuse.js
  const fuse = useMemo(() => {
    if (searchDocs.length === 0) return null;
    return new Fuse(searchDocs, {
      keys: [
        { name: "title", weight: 0.4 },
        { name: "headings", weight: 0.3 },
        { name: "description", weight: 0.2 },
        { name: "tags", weight: 0.1 },
        { name: "category", weight: 0.1 },
      ],
      threshold: 0.35,
      ignoreLocation: true,
    });
  }, [searchDocs]);

  // Compute search results
  const results = useMemo<SearchResultItem[]>(() => {
    if (!query.trim()) {
      // Default: show all frameworks
      return searchDocs.slice(0, 8).map((doc) => ({
        type: "framework",
        slug: doc.slug,
        title: doc.title,
        category: doc.category,
        description: doc.description,
      }));
    }

    if (!fuse) return [];

    const matches = fuse.search(query.trim());
    const items: SearchResultItem[] = [];

    for (const match of matches) {
      const doc = match.item;
      // Framework main match
      items.push({
        type: "framework",
        slug: doc.slug,
        title: doc.title,
        category: doc.category,
        description: doc.description,
      });

      // Matching headings within this framework
      const lowerQ = query.toLowerCase();
      const matchingHeadings = (doc.headings || []).filter((h) =>
        h.toLowerCase().includes(lowerQ)
      );

      for (const h of matchingHeadings.slice(0, 3)) {
        const hSlug = h
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-");

        items.push({
          type: "heading",
          slug: doc.slug,
          title: doc.title,
          category: doc.category,
          headingText: h,
          headingId: hSlug,
        });
      }
    }

    return items.slice(0, 10);
  }, [query, searchDocs, fuse]);

  // Keyboard navigation within list
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, results.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % Math.max(1, results.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    }
  };

  const handleSelect = (item: SearchResultItem) => {
    onClose();
    if (item.type === "heading" && item.headingId) {
      router.push(`/frameworks/${item.slug}#${item.headingId}`);
    } else {
      router.push(`/frameworks/${item.slug}`);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Palette Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-[640px] bg-card rounded-xl border border-line shadow-2xl overflow-hidden z-10 text-ink"
            role="dialog"
            aria-modal="true"
            aria-label="Search frameworks"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-line gap-3 bg-bg/50">
              <Search className="w-5 h-5 text-muted shrink-0 stroke-[1.5]" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleInputKeyDown}
                placeholder="Search frameworks, sections, headings..."
                className="w-full bg-transparent text-ink placeholder:text-muted-2 text-base outline-none font-sans"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-muted-2 hover:text-ink p-1 rounded transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-muted-2 bg-sage rounded border border-line">
                ESC
              </kbd>
            </div>

            {/* Results List */}
            <div className="max-h-[380px] overflow-y-auto p-2 divide-y divide-line/40">
              {loading && searchDocs.length === 0 ? (
                <div className="py-12 text-center text-muted text-sm font-mono uppercase tracking-wider">
                  Loading index...
                </div>
              ) : results.length === 0 ? (
                <div className="py-12 text-center text-muted">
                  <p className="font-serif text-lg text-ink">No frameworks found</p>
                  <p className="text-xs font-mono uppercase tracking-wider mt-1 text-muted-2">
                    Try searching for another topic or keyword
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {results.map((item, idx) => {
                    const isSelected = idx === selectedIndex;
                    return (
                      <button
                        key={`${item.slug}-${item.headingId || "main"}-${idx}`}
                        type="button"
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`w-full text-left px-3.5 py-2.5 rounded-lg flex items-start justify-between gap-3 transition-colors duration-150 ${
                          isSelected
                            ? "bg-sage text-ink font-medium"
                            : "hover:bg-sage/50 text-ink-2"
                        }`}
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          {item.type === "framework" ? (
                            <BookOpen className="w-4 h-4 text-accent mt-1 shrink-0 stroke-[1.5]" />
                          ) : (
                            <Hash className="w-4 h-4 text-terracotta mt-1 shrink-0 stroke-[1.5]" />
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-muted px-1.5 py-0.5 rounded bg-bg/80 border border-line/60">
                                {item.category}
                              </span>
                              {item.type === "heading" && (
                                <span className="text-xs text-muted truncate">
                                  {item.title}
                                </span>
                              )}
                            </div>
                            <p className="font-serif text-base text-ink mt-0.5 truncate">
                              {item.type === "heading" ? item.headingText : item.title}
                            </p>
                            {item.description && item.type === "framework" && (
                              <p className="text-xs text-muted-2 line-clamp-1 mt-0.5 font-sans">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center text-muted shrink-0 mt-1">
                          {isSelected && (
                            <CornerDownLeft className="w-3.5 h-3.5 text-accent animate-pulse" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer hints */}
            <div className="px-4 py-2.5 bg-bg/80 border-t border-line flex items-center justify-between text-[11px] font-mono text-muted uppercase tracking-wider">
              <div className="flex items-center gap-3">
                <span>↑↓ Navigate</span>
                <span>↵ Open</span>
                <span>ESC Close</span>
              </div>
              <div>
                <span>{results.length} result{results.length !== 1 ? "s" : ""}</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
