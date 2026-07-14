import React from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

export default function ScrollProgressLine() {
  const { scrollYProgress } = useScroll();

  // Smooth spring so the line eases rather than jumping
  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 25,
    mass: 0.3,
  });

  const fillHeight = useTransform(smooth, [0, 1], ['0%', '100%']);
  const pulseTop = useTransform(smooth, [0, 1], ['0%', '100%']);

  return (
    <div
      className="fixed right-5 top-0 h-screen w-[2px] z-[45] pointer-events-none"
      aria-hidden="true"
    >
      {/* Dim track */}
      <div className="absolute inset-0 bg-glow-blue/[0.06]" />

      {/* Amber → Blue fill */}
      <motion.div
        className="absolute top-0 left-0 w-full origin-top"
        style={{
          height: fillHeight,
          background: 'linear-gradient(to bottom, #FFB000, #4A90FF)',
          boxShadow:
            '0 0 8px rgba(74,144,255,0.6), 0 0 18px rgba(255,176,0,0.22)',
        }}
      />

      {/* Travelling pulse dot */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full"
        style={{
          top: pulseTop,
          background: '#FFB000',
          boxShadow: '0 0 10px 3px rgba(255,176,0,0.7)',
          marginTop: '-5px',
        }}
      />
    </div>
  );
}
