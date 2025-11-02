"use client";

import { useEffect, useRef, useState } from "react";

type Card = { title: string; blurb: string; icon?: string };

const CARDS: Card[] = [
  { title: "Ad Generator", blurb: "Turn prompts + personas into on-brand ads in seconds.", icon: "✦" },
  { title: "Reels Studio", blurb: "Storyboard, captions, and voice—export-ready.", icon: "▶" },
  { title: "Persona Engine", blurb: "Reusable tones, styles, and audiences.", icon: "👤" },
  { title: "Broadcast", blurb: "One-click publish to TikTok, IG, YouTube, X.", icon: "⤴" },
];

export default function FeatureRail() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section id="features" className="relative bg-[#F7FAFF]" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-[#071022]">Create. Remix. Broadcast.</h2>
          <p className="mt-2 text-[#071022]/70 max-w-2xl">
            Built for modern creators—fast, friendly, and production-ready.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((c, idx) => (
            <div
              key={c.title}
              className={`rounded-2xl border border-black/10 bg-white p-5 
                         hover:shadow-xl hover:scale-105 hover:-translate-y-1
                         transition-all duration-300 cursor-pointer
                         shadow-[0_6px_30px_rgba(124,77,255,.08)]
                         ${isVisible ? 'animate-in fade-in slide-in-from-bottom-4' : 'opacity-0'}`}
              style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'forwards' }}
              tabIndex={0}
              role="article"
              aria-label={`${c.title} - ${c.blurb}`}
            >
              <div className="text-[#35E3FF] text-3xl mb-2 transition-transform group-hover:scale-110">
                {c.icon ?? "✦"}
              </div>
              <div className="mt-1 font-semibold text-[#071022] text-lg">{c.title}</div>
              <div className="mt-1 text-sm text-[#071022]/70 leading-relaxed">{c.blurb}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
