import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reveal — wraps children with a scroll-triggered entrance animation.
 *
 * Props:
 *  direction  'up' | 'down' | 'left' | 'right' | 'none'  (default: 'up')
 *  delay      seconds before animation fires               (default: 0)
 *  duration   animation duration in seconds                (default: 0.7)
 *  distance   pixels to slide in from                      (default: 40)
 *  className  forwarded to the motion.div wrapper
 */
export default function Reveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.7,
  distance = 40,
  className = '',
}) {
  const offsets = {
    up:    { y: distance },
    down:  { y: -distance },
    left:  { x: distance },
    right: { x: -distance },
    none:  {},
  };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offsets[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // custom ease-out-expo
      }}
    >
      {children}
    </motion.div>
  );
}
