import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 3D Particles/Nodes visualizer
function NeuralCloud({ count }) {
  const pointsRef = useRef();

  // Generate procedural coordinates in clusters
  const [particles, positions, colors] = useMemo(() => {
    const pts = [];
    const posArr = new Float32Array(count * 3);
    const colArr = new Float32Array(count * 3);

    const centers = [
      new THREE.Vector3(-1.8, 1.2, -0.5),
      new THREE.Vector3(1.8, -1.0, 0.5),
      new THREE.Vector3(0.5, 1.8, 0.8),
      new THREE.Vector3(-0.8, -1.5, -1.0)
    ];

    for (let i = 0; i < count; i++) {
      const center = centers[i % centers.length];
      const offset = new THREE.Vector3(
        (Math.random() - 0.5) * 2.8,
        (Math.random() - 0.5) * 2.8,
        (Math.random() - 0.5) * 2.8
      );
      
      const pos = center.clone().add(offset);
      const color = i % 7 === 0 ? '#FFB000' : '#4A90FF'; // Amber accent, mostly blue

      pts.push({
        origin: pos.clone(),
        speed: Math.random() * 0.35 + 0.1,
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

      posAttr.setX(idx, ox + Math.sin(t * p.speed + p.phase) * 0.12);
      posAttr.setY(idx, oy + Math.cos(t * p.speed * 0.8 + p.phase) * 0.12);
      posAttr.setZ(idx, oz + Math.sin(t * p.speed * 1.2 + p.phase) * 0.12);
    });

    posAttr.needsUpdate = true;

    // Slowly spin the cluster
    pointsRef.current.rotation.y = t * 0.025;
    pointsRef.current.rotation.x = t * 0.01;
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
        size={0.048}
        vertexColors
        transparent
        opacity={0.28}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// 3D Synapses (connection lines)
function NeuralSynapses({ count }) {
  const lineRef = useRef();

  const [positions] = useMemo(() => {
    const centers = [
      new THREE.Vector3(-1.8, 1.2, -0.5),
      new THREE.Vector3(1.8, -1.0, 0.5),
      new THREE.Vector3(0.5, 1.8, 0.8),
      new THREE.Vector3(-0.8, -1.5, -1.0)
    ];

    const nodes = [];
    for (let i = 0; i < 55; i++) {
      const center = centers[i % centers.length];
      nodes.push(center.clone().add(new THREE.Vector3(
        (Math.random() - 0.5) * 2.5,
        (Math.random() - 0.5) * 2.5,
        (Math.random() - 0.5) * 2.5
      )));
    }

    const posList = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = nodes[i].distanceTo(nodes[j]);
        if (dist < 2.0 && Math.random() > 0.45) {
          posList.push(nodes[i].x, nodes[i].y, nodes[i].z);
          posList.push(nodes[j].x, nodes[j].y, nodes[j].z);
        }
      }
    }

    const posArr = new Float32Array(posList);
    return [posArr];
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!lineRef.current) return;
    
    // Rotate connections at identical speed
    lineRef.current.rotation.y = t * 0.025;
    lineRef.current.rotation.x = t * 0.01;
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
        opacity={0.03}
        linewidth={1}
        depthWrite={false}
      />
    </lineSegments>
  );
}

// Camera controller that bounds camera vectors based on window scroll height
function ScrollCameraHandler() {
  const targetCamPos = useRef(new THREE.Vector3(0.8, 0, 4.5));

  useFrame((state) => {
    const docH = document.documentElement.scrollHeight - window.innerHeight || 1;
    const progress = window.scrollY / docH; // 0.0 -> 1.0

    // Compute target coordinates based on scroll progress
    if (progress < 0.25) {
      // Hero section: cluster shifted right
      const subProg = progress / 0.25;
      targetCamPos.current.set(
        THREE.MathUtils.lerp(0.8, -1.2, subProg),
        THREE.MathUtils.lerp(0, 0.4, subProg),
        THREE.MathUtils.lerp(4.5, 4.0, subProg)
      );
    } else if (progress < 0.5) {
      // Pipeline: zoomed in and left
      const subProg = (progress - 0.25) / 0.25;
      targetCamPos.current.set(
        THREE.MathUtils.lerp(-1.2, 1.4, subProg),
        THREE.MathUtils.lerp(0.4, -0.6, subProg),
        THREE.MathUtils.lerp(4.0, 4.4, subProg)
      );
    } else if (progress < 0.7) {
      // Domains: lower right angle
      const subProg = (progress - 0.5) / 0.2;
      targetCamPos.current.set(
        THREE.MathUtils.lerp(1.4, 0, subProg),
        THREE.MathUtils.lerp(-0.6, 0, subProg),
        THREE.MathUtils.lerp(4.4, 5.5, subProg)
      );
    } else {
      // Knowledge Graph / Token Flow / Community / Future: pull camera back into starry backdrop
      const subProg = (progress - 0.7) / 0.3;
      targetCamPos.current.set(
        THREE.MathUtils.lerp(0, -0.6, subProg),
        THREE.MathUtils.lerp(0, 0.6, subProg),
        THREE.MathUtils.lerp(5.5, 4.8, subProg)
      );
    }

    // Smoothly interpolate current camera position and lookAt target
    state.camera.position.lerp(targetCamPos.current, 0.05);
    
    // Smoothly focus camera look point
    const lookAtTarget = new THREE.Vector3(0, 0, 0);
    const m = new THREE.Matrix4().lookAt(state.camera.position, lookAtTarget, new THREE.Vector3(0, 1, 0));
    const q = new THREE.Quaternion().setFromRotationMatrix(m);
    state.camera.quaternion.slerp(q, 0.05);
  });

  return null;
}

export default function ThreeBackground({ performanceTier }) {
  if (performanceTier === 'reduced') {
    return null; // Don't mount background visualizer on low-perf devices
  }

  const particleCount = performanceTier === 'high' ? 1400 : 500;

  return (
    <div className="w-full h-full absolute inset-0 select-none bg-transparent">
      {/* Background radial glows mapping behind sections */}
      <div className="absolute top-[10%] right-[5%] w-[500px] h-[500px] rounded-full bg-sds-blue/8 blur-[150px] pointer-events-none radial-glow" />
      <div className="absolute bottom-[20%] left-[10%] w-[600px] h-[600px] rounded-full bg-sds-amber/[0.02] blur-[180px] pointer-events-none radial-glow-amber" />

      <Canvas
        camera={{ position: [0.8, 0, 4.5], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.65} />
        <pointLight position={[10, 10, 10]} intensity={0.9} />
        
        <NeuralCloud count={particleCount} />
        <NeuralSynapses count={particleCount} />
        <ScrollCameraHandler />
      </Canvas>
    </div>
  );
}
