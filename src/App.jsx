import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Lenis from 'lenis';

// Hooks
import { usePerformanceTier } from './hooks/usePerformanceTier';
import { useIntroGate } from './hooks/useIntroGate';

// Components
import IntroCanvas from './components/IntroCanvas';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import ScrollProgressTracker from './components/ScrollProgressTracker';
import ScrollProgressLine from './components/ScrollProgressLine';
import HeroSection from './components/HeroSection';
import PipelineSection from './components/PipelineSection';
import DomainsSection from './components/DomainsSection';
import KnowledgeGraphSection from './components/KnowledgeGraphSection';
import TokenFlowSection from './components/TokenFlowSection';
import CommunitySection from './components/CommunitySection';
import FutureSection from './components/FutureSection';
import NetworkMagnitudeSection from './components/NetworkMagnitudeSection';
import Footer from './components/Footer';
import ThreeBackground from './components/ThreeBackground';

export default function App() {
  const performanceTier = usePerformanceTier();
  const { isPlaying, completeIntro } = useIntroGate();

  // Initialize Lenis Smooth Scrolling when homepage is mounted
  useEffect(() => {
    if (isPlaying) return;

    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth easeOutExpo
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    // Request Animation Frame loop for Lenis scroll ticks
    let animationId;
    function raf(time) {
      lenis.raf(time);
      animationId = requestAnimationFrame(raf);
    }
    animationId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationId);
      lenis.destroy();
    };
  }, [isPlaying]);

  return (
    <>
      {/* Dynamic SEO & Metadata Head elements */}
      <Helmet>
        <title>SDS | Society for Data Science</title>
        <meta name="description" content="Enter the mind of Artificial Intelligence. Society for Data Science (SDS) is a premium collegiate community pushing boundaries in Machine Learning, Deep Learning, and Neural Networks." />
        <meta name="theme-color" content="#020611" />
        
        {/* OpenGraph social share data */}
        <meta property="og:title" content="SDS | Society for Data Science" />
        <meta property="og:description" content="Enter the mind of Artificial Intelligence. Collegiate data science community exploring transformer engineering, neural networks, and computer vision." />
        <meta property="og:site_name" content="Society for Data Science" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* Cinematic Intro state */}
      {isPlaying ? (
        <IntroCanvas 
          onIntroComplete={completeIntro} 
          performanceTier={performanceTier} 
        />
      ) : (
        <div className="relative min-h-screen bg-void text-soft-white overflow-hidden flex flex-col items-stretch">
          
          {/* Global Visual Enhancements */}
          <div className="scanlines" />
          <div className="fixed inset-0 pointer-events-none z-0">
            <ThreeBackground performanceTier={performanceTier} />
          </div>
          
          {/* Global Page Interactive elements */}
          <CustomCursor />
          <ScrollProgressLine />
          <Navbar />
          <ScrollProgressTracker />

          {/* Homepage Sections */}
          <main className="flex flex-col items-stretch">
            <HeroSection performanceTier={performanceTier} />
            <PipelineSection />
            <DomainsSection />
            <KnowledgeGraphSection />
            <TokenFlowSection />
            <CommunitySection />
            <FutureSection />
            <NetworkMagnitudeSection />
          </main>

          {/* Footer CLI Terminal */}
          <Footer />
        </div>
      )}
    </>
  );
}
