import React from 'react';
import { ArrowRight, Terminal, Cpu, Database, Network } from 'lucide-react';
import Reveal from './Reveal';

export default function HeroSection({ performanceTier }) {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="attention"
      className="min-h-screen relative flex items-center justify-center pt-24 pb-16 overflow-hidden tech-grid"
    >
      {/* Background glow filters */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-sds-blue/10 blur-[150px] pointer-events-none radial-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-sds-amber/5 blur-[120px] pointer-events-none radial-glow-amber" />

      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">

        {/* Left Side Content */}
        <div className="lg:col-span-7 text-left flex flex-col items-start">

          {/* Status tag */}
          <Reveal direction="down" delay={0} duration={0.6}>
            <div className="inline-flex items-center gap-2 border border-glow-blue/20 bg-sds-blue/15 px-3 py-1 rounded-full mb-6 pointer-events-none shadow-[0_0_15px_rgba(74,144,255,0.1)]">
              <span className="w-1.5 h-1.5 rounded-full bg-glow-blue animate-ping" />
              <span className="font-mono text-[9px] tracking-widest text-glow-blue uppercase font-mono-tech">
                STATE: INFERENCE_MODE_ACTIVE
              </span>
            </div>
          </Reveal>

          {/* Headline */}
          <Reveal direction="up" delay={0.1} duration={0.8}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-soft-white leading-tight font-display mb-6 glitch-hover">
              Building the Next <br />
              <span
                className="text-transparent bg-clip-text bg-gradient-to-r from-glow-blue via-soft-white to-sds-amber glow-text-blue glitch-text relative"
                data-text="Generation of AI"
              >
                Generation of AI
              </span>{' '}
              <br />
              Innovators.
            </h1>
          </Reveal>

          {/* Subtext */}
          <Reveal direction="up" delay={0.2} duration={0.8}>
            <p className="text-sm md:text-base text-soft-white/60 leading-relaxed max-w-xl mb-10">
              Welcome to the mind of the machine. The Society for Data Science is a premium
              collegiate neural network where researchers, engineers, and builders assemble to
              optimize algorithms, train transformers, and shape the future of machine intelligence.
            </p>
          </Reveal>

          {/* CTAs */}
          <Reveal direction="up" delay={0.3} duration={0.7}>
            <div className="flex flex-wrap items-center gap-4 mb-16">
              <button
                onClick={() => scrollToSection('knowledge')}
                className="glass-button glass-button-active px-6 py-3 rounded text-xs tracking-widest font-mono flex items-center gap-2 cursor-pointer group"
              >
                EXPLORE_SDS
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => scrollToSection('footer')}
                className="glass-button px-6 py-3 rounded text-xs tracking-widest font-mono flex items-center gap-2 cursor-pointer group"
              >
                JOIN_COMMUNITY
                <Terminal className="w-4 h-4 text-soft-white/60 group-hover:text-sds-amber transition-colors" />
              </button>
            </div>
          </Reveal>

          {/* Stats bar */}
          <Reveal direction="up" delay={0.4} duration={0.7}>
            <div className="grid grid-cols-3 gap-6 border-t border-glow-blue/10 pt-8 w-full max-w-lg font-mono text-[10px] tracking-wider text-soft-white/40">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-glow-blue/60" />
                <div className="flex flex-col">
                  <span className="text-soft-white font-bold font-mono-tech text-xs">240+ FLOPS</span>
                  <span>COMPUTE SPEED</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-sds-amber/60" />
                <div className="flex flex-col">
                  <span className="text-soft-white font-bold font-mono-tech text-xs">15.2 TB</span>
                  <span>DATA PROCESS</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Network className="w-4 h-4 text-glow-blue/60" />
                <div className="flex flex-col">
                  <span className="text-soft-white font-bold font-mono-tech text-xs">350+ NODES</span>
                  <span>ACTIVE MEMBERS</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Right Side — Empty placeholder to let the global 3D neural network background show through */}
        <div className="lg:col-span-5 w-full h-[400px] lg:h-[500px] pointer-events-none select-none relative" />
      </div>
    </section>
  );
}
