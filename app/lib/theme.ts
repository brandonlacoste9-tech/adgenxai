// lib/theme.ts - Theme management utilities
export type Theme = "light" | "dark";

const THEME_KEY = "adgenxai-theme";

export function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  
  const stored = localStorage.getItem(THEME_KEY) as Theme | null;
  if (stored === "light" || stored === "dark") return stored;
  
  // Check system preference
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  
  return "light";
}

export function setTheme(theme: Theme): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
}

export function applyTheme(theme: Theme): void {
  if (typeof window === "undefined") return;
  
  const root = document.documentElement;
  
  if (theme === "dark") {
    root.style.setProperty("--bg", "#0a0a0a");
    root.style.setProperty("--text", "rgba(255,255,255,0.9)");
    root.style.setProperty("--card", "#1a1a1a");
    root.style.setProperty("--border", "rgba(255,255,255,0.1)");
  } else {
    root.style.setProperty("--bg", "#F7FAFF");
    root.style.setProperty("--text", "rgba(0,0,0,0.86)");
    root.style.setProperty("--card", "#ffffff");
    root.style.setProperty("--border", "rgba(0,0,0,0.08)");
  }
}
