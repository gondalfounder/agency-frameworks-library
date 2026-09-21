import React from "react";
import Link from "next/link";
import { CircledArrow } from "@/components/ui/circled-arrow";
import { Github, Twitter, Linkedin, BookOpen, Layers, Terminal } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-8">
      <div className="bg-[#171F1E] text-[#F1F2EE] rounded-panel p-8 sm:p-12 lg:p-16 border border-line/20">
        {/* Top Call to Action */}
        <div className="text-center max-w-xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#9AA09E]">
              Ready when you are
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#F1F2EE] font-normal tracking-tight">
            Add your next framework
          </h2>

          <p className="text-sm text-[#9AA09E] font-sans">
            Drop any Markdown document into the library. Automatic categorization, full verbatim preservation, and zero code updates.
          </p>

          <div className="pt-2 flex justify-center">
            <Link
              href="/about#add-framework"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-[2px] bg-accent text-white text-xs font-sans font-medium hover:opacity-90 transition-opacity"
            >
              <span>Learn how to contribute</span>
              <CircledArrow size={14} />
            </Link>
          </div>
        </div>

        {/* 3-Column Link Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-16 pb-12 border-b border-white/10 text-xs">
          {/* Col 1: Library */}
          <div className="space-y-3">
            <p className="font-mono uppercase tracking-[0.08em] text-accent text-[11px]">
              Library
            </p>
            <ul className="space-y-2 text-[#9AA09E]">
              <li>
                <Link href="/frameworks" className="hover:text-white transition-colors">
                  All Frameworks
                </Link>
              </li>
              <li>
                <Link href="/frameworks" className="hover:text-white transition-colors">
                  Browse by Tag
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Categories */}
          <div className="space-y-3">
            <p className="font-mono uppercase tracking-[0.08em] text-accent text-[11px]">
              Categories
            </p>
            <ul className="space-y-2 text-[#9AA09E]">
              <li>
                <Link href="/frameworks" className="hover:text-white transition-colors">
                  Explore Categories
                </Link>
              </li>
              <li>
                <Link href="/frameworks" className="hover:text-white transition-colors">
                  Framework Directory
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: About */}
          <div className="space-y-3">
            <p className="font-mono uppercase tracking-[0.08em] text-accent text-[11px]">
              About
            </p>
            <ul className="space-y-2 text-[#9AA09E]">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Library
                </Link>
              </li>
              <li>
                <Link href="/about#add-framework" className="hover:text-white transition-colors">
                  How to Add a Framework
                </Link>
              </li>
              <li>
                <span className="text-[#9AA09E]">Public Read-Only</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono uppercase tracking-[0.08em] text-[#7B8280]">
          <div>
            <span>© 2026 Agency Frameworks Library. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-white transition-colors cursor-pointer">
              Calm · Editorial · Verbatim
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
