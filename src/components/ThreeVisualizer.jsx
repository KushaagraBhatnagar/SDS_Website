import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// 3D Particles/Nodes visualizer inside Canvas
function NeuralCloud({ count }) {
  const pointsRef = useRef();

  // Generate procedural coordinates in clusters
  const [particles, positions, colors] = useMemo(() => {
    const pts = [];
    const posArr = new Float32Array(count * 3);
    const colArr = new Float32Array(count * 3);

    const centers = [
      new THREE.Vector3(-1.2, 0.8, -0.5),
      new THREE.Vector3(1.2, -0.6, 0.5),
      new THREE.Vector3(0.2, 1.2, 0.8),
      new THREE.Vector3(-0.5, -1.0, -1.0)
    ];

    for (let i = 0; i < count; i++) {
      const center = centers[i % centers.length];
      const offset = new THREE.Vector3(
        (Math.random() - 0.5) * 1.6,
        (Math.random() - 0.5) * 1.6,
        (Math.random() - 0.5) * 1.6
      );
      
      const pos = center.clone().add(offset);
      const color = i % 8 === 0 ? '#FFB000' : '#4A90FF'; // Amber accent, mostly blue

      pts.push({
        origin: pos.clone(),
        speed: Math.random() * 0.4 + 0.1,
        phase: Math.random() * Math.PI * 2
      });

      posArr[i * 3] = pos.x;
      posArr[i * 3 + 1] = pos.y;
      posArr[i * 3 + 2] = pos.z;

      const c = new THREE.Color(color);
      colArr[i * 3] = c.r;
      colArr[i * 3 + 1] = c.g;
      colArr[i * 3 + 2] = c.b;
    }

    return [pts, posArr, colArr];
  }, [count]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!pointsRef.current) return;

    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position;

    // Slowly drift nodes procedurally
    particles.forEach((p, idx) => {
      const ox = p.origin.x;
      const oy = p.origin.y;
      const oz = p.origin.z;

      posAttr.setX(idx, ox + Math.sin(t * p.speed + p.phase) * 0.08);
      posAttr.setY(idx, oy + Math.cos(t * p.speed * 0.8 + p.phase) * 0.08);
      posAttr.setZ(idx, oz + Math.sin(t * p.speed * 1.2 + p.phase) * 0.08);
    });

    posAttr.needsUpdate = true;

    // Rotate cloud slowly
    pointsRef.current.rotation.y = t * 0.04;
    pointsRef.current.rotation.x = t * 0.015;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </points>
  );
}

// 3D Synapses (connection lines)
function NeuralSynapses({ count }) {
  const lineRef = useRef();

  // Create connections between some random nodes
  const [positions, linesData] = useMemo(() => {
    const centers = [
      new THREE.Vector3(-1.2, 0.8, -0.5),
      new THREE.Vector3(1.2, -0.6, 0.5),
      new THREE.Vector3(0.2, 1.2, 0.8),
      new THREE.Vector3(-0.5, -1.0, -1.0)
    ];

    const nodes = [];
    for (let i = 0; i < 40; i++) {
      const center = centers[i % centers.length];
      nodes.push(center.clone().add(new THREE.Vector3(
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 1.5
      )));
    }

    const posList = [];
    const lines = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = nodes[i].distanceTo(nodes[j]);
        if (dist < 1.3 && Math.random() > 0.4) {
          posList.push(nodes[i].x, nodes[i].y, nodes[i].z);
          posList.push(nodes[j].x, nodes[j].y, nodes[j].z);
          lines.push({
            p1: nodes[i].clone(),
            p2: nodes[j].clone(),
            speed: Math.random() * 0.5 + 0.1,
            phase: Math.random() * Math.PI
          });
        }
      }
    }

    const posArr = new Float32Array(posList);
    return [posArr, lines];
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!lineRef.current) return;
    
    // Rotate connections at same speed
    lineRef.current.rotation.y = t * 0.04;
    lineRef.current.rotation.x = t * 0.015;
  });

  return (
    <lineSegments ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color="#4A90FF"
        transparent
        opacity={0.12}
        linewidth={1}
      />
    </lineSegments>
  );
}

// Fallback static graphic for reduced-motion / low-perf devices
function StaticSVGPlaceholder() {
  return (
    <div className="w-full h-full flex items-center justify-center relative p-8">
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-radial-glow opacity-60"></div>
      
      <svg 
        viewBox="0 0 500 500" 
        className="w-full max-w-[400px] h-auto text-glow-blue/40 relative z-10 animate-pulse-subtle"
        aria-label="Static neural transformer visualizer diagram"
      >
        <defs>
          <radialGradient id="radialGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4A90FF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#020611" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {/* Connection paths */}
        <path d="M 150 150 L 350 150 L 250 350 Z" stroke="rgba(74,144,255,0.2)" strokeWidth="1.5" fill="none" />
        <path d="M 100 250 L 150 150 L 400 250 L 350 150" stroke="rgba(74,144,255,0.15)" strokeWidth="1" fill="none" />
        <path d="M 100 250 L 250 350 L 400 250 L 250 100 L 100 250" stroke="rgba(255,176,0,0.2)" strokeWidth="1.5" fill="none" />
        
        {/* Core nodes */}
        <circle cx="250" cy="100" r="10" fill="#FFB000" className="glow-text-amber" />
        <circle cx="150" cy="150" r="6" fill="#4A90FF" />
        <circle cx="350" cy="150" r="6" fill="#4A90FF" />
        <circle cx="100" cy="250" r="8" fill="#4A90FF" />
        <circle cx="400" cy="250" r="8" fill="#4A90FF" />
        <circle cx="250" cy="350" r="12" fill="#4A90FF" />

        {/* Small attention graph overlays */}
        <circle cx="250" cy="100" r="22" stroke="rgba(255,176,0,0.3)" strokeWidth="1" strokeDasharray="3,3" fill="none" />
        <circle cx="250" cy="350" r="30" stroke="rgba(74,144,255,0.2)" strokeWidth="1" fill="none" />
      </svg>
    </div>
  );
}

export default function ThreeVisualizer({ performanceTier }) {
  if (performanceTier === 'reduced') {
    return <StaticSVGPlaceholder />;
  }

  const particleCount = performanceTier === 'high' ? 1200 : 400;

  return (
    <div className="w-full h-full min-h-[450px] relative select-none">
      <div className="absolute inset-0 bg-radial-glow pointer-events-none opacity-45"></div>

      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={1.2} />
        
        <NeuralCloud count={particleCount} />
        <NeuralSynapses count={particleCount} />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate={true}
          autoRotateSpeed={0.35}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 2.2}
        />
      </Canvas>
    </div>
  );
}
