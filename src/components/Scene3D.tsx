'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface Scene3DProps {
  scrollProgress: number;
  activeProjectIndex?: number | null;
  onSelectProject?: (index: number) => void;
}

// ─── STAGE 1: Morphing Liquid Chrome Blob (Hero Stage: 0.0 - 0.18) ────────────

function LiquidChromeBlob({ scrollProgress }: { scrollProgress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();

    // Scale and opacity fade out when moving to Stage 2
    const visibility = Math.max(0, 1 - scrollProgress * 5); // Visible during 0.0 - 0.2
    meshRef.current.scale.setScalar(visibility * (1.8 + Math.sin(time * 1.5) * 0.1));

    meshRef.current.rotation.x = time * 0.3;
    meshRef.current.rotation.y = time * 0.4;

    // Mouse tilt attraction
    const pointer = state.pointer;
    meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, pointer.x * 0.5, 0.1);
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <icosahedronGeometry args={[1.6, 32]} />
      <meshStandardMaterial
        ref={materialRef}
        color="#10b981"
        roughness={0.15}
        metalness={0.9}
        emissive="#047857"
        emissiveIntensity={0.3}
        wireframe={false}
      />
    </mesh>
  );
}

// ─── STAGE 2: 3D Cyber Matrix Tunnel (Manifesto Stage: 0.18 - 0.38) ──────────

function CyberMatrixTunnel({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const ringCount = 12;

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();

    // Fade in during 0.15-0.25, fade out during 0.35-0.45
    let opacity = 0;
    if (scrollProgress >= 0.12 && scrollProgress <= 0.40) {
      opacity = Math.sin(((scrollProgress - 0.12) / 0.28) * Math.PI);
    }

    groupRef.current.rotation.z = time * 0.1 + scrollProgress * 4;
    groupRef.current.position.z = (scrollProgress - 0.25) * 20;

    // Update children line opacity
    groupRef.current.children.forEach((child, i) => {
      const line = child as THREE.LineSegments;
      if (line.material && line.material instanceof THREE.LineBasicMaterial) {
        line.material.opacity = opacity * (1 - (i / ringCount) * 0.5);
      }
    });
  });

  return (
    <group ref={groupRef} position={[0, 0, -5]}>
      {Array.from({ length: ringCount }).map((_, i) => (
        <lineSegments key={i} position={[0, 0, -i * 2.5]}>
          <wireframeGeometry args={[new THREE.TorusGeometry(3.5 + i * 0.2, 0.05, 8, 24)]} />
          <lineBasicMaterial color={i % 2 === 0 ? '#10b981' : '#6366f1'} transparent opacity={0} />
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
      const grad = ctx.createLinearGradient(0, 0, 512, 340);
      grad.addColorStop(0, '#13131a');
      grad.addColorStop(1, '#1a1a24');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 340);

      ctx.strokeStyle = color;
      ctx.lineWidth = 10;
      ctx.strokeRect(6, 6, 500, 328);

      ctx.fillStyle = color;
      ctx.font = 'bold 20px monospace';
      ctx.fillText(`// ${category.toUpperCase()}`, 36, 65);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText(title, 36, 140);

      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.font = 'bold 90px monospace';
      ctx.fillText(`0${index + 1}`, 360, 280);

      ctx.fillStyle = 'rgba(255,255,255,0.7)';
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

    // Visibility window during works section
    let cardOpacity = 0;
    if (scrollProgress >= 0.30 && scrollProgress <= 0.75) {
      cardOpacity = Math.sin(((scrollProgress - 0.30) / 0.45) * Math.PI);
    }

    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    if (mat) {
      mat.opacity = cardOpacity;
      mat.transparent = true;
    }

    // Otsuka Air float drift
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
        metalness={0.8}
        side={THREE.DoubleSide}
        emissive={hovered ? color : '#000000'}
        emissiveIntensity={hovered ? 0.5 : 0}
      />
    </mesh>
  );
}

const FLOATING_PROJECTS = [
  { title: 'Fotobooth Pro', category: 'Software', color: '#10b981', pos: [-5, 3, -1] as [number, number, number], rot: [0.1, 0.2, -0.05] as [number, number, number] },
  { title: 'BNC Express', category: 'Editorial', color: '#3b82f6', pos: [5, 2, -3] as [number, number, number], rot: [-0.1, -0.25, 0.05] as [number, number, number] },
  { title: 'Brand Systems', category: 'Branding', color: '#f59e0b', pos: [-4.5, -2.5, -4] as [number, number, number], rot: [0.15, 0.3, -0.1] as [number, number, number] },
  { title: 'Aura App', category: 'UI/UX', color: '#8b5cf6', pos: [4.8, -3, -2] as [number, number, number], rot: [-0.1, -0.2, 0.08] as [number, number, number] },
  { title: 'Culinary Photography', category: 'Photography', color: '#ef4444', pos: [0, 4.5, -6] as [number, number, number], rot: [0.2, 0, 0] as [number, number, number] },
  { title: 'Print & Packaging', category: 'Print', color: '#6366f1', pos: [0, -4.5, -5] as [number, number, number], rot: [-0.2, 0, 0] as [number, number, number] },
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

    groupRef.current.rotation.x = time * 0.4;
    groupRef.current.rotation.y = time * 0.6;
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
      {/* 3 Orbital Rings */}
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[3, 0.03, 16, 64]} />
        <meshBasicMaterial color="#10b981" />
      </mesh>
      <mesh rotation={[-Math.PI / 3, Math.PI / 4, 0]}>
        <torusGeometry args={[3.6, 0.03, 16, 64]} />
        <meshBasicMaterial color="#3b82f6" />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, Math.PI / 6]}>
        <torusGeometry args={[4.2, 0.03, 16, 64]} />
        <meshBasicMaterial color="#8b5cf6" />
      </mesh>
      {/* Center Core Node */}
      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color="#34d399" emissive="#10b981" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

// ─── STAGE 5: Supernova Particle Tunnel (Contact Stage: 0.85 - 1.0) ───────────

function SupernovaParticleTunnel({ scrollProgress }: { scrollProgress: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 3000;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const c1 = new THREE.Color('#10b981');
    const c2 = new THREE.Color('#6366f1');
    const c3 = new THREE.Color('#22d3ee');

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

    // Accelerate particle swirl on deep scroll
    const speed = scrollProgress > 0.8 ? 0.3 : 0.05;
    pointsRef.current.rotation.y = time * speed + scrollProgress * 3;
    pointsRef.current.rotation.x = Math.sin(time * 0.1) * 0.2;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.09}
        vertexColors
        transparent
        opacity={0.7}
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
    const targetX = pointer.x * 3;

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
        <color attach="background" args={['#0a0a0f']} />

        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.8} color="#10b981" />
        <pointLight position={[-10, -10, -10]} intensity={1.2} color="#6366f1" />
        <directionalLight position={[0, 10, 5]} intensity={1.5} />

        <CameraRig scrollProgress={scrollProgress} />

        {/* 5 Distinct Morphing 3D Environments */}
        <LiquidChromeBlob scrollProgress={scrollProgress} />
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
