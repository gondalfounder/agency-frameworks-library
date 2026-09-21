import React from "react";
import { cn } from "@/lib/utils";

interface CircledArrowProps {
  className?: string;
  size?: number;
}

export function CircledArrow({ className, size = 16 }: CircledArrowProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full border border-current transition-transform duration-200 group-hover:translate-x-1 shrink-0",
        className
      )}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        width={size * 0.6}
        height={size * 0.6}
        viewBox="0 0 10 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="stroke-current"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M1.5 5H8.5" />
        <path d="M5.5 2L8.5 5L5.5 8" />
      </svg>
    </span>
  );
}
