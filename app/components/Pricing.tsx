type Plan = { name: string; price: string; blurb: string; cta: string; popular?: boolean; features: string[]; savings?: string };

const PLANS: Plan[] = [
  { 
    name: "Starter", 
    price: "$9/mo", 
    blurb: "Perfect for getting started", 
    cta: "Start Free", 
    features: ["50 renders/mo", "2 personas", "Basic templates", "Community support"] 
  },
  { 
    name: "Creator", 
    price: "$19/mo", 
    blurb: "For daily content creators", 
    cta: "Most Popular", 
    popular: true, 
    savings: "Save $10/mo vs old pricing",
    features: ["500 renders/mo", "10 personas", "HD exports", "Priority queue", "Advanced templates", "Email support"] 
  },
  { 
    name: "Studio", 
    price: "$49/mo", 
    blurb: "For teams & agencies", 
    cta: "Best Value", 
    savings: "Save $50/mo vs old pricing",
    features: ["2,000 renders/mo", "Unlimited personas", "4K exports", "Team collaboration", "Brand kits", "API access", "Priority support"] 
  },
  {
    name: "Enterprise",
    price: "Custom",
    blurb: "For large organizations",
    cta: "Contact Sales",
    features: ["Unlimited renders", "White-label option", "Custom integrations", "SAML/SSO", "SLA guarantee", "Dedicated support"]
  }
];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-[#F7FAFF]">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#071022]">Simple, creator-friendly pricing</h2>
          <p className="mt-2 text-[#071022]/70">Monthly or yearly. Cancel anytime.</p>
          <div className="mt-4 inline-block bg-[#35E3FF]/10 text-[#071022] px-4 py-2 rounded-full text-sm font-medium">
            🎉 New lower pricing! Save up to $600/year
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((p) => (
            <article
              key={p.name}
              className={
                "rounded-2xl border border-black/10 bg-white p-6 hover:shadow-lg transition-all duration-300 " +
                (p.popular ? "shadow-[0_15px_50px_rgba(124,77,255,.15)] relative ring-2 ring-[#7C4DFF]/40 scale-105" : "")
              }
            >
              {p.popular && (
                <div className="absolute -top-3 left-6 rounded-full bg-gradient-to-r from-[#7C4DFF] to-[#35E3FF] text-white text-xs px-3 py-1 shadow-lg font-semibold">
                  Most Popular
                </div>
              )}
              
              <div className="font-semibold text-[#071022] text-lg">{p.name}</div>
              <div className="mt-2 text-3xl font-extrabold text-[#071022]">{p.price}</div>
              <div className="text-sm text-[#071022]/70 mt-1">{p.blurb}</div>
              
              {p.savings && (
                <div className="mt-2 text-xs bg-[#FFD76A]/20 text-[#071022] px-2 py-1 rounded-md font-medium">
                  {p.savings}
                </div>
              )}

              <ul className="mt-6 space-y-3 text-sm text-[#071022]/80 min-h-[200px]">
                {p.features.map(f => (
                  <li key={f} className="flex gap-3 items-start">
                    <span className="text-[#35E3FF] mt-0.5 flex-shrink-0">✦</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              
              <a
                href={p.name === "Enterprise" ? "#contact" : "#checkout"}
                className={
                  "mt-6 w-full inline-block text-center rounded-xl px-4 py-3 font-semibold transition-all duration-200 " + 
                  (p.popular 
                    ? "bg-gradient-to-r from-[#7C4DFF] to-[#35E3FF] text-white hover:shadow-lg transform hover:scale-[1.02]" 
                    : "border border-black/10 bg-white hover:bg-[#F7FAFF] hover:border-[#7C4DFF]/30"
                  )
                }
              >
                {p.cta}
              </a>
              
              {p.name !== "Enterprise" && (
                <div className="mt-3 text-[11px] text-[#071022]/50 text-center">
                  No setup fees • Cancel anytime
                </div>
              )}
            </article>
          ))}
        </div>

        {/* Cost comparison section */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-black/5">
            <h3 className="text-lg font-semibold text-[#071022] mb-4">💰 How much can you save?</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#071022]">$600+</div>
                <div className="text-[#071022]/70">Annual savings vs competitors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#071022]">50%</div>
                <div className="text-[#071022]/70">Lower cost per render</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#071022]">0%</div>
                <div className="text-[#071022]/70">Platform fees or commissions</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}