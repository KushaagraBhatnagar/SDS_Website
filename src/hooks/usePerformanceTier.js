import { useState, useEffect } from 'react';

export function usePerformanceTier() {
  const [tier, setTier] = useState('high');

  useEffect(() => {
    // 1. Check prefers-reduced-motion
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotionQuery.matches) {
      setTier('reduced');
      return;
    }

    // 2. Check for WebGL support
    const hasWebGL = () => {
      try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && 
          (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      } catch (e) {
        return false;
      }
    };

    if (!hasWebGL()) {
      setTier('reduced');
      return;
    }

    // 3. Check hardware metrics
    const cores = navigator.hardwareConcurrency || 4;
    // navigator.deviceMemory is standard in Chrome, undefined in Safari/Firefox
    const memory = navigator.deviceMemory || 8; 
    const isMobile = window.matchMedia('(hover: none)').matches;

    if (cores <= 4 || memory <= 4 || isMobile) {
      setTier('low');
    } else {
      setTier('high');
    }

    // Listener for motion preferences
    const handleMotionChange = (e) => {
      if (e.matches) {
        setTier('reduced');
      }
    };
    
    reducedMotionQuery.addEventListener('change', handleMotionChange);
    return () => {
      reducedMotionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  return tier;
}
