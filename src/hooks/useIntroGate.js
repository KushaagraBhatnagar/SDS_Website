import { useState, useEffect } from 'react';

export function useIntroGate() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isSkipped, setIsSkipped] = useState(false);
  const [isReturning, setIsReturning] = useState(false);

  useEffect(() => {
    // Check if user has already visited in this session
    const hasSeenIntro = sessionStorage.getItem('sds_intro_completed');
    if (hasSeenIntro) {
      setIsReturning(true);
      setIsPlaying(false);
    }
  }, []);

  const completeIntro = () => {
    sessionStorage.setItem('sds_intro_completed', 'true');
    setIsPlaying(false);
  };

  const skipIntro = () => {
    setIsSkipped(true);
    completeIntro();
  };

  return {
    isPlaying,
    isSkipped,
    isReturning,
    skipIntro,
    completeIntro,
  };
}
