'use client';

import { useRef, useMemo, useCallback, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Scene3DProps {
  scrollProgress: number;
}

interface SceneContentProps {
  scrollProgress: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

/** Remap scroll to 0-1 within a scroll sub-range */
function scrollRange(scroll: number, start: number, end: number): number {
  return clamp((scroll - start) / (end - start), 0, 1);
}

/** Smooth-step easing */
function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

function lerpColor(c1: THREE.Color, c2: THREE.Color, t: number): THREE.Color {
  return new THREE.Color().copy(c1).lerp(c2, t);
}

// ─── Color Palette ────────────────────────────────────────────────────────────

const COLORS = {
  indigo: new THREE.Color('#6366f1'),
  cyan: new THREE.Color('#22d3ee'),
  violet: new THREE.Color('#8b5cf6'),
  white: new THREE.Color('#e2e8f0'),
};

function getParticleColor(scroll: number): THREE.Color {
  if (scroll < 0.15) return COLORS.indigo.clone();
  if (scroll < 0.35) return lerpColor(COLORS.indigo, COLORS.cyan, scrollRange(scroll, 0.15, 0.35));
  if (scroll < 0.7) return lerpColor(COLORS.cyan, COLORS.violet, scrollRange(scroll, 0.35, 0.7));
  if (scroll < 0.85) return lerpColor(COLORS.violet, COLORS.white, scrollRange(scroll, 0.7, 0.85));
  return COLORS.white.clone();
}

// ─── Sprite Texture (circular dot) ───────────────────────────────────────────

function createCircleTexture(): THREE.Texture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.4, 'rgba(255,255,255,0.8)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// ─── Custom Shader: Icosahedron ──────────────────────────────────────────────

const ICOSAHEDRON_VERTEX = /* glsl */ `
  //
  // Simplex 3D noise (inline, no imports)
  //
  vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 1.0/7.0;
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  uniform float uTime;
  uniform float uNoiseScale;
  uniform float uNoiseIntensity;

  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main(){
    vNormal = normalize(normalMatrix * normal);

    float noise = snoise(position * uNoiseScale + uTime * 0.3);
    vec3 displaced = position + normal * noise * uNoiseIntensity;

    vWorldPosition = (modelMatrix * vec4(displaced, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const ICOSAHEDRON_FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uOpacity;

  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main(){
    // Direction-based gradient
    float mixFactor = vNormal.y * 0.5 + 0.5;
    vec3 baseColor = mix(uColorA, uColorB, mixFactor);

    // Fresnel glow on edges
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 3.0);
    vec3 fresnelColor = uColorB * fresnel * 1.5;

    vec3 finalColor = baseColor + fresnelColor;
    gl_FragColor = vec4(finalColor, uOpacity);
  }
`;

// ─── Icosahedron Mesh ────────────────────────────────────────────────────────

function FloatingIcosahedron({ scrollProgress }: { scrollProgress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.LineSegments>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1.6, 1), []);
  const wireGeometry = useMemo(
    () => new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.6, 1)),
    []
  );

  const shaderUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uNoiseScale: { value: 1.5 },
      uNoiseIntensity: { value: 0.25 },
      uColorA: { value: new THREE.Color('#6366f1') },
      uColorB: { value: new THREE.Color('#22d3ee') },
      uOpacity: { value: 1.0 },
    }),
    []
  );

  // Mouse tracking
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current || !materialRef.current) return;

    const t = state.clock.getElapsedTime();

    // Animate uniforms
    materialRef.current.uniforms.uTime.value = t;

    // Scroll-driven visibility: dissolve after hero
    const heroT = scrollRange(scrollProgress, 0.1, 0.3);
    const opacity = 1 - smoothstep(heroT);
    materialRef.current.uniforms.uOpacity.value = opacity;

    // Scale pulse
    const pulse = 1 + Math.sin(t * 0.8) * 0.04;
    const dissolveScale = 1 + heroT * 2;
    const s = pulse * dissolveScale;
    meshRef.current.scale.set(s, s, s);

    // Rotation
    meshRef.current.rotation.y += delta * 0.15;
    meshRef.current.rotation.x += delta * 0.08;

    // Mouse parallax rotation
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    meshRef.current.rotation.x += (my * 0.3 - meshRef.current.rotation.x) * 0.02;
    meshRef.current.rotation.y += (mx * 0.3 - meshRef.current.rotation.y) * 0.02;

    // Sync wireframe
    if (wireRef.current) {
      wireRef.current.scale.copy(meshRef.current.scale);
      wireRef.current.rotation.copy(meshRef.current.rotation);
      wireRef.current.visible = opacity > 0.01;
      const mat = wireRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = opacity * 0.6;
    }

    // Hide entirely when dissolved
    meshRef.current.visible = opacity > 0.01;
  });

  return (
    <group>
      <mesh ref={meshRef} geometry={geometry}>
        <shaderMaterial
          ref={materialRef}
          vertexShader={ICOSAHEDRON_VERTEX}
          fragmentShader={ICOSAHEDRON_FRAGMENT}
          uniforms={shaderUniforms}
          transparent
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <lineSegments ref={wireRef} geometry={wireGeometry}>
        <lineBasicMaterial color="#6366f1" transparent opacity={0.6} />
      </lineSegments>
    </group>
  );
}

// ─── Particle Field ──────────────────────────────────────────────────────────

const PARTICLE_COUNT = 2000;

function ParticleField({ scrollProgress }: { scrollProgress: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);

  const spriteTexture = useMemo(() => createCircleTexture(), []);

  // Initial positions & velocities stored as refs for performance
  const { positions, seeds } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const sd = new Float32Array(PARTICLE_COUNT * 3); // unique per-particle seed for animation
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 20;
      pos[i3 + 1] = (Math.random() - 0.5) * 20;
      pos[i3 + 2] = (Math.random() - 0.5) * 20;
      sd[i3] = Math.random() * Math.PI * 2;
      sd[i3 + 1] = Math.random() * Math.PI * 2;
      sd[i3 + 2] = 0.3 + Math.random() * 0.7; // speed multiplier
    }
    return { positions: pos, seeds: sd };
  }, []);

  const basePositions = useMemo(() => new Float32Array(positions), [positions]);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const t = state.clock.getElapsedTime();
    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    // Scroll-driven spread factor
    const spread = 1 + scrollProgress * 2.5;

    // Section transitions
    const isVortex = scrollRange(scrollProgress, 0.7, 0.85);
    const isConverge = scrollRange(scrollProgress, 0.85, 1.0);
    const isGrid = scrollRange(scrollProgress, 0.35, 0.7);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const sx = seeds[i3];
      const sy = seeds[i3 + 1];
      const sp = seeds[i3 + 2];

      let bx = basePositions[i3];
      let by = basePositions[i3 + 1];
      let bz = basePositions[i3 + 2];

      // Base drift
      const driftX = Math.sin(t * 0.1 * sp + sx) * 0.3;
      const driftY = Math.cos(t * 0.08 * sp + sy) * 0.2 + t * 0.02 * sp;
      const driftZ = Math.sin(t * 0.06 * sp + sx + sy) * 0.2;

      let px = bx * spread + driftX;
      let py = by * spread + driftY;
      let pz = bz * spread + driftZ;

      // Wrap particles that drift too far
      py = ((py % 20) + 30) % 20 - 10;

      // Grid formation (loose constellation)
      if (isGrid > 0) {
        const gridX = (Math.round(bx * 2) / 2) * spread;
        const gridY = (Math.round(by * 2) / 2) * spread;
        const gridZ = (Math.round(bz * 2) / 2) * spread;
        const gt = smoothstep(isGrid) * 0.4; // partial grid alignment
        px = lerp(px, gridX + driftX * 0.2, gt);
        py = lerp(py, gridY + driftY * 0.1, gt);
        pz = lerp(pz, gridZ + driftZ * 0.2, gt);
      }

      // Vortex shape
      if (isVortex > 0) {
        const angle = sx + t * 0.5 * sp;
        const radius = 3 + by * 0.5;
        const vx = Math.cos(angle) * radius;
        const vy = by * spread * 0.5;
        const vz = Math.sin(angle) * radius;
        const vt = smoothstep(isVortex);
        px = lerp(px, vx, vt);
        py = lerp(py, vy, vt);
        pz = lerp(pz, vz, vt);
      }

      // Converge to center
      if (isConverge > 0) {
        const ct = smoothstep(isConverge);
        px = lerp(px, driftX * 0.5, ct);
        py = lerp(py, driftY * 0.3, ct);
        pz = lerp(pz, driftZ * 0.5, ct);
      }

      arr[i3] = px;
      arr[i3 + 1] = py;
      arr[i3 + 2] = pz;
    }

    posAttr.needsUpdate = true;

    // Color transition
    if (materialRef.current) {
      const col = getParticleColor(scrollProgress);
      materialRef.current.color.lerp(col, 0.05);
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={PARTICLE_COUNT}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.06}
        color="#6366f1"
        map={spriteTexture}
        transparent
        opacity={0.7}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

// ─── Scene Camera Controller ─────────────────────────────────────────────────

function CameraController({ scrollProgress }: { scrollProgress: number }) {
  const { camera } = useThree();
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0, z: 8 });

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  useFrame(() => {
    const cam = camera as THREE.PerspectiveCamera;

    // Scroll-driven camera position
    // Hero: close, centered; About: pull back; Works: side angle; Skills: top; Contact: close again
    let tx: number, ty: number, tz: number;

    if (scrollProgress < 0.15) {
      tx = 0;
      ty = 0;
      tz = 8;
    } else if (scrollProgress < 0.35) {
      const t = scrollRange(scrollProgress, 0.15, 0.35);
      tx = lerp(0, 1, smoothstep(t));
      ty = lerp(0, 0.5, smoothstep(t));
      tz = lerp(8, 14, smoothstep(t));
    } else if (scrollProgress < 0.7) {
      const t = scrollRange(scrollProgress, 0.35, 0.7);
      tx = lerp(1, -0.5, smoothstep(t));
      ty = lerp(0.5, 1, smoothstep(t));
      tz = lerp(14, 12, smoothstep(t));
    } else if (scrollProgress < 0.85) {
      const t = scrollRange(scrollProgress, 0.7, 0.85);
      tx = lerp(-0.5, 0, smoothstep(t));
      ty = lerp(1, 2, smoothstep(t));
      tz = lerp(12, 10, smoothstep(t));
    } else {
      const t = scrollRange(scrollProgress, 0.85, 1.0);
      tx = lerp(0, 0, smoothstep(t));
      ty = lerp(2, 0, smoothstep(t));
      tz = lerp(10, 6, smoothstep(t));
    }

    // Smooth interpolation
    targetRef.current.x = lerp(targetRef.current.x, tx, 0.03);
    targetRef.current.y = lerp(targetRef.current.y, ty, 0.03);
    targetRef.current.z = lerp(targetRef.current.z, tz, 0.03);

    // Apply with mouse parallax
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;

    cam.position.x = targetRef.current.x + mx * 0.3;
    cam.position.y = targetRef.current.y + my * 0.2;
    cam.position.z = targetRef.current.z;

    cam.lookAt(0, 0, 0);
  });

  return null;
}

// ─── Fog Controller ──────────────────────────────────────────────────────────

function FogController({ scrollProgress }: { scrollProgress: number }) {
  const { scene } = useThree();

  useFrame(() => {
    // Add fog in the works section
    const worksT = scrollRange(scrollProgress, 0.35, 0.7);
    const fogDensity = smoothstep(worksT) * 0.03;

    if (fogDensity > 0.001) {
      if (!scene.fog || !(scene.fog instanceof THREE.FogExp2)) {
        scene.fog = new THREE.FogExp2('#000000', fogDensity);
      } else {
        scene.fog.density = fogDensity;
      }
    } else {
      scene.fog = null;
    }
  });

  return null;
}

// ─── Post-Processing ─────────────────────────────────────────────────────────

function PostEffects({ scrollProgress }: { scrollProgress: number }) {
  // Bloom intensity varies with scroll
  const bloomIntensity = useMemo(() => {
    // Higher bloom in hero & contact
    if (scrollProgress < 0.15) return 1.2;
    if (scrollProgress < 0.35) return lerp(1.2, 0.6, scrollRange(scrollProgress, 0.15, 0.35));
    if (scrollProgress < 0.7) return 0.6;
    if (scrollProgress < 0.85) return lerp(0.6, 0.8, scrollRange(scrollProgress, 0.7, 0.85));
    return lerp(0.8, 1.8, scrollRange(scrollProgress, 0.85, 1.0));
  }, [scrollProgress]);

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={bloomIntensity}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <Vignette
        offset={0.3}
        darkness={0.7}
        blendFunction={BlendFunction.NORMAL}
      />
      <Noise
        opacity={0.05}
        blendFunction={BlendFunction.OVERLAY}
      />
    </EffectComposer>
  );
}

// ─── Scene Content (rendered inside Canvas) ──────────────────────────────────

function SceneContent({ scrollProgress }: SceneContentProps) {
  return (
    <>
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={0.1} />

      <CameraController scrollProgress={scrollProgress} />
      <FogController scrollProgress={scrollProgress} />

      <FloatingIcosahedron scrollProgress={scrollProgress} />
      <ParticleField scrollProgress={scrollProgress} />

      <PostEffects scrollProgress={scrollProgress} />
    </>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Scene3D({ scrollProgress }: Scene3DProps) {
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
        dpr={[1, 1.5]}
        frameloop="always"
        camera={{ fov: 60, near: 0.1, far: 100, position: [0, 0, 8] }}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
        }}
        style={{ pointerEvents: 'auto' }}
      >
        <SceneContent scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
