import React from 'react';
import teamData from '../data/team.json';
import { Github, Linkedin, Mail, Network, User } from 'lucide-react';
import Reveal from './Reveal';

export default function CommunitySection() {
  return (
    <section 
      id="community" 
      className="py-24 relative overflow-hidden bg-void/85 border-t border-glow-blue/5"
    >
      {/* Background visual cues */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-radial-glow pointer-events-none opacity-20"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <Reveal direction="up" delay={0}>
          <div className="text-left mb-16">
            <span className="font-mono text-[10px] tracking-widest text-glow-blue uppercase font-mono-tech">
              STAGE_05 // COMMUNITY
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-soft-white mt-2 font-display glitch-hover">
              <span className="glitch-text relative" data-text="The Neural Human Network">The Neural Human Network</span>
            </h2>
            <p className="text-xs md:text-sm text-soft-white/50 mt-3 max-w-xl leading-relaxed">
              Meet the researchers, engineers, and coordinators leading our intelligence cluster. We are a collection of minds synchronized on the exploration of algorithms.
            </p>
          </div>
        </Reveal>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamData.map((member, index) => (
            <Reveal key={index} direction="up" delay={0.05 + (index % 4) * 0.09} duration={0.65}>
              <div
                className="glass-panel p-6 rounded-lg flex flex-col items-center text-center relative overflow-hidden group border-glow-blue-hover border-glow-blue/15 shadow-2xl interactive-card glitch-hover h-full"
              >
                {/* Decorative node pattern */}
                <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-sds-blue/10 blur-xl group-hover:bg-glow-blue/10 transition-colors pointer-events-none" />

                {/* Avatar */}
                <div className="relative w-20 h-20 rounded-full border border-glow-blue/20 bg-void flex items-center justify-center mb-5 overflow-hidden transition-all duration-300 group-hover:border-glow-blue/50 group-hover:shadow-[0_0_15px_rgba(74,144,255,0.25)]">
                  <User className="w-8 h-8 text-glow-blue/60 group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity bg-tech-grid" />
                </div>

                {/* Name & Role */}
                <h3
                  className="text-base font-bold text-soft-white font-display mb-1 relative glitch-text"
                  data-text={member.name}
                >
                  {member.name}
                </h3>
                <span className="font-mono text-[9px] tracking-wider text-sds-amber font-mono-tech mb-4">
                  {member.role}
                </span>

                {/* Bio */}
                <p className="text-xs text-soft-white/60 leading-relaxed mb-6 flex-grow">
                  {member.bio}
                </p>

                {/* Links */}
                <div className="flex items-center gap-4 mt-auto border-t border-glow-blue/5 pt-4 w-full justify-center">
                  <a href={member.github} target="_blank" rel="noreferrer" className="text-soft-white/40 hover:text-glow-blue transition-colors p-1 rounded hover:bg-sds-blue/20" aria-label={`${member.name} GitHub`}><Github className="w-4 h-4" /></a>
                  <a href={member.linkedin} target="_blank" rel="noreferrer" className="text-soft-white/40 hover:text-glow-blue transition-colors p-1 rounded hover:bg-sds-blue/20" aria-label={`${member.name} LinkedIn`}><Linkedin className="w-4 h-4" /></a>
                  <a href="#connect" className="text-soft-white/40 hover:text-glow-blue transition-colors p-1 rounded hover:bg-sds-blue/20" aria-label={`${member.name} Email`}><Mail className="w-4 h-4" /></a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Global Cluster Stats Banner */}
        <Reveal direction="up" delay={0.2} duration={0.8}>
          <div className="glass-panel p-8 rounded-lg mt-16 flex flex-col md:flex-row items-center justify-between gap-6 border-glow-blue/15">
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded bg-sds-blue/30 border border-glow-blue/20 flex items-center justify-center shadow-[0_0_12px_rgba(74,144,255,0.15)]">
                <Network className="w-6 h-6 text-glow-blue" />
              </div>
              <div>
                <h3 className="text-base font-bold text-soft-white font-display">Are you ready to join the cluster?</h3>
                <p className="text-xs text-soft-white/50 mt-1">Applications for our specialized engineering domains open every semester.</p>
              </div>
            </div>
            <button
              onClick={() => { const el = document.getElementById('footer'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
              className="glass-button glass-button-active px-6 py-3 rounded text-xs tracking-widest font-mono cursor-pointer"
            >
              SUBMIT_NODE_APPLICATION
            </button>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
