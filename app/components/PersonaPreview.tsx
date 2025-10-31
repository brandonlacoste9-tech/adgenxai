type Persona = { name: string; tone: string; accent: string; avatar: string };

const PERSONAS: Persona[] = [
  { name: "Creator Core", tone: "Upbeat • Conversational", accent: "EN-US", avatar: "/avatar-aurora.svg" },
  { name: "Global Launch", tone: "Confident • Direct", accent: "EN-UK", avatar: "/avatar-gold.svg" },
  { name: "Gen Z Pulse", tone: "Playful • Quick-cut", accent: "EN-US", avatar: "/avatar-aurora.svg" },
];

export default function PersonaPreview() {
  return (
    <section id="personas" className="bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#071022]">Persona Engine</h2>
            <p className="mt-2 text-[#071022]/70 max-w-2xl">
              Snap to a reusable tone + style. Preview voice, captions, and reel pacing—then export everywhere.
            </p>
          </div>
          <a href="#create" className="hidden sm:inline-block rounded-xl bg-[#35E3FF] text-[#071022] font-semibold px-5 py-2.5 hover:bg-[#29c7e1] shadow-[0_6px_30px_rgba(53,227,255,.35)]">
            New Persona
          </a>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PERSONAS.map((p) => (
            <article key={p.name} className="rounded-2xl border border-black/10 bg-white p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3">
                <img src={p.avatar} alt="" className="h-10 w-10 rounded-full border border-black/10" />
                <div>
                  <div className="font-semibold text-[#071022]">{p.name}</div>
                  <div className="text-xs text-[#071022]/60">{p.tone} • {p.accent}</div>
                </div>
              </div>

              {/* timeline stub */}
              <div className="mt-4 rounded-xl border border-black/10 bg-[#F7FAFF] p-4">
                <div className="text-xs text-[#071022]/60 mb-2">Reel Timeline</div>
                <div className="h-2 w-full rounded bg-black/10">
                  <div className="h-2 w-2/3 rounded bg-[#7C4DFF]/40"></div>
                </div>
                <div className="mt-3 flex gap-2 text-xs text-[#071022]/70">
                  <span className="px-2 py-1 rounded-full bg-white border border-black/10">Captions</span>
                  <span className="px-2 py-1 rounded-full bg-white border border-black/10">Voice</span>
                  <span className="px-2 py-1 rounded-full bg-white border border-black/10">Beat sync</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                {["TikTok","Instagram","YouTube","X"].map((n) => (
                  <span key={n} className="text-xs rounded-lg border border-black/10 bg-white px-2.5 py-1">{n}</span>
                ))}
                <a href="#create" className="ml-auto text-sm rounded-lg bg-[#071022] text-white px-3 py-1.5 hover:opacity-90">Use</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
