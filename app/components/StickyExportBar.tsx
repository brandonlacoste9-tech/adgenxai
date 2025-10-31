"use client";

const ICONS = ["TikTok","Instagram","YouTube","X"] as const;

export default function StickyExportBar() {
  return (
    <div
      role="region"
      aria-label="Export bar"
      className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4"
    >
      <div className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 px-3 py-2 shadow-[0_8px_40px_rgba(124,77,255,.12)]">
        {ICONS.map((n) => (
          <button
            key={n}
            className="group rounded-xl border border-black/10 bg-white px-3 py-2 text-sm hover:shadow-md"
            aria-label={`Export to ${n}`}
            title={`Export to ${n}  •  Press E`}
          >
            <span className="opacity-80">{n}</span>
          </button>
        ))}
        <span className="ml-1 hidden sm:inline text-xs text-black/50">Press <kbd className="rounded border px-1">E</kbd> to quick-export</span>
      </div>
    </div>
  );
}
