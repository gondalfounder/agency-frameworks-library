"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { CircledArrow } from "@/components/ui/circled-arrow";

interface HeroSectionProps {
  featuredSlug?: string;
  featuredTitle?: string;
  featuredCategory?: string;
}

export function HeroSection({
  featuredSlug,
  featuredTitle,
  featuredCategory,
}: HeroSectionProps) {
  const shouldReduce = useReducedMotion();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: shouldReduce ? { opacity: 0 } : { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="relative pt-6 sm:pt-10 pb-12 sm:pb-16">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center"
      >
        {/* Left Column: Value Prop */}
        <div className="lg:col-span-7 space-y-6">
          <motion.div variants={itemVariants} className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
              Agency Frameworks Library · 2026 Edition
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="font-serif italic text-[clamp(40px,5.5vw,72px)] text-ink dark:text-white leading-[1.08] tracking-tight font-normal"
          >
            We curate the systems that power{" "}
            <span className="font-serif italic font-normal text-accent">
              agency growth.
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-base text-muted max-w-[54ch] leading-relaxed font-sans"
          >
            A curated, open-access repository of battle-tested engineering, pricing, sales, and design frameworks for founders building high-margin digital agencies.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <Link
              href="/frameworks"
              className="inline-flex items-center justify-center px-6 py-3 rounded-[2px] bg-accent text-white font-sans text-xs font-medium hover:opacity-90 transition-opacity"
            >
              Explore all frameworks
            </Link>

            <Link
              href="/about"
              className="group inline-flex items-center gap-2 text-xs font-sans font-medium text-ink hover:text-accent transition-colors py-2 px-1"
            >
              <span>How it works</span>
              <CircledArrow size={15} />
            </Link>
          </motion.div>
        </div>

        {/* Right Column: Featured Preview Card */}
        <motion.div variants={itemVariants} className="lg:col-span-5">
          <div className="relative bg-card p-6 sm:p-8 rounded-card border border-line shadow-sm hover:border-ink transition-colors duration-200">
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-accent px-2 py-0.5 rounded bg-accent/10">
                {featuredSlug ? "Featured System" : "Framework Engine"}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
                {featuredSlug ? "Start Here" : "2-Step Setup"}
              </span>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-muted-2">
                {featuredCategory || "Documentation Library"}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-ink leading-tight font-normal">
                {featuredTitle || "Add Your First Framework"}
              </h3>
              <p className="font-sans text-xs sm:text-sm text-muted line-clamp-3 leading-relaxed">
                {featuredSlug
                  ? "Read the complete, unsummarized operational framework with full verbatim fidelity."
                  : "Drop any Markdown document into content/frameworks/ to automatically publish and index it."}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-line/60 flex items-center justify-between">
              <Link
                href={featuredSlug ? `/frameworks/${featuredSlug}` : "/about#add-framework"}
                className="group inline-flex items-center gap-2 text-xs font-sans font-medium text-ink hover:text-accent transition-colors"
              >
                <span>{featuredSlug ? "Read framework" : "Add framework guide"}</span>
                <CircledArrow size={14} />
              </Link>
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
                Verbatim 100%
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Under Hero: Tech & Tools Strip */}
      <div className="pt-12 sm:pt-16 border-b border-line pb-8">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted-2 mb-4 text-center sm:text-left">
          Covering Frameworks & Technologies
        </p>
        <div className="flex flex-wrap items-center justify-between gap-6 text-xs font-mono uppercase tracking-wider text-muted grayscale opacity-75">
          <span>Next.js 15</span>
          <span>Motion / Framer</span>
          <span>Tailwind CSS</span>
          <span>GoHighLevel</span>
          <span>Voice AI (Retell/Vapi)</span>
          <span>Shiki Highlighting</span>
          <span>Claude & LLMs</span>
          <span>Make / Supabase</span>
        </div>
      </div>
    </section>
  );
}
