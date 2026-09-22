"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Plus, ArrowRight } from "lucide-react";

export function CtaTile() {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      whileHover={shouldReduce ? {} : { y: -2 }}
      transition={{ duration: 0.15 }}
      className="h-full"
    >
      <Link
        href="/upload"
        className="group relative flex flex-col justify-between h-full bg-accent text-white p-6 rounded-card border border-accent overflow-hidden min-h-[240px] shadow-sm hover:bg-accent-hover transition-colors duration-200"
      >
        {/* Background Decorative SVG */}
        <div className="absolute -right-8 -top-8 w-40 h-40 pointer-events-none opacity-20">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full stroke-white">
            <circle cx="50" cy="50" r="45" strokeWidth="2" strokeDasharray="3 3" />
            <circle cx="50" cy="50" r="30" strokeWidth="2" />
            <circle cx="50" cy="50" r="15" strokeWidth="2" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 space-y-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mb-3">
            <Plus className="w-4 h-4 text-white" />
          </div>
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-white/80 block">
            Contribute
          </span>
          <h3 className="font-serif text-2xl text-white font-medium leading-snug">
            Want to add a framework?
          </h3>
          <p className="text-white/80 text-xs font-sans leading-relaxed">
            Drop a Markdown document into the library. Automatic categorization and zero code updates.
          </p>
        </div>

        {/* Bottom Link */}
        <div className="relative z-10 pt-4 border-t border-white/20 flex items-center justify-between text-xs font-sans font-medium text-white">
          <span>Read the 2-step guide</span>
          <span className="inline-block transition-transform duration-150 group-hover:translate-x-1">
            →
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
