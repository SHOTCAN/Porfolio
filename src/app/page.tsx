'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

const Scene3D = dynamic(() => import('@/components/Scene3D'), { ssr: false });

/* ═══════════════════════════════════════════
   PROJECT DATA — Real work + Concepts
   ═══════════════════════════════════════════ */
const PROJECTS = [
  {
    id: 'fotobooth',
    title: 'FOTOBOOTH PRO',
    category: 'Software Design',
    year: '2025',
    image: '/images/projects/fotobooth-pro.png',
    gallery: ['/images/projects/fotobooth-app.webp', '/images/projects/fotobooth-event.webp', '/images/projects/fotobooth-output.webp'],
    description: 'Professional event photobooth system with camera integration, template design, QR sharing & cloud upload.',
    color: '#a78bfa',
  },
  {
    id: 'compro',
    title: 'BNC EXPRESS',
    category: 'Company Profile',
    year: '2024',
    image: '/images/projects/compro-cover.webp',
    gallery: ['/images/projects/compro-about.webp', '/images/projects/compro-service.webp', '/images/projects/compro-armada.webp', '/images/projects/compro-keunggulan.webp'],
    description: 'Complete 16-page company profile for a national logistics company. Print-ready editorial design.',
    color: '#3b82f6',
  },
  {
    id: 'branding',
    title: 'BRAND SYSTEMS',
    category: 'Logo & Identity',
    year: '2024–25',
    image: '/images/projects/logo-crispy-krinj.webp',
    gallery: ['/images/projects/logo-bnc-express.webp', '/images/projects/logo-expo-express.webp', '/images/projects/logo-cahaya-kontruksi.webp', '/images/projects/logo-fashion-france.webp', '/images/projects/logo-jewalen.webp', '/images/projects/logo-dkv.webp'],
    description: 'Complete brand identity systems for multiple clients — from restaurants to construction firms.',
    color: '#f59e0b',
  },
  {
    id: 'aura',
    title: 'AURA APP',
    category: 'UI/UX Design',
    year: '2025',
    image: '/images/projects/aura-login.webp',
    gallery: ['/images/projects/aura-home.webp', '/images/projects/aura-detail.webp', '/images/projects/aura-profile.webp'],
    description: 'Modern marketplace mobile app — login, home, detail & profile screens with glassmorphism UI.',
    color: '#14b8a6',
  },
  {
    id: 'food',
    title: 'FOOD PHOTOGRAPHY',
    category: 'Photography & Poster',
    year: '2024',
    image: '/images/projects/food-photo-1.webp',
    gallery: ['/images/projects/food-photo-2.webp', '/images/projects/food-photo-3.webp', '/images/projects/poster-bakso.webp', '/images/projects/poster-esteh.webp', '/images/projects/poster-sistagor.webp'],
    description: 'Food photography and poster design for local F&B brands — from product shots to promotional material.',
    color: '#ef4444',
  },
  {
    id: 'stickers',
    title: 'STICKER ART',
    category: 'Illustration & Print',
    year: '2024',
    image: '/images/projects/stiker-marvel.webp',
    gallery: ['/images/projects/stiker-deadpool.webp', '/images/projects/stiker-frozen.webp', '/images/projects/stiker-spongebob.webp', '/images/projects/pin-design.webp', '/images/projects/mug-design.webp'],
    description: 'Character sticker collections, pin badges & merchandise design for print production.',
    color: '#ec4899',
  },
  {
    id: 'editorial',
    title: 'EDITORIAL DESIGN',
    category: 'Print & Layout',
    year: '2024',
    image: '/images/projects/majalah-cover.webp',
    gallery: ['/images/projects/book-cover-tangga.webp', '/images/projects/book-cover-back.webp', '/images/projects/brosur-crispy.webp', '/images/projects/menu-trifold.webp', '/images/projects/id-card-menu.webp'],
    description: 'Magazine covers, book layouts, brochures, menus & ID card designs for various clients.',
    color: '#8b5cf6',
  },
  {
    id: 'product',
    title: 'PRODUCT SHOTS',
    category: 'Product Photography',
    year: '2024',
    image: '/images/projects/product-bakso-atas.webp',
    gallery: ['/images/projects/product-bakso-45.webp', '/images/projects/product-sosis-atas.webp', '/images/projects/product-sosis-bright.webp', '/images/projects/mockup-gelas.webp'],
    description: 'Commercial product photography with controlled lighting for F&B and merchandise brands.',
    color: '#f97316',
  },
];

/* ═══════════════════════════════════════════
   MANIFESTO WORDS
   ═══════════════════════════════════════════ */
const MANIFESTO = "I don't just design. I craft visual experiences that make brands unforgettable. Every pixel is intentional. Every detail tells a story. This is my universe.".split(' ');

/* ═══════════════════════════════════════════
   SKILLS
   ═══════════════════════════════════════════ */
const SKILLS = [
  { name: 'Photoshop', size: 'text-4xl md:text-6xl', weight: 'font-black' },
  { name: 'Illustrator', size: 'text-2xl md:text-4xl', weight: 'font-light' },
  { name: 'Figma', size: 'text-5xl md:text-7xl', weight: 'font-bold' },
  { name: 'After Effects', size: 'text-xl md:text-3xl', weight: 'font-normal' },
  { name: 'Premiere Pro', size: 'text-lg md:text-2xl', weight: 'font-light' },
  { name: 'Photography', size: 'text-3xl md:text-5xl', weight: 'font-semibold' },
  { name: 'Branding', size: 'text-4xl md:text-6xl', weight: 'font-bold' },
  { name: 'UI/UX', size: 'text-5xl md:text-8xl', weight: 'font-black' },
  { name: 'Typography', size: 'text-2xl md:text-4xl', weight: 'font-medium' },
  { name: 'Motion Design', size: 'text-3xl md:text-5xl', weight: 'font-semibold' },
  { name: 'Python', size: 'text-xl md:text-2xl', weight: 'font-mono' },
  { name: 'Lightroom', size: 'text-2xl md:text-3xl', weight: 'font-light' },
  { name: 'InDesign', size: 'text-xl md:text-3xl', weight: 'font-normal' },
  { name: 'DaVinci', size: 'text-lg md:text-2xl', weight: 'font-light' },
];

/* ═══════════════════════════════════════════
   TEXT SCRAMBLE HOOK
   ═══════════════════════════════════════════ */
function useTextScramble(text: string) {
  const [display, setDisplay] = useState(text);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const chars = '!<>-_\\/[]{}—=+*^?#________';

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
      iteration += 1 / 3;
      if (iteration >= text.length && intervalRef.current) {
        clearInterval(intervalRef.current);
        setDisplay(text);
      }
    }, 30);
  }, [text, chars]);

  const reset = useCallback(() => setDisplay(text), [text]);
  return { display, scramble, reset };
}

/* ═══════════════════════════════════════════
   HORIZONTAL GALLERY COMPONENT
   ═══════════════════════════════════════════ */
function ProjectGallery({ images, color }: { images: string[]; color: string }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
      {images.map((img, i) => (
        <div
          key={i}
          className="flex-shrink-0 w-[280px] md:w-[400px] aspect-[4/3] relative rounded-xl overflow-hidden snap-center group"
          style={{ boxShadow: `0 0 30px ${color}20` }}
        >
          <Image
            src={img}
            alt={`Gallery ${i + 1}`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="400px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════ */
export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const manifestoRef = useRef<HTMLElement>(null);
  const worksRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const skillsRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);
  const emailScramble = useTextScramble('baldyas.albani@gmail.com');

  // ─── Scroll Progress ───
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? scrollTop / docHeight : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ─── GSAP Animations ───
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero text reveal — character split
      const heroChars = heroRef.current?.querySelectorAll('.hero-char');
      if (heroChars) {
        gsap.from(heroChars, {
          y: 120,
          rotateX: -90,
          opacity: 0,
          stagger: 0.04,
          duration: 1.2,
          ease: 'power4.out',
          delay: 0.3,
        });
      }

      // Hero subtitle
      gsap.from('.hero-sub', {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 1.2,
      });

      // Hero scroll indicator
      gsap.from('.scroll-indicator', {
        opacity: 0,
        y: 20,
        duration: 1,
        delay: 2,
        ease: 'power2.out',
      });

      // Hero parallax out
      if (heroRef.current) {
        gsap.to(heroRef.current, {
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
          y: -200,
          opacity: 0,
          scale: 0.9,
        });
      }

      // Manifesto word-by-word reveal
      const manifestoWords = manifestoRef.current?.querySelectorAll('.manifesto-word');
      if (manifestoWords) {
        manifestoWords.forEach((word, i) => {
          gsap.to(word, {
            scrollTrigger: {
              trigger: manifestoRef.current,
              start: `top+=${i * 40} center`,
              end: `top+=${i * 40 + 80} center`,
              scrub: 0.5,
            },
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
          });
        });
      }

      // Works section — stagger entrance
      const workRows = worksRef.current?.querySelectorAll('.work-row');
      if (workRows) {
        gsap.from(workRows, {
          scrollTrigger: {
            trigger: worksRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
          x: 100,
          opacity: 0,
          stagger: 0.12,
          duration: 0.8,
          ease: 'power3.out',
        });
      }

      // About section
      gsap.from('.about-image', {
        scrollTrigger: {
          trigger: aboutRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
        clipPath: 'circle(0% at 50% 50%)',
        duration: 1.5,
        ease: 'power3.inOut',
      });

      gsap.from('.about-text', {
        scrollTrigger: {
          trigger: aboutRef.current,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        },
        y: 60,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out',
      });

      // Stats counter animation
      const stats = aboutRef.current?.querySelectorAll('.stat-number');
      if (stats) {
        stats.forEach((stat) => {
          const target = parseInt(stat.getAttribute('data-value') || '0');
          gsap.from(stat, {
            scrollTrigger: {
              trigger: stat,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
            textContent: 0,
            duration: 2,
            ease: 'power2.out',
            snap: { textContent: 1 },
            onUpdate: function () {
              const val = Math.round(gsap.getProperty(stat, 'textContent') as number);
              stat.textContent = val + '+';
            },
          });
        });
      }

      // Skills float-in
      const skillWords = skillsRef.current?.querySelectorAll('.skill-word');
      if (skillWords) {
        skillWords.forEach((word, i) => {
          gsap.from(word, {
            scrollTrigger: {
              trigger: skillsRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
            y: gsap.utils.random(60, 150),
            x: gsap.utils.random(-100, 100),
            opacity: 0,
            rotation: gsap.utils.random(-15, 15),
            duration: 1.2,
            delay: i * 0.08,
            ease: 'elastic.out(1, 0.5)',
          });
        });
      }

      // Contact entrance
      gsap.from('.contact-title', {
        scrollTrigger: {
          trigger: contactRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* ─── 3D Background Canvas ─── */}
      <div className="fixed inset-0 z-0">
        <Scene3D scrollProgress={scrollProgress} />
      </div>

      {/* ═══════════════════════════════════════
          SECTION 1 — HERO
          ═══════════════════════════════════════ */}
      <section ref={heroRef} className="relative z-10 h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
        {/* Main title */}
        <h1 className="text-center select-none" style={{ mixBlendMode: 'difference' }}>
          <span className="block overflow-hidden">
            <span className="flex justify-center">
              {'BALDYAS'.split('').map((char, i) => (
                <span
                  key={`a-${i}`}
                  className="hero-char inline-block text-white"
                  style={{
                    fontSize: 'clamp(3rem, 15vw, 12rem)',
                    letterSpacing: 'clamp(0.2rem, 2vw, 1.5rem)',
                    fontWeight: 900,
                    lineHeight: 1,
                  }}
                >
                  {char}
                </span>
              ))}
            </span>
          </span>
          <span className="block overflow-hidden mt-2 md:mt-4">
            <span className="flex justify-center">
              {'SATRIO ALBANI'.split('').map((char, i) => (
                <span
                  key={`b-${i}`}
                  className="hero-char inline-block bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent"
                  style={{
                    fontSize: 'clamp(1.5rem, 6vw, 5rem)',
                    letterSpacing: 'clamp(0.1rem, 0.8vw, 0.6rem)',
                    fontWeight: 700,
                    lineHeight: 1.2,
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </span>
          </span>
        </h1>

        <div className="hero-sub mt-8 md:mt-12 text-center">
          <p className="text-[var(--text-secondary)] text-sm md:text-base uppercase tracking-[0.4em] mb-4">
            Creative Designer & Digital Craftsman
          </p>
          <div className="flex items-center justify-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-[var(--text-secondary)] text-xs md:text-sm tracking-wider">
              Currently at <span className="text-white font-medium">Anomali Digital</span>
            </span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="scroll-indicator absolute bottom-8 md:bottom-12 flex flex-col items-center gap-3">
          <span className="text-[var(--text-secondary)] text-[10px] uppercase tracking-[0.5em]">Scroll to explore</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/40 to-transparent relative overflow-hidden">
            <div className="absolute w-full h-4 bg-white/80 animate-[scrollLine_2s_ease-in-out_infinite]" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 2 — MANIFESTO
          ═══════════════════════════════════════ */}
      <section ref={manifestoRef} className="relative z-10 min-h-[150vh] flex items-center px-6 md:px-16 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <p className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-snug md:leading-tight tracking-tight">
            {MANIFESTO.map((word, i) => (
              <span
                key={i}
                className="manifesto-word inline-block mr-[0.3em] opacity-[0.08] translate-y-2"
                style={{
                  filter: 'blur(4px)',
                  transition: 'text-shadow 0.3s',
                  textShadow: 'none',
                  color: '#fff',
                }}
              >
                {word}
              </span>
            ))}
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 3 — SELECTED WORKS
          ═══════════════════════════════════════ */}
      <section ref={worksRef} id="works" className="relative z-10 py-24 md:py-40">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Section title */}
          <div className="mb-16 md:mb-24">
            <p className="text-indigo-400 font-mono text-xs md:text-sm tracking-[0.5em] uppercase mb-3">Selected Works</p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
              Projects that<br />
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">speak for themselves.</span>
            </h2>
          </div>

          {/* Project list */}
          <div className="space-y-0">
            {PROJECTS.map((project, i) => (
              <div key={project.id} className="work-row group">
                {/* Main row */}
                <div
                  className="relative flex items-center justify-between py-6 md:py-8 border-b border-white/[0.06] cursor-pointer transition-all duration-500 hover:border-white/20 hover:pl-4"
                  onMouseEnter={() => setActiveProject(i)}
                  onMouseLeave={() => setActiveProject(null)}
                  onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
                >
                  {/* Background image on hover — desktop only */}
                  <div
                    className="absolute inset-0 overflow-hidden rounded-lg hidden md:block"
                    style={{
                      clipPath: activeProject === i
                        ? 'inset(0% 0% 0% 0%)'
                        : 'inset(50% 50% 50% 50%)',
                      transition: 'clip-path 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover opacity-20 scale-110 blur-sm"
                      sizes="100vw"
                    />
                    <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, ${project.color}10, transparent)` }} />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex items-center gap-4 md:gap-8 flex-1 min-w-0">
                    <span className="text-white/20 font-mono text-xs md:text-sm w-8 flex-shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3
                      className="text-xl md:text-3xl lg:text-4xl font-bold text-white truncate transition-all duration-300"
                      style={{
                        textShadow: activeProject === i ? `0 0 30px ${project.color}60` : 'none',
                      }}
                    >
                      {project.title}
                    </h3>
                  </div>

                  <div className="relative z-10 flex items-center gap-4 md:gap-8 flex-shrink-0">
                    <span className="hidden md:inline text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                      {project.category}
                    </span>
                    <span className="text-xs font-mono text-white/30">{project.year}</span>
                    <svg
                      className={`w-4 h-4 md:w-5 md:h-5 text-white/30 transition-transform duration-300 ${expandedProject === project.id ? 'rotate-45' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </div>

                {/* Expanded content */}
                <div
                  className="overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
                  style={{
                    maxHeight: expandedProject === project.id ? '600px' : '0',
                    opacity: expandedProject === project.id ? 1 : 0,
                  }}
                >
                  <div className="py-8 md:py-12 pl-0 md:pl-12">
                    <div className="flex flex-col md:flex-row gap-6 md:gap-12 mb-6">
                      <div className="md:w-1/3">
                        <p className="text-xs uppercase tracking-[0.2em] mb-2" style={{ color: project.color }}>
                          {project.category}
                        </p>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                          {project.description}
                        </p>
                      </div>
                      <div className="md:w-2/3">
                        <ProjectGallery images={project.gallery} color={project.color} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom glow */}
                <div
                  className="h-[1px] transition-all duration-500"
                  style={{
                    background: activeProject === i
                      ? `linear-gradient(90deg, transparent, ${project.color}60, transparent)`
                      : 'transparent',
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 4 — ABOUT
          ═══════════════════════════════════════ */}
      <section ref={aboutRef} id="about" className="relative z-10 py-24 md:py-40">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
            {/* Profile image */}
            <div className="about-image relative aspect-[3/4] max-w-md mx-auto lg:mx-0 rounded-2xl overflow-hidden" style={{ clipPath: 'circle(50% at 50% 50%)' }}>
              <Image
                src="/images/profile.webp"
                alt="Baldyas Satrio Albani"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-xs uppercase tracking-[0.3em] text-indigo-300 mb-1">Anomali Digital</p>
                <p className="text-lg font-semibold text-white">Graphic Designer</p>
              </div>
            </div>

            {/* Bio */}
            <div className="about-text">
              <p className="text-indigo-400 font-mono text-xs md:text-sm tracking-[0.5em] uppercase mb-6">About</p>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
                Designing the<br />
                <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                  future of brands.
                </span>
              </h2>
              <div className="space-y-4 text-[var(--text-secondary)] text-sm md:text-base leading-relaxed">
                <p>
                  I&apos;m <span className="text-white font-medium">Baldyas Satrio Albani</span> — a multidisciplinary
                  designer currently crafting visual experiences at{' '}
                  <span className="text-indigo-400">Anomali Digital</span> since February 2025.
                </p>
                <p>
                  With a background in Visual Communication Design from{' '}
                  <span className="text-white/80">SMK Budhiwarman 1</span> and studies at{' '}
                  <span className="text-white/80">Politeknik Negeri Media Kreatif</span>,
                  I specialize in brand identity, UI/UX, motion graphics, photography & print design.
                </p>
                <p>
                  Based in <span className="text-white/80">Jakarta, Indonesia</span>.
                  Building brands that don&apos;t just look beautiful — they{' '}
                  <em className="text-white not-italic font-medium">resonate</em>.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12">
                {[
                  { value: 30, label: 'Projects' },
                  { value: 15, label: 'Clients' },
                  { value: 2, label: 'Years' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center md:text-left">
                    <p className="stat-number text-3xl md:text-5xl font-bold text-white" data-value={stat.value}>
                      0+
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 5 — SKILLS
          ═══════════════════════════════════════ */}
      <section ref={skillsRef} id="skills" className="relative z-10 py-24 md:py-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <p className="text-indigo-400 font-mono text-xs md:text-sm tracking-[0.5em] uppercase mb-6 text-center">Skills & Tools</p>
          <div className="relative min-h-[50vh] md:min-h-[60vh] flex flex-wrap items-center justify-center gap-x-6 md:gap-x-10 gap-y-4 md:gap-y-6">
            {SKILLS.map((skill, i) => (
              <span
                key={skill.name}
                className={`skill-word ${skill.size} ${skill.weight} text-white/[0.15] hover:text-white hover:scale-110 cursor-default select-none transition-all duration-500`}
                style={{
                  transitionDelay: `${i * 20}ms`,
                  textShadow: 'none',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.textShadow = '0 0 40px rgba(99,102,241,0.6), 0 0 80px rgba(99,102,241,0.3)';
                  (e.target as HTMLElement).style.color = '#a5b4fc';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.textShadow = 'none';
                  (e.target as HTMLElement).style.color = '';
                }}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 6 — CONTACT
          ═══════════════════════════════════════ */}
      <section ref={contactRef} id="contact" className="relative z-10 py-24 md:py-40 min-h-screen flex flex-col items-center justify-center">
        <div className="max-w-5xl mx-auto px-6 md:px-12 text-center">
          <p className="text-indigo-400 font-mono text-xs md:text-sm tracking-[0.5em] uppercase mb-6">Get in Touch</p>
          <h2
            className="contact-title text-3xl md:text-5xl lg:text-7xl font-bold text-white leading-tight mb-12"
          >
            LET&apos;S CREATE
            <br />
            SOMETHING{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
              EXTRAORDINARY
            </span>
          </h2>

          {/* Email with scramble */}
          <a
            href="mailto:baldyas.albani@gmail.com"
            className="inline-block text-lg md:text-2xl font-mono text-[var(--text-secondary)] hover:text-white transition-colors duration-300 mb-16 border-b border-white/10 hover:border-indigo-500/50 pb-2"
            onMouseEnter={emailScramble.scramble}
            onMouseLeave={emailScramble.reset}
          >
            {emailScramble.display}
          </a>

          {/* Social links */}
          <div className="flex items-center justify-center gap-8 md:gap-12 mb-20">
            {[
              { name: 'Instagram', href: 'https://instagram.com/baldyas.sa' },
              { name: 'LinkedIn', href: 'https://linkedin.com/in/baldyas-satrio' },
              { name: 'GitHub', href: 'https://github.com/SHOTCAN' },
            ].map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs md:text-sm uppercase tracking-[0.3em] text-[var(--text-secondary)] hover:text-white transition-all duration-300 hover:tracking-[0.5em]"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="absolute bottom-0 left-0 right-0 py-6 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-lg font-bold bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">BSA.</p>
            <p className="text-xs text-[var(--text-secondary)]">
              © {new Date().getFullYear()} Baldyas Satrio Albani. Crafted with passion.
            </p>
          </div>
        </footer>
      </section>
    </div>
  );
}
