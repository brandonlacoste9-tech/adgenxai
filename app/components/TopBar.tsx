"use client";

import { useEffect, useState } from "react";
import { getInitialTheme, setTheme, applyTheme, Theme } from "@/lib/theme";

export default function TopBar({
  onOpenPalette,
  paletteOpen = false,
}: {
  onOpenPalette: () => void;
  paletteOpen?: boolean;
}) {
  const [theme, setLocalTheme] = useState<Theme>("light");

  useEffect(() => {
    const t = getInitialTheme();
    setLocalTheme(t);
    applyTheme(t);
  }, []);

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    setLocalTheme(next);
    setTheme(next);
  }

  const themeLabel = theme === "light" ? "Light" : "Dark";

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-xl transition-all duration-300 ${paletteOpen ? "opacity-80 saturate-[0.75]" : ""}`}
      style={{
        borderColor: "var(--border)",
        background: "color-mix(in oklab, var(--bg) 82%, transparent)",
        boxShadow: paletteOpen ? "0 20px 40px rgba(7,16,34,0.15)" : "0 10px 30px rgba(7,16,34,0.08)",
      }}
      data-palette-open={paletteOpen ? "true" : undefined}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 font-semibold" aria-label="AdGenXAI home">
          <span className="inline-block h-6 w-6 rounded-full shadow-[0_0_24px_rgba(124,77,255,.4)]" style={{background:"radial-gradient(60% 60% at 50% 50%, #35E3FF 0%, #7C4DFF 50%, #FFD76A 100%)"}}/>
          <span>AdGenXAI</span>
        </a>

        <div className={`flex items-center gap-2 transition-opacity ${paletteOpen ? "opacity-70" : ""}`}>
          <input
            type="search"
            role="searchbox"
            placeholder="Search…  (⌘K)"
            className="hidden md:block w-64 rounded-lg border px-3 py-1.5 text-sm"
            style={{background:"var(--card)", borderColor:"var(--border)", color:"var(--text)"}}
            onFocus={(e)=>e.currentTarget.select()}
            onKeyDown={(e)=>{ if(e.key==="Enter") onOpenPalette(); }}
          />
          <a
            href="/dashboard"
            className="rounded-lg border px-3 py-1.5 text-sm hover:opacity-70 transition"
            style={{background:"var(--card)", borderColor:"var(--border)", color:"var(--text)"}}
            title="Creator Dashboard"
          >📊 Dashboard</a>
          <button
            className="rounded-lg border px-3 py-1.5 text-sm"
            style={{background:"var(--card)", borderColor:"var(--border)", color:"var(--text)"}}
            onClick={onOpenPalette}
            aria-label="Open command palette"
            title="Open palette (⌘K)"
          >⌘K</button>
          <button
            className="flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm transition-colors"
            style={{background:"var(--card)", borderColor:"var(--border)", color:"var(--text)"}}
            onClick={toggleTheme}
            aria-label={`Toggle theme (currently ${themeLabel})`}
            title="Toggle theme"
          >
            <span aria-hidden>{theme === "light" ? "☀️" : "🌙"}</span>
            <span className="text-xs font-medium tracking-wide">{themeLabel}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
