import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getAllCategories, getFrameworksByCategory, getAllFrameworks } from "@/lib/content";
import { FrameworkCard } from "@/components/ui/framework-card";
import { CategoryChips } from "@/components/ui/category-chips";
import { CircledArrow } from "@/components/ui/circled-arrow";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((c) => ({
    category: c.slug,
  }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const categories = getAllCategories();
  const catObj = categories.find((c) => c.slug === category);

  const title = catObj ? catObj.category : "Category";

  return {
    title: `${title} Frameworks — Agency Frameworks Library`,
    description: `Browse all frameworks in the ${title} collection.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const categories = getAllCategories();
  const catObj = categories.find((c) => c.slug === category);

  if (!catObj) {
    notFound();
  }

  const frameworks = getFrameworksByCategory(category);

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Link
            href="/frameworks"
            className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted hover:text-ink"
          >
            ← All Categories
          </Link>
          <span className="text-muted text-xs">/</span>
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-accent">
            {catObj.category}
          </span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl text-ink font-normal tracking-tight">
          {catObj.category}
        </h1>

        <p className="text-muted text-sm font-sans max-w-2xl">
          Showing {frameworks.length} curated framework{frameworks.length !== 1 ? "s" : ""} in this collection.
        </p>
      </div>

      {/* Category Filter Chips */}
      <CategoryChips
        categories={categories}
        activeCategory={catObj.slug}
        asLinks
      />

      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {frameworks.map((framework) => (
          <FrameworkCard key={framework.slug} framework={framework} />
        ))}
      </div>
    </div>
  );
}
