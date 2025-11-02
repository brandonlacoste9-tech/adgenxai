export type Theme = "light" | "dark";

const STORAGE_KEY = "adgenxai:theme";

function isTheme(value: string | null): value is Theme {
  return value === "light" || value === "dark";
}

export function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (isTheme(stored)) {
    return stored;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function setTheme(theme: Theme): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, theme);
  applyTheme(theme);
}

export function applyTheme(theme: Theme): void {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}
