import React from "react";
import Link from "next/link";
import { FrameworkManager } from "@/components/admin/framework-manager";
import { Plus, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Framework Manager | Agency Frameworks",
  description: "Manage, audit, and delete operational frameworks from the GitHub repository.",
};

export default function AdminManagePage() {
  return (
    <div className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-border-light pb-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-secondary font-medium">
              Admin Registry & Operations
            </span>
          </div>

          <h1 className="font-serif italic text-4xl sm:text-5xl text-text-primary tracking-tight font-normal">
            Manage Frameworks
          </h1>

          <p className="text-sm sm:text-base text-text-secondary font-sans leading-relaxed max-w-2xl">
            Review all registered frameworks grouped by category. Deleting frameworks or categories
            automatically executes the Git Auto-Sync Protocol to remove documents from GitHub.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[2px] bg-accent text-white font-sans text-xs font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New</span>
          </Link>
        </div>
      </div>

      {/* Main Framework Manager */}
      <FrameworkManager />
    </div>
  );
}
