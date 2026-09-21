"use client";

import React, { useEffect, useState } from "react";
import { Copy, Check, Download, Link2, Calendar, FileText, Clock, Layers } from "lucide-react";
import { FrameworkMetadata } from "@/lib/content";
import { formatDate, formatNumber } from "@/lib/utils";

interface MarkdownViewProps {
  framework: FrameworkMetadata;
  htmlContent: string;
}

export function MarkdownView({ framework, htmlContent }: MarkdownViewProps) {
  const [copiedMd, setCopiedMd] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Setup click listeners for copy buttons generated inside Shiki code blocks
  useEffect(() => {
    const handleCodeCopyClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest(".copy-code-btn");
      if (!target) return;

      const code = target.getAttribute("data-code");
      if (code) {
        navigator.clipboard.writeText(code).then(() => {
          const originalText = target.innerHTML;
          target.innerHTML = `<span class="text-accent flex items-center gap-1">✓ Copied</span>`;
          setTimeout(() => {
            target.innerHTML = originalText;
          }, 2000);
        });
      }
    };

    document.addEventListener("click", handleCodeCopyClick);
    return () => document.removeEventListener("click", handleCodeCopyClick);
  }, []);

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(framework.rawContent).then(() => {
      setCopiedMd(true);
      setTimeout(() => setCopiedMd(false), 2000);
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  const handleDownloadMd = () => {
    const blob = new Blob([framework.rawContent], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${framework.slug}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <article className="w-full min-w-0">
      {/* Header Section */}
      <div className="pb-8 mb-8 border-b border-line space-y-4">
        {/* Category & Tag Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-accent px-2.5 py-1 rounded bg-accent/10 border border-accent/20">
            {framework.category}
          </span>
          {framework.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] uppercase tracking-wider text-muted px-2 py-0.5 rounded bg-sage border border-line"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Serif Title */}
        <h1 className="font-serif text-[clamp(32px,4.5vw,56px)] text-ink leading-[1.1] font-normal tracking-tight">
          {framework.title}
        </h1>

        {/* Mono Meta Row */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-mono uppercase tracking-[0.08em] text-muted pt-1">
          <div className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-muted-2" />
            <span>{formatNumber(framework.lineCount)} lines</span>
          </div>
          <span>·</span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-muted-2" />
            <span>{framework.readingTime} min read</span>
          </div>
          <span>·</span>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-muted-2" />
            <span>Updated {formatDate(framework.updatedAt)}</span>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center gap-2.5 pt-4">
          <button
            type="button"
            onClick={handleCopyMarkdown}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-card border border-line hover:border-ink text-ink font-sans text-xs transition-colors cursor-pointer"
            aria-label="Copy entire markdown file"
          >
            {copiedMd ? (
              <>
                <Check className="w-3.5 h-3.5 text-accent" />
                <span className="text-accent font-medium">Copied Markdown</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-muted" />
                <span>Copy Markdown</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownloadMd}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-card border border-line hover:border-ink text-ink font-sans text-xs transition-colors cursor-pointer"
            aria-label="Download markdown file"
          >
            <Download className="w-3.5 h-3.5 text-muted" />
            <span>Download .md</span>
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-card border border-line hover:border-ink text-ink font-sans text-xs transition-colors cursor-pointer"
            aria-label="Copy share link"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-accent" />
                <span className="text-accent font-medium">Link Copied</span>
              </>
            ) : (
              <>
                <Link2 className="w-3.5 h-3.5 text-muted" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Frontmatter Info Card (Shown as structured UI, not raw YAML) */}
      {Object.keys(framework.frontmatter).length > 0 && (
        <div className="bg-sage/70 dark:bg-[#1E2726] border border-line rounded-lg p-5 mb-8 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted font-semibold">
              Framework Metadata
            </span>
          </div>
          {framework.frontmatter.name && (
            <p className="text-xs font-mono text-ink">
              <span className="text-muted uppercase">Slug identifier:</span> {framework.frontmatter.name}
            </p>
          )}
          {framework.frontmatter.description && (
            <p className="text-xs text-ink-2 font-sans leading-relaxed">
              <span className="font-semibold text-ink">Brief:</span> {framework.frontmatter.description}
            </p>
          )}
        </div>
      )}

      {/* Verbatim Rendered Markdown Body */}
      <div
        className="markdown-body max-w-[72ch] text-ink"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </article>
  );
}
