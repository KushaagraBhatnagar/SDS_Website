import React from 'react';
import { motion } from 'framer-motion';
import { 
  Database, ShieldCheck, Binary, MoveRight, Eye, Layers, Zap, BookOpen, Lightbulb 
} from 'lucide-react';

const PIPELINE_STEPS = [
  {
    phase: "01",
    title: "Raw Data",
    description: "Intesting multi-modal streams: raw text, tabular CSVs, video matrices, and log files.",
    details: "FORMATS: JSON, Parquet, Audio Waveforms, H.264",
    icon: Database,
    color: "#4A90FF"
  },
  {
    phase: "02",
    title: "Data Cleaning",
    description: "Imputing missing values, removing outliers, and normalizing distributions across clusters.",
    details: "PIPELINES: Spark, Pandas, NumPy, Quantile Scaling",
    icon: ShieldCheck,
    color: "#4A90FF"
  },
  {
    phase: "03",
    title: "Tokenization",
    description: "Splitting streams into subword tokens using Byte-Pair Encoding (BPE) algorithms.",
    details: "VOCABULARY: Tiktoken, SentencePiece (32,000 tokens)",
    icon: Binary,
    color: "#4A90FF"
  },
  {
    phase: "04",
    title: "Vector Embeddings",
    description: "Mapping discrete subword tokens onto high-dimensional dense numeric vector spaces.",
    details: "DIMENSION: 1536-D Semantic Manifold Spaces",
    icon: MoveRight,
    color: "#4A90FF"
  },
  {
    phase: "05",
    title: "Attention Blocks",
    description: "Computing Query, Key, and Value matrices to map token dependencies dynamically.",
    details: "MECHANISM: Multi-Head Self-Attention (8 Attention Heads)",
    icon: Eye,
    color: "#FFB000" // Highlight key AI step in Amber
  },
  {
    phase: "06",
    title: "Transformer Layers",
    description: "Multiplexing token vectors through feed-forward layers, MLP blocks, and residual connections.",
    details: "LAYERS: 32 Blocks, Layer Normalization, RoPE",
    icon: Layers,
    color: "#4A90FF"
  },
  {
    phase: "07",
    title: "Model Inference",
    description: "Sampling log probabilities to autoregressively decode outputs via KV caching.",
    details: "SAMPLING: Temperature = 0.7, Top-P = 0.95",
    icon: Zap,
    color: "#4A90FF"
  },
  {
    phase: "08",
    title: "Knowledge Synthesis",
    description: "Compiling raw model predictions into structured insights, logs, and representations.",
    details: "OUTPUT: Unified Semantic Graphs, Logical Deductions",
    icon: BookOpen,
    color: "#FFB000"
  },
  {
    phase: "09",
    title: "Downstream Innovation",
    description: "Deploying multi-agent frameworks, neural web systems, and predictive products.",
    details: "APPLICATIONS: Autonomous Coding, Robotics, Agent Swarms",
    icon: Lightbulb,
    color: "#FFB000"
  }
];

export default function PipelineSection() {
  return (
    <section 
      id="knowledge" 
      className="py-24 bg-transparent border-t border-glow-blue/5 relative overflow-hidden"
    >
      {/* Background visual element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-radial-glow opacity-30 pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        
        {/* Title details */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="font-mono text-[10px] tracking-widest text-sds-amber font-mono-tech uppercase">
            STAGE_03 // KNOWLEDGE
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-soft-white mt-2 font-display">
            The AI Pipeline Journey
          </h2>
          <p className="text-xs md:text-sm text-soft-white/40 mt-3 font-mono">
            How raw data converts into intelligent innovations, matching the layers of a Deep Transformer network.
          </p>
        </div>

        {/* Vertical Pipeline timeline */}
        <div className="relative">
          {/* Glowing central path line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-glow-blue via-sds-amber to-glow-blue/10 transform -translate-x-1/2"></div>
          
          <div className="space-y-16">
            {PIPELINE_STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={step.phase}
                  className={`flex flex-col md:flex-row items-stretch md:items-center relative ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Central Node Circle */}
                  <div className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full bg-void border-2 transform -translate-x-1/2 z-20 flex items-center justify-center transition-all duration-300 shadow-[0_0_12px_rgba(74,144,255,0.4)]"
                    style={{ borderColor: step.color }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: step.color }} />
                  </div>

                  {/* Spacer or Offset for wide layouts */}
                  <div className="w-full md:w-1/2"></div>

                  {/* Card content container */}
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, cubicBezier: [0.16, 1, 0.3, 1] }}
                    className="w-full md:w-[45%] pl-12 md:pl-0"
                  >
                    <div className="glass-panel interactive-card p-6 rounded-lg text-left relative overflow-hidden border-glow-blue-hover">
                      {/* Gradient glow edge */}
                      <div 
                        className="absolute top-0 left-0 w-1 h-full"
                        style={{ backgroundColor: step.color }}
                      />

                      {/* Header details */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-mono text-[10px] tracking-wider text-soft-white/40">
                          PHASE_{step.phase}
                        </span>
                        <div className="w-8 h-8 rounded bg-void border border-glow-blue/10 flex items-center justify-center">
                          <Icon className="w-4 h-4" style={{ color: step.color }} />
                        </div>
                      </div>

                      {/* Title & Desc */}
                      <h3 className="text-lg font-bold font-display text-soft-white mb-2">
                        {step.title}
                      </h3>
                      <p className="text-xs text-soft-white/60 leading-relaxed mb-4">
                        {step.description}
                      </p>

                      {/* Tech Specifications */}
                      <div className="bg-void/50 border border-glow-blue/5 p-2.5 rounded font-mono text-[9px] text-glow-blue/80 font-mono-tech">
                        {step.details}
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
