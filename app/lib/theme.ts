export type Theme = "light" | "dark";

const STORAGE_KEY = "adgenxai-theme";
const MEDIA_QUERY = "(prefers-color-scheme: dark)";

function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

export function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isTheme(stored)) {
      return stored;
    }
  } catch {
    // Ignore storage access issues (private mode, etc.) and fallback to system preference
  }

  try {
    if (window.matchMedia(MEDIA_QUERY).matches) {
      return "dark";
    }
  } catch {
    // matchMedia can throw in older browsers; fall back to light theme
  }

  return "light";
}

export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

export function setTheme(theme: Theme) {
  if (typeof window === "undefined") {
    return;
  }

  applyTheme(theme);

  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Ignore storage write failures (e.g. private browsing)
  }
}
