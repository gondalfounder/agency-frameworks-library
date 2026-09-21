import React from "react";
import Link from "next/link";
import { CircledArrow } from "@/components/ui/circled-arrow";

export default function NotFound() {
  return (
    <div className="max-w-[700px] mx-auto px-4 py-24 sm:py-32 text-center space-y-6">
      <div className="flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        <span className="font-mono text-xs uppercase tracking-[0.1em] text-muted">
          404 · Page Not Found
        </span>
      </div>

      <h1 className="font-serif text-5xl sm:text-6xl text-ink font-normal tracking-tight">
        Lost in the architecture
      </h1>

      <p className="text-sm text-muted font-sans max-w-md mx-auto leading-relaxed">
        The framework or resource you are looking for does not exist or has been moved in the library index.
      </p>

      <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-[2px] bg-accent text-white font-sans text-xs font-medium hover:opacity-90 transition-opacity"
        >
          Return to home
        </Link>
        <Link
          href="/frameworks"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[2px] bg-card border border-line hover:border-ink text-ink font-sans text-xs transition-colors"
        >
          <span>Browse directory</span>
          <CircledArrow size={14} />
        </Link>
      </div>
    </div>
  );
}
