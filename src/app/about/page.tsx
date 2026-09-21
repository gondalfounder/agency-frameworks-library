import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { CircledArrow } from "@/components/ui/circled-arrow";
import { BookOpen, Layers, Sparkles, Terminal, FileCode, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "About the Library & Contributing — Agency Frameworks",
  description: "Learn about the Agency Frameworks Library, architectural principles, and the 2-step process to add new framework documents.",
};

export default function AboutPage() {
  return (
    <div className="max-w-[880px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="space-y-4 border-b border-line pb-8">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
            Architecture & Principles
          </span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl text-ink font-normal tracking-tight">
          About Agency Frameworks
        </h1>

        <p className="text-base text-muted font-sans leading-relaxed">
          An open-access, static documentation dashboard purpose-built for agency founders, engineers, and designers. We curate and preserve high-leverage frameworks with 100% verbatim fidelity.
        </p>
      </div>

      {/* Core Principles */}
      <section className="space-y-6">
        <h2 className="font-serif text-2xl text-ink">Core Design Principles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-card p-6 rounded-card border border-line space-y-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-accent">
              01 · Verbatim Integrity
            </span>
            <h3 className="font-serif text-xl text-ink">100% Exact Text</h3>
            <p className="text-xs text-muted leading-relaxed font-sans">
              No AI summaries, no rewrites, no paraphrasing. The exact language, scripts, formulas, and objections from source material are rendered without loss.
            </p>
          </div>

          <div className="bg-card p-6 rounded-card border border-line space-y-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-accent">
              02 · Editorial Aesthetic
            </span>
            <h3 className="font-serif text-xl text-ink">Anti-Slop Craft</h3>
            <p className="text-xs text-muted leading-relaxed font-sans">
              Built with Instrument Serif, Geist, hairline dividers, warm-neutral sage panels, and a singular terracotta-orange accent. Zero generic AI-purple glow.
            </p>
          </div>

          <div className="bg-card p-6 rounded-card border border-line space-y-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-accent">
              03 · Static Speed
            </span>
            <h3 className="font-serif text-xl text-ink">Static SSG Generation</h3>
            <p className="text-xs text-muted leading-relaxed font-sans">
              Every route is statically pre-rendered at build time. Search index is generated ahead-of-time and loaded lazily on demand.
            </p>
          </div>

          <div className="bg-card p-6 rounded-card border border-line space-y-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-accent">
              04 · Scalable Markdown
            </span>
            <h3 className="font-serif text-xl text-ink">Zero Code Additions</h3>
            <p className="text-xs text-muted leading-relaxed font-sans">
              Dropping a new file into the repository automatically registers it across the navigation sidebar, home grid, search palette, and sitemap.
            </p>
          </div>
        </div>
      </section>

      {/* How to Add a Framework Section */}
      <section id="add-framework" className="bg-sage/70 dark:bg-[#171F1E] p-8 rounded-panel border border-line space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
              Guide
            </span>
          </div>
          <h2 className="font-serif text-3xl text-ink">How to Add a New Framework in 2 Steps</h2>
          <p className="text-xs text-muted font-sans">
            Follow this simple workflow to add any new markdown framework or skill document:
          </p>
        </div>

        <div className="space-y-4 text-xs font-sans">
          {/* Step 1 */}
          <div className="bg-card p-5 rounded-card border border-line space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-ink text-bg flex items-center justify-center font-mono text-[11px] font-bold">
                1
              </span>
              <span className="font-serif text-lg text-ink font-semibold">
                Drop your Markdown file into <code className="font-mono text-[11px] bg-sage px-1.5 py-0.5 rounded">content/frameworks/</code>
              </span>
            </div>
            <p className="text-muted leading-relaxed">
              Place your <code className="font-mono text-[11px]">.md</code> or <code className="font-mono text-[11px]">.mdx</code> file directly into <code className="font-mono text-[11px]">content/frameworks/</code> (or in a categorized subfolder like <code className="font-mono text-[11px]">content/frameworks/your-category/SKILL.md</code>).
            </p>
            <div className="bg-[#171F1E] text-[#F1F2EE] p-4 rounded font-mono text-[11px] space-y-1">
              <p className="text-muted-2">---</p>
              <p className="text-accent">name: my-new-framework</p>
              <p className="text-[#9AA09E]">description: High-converting framework for digital agencies.</p>
              <p className="text-[#9AA09E]">category: Sales & Operations</p>
              <p className="text-[#9AA09E]">tags: [Sales, B2B, Closing]</p>
              <p className="text-muted-2">---</p>
              <p className="text-white mt-2"># My New Framework Title</p>
              <p className="text-muted-2">Your complete unsummarized framework content goes here...</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-card p-5 rounded-card border border-line space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-ink text-bg flex items-center justify-center font-mono text-[11px] font-bold">
                2
              </span>
              <span className="font-serif text-lg text-ink font-semibold">
                Run the build or redeploy
              </span>
            </div>
            <p className="text-muted leading-relaxed">
              Execute <code className="font-mono text-[11px] bg-sage px-1.5 py-0.5 rounded">npm run build</code> (or <code className="font-mono text-[11px] bg-sage px-1.5 py-0.5 rounded">npm run dev</code> for local development).
            </p>
            <div className="bg-[#171F1E] text-[#F1F2EE] p-3 rounded font-mono text-[11px]">
              <span className="text-accent">$</span> npm run build
            </div>
            <p className="text-muted leading-relaxed">
              The automated build pipeline will index the new file, generate slug routes, create the search index, make raw markdown downloadable, and update the sitemap.
            </p>
          </div>
        </div>
      </section>

      {/* Deployment & Tech Stack Info */}
      <section className="space-y-4 pt-4 border-t border-line text-xs font-sans">
        <h2 className="font-serif text-2xl text-ink">Deployment on Vercel</h2>
        <p className="text-muted leading-relaxed">
          This project is ready for instant zero-configuration deployment on Vercel or any static web host:
        </p>
        <ol className="list-decimal pl-5 space-y-2 text-muted">
          <li>Push your repository to GitHub or GitLab.</li>
          <li>Import the repository on <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-accent underline">Vercel</a>.</li>
          <li>Framework Preset: <strong>Next.js</strong> (Build command: <code className="font-mono bg-sage px-1 py-0.5 rounded text-[11px]">npm run build</code>).</li>
          <li>Click <strong>Deploy</strong>.</li>
        </ol>
      </section>
    </div>
  );
}
