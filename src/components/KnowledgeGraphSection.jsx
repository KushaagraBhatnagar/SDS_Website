import React, { useEffect, useRef, useState } from 'react';
import Reveal from './Reveal';

const NODES = [
  { id: 'ai', label: 'AI (Agentic Systems)', x: 0, y: 0, rx: 0, ry: 0, radius: 28, color: '#FFB000', connections: ['ml', 'nlp', 'cv', 'robotics', 'research'] },
  { id: 'ml', label: 'Machine Learning', x: 150, y: -70, rx: 150, ry: -70, radius: 22, color: '#4A90FF', connections: ['ai', 'research', 'data', 'cloud'] },
  { id: 'cv', label: 'Computer Vision', x: 110, y: 120, rx: 110, ry: 120, radius: 20, color: '#4A90FF', connections: ['ai', 'ml'] },
  { id: 'nlp', label: 'NLP & Semantics', x: -110, y: 120, rx: -110, ry: 120, radius: 20, color: '#4A90FF', connections: ['ai', 'ml'] },
  { id: 'robotics', label: 'Robotics & Control', x: -160, y: -70, rx: -160, ry: -70, radius: 18, color: '#4A90FF', connections: ['ai', 'cv'] },
  { id: 'research', label: 'Research & Symposia', x: 0, y: -160, rx: 0, ry: -160, radius: 22, color: '#FFB000', connections: ['ai', 'ml'] },
  { id: 'data', label: 'Data Pipelines', x: 250, y: 20, rx: 250, ry: 20, radius: 18, color: '#4A90FF', connections: ['ml', 'cloud'] },
  { id: 'cloud', label: 'Cloud Clusters', x: -250, y: 20, rx: -250, ry: 20, radius: 18, color: '#4A90FF', connections: ['ml', 'data'] }
];

export default function KnowledgeGraphSection() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const nodesState = useRef(
    NODES.map(node => ({
      ...node,
      vx: 0,
      vy: 0,
      activeGlow: 0
    }))
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      const rect = containerRef.current.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = 450;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let animationId = null;
    let mouse = { x: null, y: null };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
      setHoveredNode(null);
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const frame = () => {
      const state = nodesState.current;
      const W = canvas.width;
      const H = canvas.height;
      const CX = W / 2;
      const CY = H / 2;

      ctx.clearRect(0, 0, W, H);

      // Draw subtle backing circular grids
      ctx.strokeStyle = 'rgba(74, 144, 255, 0.02)';
      ctx.lineWidth = 1;
      for (let r = 80; r <= CX; r += 85) {
        ctx.beginPath();
        ctx.arc(CX, CY, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 1. Physics update: Hookes spring law to return to resting positions
      let currentHover = null;
      
      state.forEach(node => {
        const nx = CX + node.x;
        const ny = CY + node.y;
        
        // Check mouse collision
        if (mouse.x !== null && mouse.y !== null) {
          const dist = Math.hypot(mouse.x - nx, mouse.y - ny);
          if (dist < node.radius) {
            currentHover = node;
          }
        }

        // Return to resting position (rx, ry)
        const springK = 0.08;
        const damping = 0.85;

        const forceX = (node.rx - node.x) * springK;
        const forceY = (node.ry - node.y) * springK;

        node.vx = (node.vx + forceX) * damping;
        node.vy = (node.vy + forceY) * damping;

        node.x += node.vx;
        node.y += node.vy;
      });

      if (currentHover && currentHover.id !== hoveredNode) {
        setHoveredNode(currentHover.id);
      }

      // 2. Apply spring attraction forces from hovered node to its connections
      if (currentHover) {
        state.forEach(node => {
          if (node.id === currentHover.id) {
            // hovered node moves slightly towards mouse
            const hx = mouse.x - (CX + node.x);
            const hy = mouse.y - (CY + node.y);
            node.x += hx * 0.15;
            node.y += hy * 0.15;
            node.activeGlow = Math.min(1, node.activeGlow + 0.1);
          } else if (currentHover.connections.includes(node.id)) {
            // pull neighbors closer (attraction)
            const targetX = currentHover.x;
            const targetY = currentHover.y;
            
            const dx = targetX - node.x;
            const dy = targetY - node.y;
            
            node.x += dx * 0.035;
            node.y += dy * 0.035;
            node.activeGlow = Math.min(0.8, node.activeGlow + 0.08);
          } else {
            node.activeGlow = Math.max(0, node.activeGlow - 0.05);
          }
        });
      } else {
        state.forEach(node => {
          node.activeGlow = Math.max(0, node.activeGlow - 0.05);
        });
      }

      // 3. Draw connection lines
      state.forEach(node => {
        const fromX = CX + node.x;
        const fromY = CY + node.y;

        node.connections.forEach(connId => {
          const toNode = state.find(n => n.id === connId);
          if (toNode) {
            const toX = CX + toNode.x;
            const toY = CY + toNode.y;
            
            ctx.beginPath();
            ctx.moveTo(fromX, fromY);
            ctx.lineTo(toX, toY);

            // Set glowing synapse line opacity
            const isHighlighted = (currentHover && (currentHover.id === node.id || currentHover.id === toNode.id));
            ctx.strokeStyle = isHighlighted 
              ? 'rgba(74, 144, 255, 0.45)' 
              : 'rgba(74, 144, 255, 0.07)';
            ctx.lineWidth = isHighlighted ? 1.6 : 0.8;
            ctx.stroke();

            // Pulse connection data particles along lines
            if (isHighlighted && Math.random() > 0.85) {
              const pRatio = (Date.now() % 1500) / 1500;
              const px = fromX + (toX - fromX) * pRatio;
              const py = fromY + (toY - fromY) * pRatio;
              ctx.beginPath();
              ctx.arc(px, py, 2.5, 0, Math.PI * 2);
              ctx.fillStyle = '#FFB000';
              ctx.fill();
            }
          }
        });
      });

      // 4. Draw nodes themselves
      state.forEach(node => {
        const nx = CX + node.x;
        const ny = CY + node.y;
        
        ctx.save();
        // Glow effect for active nodes
        if (node.activeGlow > 0) {
          ctx.shadowBlur = 12 * node.activeGlow;
          ctx.shadowColor = node.color;
        }

        ctx.beginPath();
        ctx.arc(nx, ny, node.radius, 0, Math.PI * 2);
        
        // fill gradient
        const grad = ctx.createRadialGradient(nx, ny, 2, nx, ny, node.radius);
        grad.addColorStop(0, '#020611');
        grad.addColorStop(1, node.color);
        ctx.fillStyle = grad;
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 1.5;
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Node Title Text Label
        ctx.fillStyle = node.activeGlow > 0 ? '#F5F7FA' : 'rgba(245, 247, 250, 0.55)';
        ctx.font = node.id === 'ai' ? 'bold 12px Space Grotesk' : '500 10.5px Space Grotesk';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.label, nx, ny);

        // draw tiny active indicators
        if (node.activeGlow > 0) {
          ctx.beginPath();
          ctx.arc(nx + node.radius - 4, ny - node.radius + 4, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#FFB000';
          ctx.fill();
        }
      });

      animationId = requestAnimationFrame(frame);
    };

    animationId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hoveredNode]);

  return (
    <section className="py-20 relative overflow-hidden bg-transparent border-t border-glow-blue/5">
      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center">
        
        {/* Title details */}
        <Reveal direction="up" delay={0}>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="font-mono text-[10px] tracking-widest text-sds-amber font-mono-tech uppercase">
              REPRESENTATIONAL_MAP // DYNAMIC_GRAPH
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-soft-white mt-2 font-display glitch-hover">
              <span className="glitch-text relative" data-text="Interactive Knowledge Synapses">
                Interactive Knowledge Synapses
              </span>
            </h2>
            <p className="text-xs md:text-sm text-soft-white/40 mt-3 font-mono">
              Hover over elements to activate network synapses. Physics spring matrices will pull neighbouring modules into focal coordination alignment.
            </p>
          </div>
        </Reveal>

        {/* Dynamic Canvas Container */}
        <Reveal direction="up" delay={0.15} duration={0.9} className="w-full max-w-4xl">
          <div
            ref={containerRef}
            className="w-full max-w-4xl h-[450px] relative border border-glow-blue/15 bg-void/50 rounded-lg overflow-hidden shadow-2xl"
          >
            {/* Custom scanlines to keep visual style consistent */}
            <div className="absolute inset-0 bg-radial-glow opacity-30 pointer-events-none" />
            <canvas ref={canvasRef} className="block w-full h-full cursor-none" aria-hidden="true" />

            {/* Mouse tracking overlay for interactive indicators */}
            <div className="absolute top-4 right-4 pointer-events-none font-mono text-[9px] text-soft-white/30 font-mono-tech border border-glow-blue/10 px-2.5 py-1 bg-void/80 rounded">
              MATRIX: {hoveredNode ? `ACTIVE_${hoveredNode.toUpperCase()}` : 'STANDBY_'}
            </div>
          </div>
        </Reveal>

        {/* Semantic SEO & Screen Reader accessible data map */}
        <div className="sr-only">
          <h3>SDS AI Node Relationships</h3>
          <ul>
            {NODES.map(node => (
              <li key={node.id}>
                <strong>{node.label}</strong> connects to: {node.connections.map(c => NODES.find(n => n.id === c)?.label || c).join(', ')}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </section>
  );
}
