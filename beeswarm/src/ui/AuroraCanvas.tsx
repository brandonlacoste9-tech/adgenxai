// AuroraCanvas.tsx
// Animated aurora background effect for BeeHive UI

import { useEffect, useRef } from 'react';

interface AuroraCanvasProps {
  className?: string;
}

export default function AuroraCanvas({ className = '' }: AuroraCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Aurora animation
    let frame = 0;
    const animate = () => {
      frame++;
      
      // Create gradient aurora effect
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, `rgba(252, 203, 0, ${0.05 + Math.sin(frame * 0.01) * 0.05})`); // auroraGold
      gradient.addColorStop(0.5, `rgba(46, 184, 255, ${0.05 + Math.cos(frame * 0.015) * 0.05})`); // plasmaBlue
      gradient.addColorStop(1, `rgba(252, 203, 0, ${0.05 + Math.sin(frame * 0.02) * 0.05})`); // auroraGold
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
    />
  );
}
