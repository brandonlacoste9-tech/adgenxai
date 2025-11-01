"use client";

import { useEffect, useState } from "react";

export default function HotkeysOverlay() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "?") { setOpen((v) => !v); }
      if (e.key.toLowerCase() === "e") {
        // pretend-export feedback
        const el = document.getElementById("export-toast");
        if (el) {
          el.classList.remove("opacity-0","translate-y-3");
          el.classList.add("opacity-100","translate-y-0");
          setTimeout(() => {
            el?.classList.add("opacity-0","translate-y-3");
            el?.classList.remove("opacity-100","translate-y-0");
          }, 1200);
        }
      }
      if (e.key === "/") {
        const search = document.querySelector<HTMLInputElement>('input[type="search"], input[role="searchbox"]');
        search?.focus();
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* transient toast */}
      <div
        id="export-toast"
        className="pointer-events-none fixed left-1/2 top-6 z-50 -translate-x-1/2 transform rounded-xl border border-black/10 bg-white/90 px-3 py-1.5 text-sm opacity-0 transition-all duration-200 translate-y-3"
        aria-hidden
      >
        Export started…
      </div>

      {/* help sheet */}
      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Keyboard shortcuts"
          onClick={() => setOpen(false)}
        >
          <div className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-5" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 text-lg font-semibold">Keyboard shortcuts</div>
            <ul className="space-y-2 text-sm text-black/80">
              <li><kbd className="rounded border px-1">E</kbd> — Quick export</li>
              <li><kbd className="rounded border px-1">/</kbd> — Focus search</li>
              <li><kbd className="rounded border px-1">?</kbd> — Toggle this help</li>
            </ul>
            <div className="mt-4 text-right">
              <button className="rounded-lg border border-black/10 bg-white px-3 py-1.5 text-sm" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
