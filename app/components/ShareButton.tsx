"use client";

export default function ShareButton() {
  async function share() {
    const url = location.href;
    const title = "AdGenXAI — The Aurora Engine for Growth";
    const text = "Generate ads & reels, refine with personas, publish everywhere.";

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        toast("Shared!");
        return;
      } catch {}
    }
    try {
      await navigator.clipboard.writeText(url);
      toast("Link copied");
    } catch {
      toast("Copy failed");
    }
  }

  function toast(msg: string) {
    const el = document.getElementById("export-toast");
    if (!el) return alert(msg);
    el.textContent = msg;
    el.classList.remove("opacity-0","translate-y-3");
    el.classList.add("opacity-100","translate-y-0");
    setTimeout(() => {
      el?.classList.add("opacity-0","translate-y-3");
      el?.classList.remove("opacity-100","translate-y-0");
      el.textContent = "Export started…";
    }, 1200);
  }

  return (
    <button onClick={share} className="rounded-lg border px-3 py-1.5 text-sm"
      style={{background:"var(--card)", borderColor:"var(--border)", color:"var(--text)"}}
      aria-label="Share this page"
      title="Share">
      Share
    </button>
  );
}
