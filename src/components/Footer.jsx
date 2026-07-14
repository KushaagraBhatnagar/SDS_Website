import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Send, ArrowUp } from 'lucide-react';

export default function Footer() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', text: 'SDS Inference Terminal v3.2' },
    { type: 'system', text: 'Type "/help" to view directory of commands.' }
  ]);
  const outputRef = useRef(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim().toLowerCase();
    const newHistory = [...history, { type: 'user', text: `> ${input}` }];

    switch (cmd) {
      case '/help':
        newHistory.push(
          { type: 'system', text: 'AVAILABLE CHANNELS:' },
          { type: 'system', text: '  /about    - Return structural purpose of SDS.' },
          { type: 'system', text: '  /domains  - Output current AI subfield focus.' },
          { type: 'system', text: '  /team     - Output active core operators.' },
          { type: 'system', text: '  /events   - Sync upcoming pipeline schedules.' },
          { type: 'system', text: '  /clear    - Flush local memory buffers.' }
        );
        break;
      case '/about':
        newHistory.push({
          type: 'system',
          text: 'SOCIETY FOR DATA SCIENCE (SDS): An immersive academic accelerator and development cluster specializing in deep learning, transformer engineering, and statistical modeling.'
        });
        break;
      case '/domains':
        newHistory.push({
          type: 'system',
          text: 'DOMAINS ACTIVE: [Agentic AI], [Deep Learning], [Computer Vision], [NLP], [Generative Transformers], [Predictive Analytics].'
        });
        break;
      case '/team':
        newHistory.push({
          type: 'system',
          text: 'OPERATORS LOADED: Alex Mercer (President), Sophia Chen (Vice President), Ryan Kaelen (Tech Director), Elena Rostova (Data Science Lead).'
        });
        break;
      case '/events':
        newHistory.push({
          type: 'system',
          text: 'NEXT LAUNCH SYNC: Neural Genesis Hackathon (Oct 12-14) // Transformer Workshop (Nov 02).'
        });
        break;
      case '/clear':
        setHistory([]);
        setInput('');
        return;
      default:
        newHistory.push({
          type: 'error',
          text: `ERR: Command "${input}" not resolved. Buffer rejected. Type "/help" for structural list.`
        });
        break;
    }

    setHistory(newHistory);
    setInput('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer 
      id="footer" 
      className="py-16 relative overflow-hidden bg-void/95 border-t border-glow-blue/10"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-radial-glow opacity-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Side: Brand identity & copyright */}
        <div className="lg:col-span-5 text-left flex flex-col justify-between h-full min-h-[220px]">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl font-bold tracking-widest font-display text-soft-white glow-text-blue">SDS</span>
              <span className="text-[9px] font-mono tracking-widest text-soft-white/40 border border-glow-blue/20 px-2 py-0.5 rounded font-mono-tech bg-void">
                SERVER_OK
              </span>
            </div>
            <p className="text-xs text-soft-white/50 leading-relaxed max-w-sm">
              An elite collegiate Artificial Intelligence and Data Science community. Enter the mind of the machine, optimize the architecture, and decode the future.
            </p>
          </div>

          <div className="text-[10px] font-mono text-soft-white/30 font-mono-tech mt-8">
            <div>© {new Date().getFullYear()} SOCIETY FOR DATA SCIENCE. ALL RIGHTS RESERVED.</div>
            <div className="mt-1 text-glow-blue/50">BUILD_STATE: PRODUCTION_DEPLOY // HASH_0xF5A2D</div>
          </div>
        </div>

        {/* Center/Right Side: Interactive Terminal Interface */}
        <div className="lg:col-span-7 w-full flex flex-col">
          <div className="w-full glass-panel border border-glow-blue/15 bg-void/85 rounded-lg shadow-2xl overflow-hidden text-left flex flex-col font-mono text-[11px] leading-relaxed">
            
            {/* Terminal Header */}
            <div className="bg-sds-blue/20 border-b border-glow-blue/10 px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-glow-blue animate-pulse" />
                <span className="font-semibold text-soft-white tracking-widest text-[9px] font-mono-tech">
                  SDS_HOST_TERMINAL_SESSION
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/30"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/30"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/30"></span>
              </div>
            </div>

            {/* Terminal History Output */}
            <div 
              ref={outputRef}
              className="p-4 h-[160px] overflow-y-auto space-y-1.5 bg-void/90 font-mono-tech text-[10.5px] border-b border-glow-blue/10"
            >
              {history.map((line, idx) => (
                <div 
                  key={idx} 
                  className={
                    line.type === 'user' 
                      ? 'text-sds-amber font-semibold' 
                      : line.type === 'error' 
                        ? 'text-red-400 font-bold' 
                        : 'text-glow-blue/80'
                  }
                >
                  {line.text}
                </div>
              ))}
            </div>

            {/* Terminal Input Line */}
            <form onSubmit={handleCommand} className="flex items-center bg-void px-4 py-2.5">
              <span className="text-sds-amber font-mono-tech mr-2 font-bold text-xs select-none">&gt;</span>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type command (/help)..." 
                className="bg-transparent border-none outline-none flex-grow text-soft-white font-mono-tech text-[11px] placeholder-soft-white/20"
                aria-label="Host terminal query input box"
              />
              <button 
                type="submit"
                className="text-soft-white/40 hover:text-glow-blue transition-colors cursor-pointer p-1"
                aria-label="Submit terminal command button"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Quick back-to-top button below terminal */}
          <div className="flex justify-end mt-4">
            <button 
              onClick={scrollToTop}
              className="glass-button p-2.5 rounded flex items-center justify-center cursor-pointer text-soft-white/55 hover:text-sds-amber focus:outline-none"
              aria-label="Scroll back to top of page button"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
