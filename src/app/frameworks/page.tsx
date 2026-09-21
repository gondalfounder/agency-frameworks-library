import React from "react";
import type { Metadata } from "next";
import { getAllFrameworks, getAllCategories, getAllTags } from "@/lib/content";
import { LibraryView } from "@/components/library/library-view";

export const metadata: Metadata = {
  title: "Frameworks Library — Complete Repository",
  description: "Browse, filter, and search the entire collection of agency building, sales, pricing, and frontend engineering frameworks.",
};

export default function FrameworksPage() {
  const frameworks = getAllFrameworks();
  const categories = getAllCategories();
  const tags = getAllTags();

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
            Directory & Search
          </span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl text-ink font-normal tracking-tight">
          Frameworks Library
        </h1>
        <p className="text-muted text-sm font-sans max-w-2xl">
          Search and filter battle-tested frameworks across mindset, offer design, sales calls, operations, pricing models, and frontend standards.
        </p>
      </div>

      {/* Library Interactive Component */}
      <LibraryView
        frameworks={frameworks}
        categories={categories}
        tags={tags}
      />
    </div>
  );
}
