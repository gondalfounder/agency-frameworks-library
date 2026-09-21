"use client";

import React from "react";
import Link from "next/link";

interface CategoryChipsProps {
  categories: { category: string; count: number; slug: string }[];
  activeCategory?: string;
  onSelect?: (slug: string) => void;
  asLinks?: boolean;
}

export function CategoryChips({
  categories,
  activeCategory = "all",
  onSelect,
  asLinks = false,
}: CategoryChipsProps) {
  const allItems = [
    { category: "All Frameworks", count: categories.reduce((a, c) => a + c.count, 0), slug: "all" },
    ...categories,
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2">
      {allItems.map((item) => {
        const isActive = activeCategory === item.slug || (activeCategory === "all" && item.slug === "all");

        if (asLinks) {
          const href = item.slug === "all" ? "/frameworks" : `/categories/${item.slug}`;
          return (
            <Link
              key={item.slug}
              href={href}
              className={`px-4 py-2 rounded-full text-xs font-sans transition-all duration-150 border whitespace-nowrap ${
                isActive
                  ? "bg-ink text-bg border-ink font-medium shadow-sm"
                  : "bg-card text-muted hover:text-ink border-line hover:border-ink"
              }`}
            >
              {item.category}
              <span className="ml-1.5 opacity-60 text-[10px] font-mono">
                ({item.count})
              </span>
            </Link>
          );
        }

        return (
          <button
            key={item.slug}
            type="button"
            onClick={() => onSelect?.(item.slug)}
            className={`px-4 py-2 rounded-full text-xs font-sans transition-all duration-150 border whitespace-nowrap cursor-pointer ${
              isActive
                ? "bg-ink text-bg border-ink font-medium shadow-sm"
                : "bg-card text-muted hover:text-ink border-line hover:border-ink"
            }`}
          >
            {item.category}
            <span className="ml-1.5 opacity-60 text-[10px] font-mono">
              ({item.count})
            </span>
          </button>
        );
      })}
    </div>
  );
}
