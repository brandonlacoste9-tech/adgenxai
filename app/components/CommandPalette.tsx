"use client";

import { useEffect } from "react";

type Item = { key: string; label: string; hint?: string; action: () => void };

export default function CommandPalette({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  const items: Item[] = [
    { key: "ad", label: "Create new Ad", hint: "A", action: () => location.assign("#create") },
    { key: "reel", label: "Start new Reel", hint: "R", action: () => location.assign("#reel") },
    { key: "persona", label: "Open Persona Engine", hint: "P", action: () => location.assign("#persona") },
    { key: "export", label: "Quick Export", hint: "E", action: () => document.getElementById("export-toast")?.dispatchEvent(new Event("click")) },
  ];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key.toLowerCase() === "k") { e.preventDefault(); onClose(); setTimeout(()=>document.getElementById("cmd-input")?.focus(),0); }
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-label="Command palette" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl border bg-white p-4" style={{borderColor:"var(--border)", background:"var(--card)", color:"var(--text)"}} onClick={(e)=>e.stopPropagation()}>
        <input id="cmd-input" placeholder="Type a command…" className="w-full rounded-lg border px-3 py-2 text-sm" style={{borderColor:"var(--border)", background:"var(--bg)", color:"var(--text)"}} />
        <ul className="mt-3 max-h-80 overflow-y-auto divide-y" style={{borderColor:"var(--border)"}}>
          {items.map((it)=>(
            <li key={it.key}>
              <button className="w-full text-left px-3 py-2 hover:opacity-90 flex items-center justify-between" onClick={it.action}>
                <span>{it.label}</span>
                {it.hint && <kbd className="rounded border px-1 text-xs" style={{borderColor:"var(--border)"}}>{it.hint}</kbd>}
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-2 text-xs opacity-70">Esc to close · Enter to run</div>
      </div>
    </div>
  );
}
