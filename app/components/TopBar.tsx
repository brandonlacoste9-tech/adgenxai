"use client";

import { useEffect, useState } from "react";
import { getInitialTheme, setTheme, applyTheme, Theme } from "@/lib/theme";

export default function TopBar({
  onOpenPalette,
}: {
  onOpenPalette: () => void;
}) {
  const [theme, setLocalTheme] = useState<Theme>("light");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const t = getInitialTheme();
    setLocalTheme(t);
    applyTheme(t);
  }, []);

  function toggleTheme() {
    setIsAnimating(true);
    const next = theme === "light" ? "dark" : "light";
    setLocalTheme(next);
    setTheme(next);
    setTimeout(() => setIsAnimating(false), 300);
  }

  return (
    <header className="sticky top-0 z-40 border-b backdrop-blur-sm" style={{borderColor:"var(--border)", background:"color-mix(in oklab, var(--bg) 85%, transparent)"}}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 font-semibold group" aria-label="AdGenXAI home - Navigate to homepage">
          <span className="inline-block h-6 w-6 rounded-full shadow-[0_0_24px_rgba(124,77,255,.4)] group-hover:shadow-[0_0_30px_rgba(124,77,255,.6)] transition-shadow duration-300" style={{background:"radial-gradient(60% 60% at 50% 50%, #35E3FF 0%, #7C4DFF 50%, #FFD76A 100%)"}}/>
          <span>AdGenXAI</span>
        </a>

        <div className="flex items-center gap-2">
          <input
            type="search"
            role="searchbox"
            aria-label="Search for commands and features. Press Enter or Command+K to open command palette"
            placeholder="Search…  (⌘K)"
            className="hidden md:block w-64 rounded-lg border px-3 py-1.5 text-sm focus:ring-2 focus:ring-[#35E3FF]/30 focus:border-[#35E3FF] transition-all"
            style={{background:"var(--card)", borderColor:"var(--border)", color:"var(--text)"}}
            onFocus={(e)=>e.currentTarget.select()}
            onKeyDown={(e)=>{ if(e.key==="Enter") onOpenPalette(); }}
          />
          <a
            href="/dashboard"
            className="rounded-lg border px-3 py-1.5 text-sm hover:opacity-70 hover:shadow-md transition-all"
            style={{background:"var(--card)", borderColor:"var(--border)", color:"var(--text)"}}
            aria-label="Navigate to Creator Dashboard"
            title="Creator Dashboard"
          >📊 <span className="hidden sm:inline">Dashboard</span></a>
          <button
            className="rounded-lg border px-3 py-1.5 text-sm hover:shadow-md transition-all active:scale-95"
            style={{background:"var(--card)", borderColor:"var(--border)", color:"var(--text)"}}
            onClick={onOpenPalette}
            aria-label="Open command palette - Keyboard shortcut: Command+K or Control+K"
            title="Open palette (⌘K)"
          >⌘K</button>
          <button
            className={`rounded-lg border px-3 py-1.5 text-sm hover:shadow-md transition-all active:scale-95 ${isAnimating ? 'animate-spin' : ''}`}
            style={{background:"var(--card)", borderColor:"var(--border)", color:"var(--text)"}}
            onClick={toggleTheme}
            aria-label={`Toggle theme. Current theme: ${theme}. Click to switch to ${theme === "light" ? "dark" : "light"} mode`}
            aria-pressed={theme === "dark"}
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >{theme === "light" ? "☀️" : "🌙"}</button>
        </div>
      </div>
    </header>
  );
}
