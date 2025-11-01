type Plan = { name: string; price: string; blurb: string; cta: string; popular?: boolean; features: string[] };

const PLANS: Plan[] = [
  { name: "Starter", price: "$9/mo", blurb: "For getting started", cta: "Start Free", features: ["100 renders/mo", "3 personas", "Watermarked exports"] },
  { name: "Creator", price: "$29/mo", blurb: "For daily creators", cta: "Upgrade", popular: true, features: ["1,000 renders/mo", "20 personas", "No watermark", "Priority queue"] },
  { name: "Studio", price: "$99/mo", blurb: "For small teams", cta: "Contact Sales", features: ["Unlimited renders*", "Unlimited personas", "Brand kits", "SAML/SSO"] },
];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-[#F7FAFF]">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="mb-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#071022]">Simple, creator-friendly pricing</h2>
          <p className="mt-2 text-[#071022]/70">Monthly or yearly. Cancel anytime.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {PLANS.map((p) => (
            <article
              key={p.name}
              className={
                "rounded-2xl border border-black/10 bg-white p-6 hover:shadow-lg transition-shadow " +
                (p.popular ? "shadow-[0_10px_40px_rgba(124,77,255,.12)] relative ring-2 ring-[#7C4DFF]/30" : "")
              }
            >
              {p.popular && (
                <div className="absolute -top-3 left-6 rounded-full bg-[#7C4DFF] text-white text-xs px-2 py-1 shadow">Most Popular</div>
              )}
              <div className="font-semibold text-[#071022]">{p.name}</div>
              <div className="mt-1 text-3xl font-extrabold text-[#071022]">{p.price}</div>
              <div className="text-sm text-[#071022]/70">{p.blurb}</div>
              <ul className="mt-4 space-y-1 text-sm text-[#071022]/80">
                {p.features.map(f => (
                  <li key={f} className="flex gap-2"><span className="text-[#35E3FF]">✦</span><span>{f}</span></li>
                ))}
              </ul>
              <a
                href="#checkout"
                className={"mt-5 inline-block rounded-xl px-4 py-2 font-semibold " + (p.popular ? "bg-[#071022] text-white" : "border border-black/10 bg-white")}
              >
                {p.cta}
              </a>
              <div className="mt-3 text-[11px] text-[#071022]/50">*Fair use policy applies.</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
