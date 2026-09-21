"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Sun, Moon, Menu, X, BookMarked, Plus } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { SearchPalette } from "@/components/search/search-palette";

export function TopBar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Global keyboard shortcuts: Cmd+K, Ctrl+K, or "/"
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput =
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement;

      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      } else if (e.key === "/" && !isInput) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/frameworks", label: "Library" },
    { href: "/about", label: "About" },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full h-16 border-b transition-colors duration-200 ${
          scrolled
            ? "bg-bg/95 backdrop-blur-sm border-line shadow-sm"
            : "bg-bg border-line"
        }`}
      >
        <div className="max-w-[1200px] mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-2 group text-ink hover:opacity-90 transition-opacity"
            >
              <div className="w-6 h-6 rounded bg-ink text-bg flex items-center justify-center font-serif text-sm">
                F
              </div>
              <span className="font-serif text-xl sm:text-2xl tracking-tight text-ink">
                Frameworks<span className="text-accent text-lg">.</span>
              </span>
            </Link>

            {/* Nav Links Desktop */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-sans transition-colors ${
                      isActive
                        ? "text-ink font-semibold"
                        : "text-muted hover:text-ink"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Center-Right: Search Field Trigger */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-line hover:border-ink text-muted hover:text-ink transition-colors text-xs font-sans group cursor-pointer"
              aria-label="Open search palette"
            >
              <Search className="w-3.5 h-3.5 stroke-[1.5]" />
              <span className="hidden sm:inline">Search library...</span>
              <kbd className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-muted-2 bg-sage rounded border border-line">
                /
              </kbd>
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded border border-line hover:border-ink text-muted hover:text-ink bg-card transition-colors cursor-pointer"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-accent stroke-[1.5]" />
              ) : (
                <Moon className="w-4 h-4 stroke-[1.5]" />
              )}
            </button>

            {/* Add Framework Button */}
            <Link
              href="/about#add-framework"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] bg-ink text-bg font-sans text-xs font-medium hover:bg-ink-2 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add framework</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2 rounded border border-line text-ink bg-card"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4 stroke-[1.5]" />
              ) : (
                <Menu className="w-4 h-4 stroke-[1.5]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-card border-b border-line px-4 py-4 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-150">
            <nav className="flex flex-col space-y-2">
              <Link
                href="/"
                className="text-sm py-1.5 font-sans text-ink hover:text-accent"
              >
                Home
              </Link>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm py-1.5 font-sans text-muted hover:text-ink"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/about#add-framework"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-[2px] bg-ink text-bg font-sans text-xs font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add new framework</span>
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Global Search Palette Modal */}
      <SearchPalette isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
