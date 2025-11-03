type Card = { title: string; blurb: string; icon?: string };

const CARDS: Card[] = [
  { title: "Ad Generator", blurb: "Turn prompts + personas into on-brand ads in seconds.", icon: "✦" },
  { title: "Reels Studio", blurb: "Storyboard, captions, and voice—export-ready.", icon: "▶" },
  { title: "Persona Engine", blurb: "Reusable tones, styles, and audiences.", icon: "👤" },
  { title: "Broadcast", blurb: "One-click publish to TikTok, IG, YouTube, X.", icon: "⤴" },
];

export default function FeatureRail() {
  return (
    <section id="features" className="relative bg-[#F7FAFF]">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-[#071022]">Create. Remix. Broadcast.</h2>
          <p className="mt-2 text-[#071022]/70 max-w-2xl">
            Built for modern creators—fast, friendly, and production-ready.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border border-black/10 bg-white p-5 hover:shadow-lg transition-shadow
                         shadow-[0_6px_30px_rgba(124,77,255,.08)]"
            >
              <div className="text-[#35E3FF] text-xl">{c.icon ?? "✦"}</div>
              <div className="mt-1 font-semibold text-[#071022]">{c.title}</div>
              <div className="mt-1 text-sm text-[#071022]/70">{c.blurb}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
