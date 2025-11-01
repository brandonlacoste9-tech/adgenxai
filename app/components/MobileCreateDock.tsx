"use client";

export default function MobileCreateDock() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 gap-2 p-3 md:hidden"
      role="navigation" aria-label="Quick create">
      <button className="rounded-xl py-2 text-sm font-medium shadow border" style={{background:"var(--card)", borderColor:"var(--border)"}} onClick={()=>location.assign("#create")}>Create</button>
      <button className="rounded-xl py-2 text-sm font-medium shadow border" style={{background:"var(--card)", borderColor:"var(--border)"}} onClick={()=>location.assign("#reel")}>Reel</button>
      <button className="rounded-xl py-2 text-sm font-medium shadow border" style={{background:"var(--card)", borderColor:"var(--border)"}} onClick={()=>location.assign("#export")}>Export</button>
    </nav>
  );
}
