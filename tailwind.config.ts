import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-primary": "var(--bg-primary)",
        "bg-secondary": "var(--bg-secondary)",
        "bg-dark": "var(--bg-dark)",
        "bg-dark-2": "var(--bg-dark-2)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-inverse": "var(--text-inverse)",
        "text-muted": "var(--text-muted)",
        accent: "var(--accent)",
        "accent-hover": "var(--accent-hover)",
        "accent-subtle": "var(--accent-subtle)",
        "border-light": "var(--border-light)",
        "border-medium": "var(--border-medium)",
        "border-dark": "var(--border-dark)",
        // Backwards compatibility aliases
        bg: "var(--bg-primary)",
        sage: "var(--bg-secondary)",
        card: "var(--bg-primary)",
        ink: "var(--text-primary)",
        "ink-2": "var(--text-secondary)",
        line: "var(--border-light)",
        muted: "var(--text-secondary)",
        "muted-2": "var(--text-muted)",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "JetBrains Mono", "ui-monospace", "monospace"],
      },
      borderRadius: {
        card: "4px",
        panel: "16px",
      },
      maxWidth: {
        "72ch": "72ch",
        container: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
