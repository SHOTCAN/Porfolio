'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { getAssetPath } from '@/utils/assets';

gsap.registerPlugin(ScrollTrigger);

const Scene3D = dynamic(() => import('@/components/Scene3D'), { ssr: false });

/* ═══════════════════════════════════════════
   TYPES & DATA
   ═══════════════════════════════════════════ */
export interface ProjectItem {
  id: string;
  title: string;
  category: 'UI/UX' | 'Branding' | 'Software' | 'Editorial' | 'Photography' | 'Print';
  year: string;
  image: string;
  gallery: string[];
  client: string;
  role: string;
  tools: string[];
  description: string;
  accent: string;
  impactStats?: { label: string; value: string }[];
}

const PROJECTS: ProjectItem[] = [
  {
    id: 'fotobooth',
    title: 'Fotobooth Pro System',
    category: 'Software',
    year: '2025',
    image: '/images/projects/fotobooth-pro.png',
    gallery: [
      '/images/projects/fotobooth-pro.png',
      '/images/projects/fotobooth-app.webp',
      '/images/projects/fotobooth-event.webp',
      '/images/projects/fotobooth-output.webp',
    ],
    client: 'Event Technologies Co.',
    role: 'Lead UI/UX & Desktop Developer',
    tools: ['Python', 'PyQt6', 'Photoshop', 'Figma'],
    description: 'Professional event photobooth desktop application featuring live camera feed integration, customizable layout templates, instant QR code sharing, and cloud gallery synchronization.',
    accent: '#10b981',
    impactStats: [
      { label: 'Event Captures', value: '50,000+' },
      { label: 'Instant Shares', value: '98.4%' },
      { label: 'Cloud Uptime', value: '99.9%' },
    ],
  },
  {
    id: 'bnc-express',
    title: 'BNC Express Profile',
    category: 'Editorial',
    year: '2024',
    image: '/images/projects/compro-cover.webp',
    gallery: [
      '/images/projects/compro-cover.webp',
      '/images/projects/compro-about.webp',
      '/images/projects/compro-service.webp',
      '/images/projects/compro-armada.webp',
      '/images/projects/compro-visi-misi.webp',
      '/images/projects/compro-keunggulan.webp',
      '/images/projects/compro-clients.webp',
    ],
    client: 'PT BNC Express Logistics',
    role: 'Graphic Designer & Layout Artist',
    tools: ['InDesign', 'Illustrator', 'Photoshop'],
    description: 'Comprehensive 16-page editorial company profile for a major logistics provider. Designed with crisp grid structures, typography hierarchy, and high-impact fleet photography.',
    accent: '#3b82f6',
    impactStats: [
      { label: 'Pages Designed', value: '16 Pages' },
      { label: 'Print Quality', value: '300 DPI' },
      { label: 'Client Approval', value: '100%' },
    ],
  },
  {
    id: 'brand-identity',
    title: 'Brand Systems & Logos',
    category: 'Branding',
    year: '2024–2025',
    image: '/images/projects/logo-crispy-krinj.webp',
    gallery: [
      '/images/projects/logo-crispy-krinj.webp',
      '/images/projects/logo-bnc-express.webp',
      '/images/projects/logo-expo-express.webp',
      '/images/projects/logo-cahaya-kontruksi.webp',
      '/images/projects/logo-fashion-france.webp',
      '/images/projects/logo-jewalen.webp',
      '/images/projects/logo-dkv.webp',
      '/images/projects/logo-pameran-perdana.webp',
    ],
    client: 'Various Commercial Clients',
    role: 'Brand Designer',
    tools: ['Illustrator', 'Photoshop', 'Figma'],
    description: 'Versatile collection of brand identities, vector logos, mark designs, and visual guidelines created for retail, construction, F&B, and logistics businesses.',
    accent: '#f59e0b',
    impactStats: [
      { label: 'Logos Crafted', value: '25+ Marks' },
      { label: 'Industries Served', value: '8 Sectors' },
    ],
  },
  {
    id: 'aura-app',
    title: 'Aura Marketplace UI',
    category: 'UI/UX',
    year: '2025',
    image: '/images/projects/aura-login.webp',
    gallery: [
      '/images/projects/aura-login.webp',
      '/images/projects/aura-home.webp',
      '/images/projects/aura-detail.webp',
      '/images/projects/aura-profile.webp',
    ],
    client: 'Aura Digital App',
    role: 'Product UI Designer',
    tools: ['Figma', 'Prototyping', 'After Effects'],
    description: 'Next-gen mobile e-commerce interface featuring dark glassmorphic design system, smooth micro-interactions, seamless checkout flow, and custom icon sets.',
    accent: '#8b5cf6',
    impactStats: [
      { label: 'Screens Designed', value: '40+ Views' },
      { label: 'User Rating', value: '4.9 / 5.0' },
    ],
  },
  {
    id: 'food-posters',
    title: 'Culinary Photography & Posters',
    category: 'Photography',
    year: '2024',
    image: '/images/projects/food-photo-1.webp',
    gallery: [
      '/images/projects/food-photo-1.webp',
      '/images/projects/food-photo-2.webp',
      '/images/projects/food-photo-3.webp',
      '/images/projects/poster-bakso.webp',
      '/images/projects/poster-esteh.webp',
      '/images/projects/poster-sistagor.webp',
      '/images/projects/poster-animar.webp',
    ],
    client: 'F&B Brands & Restaurants',
    role: 'Commercial Photographer & Art Director',
    tools: ['Camera Studio', 'Lightroom', 'Photoshop'],
    description: 'High-end commercial food photography paired with vibrant print and digital marketing poster designs tailored for culinary campaigns.',
    accent: '#ef4444',
  },
  {
    id: 'editorial-print',
    title: 'Magazine & Print Media',
    category: 'Print',
    year: '2024',
    image: '/images/projects/majalah-cover.webp',
    gallery: [
      '/images/projects/majalah-cover.webp',
      '/images/projects/book-cover-tangga.webp',
      '/images/projects/brosur-crispy.webp',
      '/images/projects/menu-trifold.webp',
      '/images/projects/id-card-menu.webp',
      '/images/projects/mockup-gelas.webp',
      '/images/projects/mug-design.webp',
    ],
    client: 'Publishing & Hospitality',
    role: 'Print & Layout Specialist',
    tools: ['InDesign', 'Photoshop', 'Illustrator'],
    description: 'Creative print collaterals including magazine covers, trifold menu brochures, merchandise packaging mockups, and corporate ID card branding.',
    accent: '#6366f1',
  },
  {
    id: 'sticker-art',
    title: 'Character Stickers & Merch',
    category: 'Print',
    year: '2024',
    image: '/images/projects/stiker-marvel.webp',
    gallery: [
      '/images/projects/stiker-marvel.webp',
      '/images/projects/stiker-deadpool.webp',
      '/images/projects/stiker-frozen.webp',
      '/images/projects/stiker-spongebob.webp',
      '/images/projects/pin-design.webp',
    ],
    client: 'Pop Culture & Print Merch',
    role: 'Illustrator & Prepress Artist',
    tools: ['Illustrator', 'Photoshop', 'Vector Art'],
    description: 'Detailed character sticker illustrations, die-cut artwork, button pins, and custom merchandise items crafted for high-quality vinyl printing.',
    accent: '#ec4899',
  },
  {
    id: 'product-shots',
    title: 'Commercial Product Studio',
    category: 'Photography',
    year: '2024',
    image: '/images/projects/product-bakso-atas.webp',
    gallery: [
      '/images/projects/product-bakso-atas.webp',
      '/images/projects/product-bakso-45.webp',
      '/images/projects/product-sosis-atas.webp',
      '/images/projects/product-sosis-bright.webp',
      '/images/projects/food-product-karawaci.webp',
    ],
    client: 'Retail Food Manufacturers',
    role: 'Studio Photographer & Retoucher',
    tools: ['Studio Lighting', 'Lightroom', 'Photoshop'],
    description: 'Precision studio product photography with professional multi-point lighting, color grading, and texture retouching for consumer packaging and ads.',
    accent: '#f97316',
  },
];

const SKILLS = [
  'Photoshop', 'Illustrator', 'Figma', 'After Effects',
  'Premiere Pro', 'Lightroom', 'InDesign', 'Photography',
  'Branding', 'UI/UX Design', 'Typography', 'Motion Graphics',
  'Python', 'DaVinci Resolve', 'Prepress Print', 'Vector Art'
];

const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Discovery & Creative Strategy',
    desc: 'Analyzing brand goals, researching market positioning, defining visual direction, and establishing design moodboards.',
    accent: '#10b981',
  },
  {
    step: '02',
    title: 'Brand Architecture & Design Systems',
    desc: 'Crafting precision vector logos, typography pairings, grid structures, and reusable component libraries.',
    accent: '#3b82f6',
  },
  {
    step: '03',
    title: 'Interactive Prototyping & Motion',
    desc: 'Building responsive UI/UX screen flows, 3D visual assets, fluid micro-interactions, and motion graphics previews.',
    accent: '#8b5cf6',
  },
  {
    step: '04',
    title: 'Production, Prepress & Delivery',
    desc: 'Ensuring 300 DPI pre-press color accuracy, digital asset optimization, handoff guidelines, and live deployment.',
    accent: '#f59e0b',
  },
];

const FAQS = [
  {
    q: 'What visual design services do you specialize in?',
    a: 'I specialize in full-spectrum visual design including Brand Identity Systems, UI/UX Mobile & Web Interfaces, Editorial Company Profiles, Commercial Photography, Prepress Print Collaterals, and Custom Desktop Software Interfaces.',
  },
  {
    q: 'What is your current role at Anomali Digital?',
    a: 'I serve as Graphic Designer at Anomali Digital since February 2025, leading visual identity design, brand collaterals, and digital creative assets for various corporate and commercial clients.',
  },
  {
    q: 'Can you handle both print production and digital UI design?',
    a: 'Yes, absolutely! Having graduated in Visual Communication Design (DKV) and trained in commercial photography and software design, I seamlessly bridge prepress print accuracy with digital product UI/UX.',
  },
  {
    q: 'How can we initiate a new project or hire you?',
    a: 'You can easily click the "Copy Email" button or use the Interactive Project Estimator on this page to send a direct message. I will respond with a tailored creative proposal within 24 hours.',
  },
];

/* ═══════════════════════════════════════════
   AUDIO SYNTHESIZER
   ═══════════════════════════════════════════ */
function playSynthSound(freq = 440, type: OscillatorType = 'sine', duration = 0.08) {
  try {
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Audio fallback
  }
}

/* ═══════════════════════════════════════════
   TEXT SCRAMBLE HOOK
   ═══════════════════════════════════════════ */
function useTextScramble(text: string) {
  const [display, setDisplay] = useState(text);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()';

  const scramble = useCallback(() => {
    let iteration = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setDisplay(
        text.split('').map((char, index) => {
          if (index < iteration) return text[index];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('')
      );
      iteration += 0.5;
      if (iteration >= text.length && intervalRef.current) {
        clearInterval(intervalRef.current);
        setDisplay(text);
      }
    }, 25);
  }, [text, chars]);

  const reset = useCallback(() => setDisplay(text), [text]);
  return { display, scramble, reset };
}

/* ═══════════════════════════════════════════
   INTERACTIVE CANVAS PLAYGROUND
   ═══════════════════════════════════════════ */
function CanvasPlayground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 400);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: Array<{ x: number; y: number; vx: number; vy: number; radius: number; color: string; alpha: number }> = [];
    const colors = ['#10b981', '#34d399', '#6366f1', '#22d3ee', '#3b82f6'];

    const spawnParticles = (x: number, y: number) => {
      for (let i = 0; i < 4; i++) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          radius: Math.random() * 6 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
        });
      }
    };

    let animId: number;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.015;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spawnParticles(x, y);
    };

    canvas.addEventListener('pointermove', handlePointerMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('pointermove', handlePointerMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      className="relative w-full h-[320px] md:h-[420px] rounded-3xl glass-card overflow-hidden border border-emerald-500/20 shadow-2xl cursor-crosshair group"
      onMouseDown={() => setIsDrawing(true)}
      onMouseUp={() => setIsDrawing(false)}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10" />
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20 px-6 text-center">
        <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs uppercase tracking-widest mb-3">
          Interactive WebGL Lab
        </span>
        <h3 className="text-2xl md:text-4xl font-bold text-white mb-2">
          Paint neon energy on screen
        </h3>
        <p className="text-xs md:text-sm text-gray-400">
          {isDrawing ? '✨ Generating particle sparks...' : 'Drag or move cursor anywhere inside this zone'}
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   3D TILT CARD COMPONENT
   ═══════════════════════════════════════════ */
function TiltProjectCard({ project, onClick }: { project: ProjectItem; onClick: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');
  const [sheen, setSheen] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
    setSheen({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.35,
    });
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setSheen((prev) => ({ ...prev, opacity: 0 }));
  };

  const resolvedImageSrc = getAssetPath(project.image);

  return (
    <div
      ref={cardRef}
      onClick={() => {
        playSynthSound(587, 'triangle', 0.1);
        onClick();
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => playSynthSound(440, 'sine', 0.05)}
      className="group relative rounded-3xl glass-card border border-white/10 overflow-hidden cursor-pointer transition-all duration-300 ease-out shadow-xl hover:border-emerald-500/40 hover:shadow-emerald-500/10"
      style={{ transform, transformStyle: 'preserve-3d' }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${sheen.x}% ${sheen.y}%, rgba(255,255,255,0.4) 0%, transparent 60%)`,
          opacity: sheen.opacity,
        }}
      />

      <div className="relative aspect-[16/10] overflow-hidden bg-black/40">
        <Image
          src={resolvedImageSrc}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent opacity-80" />

        <div className="absolute top-4 left-4 z-20">
          <span
            className="px-3.5 py-1 rounded-full text-xs font-mono font-medium backdrop-blur-md border border-white/20 text-white"
            style={{ backgroundColor: `${project.accent}33`, borderColor: `${project.accent}66` }}
          >
            {project.category}
          </span>
        </div>

        <div className="absolute top-4 right-4 z-20">
          <span className="px-3 py-1 rounded-full text-xs font-mono text-gray-300 bg-black/40 backdrop-blur-md">
            {project.year}
          </span>
        </div>

        <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 text-black font-semibold text-xs tracking-wider uppercase shadow-lg transform group-hover:scale-105 transition-transform">
            Explore Case Study
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors duration-300 mb-2">
          {project.title}
        </h3>
        <p className="text-xs md:text-sm text-gray-400 line-clamp-2 leading-relaxed mb-4">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.tools.slice(0, 3).map((tool) => (
            <span key={tool} className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-white/5 text-gray-300 border border-white/5">
              {tool}
            </span>
          ))}
          {project.tools.length > 3 && (
            <span className="text-[10px] font-mono px-2 py-1 rounded-md bg-white/5 text-gray-400">
              +{project.tools.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════ */
export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Estimator Form State
  const [estimatorScope, setEstimatorScope] = useState('Branding & Identity');

  const heroRef = useRef<HTMLElement>(null);
  const manifestoRef = useRef<HTMLElement>(null);
  const worksRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);

  const emailScramble = useTextScramble('baldyas.albani@gmail.com');

  // Realtime Jakarta Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      setCurrentTime(now.toLocaleTimeString('en-US', options));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Scroll Tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? scrollTop / docHeight : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Escape Key Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedProject(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-badge-elem', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 });
      gsap.from('.hero-headline-word', { y: 60, opacity: 0, stagger: 0.08, duration: 1, ease: 'power4.out', delay: 0.4 });
      gsap.from('.hero-sub-text', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.8 });
      gsap.from('.hero-cta-btn', { scale: 0.9, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'back.out(1.7)', delay: 1 });

      const mWords = manifestoRef.current?.querySelectorAll('.manifesto-word');
      if (mWords) {
        mWords.forEach((word, i) => {
          gsap.to(word, {
            scrollTrigger: {
              trigger: manifestoRef.current,
              start: `top+=${i * 30} center`,
              end: `top+=${i * 30 + 50} center`,
              scrub: 0.5,
            },
            opacity: 1,
            color: '#ffffff',
            textShadow: '0 0 20px rgba(16, 185, 129, 0.5)',
          });
        });
      }

      gsap.from('.about-card-img', {
        scrollTrigger: { trigger: aboutRef.current, start: 'top 75%', toggleActions: 'play none none reverse' },
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });
    });

    return () => ctx.revert();
  }, []);

  const filteredProjects = PROJECTS.filter((p) => {
    if (activeCategory === 'ALL') return true;
    return p.category.toUpperCase() === activeCategory;
  });

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('baldyas.albani@gmail.com');
    playSynthSound(880, 'sine', 0.15);
    setToastMessage('Email copied to clipboard!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSelect3DProject = (index: number) => {
    if (PROJECTS[index]) {
      setSelectedProject(PROJECTS[index]);
      setActiveGalleryIndex(0);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0f] text-[#f0f0f5] selection:bg-emerald-500/30 selection:text-white">
      {/* 3D WebGL Background Canvas */}
      <Scene3D scrollProgress={scrollProgress} onSelectProject={handleSelect3DProject} />

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-[200] px-6 py-3 rounded-2xl bg-emerald-500 text-black font-semibold text-sm shadow-2xl flex items-center gap-3 animate-bounce">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {toastMessage}
        </div>
      )}

      {/* ═══════════════════════════════════════
          SECTION 1 — HERO SECTION
          ═══════════════════════════════════════ */}
      <section ref={heroRef} className="relative z-10 min-h-screen flex flex-col justify-center px-6 md:px-12 pt-28 pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full">
          {/* Status Badges */}
          <div className="hero-badge-elem flex flex-wrap items-center gap-3 md:gap-4 mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-emerald-500/30">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-xs font-mono tracking-wider text-emerald-400">
                Available for Senior Roles & Freelance
              </span>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-mono text-gray-400">
              <span>JAKARTA</span>
              <span className="text-gray-600">•</span>
              <span className="text-white font-medium">{currentTime || '21:14 WIB'}</span>
            </div>
          </div>

          {/* Kinetic Headline */}
          <h1 className="text-4xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight leading-[0.95] mb-8 select-none">
            <span className="block hero-headline-word text-white">BALDYAS</span>
            <span className="block hero-headline-word text-gradient-emerald">SATRIO ALBANI</span>
          </h1>

          {/* Subtitle & Role */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-12">
            <div className="md:col-span-8 hero-sub-text">
              <p className="text-lg md:text-2xl text-gray-300 font-light leading-relaxed max-w-3xl">
                Creative Designer & Digital Craftsman merging high-end graphic design,
                brand systems, UI/UX architecture, and studio photography.
                Currently leading visual design at <span className="text-emerald-400 font-medium">Anomali Digital</span>.
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#works"
              onMouseEnter={() => playSynthSound(523, 'sine', 0.05)}
              className="hero-cta-btn group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-emerald-500 text-black font-bold text-sm tracking-wider uppercase hover:bg-emerald-400 transition-all duration-300 shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-105"
            >
              Explore Works Matrix
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>

            <a
              href="#playground"
              onMouseEnter={() => playSynthSound(659, 'sine', 0.05)}
              className="hero-cta-btn inline-flex items-center gap-2 px-8 py-4 rounded-full glass border border-white/20 text-white font-semibold text-sm tracking-wider uppercase hover:bg-white/10 transition-all duration-300 hover:border-emerald-400/50"
            >
              🎮 WebGL Lab
            </a>

            <button
              onClick={handleCopyEmail}
              onMouseEnter={() => playSynthSound(783, 'sine', 0.05)}
              className="hero-cta-btn inline-flex items-center gap-2 px-6 py-4 rounded-full glass text-gray-400 hover:text-white text-xs font-mono tracking-wider transition-colors"
            >
              <span>✉ Copy Email</span>
            </button>
          </div>
        </div>

        {/* Scroll Cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
          <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-gray-500">SCROLL TO FLY THROUGH 3D WORLD</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-emerald-500 to-transparent relative overflow-hidden">
            <div className="absolute w-full h-3 bg-emerald-400 animate-[scrollLine_2s_ease-in-out_infinite]" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 2 — MANIFESTO SCROLLEYTELLING
          ═══════════════════════════════════════ */}
      <section ref={manifestoRef} className="relative z-10 min-h-[140vh] flex items-center px-6 md:px-16 py-32">
        <div className="max-w-5xl mx-auto">
          <p className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-snug tracking-tight">
            {"I don't just design static visuals. I engineer immersive digital experiences that captivate attention and elevate brands. Every curve has intent. Every pixel tells a narrative.".split(' ').map((word, i) => (
              <span
                key={i}
                className="manifesto-word inline-block mr-[0.3em] opacity-10 transition-all duration-300 select-none"
                style={{ color: '#8888a0' }}
              >
                {word}
              </span>
            ))}
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 3 — INTERACTIVE PROJECTS MATRIX
          ═══════════════════════════════════════ */}
      <section ref={worksRef} id="works" className="relative z-10 py-24 md:py-36 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs uppercase tracking-widest block w-max mb-4">
                Selected Works Matrix
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">
                FEATURED PROJECTS
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {['ALL', 'UI/UX', 'BRANDING', 'SOFTWARE', 'EDITORIAL', 'PHOTOGRAPHY', 'PRINT'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    playSynthSound(500, 'square', 0.05);
                    setActiveCategory(cat);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-mono transition-all duration-300 ${
                    activeCategory === cat
                      ? 'bg-emerald-500 text-black font-bold shadow-lg shadow-emerald-500/20'
                      : 'glass text-gray-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <TiltProjectCard
                key={project.id}
                project={project}
                onClick={() => {
                  setSelectedProject(project);
                  setActiveGalleryIndex(0);
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          NEW SECTION 4 — CREATIVE PROCESS WORKFLOW
          ═══════════════════════════════════════ */}
      <section id="process" className="relative z-10 py-28 px-6 md:px-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs uppercase tracking-widest block w-max mb-4">
              Methodology & Workflow
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">
              DESIGN PROCESS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WORKFLOW_STEPS.map((step) => (
              <div
                key={step.step}
                onMouseEnter={() => playSynthSound(500, 'sine', 0.04)}
                className="group relative rounded-3xl glass-card border border-white/10 p-8 hover:border-emerald-500/40 transition-all duration-300 shadow-xl hover:-translate-y-2"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center font-mono font-bold text-lg mb-6 border"
                  style={{ backgroundColor: `${step.accent}20`, borderColor: `${step.accent}55`, color: step.accent }}
                >
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-400 leading-relaxed font-light">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 5 — INTERACTIVE CANVAS PLAYGROUND
          ═══════════════════════════════════════ */}
      <section id="playground" className="relative z-10 py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <CanvasPlayground />
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 6 — KINETIC SKILLS MARQUEE
          ═══════════════════════════════════════ */}
      <section id="skills" className="relative z-10 py-20 border-y border-white/10 overflow-hidden bg-black/40">
        <div className="mb-8 text-center">
          <span className="text-xs font-mono uppercase tracking-[0.4em] text-gray-500">
            TECHNOLOGIES & CREATIVE DISCIPLINES
          </span>
        </div>

        <div className="flex animate-marquee whitespace-nowrap mb-6">
          {[...SKILLS, ...SKILLS].map((skill, idx) => (
            <span
              key={idx}
              className="mx-6 text-3xl md:text-5xl font-black text-gray-600 hover:text-emerald-400 transition-colors duration-300 cursor-pointer select-none"
              onMouseEnter={() => playSynthSound(600 + (idx % 8) * 40, 'triangle', 0.04)}
            >
              {skill} <span className="text-emerald-500/50 mx-4">•</span>
            </span>
          ))}
        </div>

        <div className="flex animate-marquee whitespace-nowrap" style={{ animationDirection: 'reverse', animationDuration: '30s' }}>
          {[...SKILLS.reverse(), ...SKILLS].map((skill, idx) => (
            <span
              key={idx}
              className="mx-6 text-2xl md:text-4xl font-light text-gray-700 hover:text-cyan-400 transition-colors duration-300 cursor-pointer select-none"
              onMouseEnter={() => playSynthSound(400 + (idx % 8) * 30, 'sine', 0.04)}
            >
              {skill} <span className="text-cyan-500/30 mx-4">/</span>
            </span>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 7 — ABOUT & CAREER TIMELINE
          ═══════════════════════════════════════ */}
      <section ref={aboutRef} id="about" className="relative z-10 py-28 md:py-40 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 about-card-img">
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden glass-card border border-white/10 shadow-2xl">
              <Image
                src={getAssetPath('/images/profile-new.png')}
                alt="Baldyas Satrio Albani"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
                priority
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent opacity-80" />

              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl glass border border-white/10 backdrop-blur-xl">
                <p className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">Current Role</p>
                <p className="text-lg font-bold text-white">Graphic Designer</p>
                <p className="text-xs text-gray-400">Anomali Digital (Feb 2025 – Present)</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-8">
            <div>
              <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs uppercase tracking-widest inline-block mb-4">
                Biography & Experience
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
                Crafting visual excellence across brand systems & digital products.
              </h2>
            </div>

            <p className="text-base md:text-lg text-gray-300 leading-relaxed font-light">
              I&apos;m <span className="text-white font-semibold">Baldyas Satrio Albani</span>, a creative designer based in Jakarta.
              Graduated from <span className="text-white font-medium">SMK Budhiwarman 1</span> (Visual Communication Design) and previously studied at <span className="text-white font-medium">Politeknik Negeri Media Kreatif</span>.
              My expertise bridges graphic design, corporate editorial print, UI/UX apps, motion graphics, and studio commercial photography.
            </p>

            <div className="space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-4">Career Milestones</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-2xl glass border border-emerald-500/30 flex items-start justify-between">
                  <div>
                    <span className="text-xs font-mono text-emerald-400">FEB 2025 — PRESENT</span>
                    <h4 className="text-base font-bold text-white">Graphic Designer</h4>
                    <p className="text-xs text-gray-400">Anomali Digital • Full-time</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">ACTIVE</span>
                </div>

                <div className="p-4 rounded-2xl glass border border-white/10 flex items-start justify-between">
                  <div>
                    <span className="text-xs font-mono text-gray-400">2024</span>
                    <h4 className="text-base font-bold text-white">Photography Student (1 Semester)</h4>
                    <p className="text-xs text-gray-400">Politeknik Negeri Media Kreatif (Polmed)</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl glass border border-white/10 flex items-start justify-between">
                  <div>
                    <span className="text-xs font-mono text-gray-400">2022 — 2025</span>
                    <h4 className="text-base font-bold text-white">Visual Communication Design (DKV)</h4>
                    <p className="text-xs text-gray-400">SMK Budhiwarman 1 Jakarta</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          NEW SECTION 8 — FAQ ACCORDION
          ═══════════════════════════════════════ */}
      <section id="faq" className="relative z-10 py-28 px-6 md:px-12 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16 text-center">
            <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs uppercase tracking-widest inline-block mb-4">
              Clear Answers
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">
              FREQUENTLY ASKED QUESTIONS
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-3xl glass-card border border-white/10 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => {
                    playSynthSound(450 + idx * 30, 'sine', 0.05);
                    setOpenFaq(openFaq === idx ? null : idx);
                  }}
                  className="w-full p-6 text-left flex items-center justify-between font-bold text-base md:text-lg text-white hover:text-emerald-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-sm font-mono text-emerald-400 flex-shrink-0 ml-4">
                    {openFaq === idx ? '−' : '+'}
                  </span>
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-6 text-xs md:text-sm text-gray-400 font-light leading-relaxed border-t border-white/5 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          NEW SECTION 9 — INTERACTIVE PROJECT ESTIMATOR
          ═══════════════════════════════════════ */}
      <section id="estimator" className="relative z-10 py-28 px-6 md:px-12 border-t border-white/10">
        <div className="max-w-4xl mx-auto glass-card rounded-3xl border border-emerald-500/30 p-8 md:p-12 shadow-2xl">
          <div className="text-center mb-10">
            <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs uppercase tracking-widest inline-block mb-3">
              Interactive Scope Builder
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white">
              PROJECT ESTIMATOR
            </h2>
            <p className="text-xs md:text-sm text-gray-400 mt-2">
              Select your required creative scope to generate a direct project brief.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-gray-400 block mb-3">
                1. Select Creative Scope
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  'Branding & Identity',
                  'UI/UX App Design',
                  'Editorial Company Profile',
                  'Commercial Photography',
                  'Custom Software / Desktop',
                  'Print & Packaging',
                ].map((scope) => (
                  <button
                    key={scope}
                    type="button"
                    onClick={() => {
                      playSynthSound(600, 'sine', 0.05);
                      setEstimatorScope(scope);
                    }}
                    className={`p-3 rounded-2xl text-xs font-mono border transition-all text-center ${
                      estimatorScope === scope
                        ? 'bg-emerald-500 text-black font-bold border-emerald-400'
                        : 'glass text-gray-300 border-white/10 hover:border-white/30'
                    }`}
                  >
                    {scope}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 text-center">
              <a
                href={`mailto:baldyas.albani@gmail.com?subject=New%20Project%20Inquiry%20-%20${encodeURIComponent(estimatorScope)}&body=Hi%20Baldyas,%20I'd%20like%20to%20discuss%20a%20new%20project%20regarding%20${encodeURIComponent(estimatorScope)}.`}
                onMouseEnter={() => playSynthSound(700, 'sine', 0.05)}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-emerald-500 text-black font-bold text-sm tracking-wider uppercase hover:bg-emerald-400 transition-all hover:scale-105 shadow-lg shadow-emerald-500/20"
              >
                Send Inquiry for &quot;{estimatorScope}&quot; 🚀
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 10 — CONTACT & FOOTER
          ═══════════════════════════════════════ */}
      <section id="contact" className="relative z-10 py-32 md:py-44 px-6 md:px-12 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs uppercase tracking-widest inline-block mb-6">
            Let&apos;s Build Together
          </span>

          <h2 className="text-4xl md:text-7xl font-black text-white leading-tight mb-8">
            READY TO START A <br />
            <span className="text-gradient-emerald">PROJECT?</span>
          </h2>

          <p className="text-base md:text-xl text-gray-400 max-w-xl mx-auto font-light mb-12">
            Whether you need a brand redesign, UI/UX product architecture, or commercial photography, let&apos;s make it extraordinary.
          </p>

          <div className="mb-12">
            <button
              onClick={handleCopyEmail}
              onMouseEnter={emailScramble.scramble}
              onMouseLeave={emailScramble.reset}
              className="group inline-flex items-center gap-3 px-8 py-5 rounded-full glass border border-emerald-500/40 text-lg md:text-2xl font-mono text-white hover:bg-emerald-500 hover:text-black hover:border-emerald-400 transition-all duration-300 shadow-2xl"
            >
              <span>{emailScramble.display}</span>
              <svg className="w-5 h-5 transition-transform group-hover:scale-125" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {[
              { name: 'Instagram', href: 'https://instagram.com/baldyas.sa' },
              { name: 'LinkedIn', href: 'https://linkedin.com/in/baldyas-satrio' },
              { name: 'GitHub', href: 'https://github.com/SHOTCAN' },
            ].map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => playSynthSound(700, 'sine', 0.04)}
                className="text-xs font-mono uppercase tracking-widest text-gray-400 hover:text-emerald-400 transition-colors"
              >
                {s.name} ↗
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FULL-SCREEN PROJECT LIGHTBOX MODAL
          ═══════════════════════════════════════ */}
      {selectedProject && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-2xl animate-fadeIn">
          <div className="relative w-full max-w-5xl max-h-[90vh] glass-card rounded-3xl border border-white/20 overflow-y-auto p-6 md:p-10 text-white shadow-2xl">
            <button
              onClick={() => {
                playSynthSound(300, 'sine', 0.1);
                setSelectedProject(null);
              }}
              className="absolute top-6 right-6 z-50 p-3 rounded-full glass hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-black/60 mb-6">
              <Image
                src={getAssetPath(selectedProject.gallery[activeGalleryIndex] || selectedProject.image)}
                alt={selectedProject.title}
                fill
                className="object-contain"
                sizes="(max-width: 1200px) 100vw, 80vw"
                priority
                unoptimized
              />
            </div>

            {selectedProject.gallery.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-4 mb-6 scrollbar-hide">
                {selectedProject.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      playSynthSound(600 + idx * 50, 'sine', 0.04);
                      setActiveGalleryIndex(idx);
                    }}
                    className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      activeGalleryIndex === idx ? 'border-emerald-400 scale-105' : 'border-transparent opacity-50 hover:opacity-100'
                    }`}
                  >
                    <Image src={getAssetPath(img)} alt={`Thumb ${idx}`} fill className="object-cover" sizes="80px" unoptimized />
                  </button>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 border-t border-white/10 pt-6">
              <div className="md:col-span-8">
                <span
                  className="px-3.5 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider inline-block mb-3"
                  style={{ backgroundColor: `${selectedProject.accent}33`, color: selectedProject.accent }}
                >
                  {selectedProject.category} • {selectedProject.year}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{selectedProject.title}</h2>
                <p className="text-gray-300 text-sm md:text-base leading-relaxed font-light mb-6">
                  {selectedProject.description}
                </p>

                {selectedProject.impactStats && (
                  <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10">
                    {selectedProject.impactStats.map((st) => (
                      <div key={st.label} className="px-4 py-2 rounded-xl bg-white/5 border border-white/5">
                        <span className="text-xs text-gray-400 block">{st.label}</span>
                        <span className="text-lg font-bold text-emerald-400">{st.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="md:col-span-4 space-y-4 text-xs font-mono border-l border-white/10 pl-0 md:pl-6">
                <div>
                  <span className="text-gray-500 uppercase block">Client</span>
                  <span className="text-white font-medium">{selectedProject.client}</span>
                </div>
                <div>
                  <span className="text-gray-500 uppercase block">Role</span>
                  <span className="text-white font-medium">{selectedProject.role}</span>
                </div>
                <div>
                  <span className="text-gray-500 uppercase block mb-1">Tools & Tech</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.tools.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded bg-white/10 text-emerald-300">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
