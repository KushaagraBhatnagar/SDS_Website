import React, { useEffect, useState } from 'react';
import { Network, Terminal } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-out py-4 ${
        scrolled 
          ? 'bg-void/40 backdrop-blur-md border-b border-glow-blue/10 py-3 shadow-lg' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <button 
          onClick={() => scrollToSection('top')}
          className="flex items-center gap-2 group cursor-pointer focus:outline-none"
        >
          <div className="relative w-8 h-8 rounded-lg bg-sds-blue/40 border border-glow-blue/20 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:border-glow-blue/50 group-hover:shadow-[0_0_12px_rgba(74,144,255,0.3)]">
            <Network className="w-4 h-4 text-glow-blue group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-tr from-glow-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div className="flex flex-col text-left glitch-hover">
            <span 
              className="text-sm font-bold tracking-wider Space Grotesk text-soft-white group-hover:text-glow-blue transition-colors duration-300 relative glitch-text"
              data-text="SDS"
            >
              SDS
            </span>
            <span className="text-[8px] font-mono tracking-widest text-soft-white/40 -mt-0.5 font-mono-tech">
              SOCIETY.FOR.DATA.SCIENCE
            </span>
          </div>
        </button>

        {/* Menu Links */}
        <div className="hidden md:flex items-center gap-8 font-mono text-[11px] tracking-widest">
          <button 
            onClick={() => scrollToSection('attention')}
            className="text-soft-white/60 hover:text-glow-blue transition-colors duration-300 cursor-pointer"
          >
            01_ATTENTION
          </button>
          <button 
            onClick={() => scrollToSection('knowledge')}
            className="text-soft-white/60 hover:text-glow-blue transition-colors duration-300 cursor-pointer"
          >
            02_KNOWLEDGE
          </button>
          <button 
            onClick={() => scrollToSection('innovation')}
            className="text-soft-white/60 hover:text-glow-blue transition-colors duration-300 cursor-pointer"
          >
            03_INNOVATION
          </button>
          <button 
            onClick={() => scrollToSection('community')}
            className="text-soft-white/60 hover:text-glow-blue transition-colors duration-300 cursor-pointer"
          >
            04_COMMUNITY
          </button>
          <button 
            onClick={() => scrollToSection('future')}
            className="text-soft-white/60 hover:text-glow-blue transition-colors duration-300 cursor-pointer"
          >
            05_FUTURE
          </button>
        </div>

        {/* Action Button */}
        <div>
          <button 
            onClick={() => scrollToSection('footer')}
            className="glass-button px-4 py-1.5 rounded text-[10px] tracking-widest font-mono cursor-pointer flex items-center gap-1.5 focus:outline-none"
          >
            <Terminal className="w-3.5 h-3.5" />
            CONNECT_
          </button>
        </div>
      </div>
    </nav>
  );
}
