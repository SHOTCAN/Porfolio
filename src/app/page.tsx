'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */
const PROJECTS = [
  {
    id: 'fotobooth',
    title: 'Fotobooth Pro',
    category: 'Software Design',
    year: '2025',
    image: '/images/projects/fotobooth-pro.png',
    gallery: ['/images/projects/fotobooth-app.webp', '/images/projects/fotobooth-event.webp', '/images/projects/fotobooth-output.webp'],
    description: 'Professional event photobooth system with camera integration, template design, QR sharing & cloud upload. Built with Python & PyQt6.',
    accent: '#10b981',
  },
  {
    id: 'compro',
    title: 'BNC Express',
    category: 'Company Profile',
    year: '2024',
    image: '/images/projects/compro-cover.webp',
    gallery: ['/images/projects/compro-about.webp', '/images/projects/compro-service.webp', '/images/projects/compro-armada.webp', '/images/projects/compro-visi-misi.webp', '/images/projects/compro-keunggulan.webp'],
    description: 'Complete 16-page company profile for a national logistics company. Professional print-ready editorial design.',
    accent: '#3b82f6',
  },
  {
    id: 'branding',
    title: 'Brand Systems',
    category: 'Logo & Identity',
    year: '2024–25',
    image: '/images/projects/logo-crispy-krinj.webp',
    gallery: ['/images/projects/logo-bnc-express.webp', '/images/projects/logo-expo-express.webp', '/images/projects/logo-cahaya-kontruksi.webp', '/images/projects/logo-fashion-france.webp', '/images/projects/logo-jewalen.webp', '/images/projects/logo-dkv.webp', '/images/projects/logo-pameran-perdana.webp'],
    description: 'Complete brand identity systems for multiple clients — from restaurants to construction firms, fashion to logistics.',
    accent: '#f59e0b',
  },
  {
    id: 'aura',
    title: 'Aura App',
    category: 'UI/UX Design',
    year: '2025',
    image: '/images/projects/aura-login.webp',
    gallery: ['/images/projects/aura-home.webp', '/images/projects/aura-detail.webp', '/images/projects/aura-profile.webp'],
    description: 'Modern marketplace mobile app with login, home, detail & profile screens featuring glassmorphism UI.',
    accent: '#8b5cf6',
  },
  {
    id: 'food',
    title: 'Food & Poster',
    category: 'Photography & Design',
    year: '2024',
    image: '/images/projects/food-photo-1.webp',
    gallery: ['/images/projects/food-photo-2.webp', '/images/projects/food-photo-3.webp', '/images/projects/poster-bakso.webp', '/images/projects/poster-esteh.webp', '/images/projects/poster-sistagor.webp', '/images/projects/poster-animar.webp'],
    description: 'Food photography and poster design for local F&B brands — from product shots to promotional material.',
    accent: '#ef4444',
  },
  {
    id: 'editorial',
    title: 'Editorial Works',
    category: 'Print & Layout',
    year: '2024',
    image: '/images/projects/majalah-cover.webp',
    gallery: ['/images/projects/book-cover-tangga.webp', '/images/projects/brosur-crispy.webp', '/images/projects/menu-trifold.webp', '/images/projects/id-card-menu.webp', '/images/projects/mockup-gelas.webp', '/images/projects/mug-design.webp'],
    description: 'Magazine covers, book layouts, brochures, menus, packaging & merchandise mockup designs.',
    accent: '#6366f1',
  },
  {
    id: 'stickers',
    title: 'Sticker & Merch',
    category: 'Illustration',
    year: '2024',
    image: '/images/projects/stiker-marvel.webp',
    gallery: ['/images/projects/stiker-deadpool.webp', '/images/projects/stiker-frozen.webp', '/images/projects/stiker-spongebob.webp', '/images/projects/pin-design.webp'],
    description: 'Character sticker collections, pin badges & merchandise design for print production.',
    accent: '#ec4899',
  },
  {
    id: 'product',
    title: 'Product Shots',
    category: 'Photography',
    year: '2024',
    image: '/images/projects/product-bakso-atas.webp',
    gallery: ['/images/projects/product-bakso-45.webp', '/images/projects/product-sosis-atas.webp', '/images/projects/product-sosis-bright.webp', '/images/projects/food-product-karawaci.webp'],
    description: 'Commercial product photography with controlled lighting for F&B brands.',
    accent: '#f97316',
  },
];

const SKILLS = [
  'Photoshop', 'Illustrator', 'Figma', 'After Effects',
  'Premiere Pro', 'Lightroom', 'InDesign', 'Photography',
  'Branding', 'UI/UX', 'Typography', 'Motion Design',
  'Python', 'DaVinci Resolve',
];

/* ═══════════════════════════════════════════
   TEXT SCRAMBLE HOOK
   ═══════════════════════════════════════════ */
function useTextScramble(text: string) {
  const [display, setDisplay] = useState(text);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&';
  const scramble = useCallback(() => {
    let iteration = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setDisplay(text.split('').map((char, idx) => {
        if (idx < iteration) return text[idx];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(''));
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
   MAIN PAGE
   ═══════════════════════════════════════════ */
export default function Home() {
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const manifestoRef = useRef<HTMLElement>(null);
  const worksRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const emailScramble = useTextScramble('baldyas.albani@gmail.com');

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Hero entrance ──
      gsap.from('.hero-title', { y: 80, opacity: 0, duration: 1.2, ease: 'power4.out', delay: 0.2 });
      gsap.from('.hero-subtitle', { y: 40, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.6 });
      gsap.from('.hero-badge', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.9 });
      gsap.from('.hero-cta', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 1.1 });
      gsap.from('.hero-visual', { scale: 0.8, opacity: 0, duration: 1.5, ease: 'power3.out', delay: 0.4 });
      gsap.from('.hero-float-1', { x: -60, opacity: 0, duration: 1.2, ease: 'power3.out', delay: 0.8 });
      gsap.from('.hero-float-2', { x: 60, y: 40, opacity: 0, duration: 1.2, ease: 'power3.out', delay: 1.0 });
      gsap.from('.hero-float-3', { y: -50, opacity: 0, duration: 1.2, ease: 'power3.out', delay: 1.2 });
      gsap.from('.scroll-cue', { opacity: 0, y: 10, duration: 1, delay: 2, ease: 'power2.out' });

      // ── Hero parallax out ──
      if (heroRef.current) {
        gsap.to(heroRef.current, {
          scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 1 },
          y: -100, opacity: 0,
        });
      }

      // ── Manifesto word reveal ──
      const mWords = manifestoRef.current?.querySelectorAll('.m-word');
      if (mWords) {
        mWords.forEach((w, i) => {
          gsap.to(w, {
            scrollTrigger: { trigger: manifestoRef.current, start: `top+=${i * 35} center`, end: `top+=${i * 35 + 60} center`, scrub: 0.5 },
            opacity: 1, y: 0, color: '#1a1a2e',
          });
        });
      }

      // ── Works stagger ──
      const rows = worksRef.current?.querySelectorAll('.work-item');
      if (rows) {
        gsap.from(rows, {
          scrollTrigger: { trigger: worksRef.current, start: 'top 75%', toggleActions: 'play none none reverse' },
          y: 60, opacity: 0, stagger: 0.1, duration: 0.7, ease: 'power3.out',
        });
      }

      // ── About ──
      gsap.from('.about-img', {
        scrollTrigger: { trigger: aboutRef.current, start: 'top 70%', toggleActions: 'play none none reverse' },
        scale: 0.85, opacity: 0, duration: 1.2, ease: 'power3.out',
      });
      gsap.from('.about-text > *', {
        scrollTrigger: { trigger: aboutRef.current, start: 'top 65%', toggleActions: 'play none none reverse' },
        y: 40, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out',
      });

      // ── Skills marquee scroll ──
      gsap.from('.skills-section', {
        scrollTrigger: { trigger: '.skills-section', start: 'top 80%', toggleActions: 'play none none reverse' },
        y: 40, opacity: 0, duration: 1, ease: 'power3.out',
      });

      // ── Contact ──
      gsap.from('.contact-content > *', {
        scrollTrigger: { trigger: '.contact-content', start: 'top 75%', toggleActions: 'play none none reverse' },
        y: 50, opacity: 0, stagger: 0.12, duration: 0.8, ease: 'power3.out',
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="relative">
      {/* ═══ NAVBAR ═══ */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="text-xl font-bold tracking-tight" style={{ color: '#1a1a2e' }}>
            BSA<span className="text-gradient-green">.</span>
          </span>
          <div className="hidden md:flex items-center gap-8">
            {['Works', 'About', 'Contact'].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-300 tracking-wide">
                {l}
              </a>
            ))}
          </div>
          <a href="#contact" className="text-xs px-5 py-2 rounded-full border border-gray-200 text-gray-600 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-all duration-300">
            Let&apos;s Talk
          </a>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden pt-20">
        {/* Background gradient blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 right-[10%] w-[500px] h-[500px] rounded-full bg-emerald-100/40 blur-[100px] animate-pulse-soft" />
          <div className="absolute bottom-20 left-[5%] w-[400px] h-[400px] rounded-full bg-teal-50/60 blur-[80px] animate-pulse-soft" style={{ animationDelay: '2s' }} />
          <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] rounded-full bg-gray-100/50 blur-[60px] animate-pulse-soft" style={{ animationDelay: '4s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left — Text */}
          <div>
            <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs text-emerald-700 font-medium">Available for projects</span>
            </div>

            <h1 className="hero-title text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight mb-6" style={{ color: '#1a1a2e' }}>
              Creative<br />
              Designer &<br />
              <span className="text-gradient-green">Digital Craftsman</span>
            </h1>

            <p className="hero-subtitle text-base md:text-lg text-gray-500 leading-relaxed max-w-md mb-8">
              Turning ideas into visual experiences that connect, engage, and inspire.
              Currently crafting at <span className="text-gray-800 font-medium">Anomali Digital</span>.
            </p>

            <div className="hero-cta flex items-center gap-4">
              <a href="#works" className="px-7 py-3.5 rounded-full bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-200">
                View Works
              </a>
              <a href="#contact" className="px-7 py-3.5 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-emerald-200 hover:bg-emerald-50 transition-all duration-300">
                Get in Touch
              </a>
            </div>
          </div>

          {/* Right — Floating visuals */}
          <div className="relative h-[400px] md:h-[500px] lg:h-[550px]">
            {/* Main hero image */}
            <div className="hero-visual absolute inset-0 flex items-center justify-center">
              <div className="relative w-[280px] h-[280px] md:w-[380px] md:h-[380px] rounded-3xl overflow-hidden shadow-xl" style={{ boxShadow: '0 20px 60px rgba(16,185,129,0.15)' }}>
                <Image src="/images/hero-abstract.png" alt="Creative Design" fill className="object-cover" sizes="400px" priority />
              </div>
            </div>

            {/* Floating project previews */}
            <div className="hero-float-1 absolute top-8 left-0 md:left-[-20px] w-[120px] h-[90px] md:w-[160px] md:h-[120px] rounded-2xl overflow-hidden shadow-lg animate-float glass-card">
              <Image src="/images/projects/compro-cover.webp" alt="Company Profile" fill className="object-cover" sizes="160px" />
            </div>

            <div className="hero-float-2 absolute bottom-12 right-0 md:right-[-10px] w-[130px] h-[100px] md:w-[170px] md:h-[130px] rounded-2xl overflow-hidden shadow-lg animate-float-delayed glass-card">
              <Image src="/images/projects/logo-crispy-krinj.webp" alt="Brand Design" fill className="object-cover" sizes="170px" />
            </div>

            <div className="hero-float-3 absolute top-4 right-8 md:right-4 w-[100px] h-[75px] md:w-[140px] md:h-[105px] rounded-2xl overflow-hidden shadow-lg animate-float-slow glass-card">
              <Image src="/images/projects/aura-login.webp" alt="UI Design" fill className="object-cover" sizes="140px" />
            </div>

            {/* Decorative shapes */}
            <div className="absolute bottom-[30%] left-[15%] w-4 h-4 rounded-full bg-emerald-300/50 animate-float" />
            <div className="absolute top-[20%] right-[25%] w-3 h-3 rounded-full bg-gray-300/50 animate-float-delayed" />
            <div className="absolute top-[60%] right-[15%] w-6 h-6 rounded-full border border-emerald-200/50 animate-float-slow" />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="scroll-cue absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.4em] text-gray-400">Scroll</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-gray-300 to-transparent relative overflow-hidden">
            <div className="absolute w-full h-3 bg-emerald-400/70 animate-[scrollLine_2s_ease-in-out_infinite]" />
          </div>
        </div>
      </section>

      {/* ═══ MANIFESTO ═══ */}
      <section ref={manifestoRef} className="relative min-h-[120vh] flex items-center px-6 md:px-16 py-32">
        <div className="max-w-4xl mx-auto">
          <p className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold leading-relaxed md:leading-relaxed">
            {"I don't just design. I craft visual experiences that make brands unforgettable. Every pixel is intentional. Every detail tells a story.".split(' ').map((word, i) => (
              <span key={i} className="m-word inline-block mr-[0.3em] opacity-[0.12] translate-y-1" style={{ color: '#c0c0c8' }}>
                {word}
              </span>
            ))}
          </p>
        </div>
      </section>

      {/* ═══ WORKS ═══ */}
      <section ref={worksRef} id="works" className="relative py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16">
            <div>
              <p className="text-emerald-600 text-xs font-mono tracking-[0.4em] uppercase mb-3">Selected Works</p>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight" style={{ color: '#1a1a2e' }}>
                Recent Projects
              </h2>
            </div>
            <p className="text-sm text-gray-400 max-w-xs">Click to expand and explore the gallery for each project.</p>
          </div>

          {/* Project list */}
          <div className="space-y-0">
            {PROJECTS.map((project, i) => (
              <div key={project.id} className="work-item">
                {/* Row */}
                <div
                  className="group flex items-center gap-4 md:gap-8 py-5 md:py-7 border-b cursor-pointer transition-all duration-500 hover:pl-3"
                  style={{ borderColor: hoveredProject === i ? project.accent + '30' : 'rgba(0,0,0,0.06)' }}
                  onMouseEnter={() => setHoveredProject(i)}
                  onMouseLeave={() => setHoveredProject(null)}
                  onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
                >
                  <span className="text-gray-300 font-mono text-xs w-6 flex-shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* Thumbnail - visible on hover */}
                  <div className="hidden md:block relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -ml-2 group-hover:ml-0">
                    <Image src={project.image} alt={project.title} fill className="object-cover" sizes="64px" />
                  </div>

                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold flex-1 transition-colors duration-300" style={{ color: hoveredProject === i ? project.accent : '#1a1a2e' }}>
                    {project.title}
                  </h3>

                  <span className="hidden md:inline text-xs uppercase tracking-[0.15em] text-gray-400">{project.category}</span>
                  <span className="text-xs font-mono text-gray-300">{project.year}</span>

                  <svg className={`w-4 h-4 text-gray-300 transition-transform duration-300 ${expandedProject === project.id ? 'rotate-45' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                  </svg>
                </div>

                {/* Expanded gallery */}
                <div className="overflow-hidden transition-all duration-700" style={{ maxHeight: expandedProject === project.id ? '500px' : '0', opacity: expandedProject === project.id ? 1 : 0 }}>
                  <div className="py-8 space-y-4">
                    <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                      <div className="md:w-1/4">
                        <p className="text-xs font-mono uppercase tracking-wider mb-2" style={{ color: project.accent }}>{project.category}</p>
                        <p className="text-sm text-gray-500 leading-relaxed">{project.description}</p>
                      </div>
                      <div className="md:w-3/4">
                        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x">
                          {project.gallery.map((img, j) => (
                            <div key={j} className="flex-shrink-0 w-[240px] md:w-[300px] aspect-[4/3] relative rounded-xl overflow-hidden snap-center group/img" style={{ boxShadow: `0 4px 20px ${project.accent}10` }}>
                              <Image src={img} alt={`${project.title} ${j + 1}`} fill className="object-cover transition-transform duration-500 group-hover/img:scale-105" sizes="300px" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SKILLS MARQUEE ═══ */}
      <section className="skills-section py-16 md:py-24 overflow-hidden border-y" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
        <p className="text-center text-xs font-mono uppercase tracking-[0.5em] text-gray-400 mb-10">Tools & Skills</p>
        <div className="relative">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...SKILLS, ...SKILLS].map((skill, i) => (
              <span key={i} className="mx-6 md:mx-10 text-2xl md:text-4xl font-bold text-gray-200 hover:text-emerald-500 transition-colors duration-300 cursor-default select-none">
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div className="relative mt-6">
          <div className="flex animate-marquee whitespace-nowrap" style={{ animationDirection: 'reverse', animationDuration: '35s' }}>
            {[...SKILLS.reverse(), ...SKILLS].map((skill, i) => (
              <span key={i} className="mx-6 md:mx-10 text-xl md:text-3xl font-light text-gray-150 hover:text-teal-500 transition-colors duration-300 cursor-default select-none" style={{ color: 'rgba(0,0,0,0.06)' }}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ABOUT ═══ */}
      <section ref={aboutRef} id="about" className="relative py-24 md:py-40">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
            {/* Image */}
            <div className="about-img relative">
              <div className="relative aspect-[3/4] max-w-md mx-auto rounded-3xl overflow-hidden" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.08)' }}>
                <Image src="/images/profile-new.png" alt="Baldyas Satrio Albani" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 md:bottom-8 md:-right-6 px-5 py-3 rounded-2xl glass-card shadow-lg">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Currently at</p>
                <p className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>Anomali Digital</p>
              </div>
            </div>

            {/* Text */}
            <div className="about-text">
              <p className="text-emerald-600 text-xs font-mono tracking-[0.4em] uppercase mb-4">About Me</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6" style={{ color: '#1a1a2e' }}>
                Designer who cares about <span className="text-gradient-green">every detail</span>.
              </h2>
              <div className="space-y-4 text-gray-500 text-sm md:text-base leading-relaxed">
                <p>
                  I&apos;m <span className="text-gray-800 font-medium">Baldyas Satrio Albani</span> — a multidisciplinary
                  designer crafting visual experiences at <span className="text-emerald-600 font-medium">Anomali Digital</span> since February 2025.
                </p>
                <p>
                  Visual Communication Design graduate from SMK Budhiwarman 1 with studies at Politeknik Negeri Media Kreatif.
                  I specialize in brand identity, UI/UX, motion graphics, photography & print design.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                {[
                  { value: '30+', label: 'Projects' },
                  { value: '15+', label: 'Clients' },
                  { value: '2+', label: 'Years' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-3xl md:text-4xl font-bold text-gradient-green">{stat.value}</p>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CONTACT ═══ */}
      <section id="contact" className="relative py-24 md:py-40">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, transparent, rgba(16,185,129,0.03), transparent)' }} />

        <div className="contact-content max-w-3xl mx-auto px-6 md:px-12 text-center relative z-10">
          <p className="text-emerald-600 text-xs font-mono tracking-[0.4em] uppercase mb-4">Get in Touch</p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6" style={{ color: '#1a1a2e' }}>
            Let&apos;s create something <span className="text-gradient-green">extraordinary</span>.
          </h2>
          <p className="text-gray-500 text-base md:text-lg mb-10 max-w-xl mx-auto">
            Have a project in mind? I&apos;d love to hear about it. Let&apos;s turn your vision into reality.
          </p>

          {/* Email */}
          <a
            href="mailto:baldyas.albani@gmail.com"
            className="inline-block text-lg md:text-xl font-mono text-gray-400 hover:text-emerald-600 transition-colors duration-300 mb-10 border-b border-gray-200 hover:border-emerald-300 pb-1"
            onMouseEnter={emailScramble.scramble}
            onMouseLeave={emailScramble.reset}
          >
            {emailScramble.display}
          </a>

          {/* CTA */}
          <div className="mb-12">
            <a href="mailto:baldyas.albani@gmail.com" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-200 hover:gap-4">
              Start a Project
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>

          {/* Social */}
          <div className="flex justify-center gap-8">
            {[
              { name: 'Instagram', href: 'https://instagram.com/baldyas.sa' },
              { name: 'LinkedIn', href: 'https://linkedin.com/in/baldyas-satrio' },
              { name: 'GitHub', href: 'https://github.com/SHOTCAN' },
            ].map((link) => (
              <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer"
                className="text-xs uppercase tracking-[0.3em] text-gray-400 hover:text-emerald-600 transition-colors duration-300">
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-8 border-t" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-lg font-bold" style={{ color: '#1a1a2e' }}>BSA<span className="text-gradient-green">.</span></span>
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} Baldyas Satrio Albani. Crafted with passion.</p>
        </div>
      </footer>
    </div>
  );
}
