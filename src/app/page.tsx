import React from "react";
import Link from "next/link";
import { getAllFrameworks, getAllCategories, getStats } from "@/lib/content";
import { HeroSection } from "@/components/home/hero-section";
import { StatsBand } from "@/components/ui/stats-band";
import { FrameworkCard } from "@/components/ui/framework-card";
import { CtaTile } from "@/components/ui/cta-tile";
import { CategoryChips } from "@/components/ui/category-chips";
import { CircledArrow } from "@/components/ui/circled-arrow";
import { BookOpen, Layers, Terminal, Sparkles } from "lucide-react";

export default function HomePage() {
  const frameworks = getAllFrameworks();
  const categories = getAllCategories();
  const stats = getStats();

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16 py-4">
      {/* 1. Hero Section */}
      <HeroSection
        featuredSlug={frameworks[0]?.slug}
        featuredTitle={frameworks[0]?.title}
        featuredCategory={frameworks[0]?.category}
      />

      {/* 2. Dark Stats Band */}
      <StatsBand
        frameworkCount={stats.frameworkCount}
        categoryCount={stats.categoryCount}
        totalLines={stats.totalLines}
      />

      {/* 3. Sage Content Panel */}
      <section className="bg-sage/70 dark:bg-[#171F1E] rounded-panel p-6 sm:p-10 lg:p-12 border border-line space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
                Curated Frameworks
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-ink font-normal tracking-tight">
              Explore the Library
            </h2>
          </div>

          <Link
            href="/frameworks"
            className="group inline-flex items-center gap-2 text-xs font-sans font-medium text-ink hover:text-accent transition-colors self-start md:self-auto"
          >
            <span>View full directory ({frameworks.length})</span>
            <CircledArrow size={14} />
          </Link>
        </div>

        {/* Category Filter Chips */}
        <CategoryChips categories={categories} asLinks />

        {/* 3-Column Card Grid + CTA Tile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {frameworks.map((framework) => (
            <FrameworkCard key={framework.slug} framework={framework} />
          ))}
          {/* Last tile: CTA tile */}
          <CtaTile />
        </div>
      </section>

      {/* 4. Editorial Value Section */}
      <section className="py-8 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-line text-sm">
        <div className="space-y-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-accent">
            01 · Verbatim Integrity
          </span>
          <h3 className="font-serif text-xl text-ink">Zero LLM Paraphrasing</h3>
          <p className="text-muted leading-relaxed text-xs">
            Every framework is preserved word-by-word with 100% of the original author's nuance, scripts, pricing models, and operational structures intact.
          </p>
        </div>

        <div className="space-y-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-accent">
            02 · Zero-Config Growth
          </span>
          <h3 className="font-serif text-xl text-ink">Drop & Deploy</h3>
          <p className="text-muted leading-relaxed text-xs">
            Adding a new framework requires only dropping a Markdown file into <code className="bg-sage px-1 py-0.5 rounded text-[11px] font-mono">content/frameworks/</code>. No database or code changes needed.
          </p>
        </div>

        <div className="space-y-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-accent">
            03 · Fast Static Delivery
          </span>
          <h3 className="font-serif text-xl text-ink">Sub-second Readability</h3>
          <p className="text-muted leading-relaxed text-xs">
            Built as a static site (SSG) with lazy search indexing, content-visibility optimization, and zero layout shift on mobile and desktop.
          </p>
        </div>
      </section>
    </div>
  );
}
