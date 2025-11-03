"use client";

import { useEffect, useState } from "react";

export default function ReduceMotionToggle() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    // initialize from prefers-reduced-motion or localStorage
    const stored = localStorage.getItem("adgenxai-reduce-motion");
    const prefers = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const value = stored === null ? prefers : stored === "1";
    setReduced(value);
    document.documentElement.dataset.reduceMotion = value ? "1" : "0";
  }, []);

  useEffect(() => {
    document.documentElement.dataset.reduceMotion = reduced ? "1" : "0";
    localStorage.setItem("adgenxai-reduce-motion", reduced ? "1" : "0");
  }, [reduced]);

  return (
    <button
      className="fixed right-4 bottom-24 z-40 rounded-xl border border-black/10 bg-white/90 backdrop-blur px-3 py-2 text-sm hover:shadow"
      onClick={() => setReduced((v) => !v)}
      aria-pressed={reduced}
      aria-label="Toggle reduced motion"
      title="Toggle reduced motion"
    >
      {reduced ? "Motion: Off" : "Motion: On"}
    </button>
  );
}
