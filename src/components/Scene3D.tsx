'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface Scene3DProps {
  scrollProgress: number;
  activeProjectIndex?: number | null;
  onSelectProject?: (index: number) => void;
}

// ─── STAGE 1: Morphing Liquid Glass & Emerald Crystal Sphere (Hero Stage) ────

function LiquidGlassSphere({ scrollProgress }: { scrollProgress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();

    // Scale and opacity fade out when moving past Hero
    const visibility = Math.max(0, 1 - scrollProgress * 4.5);
    meshRef.current.scale.setScalar(visibility * (1.7 + Math.sin(time * 1.5) * 0.08));

    meshRef.current.rotation.x = time * 0.25;
    meshRef.current.rotation.y = time * 0.35;

    // Mouse tilt tracking
    const pointer = state.pointer;
    meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, pointer.x * 0.4, 0.1);
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <icosahedronGeometry args={[1.5, 32]} />
      <meshStandardMaterial
        color="#10b981"
        roughness={0.1}
        metalness={0.8}
        emissive="#059669"
        emissiveIntensity={0.25}
        wireframe={false}
      />
    </mesh>
  );
}

// ─── STAGE 2: 3D Cyber Matrix Tunnel (Manifesto Stage: 0.18 - 0.38) ──────────

function CyberMatrixTunnel({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const ringCount = 10;

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();

    let opacity = 0;
    if (scrollProgress >= 0.12 && scrollProgress <= 0.40) {
      opacity = Math.sin(((scrollProgress - 0.12) / 0.28) * Math.PI);
    }

    groupRef.current.rotation.z = time * 0.08 + scrollProgress * 3;
    groupRef.current.position.z = (scrollProgress - 0.25) * 18;

    groupRef.current.children.forEach((child, i) => {
      const line = child as THREE.LineSegments;
      if (line.material && line.material instanceof THREE.LineBasicMaterial) {
        line.material.opacity = opacity * (1 - (i / ringCount) * 0.4);
      }
    });
  });

  return (
    <group ref={groupRef} position={[0, 0, -5]}>
      {Array.from({ length: ringCount }).map((_, i) => (
        <lineSegments key={i} position={[0, 0, -i * 2.5]}>
          <wireframeGeometry args={[new THREE.TorusGeometry(3.5 + i * 0.2, 0.04, 8, 24)]} />
          <lineBasicMaterial color={i % 2 === 0 ? '#059669' : '#10b981'} transparent opacity={0} />
        </lineSegments>
      ))}
    </group>
  );
}

// ─── STAGE 3: Floating 3D Project Card Planes (Works Stage: 0.38 - 0.70) ──────

interface FloatingCardProps {
  position: [number, number, number];
  rotation: [number, number, number];
  title: string;
  category: string;
  color: string;
  index: number;
  scrollProgress: number;
  onSelect?: (index: number) => void;
}

function FloatingCard3D({
  position,
  rotation,
  title,
  category,
  color,
  index,
  scrollProgress,
  onSelect,
}: FloatingCardProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 340;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Pure white card background with green border
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 512, 340);

      ctx.strokeStyle = color;
      ctx.lineWidth = 10;
      ctx.strokeRect(6, 6, 500, 328);

      ctx.fillStyle = color;
      ctx.font = 'bold 20px monospace';
      ctx.fillText(`// ${category.toUpperCase()}`, 36, 65);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText(title, 36, 140);

      ctx.fillStyle = 'rgba(15, 23, 42, 0.15)';
      ctx.font = 'bold 90px monospace';
      ctx.fillText(`0${index + 1}`, 360, 280);

      ctx.fillStyle = color;
      ctx.font = 'bold 16px monospace';
      ctx.fillText('CLICK TO EXPLORE 3D CASE STUDY ↗', 36, 295);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, [title, category, color, index]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();

    let cardOpacity = 0;
    if (scrollProgress >= 0.30 && scrollProgress <= 0.75) {
      cardOpacity = Math.sin(((scrollProgress - 0.30) / 0.45) * Math.PI);
    }

    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    if (mat) {
      mat.opacity = cardOpacity;
      mat.transparent = true;
    }

    const floatY = Math.sin(time * 1.5 + index * 0.9) * 0.3;
    const scrollDolly = (scrollProgress - 0.45) * 20;

    meshRef.current.position.y = position[1] + floatY - scrollDolly * (0.2 + (index % 3) * 0.15);
    meshRef.current.position.x = position[0] + Math.sin(time * 0.6 + index) * 0.15;

    const targetScale = hovered ? 1.15 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(3.2 * targetScale, 2.1 * targetScale, 1), 0.1);

    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, rotation[0] + Math.sin(time + index) * 0.05, 0.1);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, rotation[1] + Math.cos(time + index) * 0.05, 0.1);
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => onSelect?.(index)}
    >
      <planeGeometry args={[1, 1, 16, 16]} />
      <meshStandardMaterial
        map={texture}
        roughness={0.2}
        metalness={0.1}
        side={THREE.DoubleSide}
        emissive={hovered ? color : '#ffffff'}
        emissiveIntensity={hovered ? 0.3 : 0}
      />
    </mesh>
  );
}

const FLOATING_PROJECTS = [
  { title: 'Fotobooth Pro', category: 'Software', color: '#059669', pos: [-5, 3, -1] as [number, number, number], rot: [0.1, 0.2, -0.05] as [number, number, number] },
  { title: 'BNC Express', category: 'Editorial', color: '#2563eb', pos: [5, 2, -3] as [number, number, number], rot: [-0.1, -0.25, 0.05] as [number, number, number] },
  { title: 'Brand Systems', category: 'Branding', color: '#d97706', pos: [-4.5, -2.5, -4] as [number, number, number], rot: [0.15, 0.3, -0.1] as [number, number, number] },
  { title: 'Aura App', category: 'UI/UX', color: '#7c3aed', pos: [4.8, -3, -2] as [number, number, number], rot: [-0.1, -0.2, 0.08] as [number, number, number] },
  { title: 'Culinary Photography', category: 'Photography', color: '#dc2626', pos: [0, 4.5, -6] as [number, number, number], rot: [0.2, 0, 0] as [number, number, number] },
  { title: 'Print & Packaging', category: 'Print', color: '#4f46e5', pos: [0, -4.5, -5] as [number, number, number], rot: [-0.2, 0, 0] as [number, number, number] },
];

// ─── STAGE 4: Orbital Atomic System (Process Stage: 0.70 - 0.85) ─────────────

function OrbitalAtomicSystem({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();

    let opacity = 0;
    if (scrollProgress >= 0.65 && scrollProgress <= 0.88) {
      opacity = Math.sin(((scrollProgress - 0.65) / 0.23) * Math.PI);
    }

    groupRef.current.rotation.x = time * 0.3;
    groupRef.current.rotation.y = time * 0.5;
    groupRef.current.position.y = (scrollProgress - 0.75) * 8;

    groupRef.current.children.forEach((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        (child.material as THREE.MeshBasicMaterial).opacity = opacity;
        (child.material as THREE.MeshBasicMaterial).transparent = true;
      }
    });
  });

  return (
    <group ref={groupRef} position={[0, 0, -3]}>
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[3, 0.03, 16, 64]} />
        <meshBasicMaterial color="#059669" />
      </mesh>
      <mesh rotation={[-Math.PI / 3, Math.PI / 4, 0]}>
        <torusGeometry args={[3.6, 0.03, 16, 64]} />
        <meshBasicMaterial color="#10b981" />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, Math.PI / 6]}>
        <torusGeometry args={[4.2, 0.03, 16, 64]} />
        <meshBasicMaterial color="#3b82f6" />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color="#10b981" emissive="#059669" emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}

// ─── STAGE 5: Supernova Particle Wave (Contact Stage: 0.85 - 1.0) ────────────

function SupernovaParticleTunnel({ scrollProgress }: { scrollProgress: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 2500;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const c1 = new THREE.Color('#059669');
    const c2 = new THREE.Color('#10b981');
    const c3 = new THREE.Color('#3b82f6');

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50;

      const mix = Math.random() > 0.5 ? c1 : Math.random() > 0.5 ? c2 : c3;
      col[i * 3] = mix.r;
      col[i * 3 + 1] = mix.g;
      col[i * 3 + 2] = mix.b;
    }

    return [pos, col];
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();

    const speed = scrollProgress > 0.8 ? 0.25 : 0.04;
    pointsRef.current.rotation.y = time * speed + scrollProgress * 2;
    pointsRef.current.rotation.x = Math.sin(time * 0.1) * 0.15;
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
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ─── Camera Rig & Dynamic Mouse Parallax ──────────────────────────────────────

function CameraRig({ scrollProgress }: { scrollProgress: number }) {
  const { camera, pointer } = useThree();

  useFrame(() => {
    const targetZ = 10 - scrollProgress * 14;
    const targetY = (scrollProgress - 0.5) * -8;
    const targetX = pointer.x * 2.5;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.06);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.06);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.06);

    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ─── MAIN SCENE COMPONENT EXPORT ──────────────────────────────────────────────

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
        {/* Porcelain Light Background */}
        <color attach="background" args={['#fbfbfd']} />

        {/* Ambient & Directional Lighting for Light Theme */}
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={1.8} color="#10b981" />
        <pointLight position={[-10, -10, -10]} intensity={1.2} color="#059669" />
        <directionalLight position={[0, 10, 5]} intensity={1.8} />

        <CameraRig scrollProgress={scrollProgress} />

        {/* 5 Distinct Light-Themed WebGL Stages */}
        <LiquidGlassSphere scrollProgress={scrollProgress} />
        <CyberMatrixTunnel scrollProgress={scrollProgress} />
        <OrbitalAtomicSystem scrollProgress={scrollProgress} />
        <SupernovaParticleTunnel scrollProgress={scrollProgress} />

        {/* Floating 3D Otsuka Air Project Cards */}
        {FLOATING_PROJECTS.map((proj, idx) => (
          <FloatingCard3D
            key={idx}
            index={idx}
            title={proj.title}
            category={proj.category}
            color={proj.color}
            position={proj.pos}
            rotation={proj.rot}
            scrollProgress={scrollProgress}
            onSelect={onSelectProject}
          />
        ))}
      </Canvas>
    </div>
  );
}
