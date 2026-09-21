import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getAllFrameworks, getFrameworkBySlug } from "@/lib/content";
import { renderMarkdownToHtml } from "@/lib/markdown";
import { MarkdownView } from "@/components/markdown/markdown-view";
import { TableOfContents } from "@/components/markdown/table-of-contents";
import { ReaderSidebar } from "@/components/markdown/reader-sidebar";
import { CircledArrow } from "@/components/ui/circled-arrow";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FrameworkReaderPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const frameworks = getAllFrameworks();
  return frameworks.map((f) => ({
    slug: f.slug,
  }));
}

export async function generateMetadata({
  params,
}: FrameworkReaderPageProps): Promise<Metadata> {
  const { slug } = await params;
  const framework = getFrameworkBySlug(slug);

  if (!framework) {
    return {
      title: "Framework Not Found — Agency Frameworks Library",
    };
  }

  return {
    title: `${framework.title} — Agency Frameworks Library`,
    description: framework.description || `Complete reference documentation for ${framework.title}.`,
    openGraph: {
      title: `${framework.title} — Agency Frameworks Library`,
      description: framework.description,
      type: "article",
    },
  };
}

export default async function FrameworkReaderPage({
  params,
}: FrameworkReaderPageProps) {
  const { slug } = await params;
  const framework = getFrameworkBySlug(slug);

  if (!framework) {
    notFound();
  }

  const allFrameworks = getAllFrameworks();
  const currentIndex = allFrameworks.findIndex((f) => f.slug === slug);
  const prevFramework = currentIndex > 0 ? allFrameworks[currentIndex - 1] : null;
  const nextFramework =
    currentIndex < allFrameworks.length - 1 ? allFrameworks[currentIndex + 1] : null;

  // Server-rendered verbatim markdown HTML with Shiki syntax highlighting
  const htmlContent = await renderMarkdownToHtml(framework.rawContent);

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* 3-Zone Layout: Left Sidebar, Center Markdown, Right TOC */}
      <div className="flex flex-col lg:flex-row gap-8 xl:gap-12 items-start">
        {/* Left Sidebar */}
        <ReaderSidebar
          frameworks={allFrameworks}
          currentSlug={framework.slug}
        />

        {/* Center Main Reader */}
        <div className="flex-1 min-w-0 max-w-full lg:max-w-[760px] mx-auto">
          <MarkdownView framework={framework} htmlContent={htmlContent} />

          {/* Prev / Next Pagination Links */}
          <nav
            aria-label="Framework pagination"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-12 mt-16 border-t border-line"
          >
            {prevFramework ? (
              <Link
                href={`/frameworks/${prevFramework.slug}`}
                className="group flex flex-col p-4 rounded-lg border border-line hover:border-ink bg-card transition-colors space-y-1"
              >
                <span className="font-mono text-[10.5px] uppercase tracking-wider text-muted flex items-center gap-1">
                  <ChevronLeft className="w-3.5 h-3.5" /> Previous
                </span>
                <span className="font-serif text-lg text-ink group-hover:text-accent transition-colors line-clamp-1">
                  {prevFramework.title}
                </span>
              </Link>
            ) : (
              <div />
            )}

            {nextFramework && (
              <Link
                href={`/frameworks/${nextFramework.slug}`}
                className="group flex flex-col sm:items-end p-4 rounded-lg border border-line hover:border-ink bg-card transition-colors space-y-1 text-left sm:text-right"
              >
                <span className="font-mono text-[10.5px] uppercase tracking-wider text-muted flex items-center gap-1">
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </span>
                <span className="font-serif text-lg text-ink group-hover:text-accent transition-colors line-clamp-1">
                  {nextFramework.title}
                </span>
              </Link>
            )}
          </nav>
        </div>

        {/* Right Sticky TOC */}
        <TableOfContents headings={framework.headings} />
      </div>
    </div>
  );
}
