import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Radio, ChevronRight, Tag } from 'lucide-react';
import eventsData from '../data/events.json';
import Reveal from './Reveal';

function EventCapsule({ event, index }) {
  const isOdd = index % 2 === 1;
  const isPlanning = event.status === 'Planning';

  const statusStyles = {
    "REGISTRATION OPEN": "bg-[#00F0FF]/10 text-[#00F0FF] border-[#00F0FF]/30",
    "UPCOMING": "bg-[#2D8CFF]/10 text-[#2D8CFF] border-[#2D8CFF]/30",
    "PLANNING": "bg-white/5 text-white/40 border-white/10",
  };

  const statusKey = event.status.toUpperCase();
  const activeStyle = statusStyles[statusKey] || statusStyles["PLANNING"];

  return (
    <motion.div
      initial={{ opacity: 0, x: isOdd ? 80 : -80 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.12 }}
      className="group relative w-full rounded-2xl md:rounded-full bg-[#0A0F1D]/30 border border-white/5 hover:border-white/10 hover:bg-[#0A0F1D]/55 backdrop-blur-md px-8 py-6 md:py-4 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-500 shadow-[0_10px_25px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_35px_rgba(45,140,255,0.08)] select-none"
    >
      {/* Decorative gradient mask inside hover */}
      <div className="absolute inset-0 rounded-2xl md:rounded-full bg-gradient-to-r from-[#FF7A00]/5 to-[#2D8CFF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Date & Type */}
      <div className="flex items-center gap-4 w-full md:w-auto shrink-0 text-left">
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-white/50 group-hover:text-white transition-colors duration-300">
          <Calendar className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-mono text-xs font-bold text-white group-hover:text-[#FF7A00] transition-colors">
            {event.date}
          </span>
          <span className="font-mono text-[8px] text-white/30 tracking-[0.2em] uppercase mt-0.5 font-mono-tech">
            {event.type}
          </span>
        </div>
      </div>

      {/* Title & Description */}
      <div className="flex-grow text-left w-full md:w-auto">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <h3 className="text-sm font-bold tracking-wider text-white uppercase group-hover:text-white transition-colors font-display">
            {event.title}
          </h3>
          <span className={`inline-flex items-center gap-1 font-mono text-[8px] tracking-wider uppercase px-2 py-0.5 rounded-full border w-fit font-mono-tech ${activeStyle}`}>
            {event.status === 'Registration Open' && (
              <Radio className="w-2.5 h-2.5 animate-pulse text-[#00F0FF]" />
            )}
            {event.status}
          </span>
        </div>
        <p className="text-white/40 text-[10px] sm:text-[11px] leading-relaxed font-sans font-light mt-2 max-w-2xl group-hover:text-white/60 transition-colors">
          {event.description}
        </p>
      </div>

      {/* Launcher CTA */}
      <div className="w-full md:w-auto flex justify-end shrink-0">
        <button
          disabled={isPlanning}
          className={`flex items-center gap-1.5 font-mono text-[9px] font-mono-tech transition-all py-2 px-4 rounded-full border ${
            isPlanning 
              ? 'text-white/20 border-white/5 cursor-not-allowed bg-transparent' 
              : 'text-[#2D8CFF] border-[#2D8CFF]/20 hover:border-[#2D8CFF]/50 hover:bg-[#2D8CFF]/5 hover:text-white cursor-pointer group-hover:translate-x-0.5'
          }`}
        >
          <span>{isPlanning ? 'STANDBY_' : 'LAUNCH_SYNC_'}</span>
          {!isPlanning && <ChevronRight className="w-3.5 h-3.5" />}
        </button>
      </div>
    </motion.div>
  );
}

export default function FutureSection() {
  return (
    <section 
      id="future" 
      className="py-24 relative overflow-hidden bg-transparent border-t border-glow-blue/5"
    >
      {/* Background glow overlay */}
      <div className="absolute bottom-0 left-1/3 w-[550px] h-[550px] bg-radial-glow-amber pointer-events-none opacity-20"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <Reveal direction="up" delay={0}>
          <div className="text-left mb-16">
            <span className="font-mono text-[10px] tracking-widest text-sds-amber font-mono-tech uppercase">
              STAGE_06 // FUTURE
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-soft-white mt-2 font-display glitch-hover">
              <span className="glitch-text relative" data-text="Upcoming System Synchronizations">
                Upcoming System Synchronizations
              </span>
            </h2>
            <p className="text-xs md:text-sm text-soft-white/50 mt-3 max-w-xl leading-relaxed">
              Track our pipeline schedule. Engage with upcoming workshops, competitions, and technical symposia to synchronize your nodes.
            </p>
          </div>
        </Reveal>

        {/* Timeline Horizontal Capsule Stack */}
        <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
          {eventsData.map((evt, idx) => (
            <EventCapsule key={evt.id} event={evt} index={idx} />
          ))}
        </div>

      </div>
    </section>
  );
}
