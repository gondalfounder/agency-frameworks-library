"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { FrameworkMetadata } from "@/lib/content";
import { FrameworkCard } from "@/components/ui/framework-card";
import { CircledArrow } from "@/components/ui/circled-arrow";
import { Search, LayoutGrid, List, SlidersHorizontal, ArrowUpDown, Clock, FileText, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface LibraryViewProps {
  frameworks: FrameworkMetadata[];
  categories: { category: string; count: number; slug: string }[];
  tags: { tag: string; count: number }[];
}

export function LibraryView({ frameworks, categories, tags }: LibraryViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");
  const [sortBy, setSortBy] = useState<"default" | "az" | "recent" | "longest">("default");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filtering and sorting
  const filtered = useMemo(() => {
    return frameworks
      .filter((f) => {
        // Category filter
        if (selectedCategory !== "all") {
          const catSlug = f.category.toLowerCase().replace(/\s+/g, "-");
          if (catSlug !== selectedCategory && f.category.toLowerCase() !== selectedCategory.toLowerCase()) {
            return false;
          }
        }

        // Tag filter
        if (selectedTag !== "all") {
          if (!f.tags?.includes(selectedTag)) return false;
        }

        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = f.title.toLowerCase().includes(q);
          const matchDesc = f.description.toLowerCase().includes(q);
          const matchTags = f.tags?.some((t) => t.toLowerCase().includes(q));
          const matchCategory = f.category.toLowerCase().includes(q);
          const matchHeadings = f.headings?.some((h) => h.text.toLowerCase().includes(q));
          if (!matchTitle && !matchDesc && !matchTags && !matchCategory && !matchHeadings) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "az") {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === "recent") {
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }
        if (sortBy === "longest") {
          return b.lineCount - a.lineCount;
        }
        return 0; // Default order
      });
  }, [frameworks, searchQuery, selectedCategory, selectedTag, sortBy]);

  return (
    <div className="space-y-8">
      {/* Top Filter Controls */}
      <div className="bg-card p-6 rounded-card border border-line space-y-5">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[1.5]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by title, topic, keyword or script..."
            className="w-full bg-bg/60 border border-line focus:border-ink rounded-lg pl-10 pr-4 py-2.5 text-sm font-sans text-ink placeholder:text-muted-2 outline-none transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="space-y-2">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-muted-2 block">
            Category
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-sans transition-colors border cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-ink text-bg border-ink font-medium"
                  : "bg-bg text-muted hover:text-ink border-line"
              }`}
            >
              All Categories ({frameworks.length})
            </button>
            {categories.map((c) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => setSelectedCategory(c.slug)}
                className={`px-3 py-1.5 rounded-full text-xs font-sans transition-colors border cursor-pointer ${
                  selectedCategory === c.slug
                    ? "bg-ink text-bg border-ink font-medium"
                    : "bg-bg text-muted hover:text-ink border-line"
                }`}
              >
                {c.category} ({c.count})
              </button>
            ))}
          </div>
        </div>

        {/* Tags Row */}
        {tags.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-line/50">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-muted-2 block">
              Popular Tags
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedTag("all")}
                className={`px-2.5 py-1 rounded text-[11px] font-mono uppercase tracking-wider transition-colors border cursor-pointer ${
                  selectedTag === "all"
                    ? "bg-ink text-bg border-ink font-semibold"
                    : "bg-sage/70 text-muted hover:text-ink border-line"
                }`}
              >
                All tags
              </button>
              {tags.slice(0, 10).map((t) => (
                <button
                  key={t.tag}
                  type="button"
                  onClick={() => setSelectedTag(selectedTag === t.tag ? "all" : t.tag)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono uppercase tracking-wider transition-colors border cursor-pointer ${
                    selectedTag === t.tag
                      ? "bg-ink text-bg border-ink font-semibold"
                      : "bg-sage/70 text-muted hover:text-ink border-line"
                  }`}
                >
                  {t.tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sort and View Mode Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-line text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono text-muted uppercase tracking-wider text-[11px]">
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-bg border border-line rounded px-2.5 py-1 text-xs text-ink font-sans outline-none focus:border-ink cursor-pointer"
            >
              <option value="default">Default Order</option>
              <option value="az">A to Z</option>
              <option value="recent">Recently Updated</option>
              <option value="longest">Longest (Line Count)</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-muted uppercase tracking-wider text-[11px]">
              Showing {filtered.length} of {frameworks.length}
            </span>
            <div className="flex items-center rounded border border-line overflow-hidden bg-bg">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 transition-colors cursor-pointer ${
                  viewMode === "grid" ? "bg-ink text-bg" : "text-muted hover:text-ink"
                }`}
                aria-label="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-1.5 transition-colors cursor-pointer ${
                  viewMode === "list" ? "bg-ink text-bg" : "text-muted hover:text-ink"
                }`}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results View */}
      {filtered.length === 0 ? (
        <div className="bg-card p-12 text-center rounded-card border border-line space-y-2">
          <p className="font-serif text-2xl text-ink">No frameworks match your filters</p>
          <p className="text-xs font-mono uppercase tracking-wider text-muted">
            Try resetting your filters or search query
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setSelectedTag("all");
            }}
            className="mt-4 px-4 py-2 bg-ink text-bg text-xs font-sans rounded-[2px]"
          >
            Clear all filters
          </button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((framework) => (
            <FrameworkCard key={framework.slug} framework={framework} />
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-card rounded-card border border-line divide-y divide-line overflow-hidden">
          {filtered.map((framework) => (
            <Link
              key={framework.slug}
              href={`/frameworks/${framework.slug}`}
              className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 hover:bg-sage/40 transition-colors gap-4"
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
                    {framework.category}
                  </span>
                </div>
                <h3 className="font-serif text-2xl text-ink group-hover:text-accent transition-colors">
                  {framework.title}
                </h3>
                <p className="text-xs text-muted-2 line-clamp-2 font-sans">
                  {framework.description}
                </p>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 text-xs font-mono uppercase tracking-wider text-muted shrink-0">
                <span>{framework.readingTime} min read</span>
                <span className="text-[11px]">{framework.lineCount} lines</span>
                <div className="flex items-center gap-1 text-ink group-hover:text-accent font-sans font-medium text-xs pt-1">
                  <span>Read</span>
                  <CircledArrow size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
