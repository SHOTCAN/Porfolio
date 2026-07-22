'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface Scene3DProps {
  scrollProgress: number;
  activeProjectIndex?: number | null;
  onSelectProject?: (index: number) => void;
}

// ─── Floating 3D Project Card Mesh (Otsuka Air / Lusion Style) ──────────────

interface FloatingCardProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  title: string;
  category: string;
  color: string;
  index: number;
  scrollProgress: number;
  onSelect?: (index: number) => void;
}

function FloatingCard({
  position,
  rotation,
  scale,
  title,
  category,
  color,
  index,
  scrollProgress,
  onSelect,
}: FloatingCardProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Dynamic canvas texture with project title & category
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 340;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Dark glass card backdrop
      const grad = ctx.createLinearGradient(0, 0, 512, 340);
      grad.addColorStop(0, '#13131a');
      grad.addColorStop(1, '#1a1a24');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 340);

      // Border glow
      ctx.strokeStyle = color;
      ctx.lineWidth = 8;
      ctx.strokeRect(4, 4, 504, 332);

      // Category Pill
      ctx.fillStyle = color;
      ctx.font = 'bold 18px monospace';
      ctx.fillText(`// ${category.toUpperCase()}`, 36, 60);

      // Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText(title, 36, 130);

      // Number badge
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.font = 'bold 80px monospace';
      ctx.fillText(`0${index + 1}`, 360, 280);

      // Subtitle tag
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.font = '16px sans-serif';
      ctx.fillText('CLICK TO EXPLORE 3D CASE STUDY', 36, 290);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, [title, category, color, index]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();

    // Sinusoidal floating animation (Otsuka Air drift)
    const floatY = Math.sin(time * 1.2 + index * 0.8) * 0.25;
    const floatRotX = Math.sin(time * 0.8 + index) * 0.05;
    const floatRotY = Math.cos(time * 0.9 + index) * 0.05;

    // Scroll parallax shift
    const scrollOffset = (scrollProgress - 0.3) * 15;

    meshRef.current.position.y = position[1] + floatY - scrollOffset * (0.2 + (index % 3) * 0.1);
    meshRef.current.position.x = position[0] + Math.sin(time * 0.5 + index) * 0.1;

    // Hover scale lerp
    const targetScale = hovered ? 1.15 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(scale[0] * targetScale, scale[1] * targetScale, scale[2]), 0.1);

    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, rotation[0] + floatRotX, 0.1);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, rotation[1] + floatRotY, 0.1);
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => onSelect?.(index)}
    >
      <planeGeometry args={[3.2, 2.1, 16, 16]} />
      <meshStandardMaterial
        map={texture}
        roughness={0.2}
        metalness={0.8}
        side={THREE.DoubleSide}
        emissive={hovered ? color : '#000000'}
        emissiveIntensity={hovered ? 0.4 : 0}
      />
    </mesh>
  );
}

// ─── 3D Central Morphing Geometry & Particles ────────────────────────────────

function MorphingCore({ scrollProgress }: { scrollProgress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.LineSegments>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (meshRef.current) {
      meshRef.current.rotation.x = time * 0.2 + scrollProgress * Math.PI * 2;
      meshRef.current.rotation.y = time * 0.3 + scrollProgress * Math.PI;

      // Scale pulse
      const pulse = 1 + Math.sin(time * 2) * 0.05;
      meshRef.current.scale.set(pulse, pulse, pulse);
    }

    if (wireframeRef.current) {
      wireframeRef.current.rotation.x = -time * 0.15;
      wireframeRef.current.rotation.y = -time * 0.25;
    }
  });

  return (
    <group position={[0, 0, -2]}>
      {/* Chrome/Glass Torus Knot */}
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[1.5, 0.4, 128, 32]} />
        <meshStandardMaterial
          color="#10b981"
          roughness={0.1}
          metalness={0.9}
          wireframe={false}
          emissive="#059669"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Outer Glowing Wireframe Cage */}
      <lineSegments ref={wireframeRef}>
        <wireframeGeometry args={[new THREE.IcosahedronGeometry(2.8, 2)]} />
        <lineBasicMaterial color="#34d399" transparent opacity={0.25} />
      </lineSegments>
    </group>
  );
}

// ─── 3D Starfield & Particle Vortex ──────────────────────────────────────────

function ParticleVortex({ scrollProgress }: { scrollProgress: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 2500;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const colorA = new THREE.Color('#10b981');
    const colorB = new THREE.Color('#6366f1');
    const colorC = new THREE.Color('#22d3ee');

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 45;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 45;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40;

      const mixColor = Math.random() > 0.5 ? colorA : Math.random() > 0.5 ? colorB : colorC;
      col[i * 3] = mixColor.r;
      col[i * 3 + 1] = mixColor.g;
      col[i * 3 + 2] = mixColor.b;
    }

    return [pos, col];
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();

    pointsRef.current.rotation.y = time * 0.05 + scrollProgress * 2;
    pointsRef.current.rotation.x = Math.sin(time * 0.03) * 0.2;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ─── Camera Controller & Mouse Parallax ──────────────────────────────────────

function CameraRig({ scrollProgress }: { scrollProgress: number }) {
  const { camera, pointer } = useThree();

  useFrame(() => {
    // Camera dolly through 3D space based on scroll
    const targetZ = 10 - scrollProgress * 12;
    const targetY = (scrollProgress - 0.5) * -6;

    // Mouse parallax pan
    const targetX = pointer.x * 2.5;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);

    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ─── Project Card 3D Layout Coordinates ─────────────────────────────────────

const FLOATING_PROJECTS = [
  { title: 'Fotobooth Pro', category: 'Software', color: '#10b981', pos: [-5, 3, -1] as [number, number, number], rot: [0.1, 0.2, -0.05] as [number, number, number] },
  { title: 'BNC Express', category: 'Editorial', color: '#3b82f6', pos: [5, 2, -3] as [number, number, number], rot: [-0.1, -0.25, 0.05] as [number, number, number] },
  { title: 'Brand Systems', category: 'Branding', color: '#f59e0b', pos: [-4.5, -2.5, -4] as [number, number, number], rot: [0.15, 0.3, -0.1] as [number, number, number] },
  { title: 'Aura App', category: 'UI/UX', color: '#8b5cf6', pos: [4.8, -3, -2] as [number, number, number], rot: [-0.1, -0.2, 0.08] as [number, number, number] },
  { title: 'Culinary Photography', category: 'Photography', color: '#ef4444', pos: [0, 4.5, -6] as [number, number, number], rot: [0.2, 0, 0] as [number, number, number] },
  { title: 'Print & Packaging', category: 'Print', color: '#6366f1', pos: [0, -4.5, -5] as [number, number, number], rot: [-0.2, 0, 0] as [number, number, number] },
];

// ─── Main Scene Export ───────────────────────────────────────────────────────

export default function Scene3D({ scrollProgress, onSelectProject }: Scene3DProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60, near: 0.1, far: 100 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ pointerEvents: 'auto' }}
      >
        <color attach="background" args={['#0a0a0f']} />

        {/* Ambient & Directional Lighting */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#10b981" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#6366f1" />
        <directionalLight position={[0, 10, 5]} intensity={1.2} />

        <CameraRig scrollProgress={scrollProgress} />
        <MorphingCore scrollProgress={scrollProgress} />
        <ParticleVortex scrollProgress={scrollProgress} />

        {/* Floating 3D Cards World (Otsuka Air style) */}
        {FLOATING_PROJECTS.map((proj, idx) => (
          <FloatingCard
            key={idx}
            index={idx}
            title={proj.title}
            category={proj.category}
            color={proj.color}
            position={proj.pos}
            rotation={proj.rot}
            scale={[1, 1, 1]}
            scrollProgress={scrollProgress}
            onSelect={onSelectProject}
          />
        ))}
      </Canvas>
    </div>
  );
}
