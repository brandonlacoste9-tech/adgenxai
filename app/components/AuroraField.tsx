"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export default function AuroraField() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [1, 0.8, 0.4]);
  const [mouse, setMouse] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const move = (e: MouseEvent) =>
      setMouse({ x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <motion.div
      style={{ y, opacity }}
      className="fixed inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      <svg width="100%" height="100%" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="aurora" cx={`${mouse.x}%`} cy={`${mouse.y}%`} r="60%">
            <stop offset="0%" stopColor="#35E3FF" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#7C4DFF" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#FFD76A" stopOpacity="0.15" />
          </radialGradient>
        </defs>
        <rect width="800" height="600" fill="url(#aurora)" />
      </svg>
    </motion.div>
  );
}
