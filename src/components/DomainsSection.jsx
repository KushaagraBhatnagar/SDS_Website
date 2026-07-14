import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Terminal, Eye, Zap, Database, Network } from 'lucide-react';
import domainsData from '../data/domains.json';
import Reveal from './Reveal';

const iconMap = {
  ai: Cpu,
  ml: Cpu,
  dl: Cpu,
  cv: Eye,
  nlp: Terminal,
  'gen-ai': Zap,
  llms: Database,
  'data-science': Network
};

function DomainCard({ domain, index }) {
  const IconComponent = iconMap[domain.id] || Cpu;

  // Alternate orange/blue accents for the trailing line & glows
  const isEven = index % 2 === 0;
  const accentColor = isEven ? '#FF7A00' : '#4A90FF';
  const glowStyle = isEven 
    ? 'hover:shadow-[0_15px_30px_rgba(255,122,0,0.08)] hover:border-[#FF7A00]/30' 
    : 'hover:shadow-[0_15px_30px_rgba(74,144,255,0.08)] hover:border-[#4A90FF]/30';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.08, ease: "easeOut" }}
      className={`group relative p-6 rounded-xl bg-[#0A0F1D]/30 border border-white/5 backdrop-blur-md flex flex-col justify-between overflow-hidden transition-all duration-500 min-h-[220px] select-none hover:bg-[#0A0F1D]/55 hover:translate-y-[-4px] ${glowStyle}`}
    >
      {/* Dynamic Animated Trailing Border Effect */}
      <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <linearGradient id={`grad-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={accentColor} stopOpacity="0.8" />
              <stop offset="100%" stopColor={isEven ? '#4A90FF' : '#00F0FF'} stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <rect
            x="0.5"
            y="0.5"
            width="99.5%"
            height="99.5%"
            rx="12"
            fill="none"
            stroke={`url(#grad-${index})`}
            strokeWidth="1.5"
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            strokeDasharray="400"
            strokeDashoffset="400"
            style={{
              animation: "dash-anim 4s linear infinite",
            }}
          />
        </svg>
      </div>

      {/* Card Header */}
      <div className="relative z-10">
        <div className="flex justify-between items-center">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
            <IconComponent className="w-5 h-5 text-white/70 group-hover:text-white transition-colors duration-300" />
          </div>
          <span className="font-mono text-[8px] text-white/20 tracking-[0.25em] font-medium uppercase group-hover:text-white/40 transition-colors">
            {domain.tag}
          </span>
        </div>

        <h3 className="text-sm font-bold tracking-wider text-white uppercase mt-4 group-hover:text-[#00F0FF] transition-colors duration-300 font-display">
          {domain.title}
        </h3>
      </div>

      {/* Description Text */}
      <div className="relative z-10 mt-4">
        <p className="text-white/50 text-[11px] leading-relaxed font-sans font-light group-hover:text-white/70 transition-colors duration-300 text-left">
          {domain.description}
        </p>
      </div>

      {/* Bottom Status Tracker Line */}
      <div className="w-full h-[1px] bg-white/5 group-hover:bg-[#FF7A00]/20 transition-colors mt-6 pt-1 font-mono text-[7px] text-white/10 flex justify-between tracking-widest font-mono-tech">
        <span>CORE // COMP_ENV</span>
        <span>{domain.stats} // OK</span>
      </div>
    </motion.div>
  );
}

export default function DomainsSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-transparent">
      {/* Background elements */}
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-radial-glow pointer-events-none opacity-20"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <Reveal direction="up" delay={0}>
          <div className="text-left mb-16">
            <span className="font-mono text-[10px] tracking-widest text-glow-blue uppercase font-mono-tech">
              CORE_REPRESENTATIONS // MODULES
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-soft-white mt-2 font-display glitch-hover">
              <span className="glitch-text relative" data-text="Artificial Intelligence Domains">
                Artificial Intelligence Domains
              </span>
            </h2>
            <p className="text-xs md:text-sm text-soft-white/50 mt-3 max-w-xl leading-relaxed">
              Our teams explore, optimize, and build across the full manifold of machine intelligence subfields, training architectures to understand and synthesize the human world.
            </p>
          </div>
        </Reveal>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {domainsData.map((domain, i) => (
            <DomainCard key={domain.id} domain={domain} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
