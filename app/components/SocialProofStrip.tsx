export default function SocialProofStrip() {
  const brands = ["SOLAR", "NOVA", "ATLAS", "NEON", "PULSE"];
  return (
    <section aria-label="Trusted by" className="bg-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="text-center text-sm text-black/60 mb-4">Trusted by creators & micro-brands</div>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 opacity-70">
          {brands.map((b) => (
            <div key={b} className="font-semibold tracking-wide">{b}</div>
          ))}
        </div>
      </div>
    </section>
  );
}
