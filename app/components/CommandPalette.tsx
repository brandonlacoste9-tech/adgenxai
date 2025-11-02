"use client";

import { useEffect, useState } from "react";

type Item = { key: string; label: string; hint?: string; action: () => void; category?: string; icon?: string };

export default function CommandPalette({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  const [searchQuery, setSearchQuery] = useState("");

  const items: Item[] = [
    { key: "ad", label: "Create new Ad", hint: "A", icon: "✦", category: "Create", action: () => location.assign("#create") },
    { key: "reel", label: "Start new Reel", hint: "R", icon: "▶", category: "Create", action: () => location.assign("#reel") },
    { key: "persona", label: "Open Persona Engine", hint: "P", icon: "👤", category: "Tools", action: () => location.assign("#persona") },
    { key: "export", label: "Quick Export", hint: "E", icon: "⤴", category: "Actions", action: () => document.getElementById("export-toast")?.dispatchEvent(new Event("click")) },
    { key: "dashboard", label: "Go to Dashboard", hint: "D", icon: "📊", category: "Navigation", action: () => location.assign("/dashboard") },
  ];

  // Simple fuzzy search implementation
  const filteredItems = items.filter((item) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const label = item.label.toLowerCase();
    const category = (item.category || "").toLowerCase();
    return label.includes(query) || category.includes(query) || item.key.includes(query);
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key.toLowerCase() === "k") { 
        e.preventDefault(); 
        if (!open) {
          onClose(); 
        }
        setTimeout(()=>document.getElementById("cmd-input")?.focus(),0); 
      }
      if (e.key === "Escape") {
        setSearchQuery("");
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, open]);

  // Reset search when palette closes
  useEffect(() => {
    if (!open) {
      setSearchQuery("");
    }
  }, [open]);

  if (!open) return null;
  
  // Group items by category
  const categories = Array.from(new Set(filteredItems.map(item => item.category || "Other")));
  
  return (
    <div 
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-sm" 
      role="dialog" 
      aria-modal="true" 
      aria-label="Command palette - Search and execute commands" 
      onClick={onClose}
    >
      <div className="w-full max-w-lg rounded-2xl border bg-white p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200" style={{borderColor:"var(--border)", background:"var(--card)", color:"var(--text)"}} onClick={(e)=>e.stopPropagation()}>
        <input 
          id="cmd-input" 
          placeholder="Type a command or search…" 
          className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-[#35E3FF]/30 focus:border-[#35E3FF] transition-all" 
          style={{borderColor:"var(--border)", background:"var(--bg)", color:"var(--text)"}}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search commands by name or category"
          autoFocus
        />
        <div className="mt-3 max-h-80 overflow-y-auto">
          {categories.map((category) => {
            const categoryItems = filteredItems.filter(item => (item.category || "Other") === category);
            if (categoryItems.length === 0) return null;
            
            return (
              <div key={category}>
                <div className="px-3 py-1 text-xs font-semibold opacity-60 uppercase tracking-wider">{category}</div>
                <ul className="divide-y" style={{borderColor:"var(--border)"}}>
                  {categoryItems.map((it)=>(
                    <li key={it.key}>
                      <button 
                        className="w-full text-left px-3 py-2 hover:bg-[#35E3FF]/5 transition-colors flex items-center justify-between group" 
                        onClick={() => { it.action(); onClose(); }}
                      >
                        <span className="flex items-center gap-2">
                          {it.icon && <span className="text-base">{it.icon}</span>}
                          <span>{it.label}</span>
                        </span>
                        {it.hint && <kbd className="rounded border px-2 py-0.5 text-xs font-mono opacity-60 group-hover:opacity-100 transition-opacity" style={{borderColor:"var(--border)"}}>{it.hint}</kbd>}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
          {filteredItems.length === 0 && (
            <div className="text-center py-8 text-sm opacity-60">
              No commands found for "{searchQuery}"
            </div>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between text-xs opacity-70">
          <span>Esc to close · Enter to run</span>
          <span className="hidden sm:inline">⌘K to toggle</span>
        </div>
      </div>
    </div>
  );
}
