"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FrameworkMetadata } from "@/lib/content";
import { ChevronDown, ChevronRight, Menu, X, BookOpen } from "lucide-react";

interface ReaderSidebarProps {
  frameworks: FrameworkMetadata[];
  currentSlug: string;
}

export function ReaderSidebar({ frameworks, currentSlug }: ReaderSidebarProps) {
  const pathname = usePathname();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Group frameworks by category
  const grouped = frameworks.reduce<Record<string, FrameworkMetadata[]>>((acc, f) => {
    const cat = f.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(f);
    return acc;
  }, {});

  const categories = Object.keys(grouped);

  const sidebarContent = (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-line">
        <Link
          href="/frameworks"
          className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted hover:text-ink transition-colors flex items-center gap-1.5"
        >
          <span>← Back to library</span>
        </Link>
      </div>

      {categories.map((category) => (
        <div key={category} className="space-y-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-accent flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            {category}
          </p>

          <ul className="space-y-1">
            {grouped[category].map((f) => {
              const isActive = f.slug === currentSlug;
              return (
                <li key={f.slug}>
                  <Link
                    href={`/frameworks/${f.slug}`}
                    onClick={() => setMobileDrawerOpen(false)}
                    className={`block text-xs font-sans py-1.5 px-2.5 rounded transition-all duration-150 leading-snug ${
                      isActive
                        ? "bg-sage text-ink font-semibold border-l-2 border-accent"
                        : "text-muted hover:text-ink hover:bg-sage/40"
                    }`}
                  >
                    <span className="line-clamp-2">{f.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-[260px] shrink-0 sticky top-24 self-start max-h-[calc(100vh-8rem)] overflow-y-auto pr-4 border-r border-line">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Trigger Bar */}
      <div className="lg:hidden w-full mb-6 pb-4 border-b border-line flex items-center justify-between">
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(true)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded bg-card border border-line text-xs font-sans text-ink cursor-pointer"
        >
          <BookOpen className="w-4 h-4 text-accent" />
          <span>All Frameworks ({frameworks.length})</span>
        </button>

        <Link
          href="/frameworks"
          className="text-xs font-mono uppercase tracking-wider text-muted hover:text-ink"
        >
          ← Library
        </Link>
      </div>

      {/* Mobile Drawer */}
      {mobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileDrawerOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-4/5 max-w-sm bg-card h-full p-6 overflow-y-auto z-10 shadow-2xl border-r border-line animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-line mb-6">
              <span className="font-serif text-lg text-ink font-normal">
                Frameworks Index
              </span>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1 rounded text-muted hover:text-ink"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
