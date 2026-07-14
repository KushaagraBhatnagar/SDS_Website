import React, { useEffect, useState } from 'react';

const STAGES = [
  { id: 'initialize', label: '01_INITIALIZE', desc: 'Neural Boot' },
  { id: 'attention', label: '02_ATTENTION', desc: 'Hero Space' },
  { id: 'knowledge', label: '03_KNOWLEDGE', desc: 'AI Pipeline & Graph' },
  { id: 'innovation', label: '04_INNOVATION', desc: 'Token Flow' },
  { id: 'community', label: '05_COMMUNITY', desc: 'The Network' },
  { id: 'future', label: '06_FUTURE', desc: 'Roadmap & Sync' }
];

export default function ScrollProgressTracker() {
  const [activeStage, setActiveStage] = useState('attention');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 3;
      
      for (const stage of STAGES) {
        if (stage.id === 'initialize') continue; // intro is finished
        
        const el = document.getElementById(stage.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveStage(stage.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    setTimeout(handleScroll, 100);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-6 font-mono select-none pointer-events-auto">
      {STAGES.map((stage) => {
        const isActive = activeStage === stage.id;
        return (
          <button
            key={stage.id}
            onClick={() => scrollToSection(stage.id)}
            disabled={stage.id === 'initialize'}
            className={`group text-left flex items-start gap-3 transition-all duration-300 ${
              stage.id === 'initialize' 
                ? 'opacity-30 cursor-not-allowed' 
                : 'cursor-pointer hover:opacity-100'
            }`}
          >
            {/* Tick or indicator dot */}
            <div className="flex flex-col items-center">
              <div 
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  isActive 
                    ? 'bg-sds-amber scale-150 glow-text-amber shadow-[0_0_8px_#FFB000]' 
                    : stage.id === 'initialize' 
                      ? 'bg-glow-blue/40'
                      : 'bg-glow-blue/20 group-hover:bg-glow-blue/60'
                }`}
              />
              <div className="w-[1px] h-8 bg-glow-blue/5 my-1" />
            </div>

            {/* Label and description */}
            <div className="-mt-1 flex flex-col">
              <span 
                className={`text-[10px] tracking-widest transition-colors duration-300 font-mono-tech ${
                  isActive 
                    ? 'text-sds-amber font-semibold' 
                    : 'text-soft-white/40 group-hover:text-soft-white/70'
                }`}
              >
                {stage.label}
              </span>
              <span 
                className={`text-[9px] tracking-wide font-sans mt-0.5 transition-all duration-300 ${
                  isActive 
                    ? 'text-glow-blue opacity-100 transform translate-x-1' 
                    : 'text-soft-white/20 opacity-0 group-hover:opacity-60 group-hover:translate-x-0.5'
                }`}
              >
                {stage.desc}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
