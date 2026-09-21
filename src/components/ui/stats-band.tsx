"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { formatNumber } from "@/lib/utils";

interface StatsBandProps {
  frameworkCount: number;
  categoryCount: number;
  totalLines: number;
}

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const shouldReduce = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(shouldReduce ? value : 0);

  useEffect(() => {
    if (shouldReduce) {
      setDisplayValue(value);
      return;
    }

    if (isInView) {
      let startTime: number | null = null;
      const duration = 1200; // ms

      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        // Easing: easeOutExpo
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        setDisplayValue(Math.floor(easeProgress * value));

        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setDisplayValue(value);
        }
      };

      window.requestAnimationFrame(step);
    }
  }, [isInView, value, shouldReduce]);

  return (
    <span ref={ref} className="font-serif font-normal">
      {formatNumber(displayValue)}
      {suffix}
    </span>
  );
}

export function StatsBand({ frameworkCount, categoryCount, totalLines }: StatsBandProps) {
  return (
    <div className="w-full bg-[#171F1E] text-[#F1F2EE] rounded-panel p-8 sm:p-10 lg:p-12 relative overflow-hidden border-t-2 border-accent shadow-sm">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-16">
        {/* Left: Serif Statement */}
        <div className="max-w-md">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#9AA09E]">
              Operational Intelligence
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#F1F2EE] leading-snug font-normal">
            The complete operational playbook for modern digital agencies.
          </h2>
        </div>

        {/* Right: 3 Big Serif Numbers */}
        <div className="grid grid-cols-3 gap-6 sm:gap-12 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-white/10">
          <div>
            <div className="text-3xl sm:text-4xl lg:text-5xl text-accent">
              <AnimatedNumber value={frameworkCount} />
            </div>
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#9AA09E] mt-1">
              Frameworks
            </p>
          </div>

          <div>
            <div className="text-3xl sm:text-4xl lg:text-5xl text-[#F1F2EE]">
              <AnimatedNumber value={categoryCount} />
            </div>
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#9AA09E] mt-1">
              Categories
            </p>
          </div>

          <div>
            <div className="text-3xl sm:text-4xl lg:text-5xl text-[#F1F2EE]">
              <AnimatedNumber value={totalLines} suffix="+" />
            </div>
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#9AA09E] mt-1">
              Total Lines
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
