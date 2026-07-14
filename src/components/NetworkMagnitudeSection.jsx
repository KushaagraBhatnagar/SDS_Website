import React, { useEffect, useRef } from 'react';
import { useInView, animate, motion } from 'framer-motion';
import Reveal from './Reveal';

const STATS_DATA = [
  { target: 175, label: "Active Members", code: "CLUSTER_SIZE", suffix: "✦" },
  { target: 35, label: "Projects Shipped", code: "SHIPPED_MODELS", suffix: "✦" },
  { target: 14, label: "Events Conducted", code: "SYNCHRONIZATIONS", suffix: "✦" },
  { target: 7, label: "Years of Engineering", code: "UPTIME_HISTORY", suffix: "✦" }
];

function StatCounter({ stat }) {
  const spanRef = useRef(null);
  const inView = useInView(spanRef, { once: true, margin: "-10%" });

  useEffect(() => {
    if (inView && spanRef.current) {
      const node = spanRef.current;
      const controls = animate(0, stat.target, {
        duration: 2.2,
        ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier easing
        onUpdate(value) {
          node.textContent = Math.floor(value).toString();
        },
      });
      return () => controls.stop();
    }
  }, [stat.target, inView]);

  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-[#0A0F1D]/25 border border-white/5 backdrop-blur-md text-center w-full min-h-[180px] shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:border-white/10 transition-colors select-none group relative">
      {/* Subtle border trail overlay */}
      <div className="absolute inset-0 rounded-2xl border border-glow-blue/5 group-hover:border-glow-blue/15 transition-colors pointer-events-none" />

      <span className="font-mono text-[8px] text-white/20 tracking-[0.25em] font-medium uppercase mb-4 group-hover:text-white/40 transition-colors font-mono-tech">
        {stat.code}
      </span>
      
      <div className="text-4xl sm:text-6xl font-black text-white tracking-tight flex items-center justify-center">
        <span ref={spanRef} className="font-mono bg-clip-text bg-gradient-to-r from-white to-white/70">0</span>
        <span className="text-[#FF7A00] drop-shadow-[0_0_10px_rgba(255,122,0,0.5)] ml-1 font-mono">{stat.suffix}</span>
      </div>

      <span className="text-[10px] font-mono text-white/50 tracking-[0.2em] uppercase mt-4 group-hover:text-[#00F0FF] transition-colors duration-300 font-mono-tech">
        {stat.label}
      </span>
    </div>
  );
}

export default function NetworkMagnitudeSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-transparent border-t border-glow-blue/5">
      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        
        {/* Section Header */}
        <Reveal direction="up" delay={0}>
          <div className="text-left mb-16 max-w-xl">
            <span className="font-mono text-[10px] tracking-widest text-glow-blue uppercase font-mono-tech">
              CLUSTER_METRICS // MAGNITUDE
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-soft-white mt-2 font-display glitch-hover">
              <span className="glitch-text relative" data-text="Network Magnitude">Network Magnitude</span>
            </h2>
            <p className="text-xs md:text-sm text-soft-white/50 mt-3 leading-relaxed">
              Structural scaling indices documenting the computational footprint and synchronization throughput of our engineering cluster.
            </p>
          </div>
        </Reveal>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl mx-auto">
          {STATS_DATA.map((stat, i) => (
            <Reveal key={i} direction="up" delay={0.05 + i * 0.08} duration={0.65}>
              <StatCounter stat={stat} />
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
