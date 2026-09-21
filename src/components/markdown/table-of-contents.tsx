"use client";

import React, { useEffect, useState } from "react";
import { List, X, ChevronRight } from "lucide-react";
import { HeadingItem } from "@/lib/content";

interface TableOfContentsProps {
  headings: HeadingItem[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Filter headings: include levels 1, 2, 3 (skip deep subheadings if too many)
  const displayHeadings = headings.filter((h) => h.level <= 3);

  // Scrollspy observer
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      {
        rootMargin: "-80px 0px -70% 0px",
        threshold: 0,
      }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setMobileDrawerOpen(false);
      window.history.replaceState(null, "", `#${id}`);
    }
  };

  if (displayHeadings.length === 0) return null;

  return (
    <>
      {/* Desktop Sticky TOC */}
      <aside className="hidden xl:block w-[220px] shrink-0 sticky top-24 self-start max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
        <div className="space-y-3 pb-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            On this page
          </p>

          <nav className="space-y-1 text-xs font-sans">
            {displayHeadings.map((h) => {
              const isActive = activeId === h.id;
              return (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => scrollToHeading(h.id)}
                  className={`block w-full text-left py-1 transition-colors duration-150 leading-snug cursor-pointer ${
                    h.level === 3 ? "pl-3 text-[11px]" : "pl-0 font-medium"
                  } ${
                    isActive
                      ? "text-accent font-semibold"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  <span className="line-clamp-2">{h.text}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile Floating TOC Trigger Button */}
      <div className="xl:hidden fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-ink text-bg font-sans text-xs font-medium shadow-lg border border-line cursor-pointer"
          aria-label="Open Table of Contents"
        >
          <List className="w-4 h-4" />
          <span>On this page ({displayHeadings.length})</span>
        </button>
      </div>

      {/* Mobile Bottom Sheet Drawer */}
      {mobileDrawerOpen && (
        <div className="xl:hidden fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileDrawerOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-lg bg-card rounded-t-2xl border-t border-line p-6 max-h-[80vh] overflow-y-auto z-10 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-line mb-4">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="font-mono text-xs uppercase tracking-[0.08em] text-ink font-semibold">
                  Table of Contents
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1 rounded text-muted hover:text-ink"
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="space-y-2 text-sm font-sans">
              {displayHeadings.map((h) => {
                const isActive = activeId === h.id;
                return (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => scrollToHeading(h.id)}
                    className={`block w-full text-left py-1.5 rounded px-2 transition-colors ${
                      h.level === 3 ? "pl-5 text-xs text-muted" : "font-medium"
                    } ${
                      isActive
                        ? "bg-sage text-accent font-semibold"
                        : "text-ink hover:bg-sage/40"
                    }`}
                  >
                    {h.text}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
