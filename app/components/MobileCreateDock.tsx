"use client";

import { useState } from "react";

export default function MobileCreateDock() {
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const buttons = [
    { id: "create", label: "Create", icon: "✦", href: "#create" },
    { id: "reel", label: "Reel", icon: "▶", href: "#reel" },
    { id: "export", label: "Export", icon: "⤴", href: "#export" },
  ];

  return (
    <nav 
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 gap-2 p-3 md:hidden
                 bg-white/80 backdrop-blur-md border-t"
      role="navigation" 
      aria-label="Quick create navigation"
      style={{borderColor:"var(--border)"}}
    >
      {buttons.map((btn) => (
        <button 
          key={btn.id}
          className={`rounded-xl py-3 text-sm font-medium shadow-sm border 
                     flex flex-col items-center gap-1
                     active:scale-95 active:shadow-lg
                     transition-all duration-200
                     ${activeButton === btn.id ? 'bg-[#35E3FF]/20 border-[#35E3FF]' : ''}`}
          style={{
            background: activeButton === btn.id ? undefined : "var(--card)", 
            borderColor: activeButton === btn.id ? undefined : "var(--border)"
          }}
          onClick={() => location.assign(btn.href)}
          onTouchStart={() => setActiveButton(btn.id)}
          onTouchEnd={() => setActiveButton(null)}
          onMouseDown={() => setActiveButton(btn.id)}
          onMouseUp={() => setActiveButton(null)}
          onMouseLeave={() => setActiveButton(null)}
          aria-label={btn.label}
        >
          <span className="text-lg">{btn.icon}</span>
          <span>{btn.label}</span>
        </button>
      ))}
    </nav>
  );
}
