import React, { useEffect, useRef, useState } from 'react';

// ─── Easing functions ─────────────────────────────────────────────────────────
const clamp01 = (v) => Math.max(0, Math.min(1, v));
const lerp = (a, b, t) => a + (b - a) * t;
const outExpo = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
const outCubic = (t) => 1 - Math.pow(1 - t, 3);
const inOutQuad = (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const outBack = (t) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };

// Stage durations (seconds)
const DURATIONS = {
  BOOT: 3.5,
  DISSOLVE: 1.0,
  QUOTE: 3.3,
  GLITCH_OUT: 0.9,
  SDS_REVEAL: 2.2,
  MORPH: 2.6,
  ZOOM_OUT: 1.4,
};

const QUOTE_WORDS = ['Attention', 'is', 'all', 'we', 'get.'];

const BOOT_LOGS = [
  { text: "Initializing inference server...", delay: 0 },
  { text: "Loading tokenizer embeddings...", delay: 400 },
  { text: "Constructing neural graph (32 layers)...", delay: 900 },
  { text: "Loading attention heads [8/8]...", delay: 1400 },
  { text: "Building transformer architecture...", delay: 1900 },
  { text: "Optimizing inference engine (INT8)...", delay: 2400 },
  { text: "Loading Society for Data Science...", delay: 2800 },
  { text: "Initialization complete. ✓", delay: 3200 },
];

const makeAttnWeights = () =>
  Array.from({ length: 6 }, () =>
    Array.from({ length: 6 }, () => Math.random())
  );

export default function IntroCanvas({ onIntroComplete, performanceTier }) {
  const canvasRef = useRef(null);
  const [logs, setLogs] = useState([]);
  const [showSkip, setShowSkip] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);

  // ── Font preload gate ────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        if (document.fonts) {
          await Promise.all([
            document.fonts.load('bold 160px "Space Grotesk"'),
            document.fonts.load('bold 72px "Space Grotesk"'),
            document.fonts.load('500 48px "Space Grotesk"'),
          ]);
          await document.fonts.ready;
        }
      } catch (e) { /* ignore font API errors */ }
      if (!cancelled) setFontsReady(true);
    };
    load();
    const fallback = setTimeout(() => { if (!cancelled) setFontsReady(true); }, 900);
    return () => { cancelled = true; clearTimeout(fallback); };
  }, []);

  // Skip button appears after 2s
  useEffect(() => {
    const t = setTimeout(() => setShowSkip(true), 2000);
    return () => clearTimeout(t);
  }, []);

  // ── Main animation loop ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!fontsReady) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const attnWeights = makeAttnWeights();

    // State object
    const s = {
      stage: 'BOOT',
      timer: 0,
      // network
      networkNodes: [],
      networkEdges: [],
      // ambient background stars
      stars: [],
      // quote
      quoteTimer: 0,
      // camera shake
      glitchPulse: 0,
      camShakeX: 0,
      camShakeY: 0,
      // zoom-out
      zoomScale: 1,
      masterAlpha: 1,
      // typewriter logs
      activeLogIdx: 0,
      typedText: '',
      typeCharIdx: 0,
      completedLogs: [],
      // canvas size
      W: window.innerWidth,
      H: window.innerHeight,
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      s.W = canvas.width;
      s.H = canvas.height;
    };
    resize();
    window.addEventListener('resize', resize);

    // Init network nodes
    const NC = performanceTier === 'high' ? 65 : 30;
    s.networkNodes = Array.from({ length: NC }, () => {
      const ox = Math.random() * s.W;
      const oy = Math.random() * (s.H - 170);
      return { x: ox, y: oy, ox, oy, alpha: 0, targetAlpha: Math.random() * 0.7 + 0.3, pulse: Math.random() * Math.PI * 2, speed: Math.random() * 0.4 + 0.1, active: Math.random() > 0.5, size: Math.random() * 3 + 1 };
    });
    s.networkEdges = [];
    for (let i = 0; i < NC; i++) {
      for (let j = i + 1; j < NC; j++) {
        const d = Math.hypot(s.networkNodes[i].x - s.networkNodes[j].x, s.networkNodes[i].y - s.networkNodes[j].y);
        if (d < 150 && Math.random() > 0.45) {
          s.networkEdges.push({ from: i, to: j, alpha: 0, targetAlpha: Math.random() * 0.35 });
        }
      }
    }

    // Init ambient stars
    const SC = performanceTier === 'high' ? 100 : 40;
    s.stars = Array.from({ length: SC }, () => ({
      x: Math.random() * s.W,
      y: Math.random() * s.H,
      size: Math.random() * 1.5 + 0.5,
      speed: Math.random() * 8 + 4,
      alpha: Math.random() * 0.4 + 0.1
    }));

    // ── RGB-split chromatic aberration text renderer ─────────────────────────
    const drawGlitchText = (text, x, y, fontSpec, intensity, baseAlpha) => {
      ctx.font = fontSpec;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      if (intensity <= 0.008) {
        ctx.fillStyle = `rgba(245,247,250,${baseAlpha})`;
        ctx.fillText(text, x, y);
        return;
      }

      const fs = parseInt(fontSpec.match(/(\d+)px/)?.[1] || '48', 10);
      const slices = 12;
      const textH = fs * 1.4;
      const sliceH = textH / slices;

      for (let i = 0; i < slices; i++) {
        const chunkY = y - textH / 2 + i * sliceH;
        const offset = (Math.random() - 0.5) * 42 * intensity;
        
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, chunkY, s.W, sliceH);
        ctx.clip();

        // Cyan channel split
        ctx.fillStyle = `rgba(0, 255, 249, ${baseAlpha * 0.8})`;
        ctx.fillText(text, x + offset * 1.5 - 3, y);

        // Magenta channel split
        ctx.fillStyle = `rgba(255, 0, 193, ${baseAlpha * 0.8})`;
        ctx.fillText(text, x + offset * 1.5 + 3, y);

        // Main white text
        ctx.fillStyle = `rgba(245, 247, 250, ${baseAlpha})`;
        ctx.fillText(text, x + offset, y);

        ctx.restore();
      }
    };

    // ── Attention-head Q/K visual ─────────────────────────────────────────────
    const drawAttentionHeads = (cx, cy, alpha) => {
      if (alpha < 0.01) return;
      const spread = 46;
      const qx = cx - 160, kx = cx + 160;
      const topY = cy - 5 * spread * 0.5;

      for (let i = 0; i < 6; i++)
        for (let j = 0; j < 6; j++)
          attnWeights[i][j] = clamp01(attnWeights[i][j] + (Math.random() - 0.5) * 0.025);

      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
          const w = attnWeights[i][j];
          if (w < 0.5) continue;
          const y1 = topY + i * spread;
          const y2 = topY + j * spread;
          ctx.beginPath();
          ctx.moveTo(qx, y1);
          ctx.bezierCurveTo(cx - 50, y1, cx + 50, y2, kx, y2);
          ctx.strokeStyle = `rgba(74,144,255,${(w - 0.5) * 1.4 * alpha})`;
          ctx.lineWidth = w * 1.8;
          ctx.stroke();
        }
      }

      // Q dots
      for (let i = 0; i < 6; i++) {
        const y = topY + i * spread;
        ctx.beginPath();
        ctx.arc(qx, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,176,0,${alpha * 0.9})`;
        ctx.fill();
      }
      // K dots
      for (let j = 0; j < 6; j++) {
        const y = topY + j * spread;
        ctx.beginPath();
        ctx.arc(kx, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(74,144,255,${alpha * 0.9})`;
        ctx.fill();
      }

      ctx.font = '500 10px "JetBrains Mono"';
      ctx.textAlign = 'center';
      ctx.fillStyle = `rgba(255,176,0,${alpha * 0.7})`;
      ctx.fillText('Q', qx, topY - 18);
      ctx.fillStyle = `rgba(74,144,255,${alpha * 0.7})`;
      ctx.fillText('K', kx, topY - 18);

      ctx.fillStyle = `rgba(74,144,255,${alpha * 0.45})`;
      ctx.font = '11px "JetBrains Mono"';
      ctx.fillText('ATTN HEAD 03 — Q·Kᵀ/√d SOFTMAX SYNC', s.W / 2, topY + 6 * spread + 22);
    };

    // ── Animation Loop ─────────────────────────────────────────────────────────
    let rafId = null;
    let last = performance.now();

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      // Ambient glitch pulse
      const glitchChance = (s.stage === 'SDS_REVEAL' || s.stage === 'MORPH') ? 0.06 : 0.02;
      s.glitchPulse = lerp(s.glitchPulse, Math.random() < glitchChance ? Math.random() * 0.65 : 0, dt * 8);
      s.camShakeX = (Math.random() - 0.5) * s.glitchPulse * 8;
      s.camShakeY = (Math.random() - 0.5) * s.glitchPulse * 8;

      // Background
      ctx.fillStyle = '#020611';
      ctx.fillRect(0, 0, s.W, s.H);

      // Tech Grid
      ctx.strokeStyle = 'rgba(74, 144, 255, 0.015)';
      ctx.lineWidth = 1;
      for (let x = 0; x < s.W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, s.H); ctx.stroke(); }
      for (let y = 0; y < s.H; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(s.W, y); ctx.stroke(); }

      // Stars
      s.stars.forEach(st => {
        st.y -= st.speed * dt;
        if (st.y < 0) {
          st.y = s.H;
          st.x = Math.random() * s.W;
        }
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(74,144,255,${st.alpha})`;
        ctx.fill();
      });

      ctx.save();
      ctx.translate(s.camShakeX, s.camShakeY);

      s.timer += dt;

      // ──────────────────────────────────────────────────────────────────────
      // STAGE: BOOT
      // ──────────────────────────────────────────────────────────────────────
      if (s.stage === 'BOOT') {
        s.networkNodes.forEach(n => {
          n.pulse += dt * 2;
          n.x = n.ox + Math.sin(n.pulse) * 12;
          n.y = n.oy + Math.cos(n.pulse * 0.8) * 12;
          n.alpha = lerp(n.alpha, n.targetAlpha, dt * 0.5);

          if (performanceTier !== 'reduced') {
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.size * 5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(74,144,255,${n.alpha * 0.1})`;
            ctx.fill();
          }

          ctx.beginPath();
          ctx.arc(n.x, n.y, n.size + Math.sin(n.pulse * 2) * 0.8, 0, Math.PI * 2);
          ctx.fillStyle = n.active ? `rgba(74,144,255,${n.alpha})` : `rgba(255,176,0,${n.alpha * 0.8})`;
          ctx.fill();
        });

        s.networkEdges.forEach(e => {
          const f = s.networkNodes[e.from], t = s.networkNodes[e.to];
          if (!f || !t) return;
          e.alpha = lerp(e.alpha, e.targetAlpha, dt * 0.3);
          ctx.beginPath();
          ctx.moveTo(f.x, f.y);
          ctx.lineTo(t.x, t.y);
          ctx.strokeStyle = `rgba(74,144,255,${e.alpha * 0.4})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        });

        // Logs typewriter
        if (s.activeLogIdx < BOOT_LOGS.length) {
          const cur = BOOT_LOGS[s.activeLogIdx];
          if (s.timer * 1000 >= cur.delay) {
            if (s.typeCharIdx < cur.text.length) {
              s.typedText += cur.text.charAt(s.typeCharIdx++);
              setLogs([...s.completedLogs, `> ${s.typedText}_`]);
            } else {
              s.completedLogs.push(`> ${cur.text}`);
              s.activeLogIdx++;
              s.typedText = '';
              s.typeCharIdx = 0;
            }
          }
        }

        ctx.font = '500 13px "JetBrains Mono"';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(74,144,255,0.35)';
        ctx.fillText('INFERENCE ENGINE INITIALIZING', s.W / 2, 38);

        if (s.timer >= DURATIONS.BOOT) {
          s.stage = 'DISSOLVE';
          s.timer = 0;
        }
      }

      // ──────────────────────────────────────────────────────────────────────
      // STAGE: DISSOLVE
      // ──────────────────────────────────────────────────────────────────────
      else if (s.stage === 'DISSOLVE') {
        const prog = clamp01(s.timer / DURATIONS.DISSOLVE);

        s.networkNodes.forEach(n => {
          const angle = Math.atan2(n.y - s.H / 2, n.x - s.W / 2);
          n.x += Math.cos(angle) * n.speed * dt * 260;
          n.y += Math.sin(angle) * n.speed * dt * 260;
          n.alpha = lerp(n.alpha, 0, dt * 2.5);
          if (n.alpha > 0.01) {
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(74,144,255,${n.alpha})`;
            ctx.fill();
          }
        });

        s.networkEdges.forEach(e => {
          const f = s.networkNodes[e.from], t = s.networkNodes[e.to];
          e.alpha = Math.max(0, e.alpha - dt * 3);
          if (e.alpha > 0 && f && t) {
            ctx.beginPath(); ctx.moveTo(f.x, f.y); ctx.lineTo(t.x, t.y);
            ctx.strokeStyle = `rgba(74,144,255,${e.alpha})`; ctx.stroke();
          }
        });

        if (prog > 0.4) setLogs([]);

        if (s.timer >= DURATIONS.DISSOLVE) {
          s.stage = 'QUOTE';
          s.timer = 0;
          s.quoteTimer = 0;
        }
      }

      // ──────────────────────────────────────────────────────────────────────
      // STAGE: QUOTE
      // ──────────────────────────────────────────────────────────────────────
      else if (s.stage === 'QUOTE') {
        s.quoteTimer += dt;
        const prog = clamp01(s.timer / DURATIONS.QUOTE);
        const masterIn = clamp01(s.quoteTimer * 2);

        const attnAlpha = outCubic(clamp01((s.quoteTimer - 0.4) / 0.8)) * 0.65;
        drawAttentionHeads(s.W / 2, s.H / 2, attnAlpha);

        ctx.save();
        for (let i = 0; i < 4; i++) {
          const yOff = Math.sin(s.quoteTimer * 0.6 + i * 1.2) * 70;
          ctx.beginPath();
          ctx.moveTo(0, s.H / 2 + yOff);
          ctx.quadraticCurveTo(s.W / 2, s.H / 2 + yOff - Math.cos(s.quoteTimer + i) * 55, s.W, s.H / 2 + yOff);
          ctx.strokeStyle = `rgba(74,144,255,${0.03 + i * 0.005})`;
          ctx.stroke();
        }
        ctx.restore();

        const wordsToShow = Math.min(QUOTE_WORDS.length, Math.floor(s.quoteTimer / 0.52) + 1);
        const sentence = QUOTE_WORDS.slice(0, wordsToShow).join(' ');
        const quoteAlpha = outCubic(masterIn) * (1 - clamp01((prog - 0.85) * 6));

        drawGlitchText(
          sentence,
          s.W / 2, s.H / 2,
          '500 48px "Space Grotesk"',
          s.glitchPulse * 0.4,
          quoteAlpha,
        );

        if (s.timer >= DURATIONS.QUOTE) {
          s.stage = 'GLITCH_OUT';
          s.timer = 0;
        }
      }

      // ──────────────────────────────────────────────────────────────────────
      // STAGE: GLITCH_OUT
      // ──────────────────────────────────────────────────────────────────────
      else if (s.stage === 'GLITCH_OUT') {
        const prog = clamp01(s.timer / DURATIONS.GLITCH_OUT);
        const burstIntensity = outExpo(prog);

        drawGlitchText(
          'Attention is something we attract',
          s.W / 2, s.H / 2,
          '500 48px "Space Grotesk"',
          burstIntensity * 1.8,
          1 - prog
        );

        if (s.timer >= DURATIONS.GLITCH_OUT) {
          s.stage = 'SDS_REVEAL';
          s.timer = 0;
        }
      }

      // ──────────────────────────────────────────────────────────────────────
      // STAGE: SDS_REVEAL
      // ──────────────────────────────────────────────────────────────────────
      else if (s.stage === 'SDS_REVEAL') {
        const prog = clamp01(s.timer / DURATIONS.SDS_REVEAL);
        
        let glitchAmt = 0;
        if (prog < 0.25) {
          glitchAmt = lerp(1.5, 0.1, prog / 0.25);
        } else if (prog > 0.8) {
          glitchAmt = (prog - 0.8) * 0.6;
        } else {
          glitchAmt = s.glitchPulse * 0.35 + (Math.random() < 0.05 ? Math.random() * 0.2 : 0);
        }

        const alpha = outExpo(clamp01(prog * 1.5));

        if (prog < 0.9) {
          const scanY = s.H * prog;
          ctx.beginPath();
          ctx.moveTo(0, scanY);
          ctx.lineTo(s.W, scanY);
          ctx.strokeStyle = `rgba(74, 144, 255, ${(1 - prog) * 0.45})`;
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }

        drawGlitchText(
          'SDS',
          s.W / 2, s.H / 2,
          'bold 160px "Space Grotesk"',
          glitchAmt,
          alpha
        );

        if (s.timer >= DURATIONS.SDS_REVEAL) {
          s.stage = 'MORPH';
          s.timer = 0;
        }
      }

      // ──────────────────────────────────────────────────────────────────────
      // STAGE: MORPH
      // ──────────────────────────────────────────────────────────────────────
      else if (s.stage === 'MORPH') {
        const prog = clamp01(s.timer / DURATIONS.MORPH);
        
        let glitchAmt = 0;
        let textToDraw = 'SDS';
        let alpha = 1;

        if (prog < 0.22) {
          glitchAmt = prog * 1.5;
          textToDraw = 'SDS';
        } else if (prog < 0.45) {
          glitchAmt = 2.2;
          textToDraw = Math.random() > 0.5 ? 'SDS' : 'Society for Data Science';
        } else {
          glitchAmt = lerp(1.2, 0.0, (prog - 0.45) / 0.55) + (s.glitchPulse * 0.25);
          textToDraw = 'Society for Data Science';
          alpha = clamp01((prog - 0.4) * 2);
        }

        if (prog > 0.15 && prog < 0.6) {
          ctx.fillStyle = `rgba(74, 144, 255, ${Math.random() * 0.12})`;
          ctx.fillRect(0, Math.random() * s.H, s.W, Math.random() * 80 + 10);
        }

        drawGlitchText(
          textToDraw,
          s.W / 2, s.H / 2,
          textToDraw === 'SDS' ? 'bold 160px "Space Grotesk"' : 'bold 72px "Space Grotesk"',
          glitchAmt,
          alpha
        );

        if (s.timer >= DURATIONS.MORPH) {
          s.stage = 'ZOOM_OUT';
          s.timer = 0;
        }
      }

      // ──────────────────────────────────────────────────────────────────────
      // STAGE: ZOOM_OUT
      // ──────────────────────────────────────────────────────────────────────
      else if (s.stage === 'ZOOM_OUT') {
        const prog = clamp01(s.timer / DURATIONS.ZOOM_OUT);
        s.zoomScale = lerp(1, 0.88, outCubic(prog));
        s.masterAlpha = 1 - outExpo(prog);

        ctx.save();
        ctx.translate(s.W / 2, s.H / 2);
        ctx.scale(s.zoomScale, s.zoomScale);

        drawGlitchText(
          'Society for Data Science',
          0, 0,
          'bold 72px "Space Grotesk"',
          s.glitchPulse * 0.3 * s.masterAlpha,
          s.masterAlpha
        );

        ctx.restore();

        if (s.timer >= DURATIONS.ZOOM_OUT) {
          s.stage = 'DONE';
          ctx.restore();
          onIntroComplete();
          cancelAnimationFrame(rafId);
          return;
        }
      }

      ctx.restore();
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, [fontsReady, onIntroComplete, performanceTier]);

  const handleSkip = () => {
    onIntroComplete();
  };

  // ── Render Cinematic Intro Canvas ──────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 bg-void overflow-hidden">
      <div className="scanlines pointer-events-none" />
      <canvas ref={canvasRef} className="block w-full h-full" />

      {/* Terminal boot logs */}
      {logs.length > 0 && (
        <div className="absolute bottom-8 left-8 right-8 md:right-auto md:w-[480px] font-mono-tech text-[11.5px] leading-relaxed text-glow-blue/80 bg-void/70 border border-glow-blue/10 backdrop-blur-md p-4 rounded-md pointer-events-none select-none">
          <div className="flex items-center gap-2 border-b border-glow-blue/10 pb-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-red-500/80 animate-ping" />
            <span className="font-semibold text-soft-white tracking-widest text-[9px]">
              AI MODEL BOOTSTRAPPING TERMINAL
            </span>
          </div>
          {logs.map((line, i) => (
            <div key={i} className="whitespace-pre-wrap font-mono-tech">{line}</div>
          ))}
        </div>
      )}

      {/* Skip button */}
      {showSkip && (
        <button
          onClick={handleSkip}
          className="absolute top-8 right-8 z-50 glass-button glass-button-active px-5 py-2 font-mono text-xs tracking-widest uppercase rounded cursor-pointer select-none"
        >
          Skip Intro
        </button>
      )}
    </div>
  );
}
