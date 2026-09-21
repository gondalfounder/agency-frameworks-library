"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { CircledArrow } from "@/components/ui/circled-arrow";
import { FrameworkMetadata } from "@/lib/frameworks";
import { ArrowRight, BookOpen, Layers, Terminal, Sparkles, Code2, Users, DollarSign, Compass } from "lucide-react";

interface FrameworkCardProps {
  framework: FrameworkMetadata;
}

function getFrameworkIcon(slug: string, icon?: string) {
  if (icon) {
    return <span className="text-xl">{icon}</span>;
  }
  if (slug.includes("mindset")) return <Compass className="w-5 h-5 text-accent" />;
  if (slug.includes("offer")) return <Layers className="w-5 h-5 text-accent" />;
  if (slug.includes("pricing")) return <DollarSign className="w-5 h-5 text-accent" />;
  if (slug.includes("brand")) return <Sparkles className="w-5 h-5 text-accent" />;
  if (slug.includes("client") || slug.includes("acquisition")) return <Users className="w-5 h-5 text-accent" />;
  if (slug.includes("sales")) return <BookOpen className="w-5 h-5 text-accent" />;
  if (slug.includes("operations")) return <Terminal className="w-5 h-5 text-accent" />;
  if (slug.includes("team")) return <Users className="w-5 h-5 text-accent" />;
  if (slug.includes("motion")) return <Sparkles className="w-5 h-5 text-accent" />;
  if (slug.includes("taste") || slug.includes("frontend")) return <Code2 className="w-5 h-5 text-accent" />;
  return <BookOpen className="w-5 h-5 text-accent" />;
}

export function FrameworkCard({ framework }: FrameworkCardProps) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      whileHover={shouldReduce ? {} : { y: -2 }}
      transition={{ duration: 0.15 }}
      className="h-full"
    >
      <Link
        href={`/frameworks/${framework.slug}`}
        className="group relative flex flex-col justify-between h-full bg-bg-primary p-6 rounded-card border border-border-light hover:border-border-medium hover:shadow-md transition-all duration-200 min-h-[240px]"
      >
        <div>
          {/* Header row: Icon & Category */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-bg-secondary flex items-center justify-center">
                {getFrameworkIcon(framework.slug, framework.icon)}
              </div>
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-secondary">
                {framework.category}
              </span>
            </div>
            {framework.difficulty && (
              <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted px-2 py-0.5 rounded bg-bg-secondary border border-border-light">
                {framework.difficulty}
              </span>
            )}
          </div>

          {/* Framework Title (Serif) */}
          <h3 className="font-serif text-2xl text-text-primary leading-snug group-hover:text-accent transition-colors font-medium">
            {framework.title}
          </h3>

          {/* Tagline / Description */}
          <p className="font-sans text-[13px] text-text-secondary line-clamp-3 mt-2.5 leading-relaxed">
            {framework.tagline || framework.description}
          </p>

          {/* Tag Pills */}
          {framework.tags && framework.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4">
              {framework.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[10px] uppercase tracking-wider text-text-muted px-2 py-0.5 rounded bg-bg-secondary/70 border border-border-light/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Action Row: Explore -> */}
        <div className="flex items-center justify-between pt-5 mt-4 border-t border-border-light text-text-primary">
          <span className="inline-flex items-center gap-1.5 text-xs font-sans font-medium group-hover:text-accent transition-colors">
            <span>Explore</span>
            <span className="inline-block transition-transform duration-150 group-hover:translate-x-1">
              →
            </span>
          </span>
          <span className="font-mono text-[11px] uppercase tracking-wider text-text-muted">
            {framework.readingTime} min read
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
