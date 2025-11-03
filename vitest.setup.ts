import "@testing-library/jest-dom";
import { vi } from "vitest";

// Polyfill Next.js router for components that use it
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// JSDOM lacks some web APIs; patch what we need in tests

// navigator.clipboard for ShareButton
Object.defineProperty(global.navigator, "clipboard", {
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
    readText: vi.fn().mockResolvedValue(""),
  },
  configurable: true,
  writable: true,
});

// navigator.share for ShareButton
Object.defineProperty(global.navigator, "share", {
  value: vi.fn().mockResolvedValue(undefined),
  configurable: true,
  writable: true,
});

// HTMLMediaElement.play (in case any components use audio)
Object.defineProperty(global.window.HTMLMediaElement.prototype, "play", {
  value: vi.fn().mockResolvedValue(undefined),
  configurable: true,
});

// Smooth scroll
Object.defineProperty(global.window, "scrollTo", {
  value: vi.fn(),
  configurable: true,
});

// window.alert for error handling
Object.defineProperty(global.window, "alert", {
  value: vi.fn(),
  configurable: true,
  writable: true,
});

// localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, "localStorage", {
  value: localStorageMock,
  configurable: true,
});

// matchMedia for theme detection - Direct function assignment
// This MUST return a MediaQueryList-like object when called
(global.window as any).matchMedia = (query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
});

// Mock fetch by default; individual tests can override
if (!global.fetch) {
  global.fetch = vi.fn();
}
