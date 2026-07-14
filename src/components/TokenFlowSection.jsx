import React, { useEffect, useRef } from 'react';
import Reveal from './Reveal';

const TOKENS = ["Data", "Image", "Text", "Video", "Audio", "Code", "Research", "Vector", "Weights"];

export default function TokenFlowSection() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      const rect = containerRef.current.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = 300;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initial state setup for particles
    const particleCount = 40;
    const particles = Array.from({ length: particleCount }, (_, idx) => {
      const word = TOKENS[idx % TOKENS.length];
      return {
        word,
        x: Math.random() * -300, // start offscreen left
        y: Math.random() * 200 + 50,
        speed: Math.random() * 40 + 35,
        phase: Math.random() * Math.PI,
        size: Math.random() * 2 + 1,
        active: true
      };
    });

    let animationId = null;
    let lastTime = performance.now();

    const frame = (time) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      // Draw vertical separator lanes
      ctx.strokeStyle = 'rgba(74, 144, 255, 0.03)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(W * 0.25, 0); ctx.lineTo(W * 0.25, H);
      ctx.moveTo(W * 0.55, 0); ctx.lineTo(W * 0.55, H);
      ctx.moveTo(W * 0.8, 0); ctx.lineTo(W * 0.8, H);
      ctx.stroke();

      // Labels at top of lanes
      ctx.fillStyle = 'rgba(245, 247, 250, 0.25)';
      ctx.font = '9px JetBrains Mono';
      ctx.textAlign = 'center';
      ctx.fillText("01 // RAW_TOKENS", W * 0.125, 25);
      ctx.fillText("02 // EIGEN_EMBEDDINGS", W * 0.4, 25);
      ctx.fillText("03 // ATTENTION_FILTERS", W * 0.675, 25);
      ctx.fillText("04 // KNOWLEDGE_SYNTHESIS", W * 0.9, 25);

      // Draw Attention heads (vertical rectangles in layer 3)
      const headX = W * 0.65;
      const headHeight = 120;
      ctx.fillStyle = 'rgba(7A, 144, 255, 0.015)';
      ctx.fillRect(headX - 10, H/2 - headHeight/2, 20, headHeight);
      ctx.strokeStyle = 'rgba(74, 144, 255, 0.15)';
      ctx.strokeRect(headX - 10, H/2 - headHeight/2, 20, headHeight);

      ctx.fillStyle = 'rgba(255, 176, 0, 0.015)';
      ctx.fillRect(headX + 25, H/2 - headHeight/2, 20, headHeight);
      ctx.strokeStyle = 'rgba(255, 176, 0, 0.15)';
      ctx.strokeRect(headX + 25, H/2 - headHeight/2, 20, headHeight);

      // Draw target text at synthesis zone
      const synthesisX = W * 0.9;
      const synthesisY = H / 2;
      ctx.save();
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#FFB000';
      ctx.fillStyle = 'rgba(255, 176, 0, 0.95)';
      ctx.font = 'bold 20px Space Grotesk';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText("KNOWLEDGE", synthesisX, synthesisY);
      ctx.restore();

      // Update and draw particles
      particles.forEach(p => {
        p.x += p.speed * dt;
        
        // Loop particles when reaching end
        if (p.x > W) {
          p.x = Math.random() * -300;
          p.y = Math.random() * 200 + 50;
        }

        const x = p.x;
        const y = p.y;

        // Phase 1: RAW_TOKENS (Draw text token tags)
        if (x < W * 0.25) {
          ctx.font = '10px JetBrains Mono';
          ctx.fillStyle = 'rgba(245, 247, 250, 0.7)';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          
          // draw token bubble
          const txtWidth = ctx.measureText(p.word).width;
          ctx.fillStyle = 'rgba(10, 30, 94, 0.25)';
          ctx.strokeStyle = 'rgba(74, 144, 255, 0.2)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(x - 5, y - 8, txtWidth + 10, 16, 4);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#F5F7FA';
          ctx.fillText(p.word, x, y);
        }

        // Phase 2: EIGEN_EMBEDDINGS (Collapse into coordinate dots on vectors)
        else if (x >= W * 0.25 && x < W * 0.55) {
          const ratio = (x - W * 0.25) / (W * 0.3); // 0 to 1
          
          // Interpolate coordinate y-axis towards embedding central plane
          const targetY = H / 2 + Math.sin(x * 0.05) * 40;
          const currentY = y + (targetY - y) * ratio;

          ctx.beginPath();
          ctx.arc(x, currentY, p.size + 1, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(74, 144, 255, ${0.9 - ratio * 0.3})`;
          ctx.fill();

          // draw helper projection lines to embedding plane
          ctx.beginPath();
          ctx.moveTo(x, currentY);
          ctx.lineTo(x, H / 2);
          ctx.strokeStyle = `rgba(74, 144, 255, ${0.05 * (1 - ratio)})`;
          ctx.stroke();
        }

        // Phase 3: ATTENTION_FILTERS (Vector streams pass through heads)
        else if (x >= W * 0.55 && x < W * 0.8) {
          const ratio = (x - W * 0.55) / (W * 0.25);
          
          const targetY = H / 2 + (Math.sin(x * 0.08) * 15);
          const currentY = H / 2 + (targetY - (H / 2)) * (1 - ratio);

          ctx.beginPath();
          ctx.arc(x, currentY, p.size, 0, Math.PI * 2);
          
          const color = p.speed > 55 ? '#FFB000' : '#4A90FF';
          ctx.fillStyle = color;
          ctx.fill();

          // Draw attention synapse vectors
          ctx.beginPath();
          ctx.moveTo(x, currentY);
          ctx.lineTo(headX - 10, H/2 + Math.sin(p.phase) * 40);
          ctx.strokeStyle = `rgba(74, 144, 255, 0.03)`;
          ctx.stroke();
        }

        // Phase 4: KNOWLEDGE_SYNTHESIS (Merge into final text)
        else {
          const ratio = (x - W * 0.8) / (W * 0.2);
          const currentY = H / 2 + (y - H/2) * (1 - ratio);

          ctx.beginPath();
          ctx.arc(x, currentY, p.size * (1 - ratio), 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 176, 0, 0.8)';
          ctx.fill();

          // draw synapsing connection to center target
          ctx.beginPath();
          ctx.moveTo(x, currentY);
          ctx.lineTo(synthesisX, synthesisY);
          ctx.strokeStyle = `rgba(255, 176, 0, ${0.2 * (1 - ratio)})`;
          ctx.stroke();
        }
      });

      animationId = requestAnimationFrame(frame);
    };

    animationId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <section 
      id="innovation" 
      className="py-20 relative overflow-hidden bg-transparent border-t border-glow-blue/5"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <Reveal direction="up" delay={0}>
          <div className="text-left mb-12">
            <span className="font-mono text-[10px] tracking-widest text-sds-amber font-mono-tech uppercase">
              STAGE_04 // INNOVATION
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-soft-white mt-2 font-display glitch-hover">
              <span className="glitch-text relative" data-text="Dynamic Token Streaming">Dynamic Token Streaming</span>
            </h2>
            <p className="text-xs md:text-sm text-soft-white/50 mt-3 max-w-xl leading-relaxed">
              Witness words map to vector coordinates, pass through multi-head attention weight kernels, and reconstruct into meaningful intelligence.
            </p>
          </div>
        </Reveal>

        {/* Canvas Visual Container */}
        <Reveal direction="up" delay={0.15} duration={0.9}>
          <div
            ref={containerRef}
            className="w-full h-[300px] border border-glow-blue/10 bg-void rounded-lg overflow-hidden shadow-2xl relative"
          >
            <div className="absolute inset-0 bg-radial-glow opacity-25 pointer-events-none" />
            <canvas ref={canvasRef} className="block w-full h-full" />
          </div>
        </Reveal>

      </div>
    </section>
  );
}
