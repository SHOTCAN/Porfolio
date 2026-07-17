'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

// ─── Dynamic Imports ───
const Scene3D = dynamic(() => import('@/components/Scene3D'), { ssr: false });

// ─── Project Data ───
interface Project {
  number: string;
  title: string;
  category: string;
  image: string;
}

const PROJECTS: Project[] = [
  { number: '01', title: 'Fotobooth Pro', category: 'Software Design', image: '/images/projects/software.png' },
  { number: '02', title: 'AURÈLE', category: 'Luxury Brand Identity', image: '/images/projects/luxury-brand.png' },
  { number: '03', title: 'NexusAI', category: 'Dashboard Design', image: '/images/projects/dashboard.png' },
  { number: '04', title: 'VEYRON', category: 'Automotive Campaign', image: '/images/projects/automotive.png' },
  { number: '05', title: 'Ember & Oak', category: 'Restaurant Branding', image: '/images/projects/restaurant.png' },
  { number: '06', title: 'NEON', category: 'Cyberpunk Interface', image: '/images/projects/cyberpunk-ui.png' },
  { number: '07', title: 'MAISON', category: 'Fashion Campaign', image: '/images/projects/fashion-campaign.png' },
  { number: '08', title: 'Vault Finance', category: 'Mobile App Design', image: '/images/projects/mobile-app.png' },
];

// ─── Skill Data ───
interface Skill {
  name: string;
  size: string;
  opacity: number;
  x: string;
  y: string;
  delay: string;
  duration: string;
}

const SKILLS: Skill[] = [
  { name: 'Photoshop', size: '3.5rem', opacity: 0.9, x: '10%', y: '20%', delay: '0s', duration: '18s' },
  { name: 'Illustrator', size: '2.5rem', opacity: 0.7, x: '65%', y: '15%', delay: '2s', duration: '22s' },
  { name: 'Figma', size: '4rem', opacity: 1, x: '40%', y: '45%', delay: '1s', duration: '20s' },
  { name: 'After Effects', size: '2rem', opacity: 0.6, x: '80%', y: '55%', delay: '3s', duration: '25s' },
  { name: 'Premiere Pro', size: '1.8rem', opacity: 0.5, x: '20%', y: '70%', delay: '4s', duration: '19s' },
  { name: 'Photography', size: '3rem', opacity: 0.8, x: '55%', y: '75%', delay: '1.5s', duration: '21s' },
  { name: 'Branding', size: '3.2rem', opacity: 0.85, x: '75%', y: '30%', delay: '2.5s', duration: '23s' },
  { name: 'UI/UX', size: '3.8rem', opacity: 0.95, x: '30%', y: '35%', delay: '0.5s', duration: '17s' },
  { name: 'Typography', size: '2.2rem', opacity: 0.65, x: '85%', y: '80%', delay: '3.5s', duration: '24s' },
  { name: 'Motion Design', size: '2.8rem', opacity: 0.75, x: '15%', y: '50%', delay: '2s', duration: '20s' },
  { name: 'Python', size: '1.5rem', opacity: 0.45, x: '50%', y: '10%', delay: '4.5s', duration: '26s' },
  { name: 'Lightroom', size: '2rem', opacity: 0.55, x: '45%', y: '85%', delay: '3s', duration: '22s' },
];

// ─── Manifesto Text ───
const MANIFESTO_WORDS = `I don't just design. I craft experiences that make people feel something. Every pixel has purpose. Every interaction tells a story.`.split(' ');

// ─── Text Scramble Hook ───
function useTextScramble(text: string) {
  const [display, setDisplay] = useState(text);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const chars = '!<>-_\\/[]{}—=+*^?#________';

  const scramble = useCallback(() => {
    let iteration = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplay(
        text
          .split('')
          .map((char, index) => {
            if (index < iteration) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      if (iteration >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
      iteration += 1 / 2;
    }, 30);
  }, [text, chars]);

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDisplay(text);
  }, [text]);

  return { display, scramble, reset };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  MAIN PAGE COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function Home() {
  // ─── Scroll Progress ───
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollRef = useRef(0);

  // ─── Section Refs ───
  const heroRef = useRef<HTMLElement>(null);
  const manifestoRef = useRef<HTMLElement>(null);
  const worksRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const skillsRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);
  const manifestoWordsRef = useRef<(HTMLSpanElement | null)[]>([]);

  // ─── Hovered Project ───
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  // ─── Email Scramble ───
  const emailScramble = useTextScramble('baldyassatrio@gmail.com');

  // ─── Scroll Tracking ───
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      scrollRef.current = progress;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ─── GSAP Animations ───
  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Hero parallax fade out ──
      if (heroRef.current) {
        gsap.to(heroRef.current.querySelectorAll('.hero-text'), {
          y: -150,
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }

      // ── Manifesto word-by-word reveal ──
      manifestoWordsRef.current.forEach((word, i) => {
        if (!word) return;
        gsap.fromTo(
          word,
          { opacity: 0.08, y: 10 },
          {
            opacity: 1,
            y: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: manifestoRef.current,
              start: () => `top+=${(i / MANIFESTO_WORDS.length) * 70}% center`,
              end: () => `top+=${((i + 1) / MANIFESTO_WORDS.length) * 70 + 5}% center`,
              scrub: true,
            },
          }
        );
      });

      // ── Works row entrance ──
      if (worksRef.current) {
        gsap.utils.toArray<HTMLElement>(worksRef.current.querySelectorAll('.work-row')).forEach((row, i) => {
          gsap.fromTo(
            row,
            { x: 120, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: row,
                start: 'top 85%',
                end: 'top 60%',
                scrub: 1,
              },
              delay: i * 0.05,
            }
          );
        });
      }

      // ── About section ──
      if (aboutRef.current) {
        gsap.fromTo(
          aboutRef.current.querySelector('.about-image'),
          { clipPath: 'circle(0% at 50% 50%)' },
          {
            clipPath: 'circle(50% at 50% 50%)',
            ease: 'power2.out',
            scrollTrigger: {
              trigger: aboutRef.current,
              start: 'top 70%',
              end: 'center center',
              scrub: 1,
            },
          }
        );

        gsap.fromTo(
          aboutRef.current.querySelectorAll('.about-text-line'),
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: aboutRef.current,
              start: 'top 60%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        // Stats counter animation
        gsap.fromTo(
          aboutRef.current.querySelectorAll('.stat-item'),
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: aboutRef.current.querySelector('.stats-row'),
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // ── Contact entrance ──
      if (contactRef.current) {
        gsap.fromTo(
          contactRef.current.querySelectorAll('.contact-line'),
          { opacity: 0, y: 80 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.12,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: contactRef.current,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  RENDER
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  return (
    <>
      {/* ─── 3D Canvas Background ─── */}
      <Scene3D scrollProgress={scrollProgress} />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 1 — HERO
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        ref={heroRef}
        className="relative z-10 flex h-screen flex-col items-center justify-center overflow-hidden"
        style={{ background: 'transparent' }}
      >
        <div className="hero-text flex flex-col items-center text-center" style={{ mixBlendMode: 'difference' }}>
          {/* Main Name */}
          <h1
            className="font-bold uppercase leading-none tracking-[2vw] text-white"
            style={{ fontSize: '15vw', textShadow: '0 0 80px rgba(99,102,241,0.15)' }}
          >
            BALDYAS
          </h1>

          {/* Subtitle */}
          <h2
            className="mt-2 bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text font-bold uppercase leading-tight tracking-wide text-transparent"
            style={{ fontSize: '6vw' }}
          >
            SATRIO ALBANI
          </h2>

          {/* Tagline */}
          <p
            className="mt-6 text-sm font-medium uppercase tracking-[0.35em] text-white/50"
            style={{ fontVariant: 'small-caps' }}
          >
            Creative Designer &amp; Digital Craftsman
          </p>

          {/* Currently at */}
          <div className="mt-4 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-white/40">
              Currently at Anomali Digital
            </span>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="hero-text absolute bottom-12 flex flex-col items-center gap-3">
          <div className="relative h-16 w-px overflow-hidden bg-white/10">
            <div
              className="absolute left-0 top-0 h-8 w-full bg-gradient-to-b from-white/60 to-transparent"
              style={{ animation: 'scroll-line 2s ease-in-out infinite' }}
            />
          </div>
          <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-white/30">
            Explore
          </span>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 2 — MANIFESTO
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        ref={manifestoRef}
        className="relative z-10 flex min-h-screen items-center justify-center px-6 py-40"
        style={{ background: 'transparent' }}
      >
        <p
          className="max-w-5xl text-center font-bold leading-relaxed text-white"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 3.5rem)', lineHeight: 1.4 }}
        >
          {MANIFESTO_WORDS.map((word, i) => (
            <span
              key={i}
              ref={(el) => { manifestoWordsRef.current[i] = el; }}
              className="mr-[0.35em] inline-block opacity-[0.08] transition-colors duration-300"
              style={{ textShadow: '0 0 40px rgba(139,92,246,0.2)' }}
            >
              {word}
            </span>
          ))}
        </p>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 3 — SELECTED WORKS
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        ref={worksRef}
        id="works"
        className="relative z-10 px-6 py-32 lg:px-16"
        style={{ background: 'transparent' }}
      >
        {/* Section Title */}
        <h2
          className="mb-24 text-center text-xs font-medium uppercase text-white/40"
          style={{ letterSpacing: '1em' }}
        >
          Selected Works
        </h2>

        {/* Project List */}
        <div className="mx-auto max-w-6xl">
          {PROJECTS.map((project, index) => (
            <div key={project.number}>
              {/* Project Row */}
              <div
                className="work-row group relative cursor-pointer overflow-hidden px-4 py-8 transition-all duration-500 hover:px-8"
                onMouseEnter={() => setHoveredProject(index)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                {/* Hover Image (behind text) */}
                <div
                  className="pointer-events-none absolute inset-0 z-0 overflow-hidden transition-all duration-700"
                  style={{
                    clipPath: hoveredProject === index
                      ? 'inset(0% 0% 0% 0%)'
                      : 'inset(50% 50% 50% 50%)',
                    opacity: hoveredProject === index ? 0.25 : 0,
                  }}
                >
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="100vw"
                  />
                </div>

                {/* Row Content */}
                <div className="relative z-10 flex items-center justify-between">
                  {/* Number */}
                  <span className="font-mono text-sm text-white/30 transition-colors duration-300 group-hover:text-indigo-400">
                    {project.number}
                  </span>

                  {/* Title */}
                  <span
                    className="flex-1 px-8 text-3xl font-bold text-white transition-all duration-500 group-hover:text-white md:text-5xl lg:text-6xl"
                    style={{ textShadow: hoveredProject === index ? '0 0 40px rgba(139,92,246,0.3)' : 'none' }}
                  >
                    {project.title}
                  </span>

                  {/* Category */}
                  <span
                    className="hidden text-xs font-medium uppercase text-white/30 transition-colors duration-300 group-hover:text-white/60 md:block"
                    style={{ fontVariant: 'small-caps', letterSpacing: '0.15em' }}
                  >
                    {project.category}
                  </span>
                </div>
              </div>

              {/* Separator */}
              {index < PROJECTS.length - 1 && (
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 4 — ABOUT
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        ref={aboutRef}
        id="about"
        className="relative z-10 flex min-h-screen items-center px-6 py-32 lg:px-16"
        style={{ background: 'transparent' }}
      >
        <div className="mx-auto grid w-full max-w-6xl gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Left — Profile Image */}
          <div className="flex items-center justify-center">
            <div
              className="about-image relative aspect-square w-full max-w-md overflow-hidden"
              style={{ clipPath: 'circle(0% at 50% 50%)' }}
            >
              <Image
                src="/images/profile.png"
                alt="Baldyas Satrio Albani"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
            </div>
          </div>

          {/* Right — Bio */}
          <div className="flex flex-col justify-center">
            <h3 className="about-text-line mb-8 text-xs font-medium uppercase text-white/40" style={{ letterSpacing: '0.6em' }}>
              About
            </h3>

            <p className="about-text-line mb-6 text-lg leading-relaxed text-white/70 lg:text-xl">
              <span className="font-semibold text-white">Graphic Designer</span> at{' '}
              <span className="font-semibold text-indigo-400">Anomali Digital</span>. Formerly at{' '}
              <span className="text-white/90">Politeknik Negeri Media Kreatif</span>.
            </p>

            <p className="about-text-line mb-6 text-lg leading-relaxed text-white/50 lg:text-xl">
              I specialize in brand identity, UI/UX design, motion graphics, and photography. Based in{' '}
              <span className="text-white/80">Jakarta, Indonesia</span>.
            </p>

            {/* Stats */}
            <div className="stats-row mt-12 grid grid-cols-3 gap-8">
              {[
                { value: '30+', label: 'Projects' },
                { value: '1.5+', label: 'Years' },
                { value: '15+', label: 'Clients' },
              ].map((stat) => (
                <div key={stat.label} className="stat-item">
                  <div
                    className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text font-bold text-transparent"
                    style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
                  >
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-white/40">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 5 — SKILLS
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        ref={skillsRef}
        id="skills"
        className="relative z-10 overflow-hidden px-6"
        style={{ height: '80vh', background: 'transparent' }}
      >
        <h2
          className="pt-20 text-center text-xs font-medium uppercase text-white/40"
          style={{ letterSpacing: '1em' }}
        >
          Skills &amp; Tools
        </h2>

        {/* Floating Skill Words */}
        <div className="relative h-full w-full">
          {SKILLS.map((skill) => (
            <span
              key={skill.name}
              className="absolute cursor-default font-bold text-white transition-all duration-500 hover:scale-125 hover:text-indigo-400"
              style={{
                fontSize: skill.size,
                opacity: skill.opacity,
                left: skill.x,
                top: skill.y,
                textShadow: '0 0 30px rgba(139,92,246,0.1)',
                animation: `float-slow ${skill.duration} ease-in-out ${skill.delay} infinite`,
                filter: 'blur(0px)',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.textShadow = '0 0 60px rgba(139,92,246,0.5), 0 0 120px rgba(99,102,241,0.3)';
                (e.target as HTMLElement).style.filter = 'blur(0px)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.textShadow = '0 0 30px rgba(139,92,246,0.1)';
              }}
            >
              {skill.name}
            </span>
          ))}
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 6 — CONTACT
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        ref={contactRef}
        id="contact"
        className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6"
        style={{ background: 'transparent' }}
      >
        {/* Big Headline */}
        <h2
          className="contact-line max-w-5xl text-center font-bold uppercase leading-tight text-white"
          style={{ fontSize: 'clamp(1.5rem, 5vw, 4rem)', letterSpacing: '0.05em', textShadow: '0 0 60px rgba(99,102,241,0.15)' }}
        >
          Let&apos;s Create Something Extraordinary
        </h2>

        {/* Email — Scramble Effect */}
        <a
          href="mailto:baldyassatrio@gmail.com"
          className="contact-line group mt-12 block text-center text-xl font-medium text-white/50 transition-colors duration-300 hover:text-indigo-400 md:text-2xl"
          onMouseEnter={() => emailScramble.scramble()}
          onMouseLeave={() => emailScramble.reset()}
          style={{ fontFamily: 'monospace' }}
        >
          {emailScramble.display}
        </a>

        {/* Social Links */}
        <div className="contact-line mt-16 flex items-center gap-12">
          {[
            { label: 'Instagram', href: 'https://instagram.com/baldyas' },
            { label: 'LinkedIn', href: 'https://linkedin.com/in/baldyas' },
            { label: 'GitHub', href: 'https://github.com/baldyas' },
          ].map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium uppercase tracking-[0.2em] text-white/30 transition-all duration-300 hover:text-white hover:tracking-[0.35em]"
            >
              {social.label}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="contact-line absolute bottom-8 text-center text-xs text-white/20">
          &copy; 2026 Baldyas Satrio Albani
        </div>
      </section>
    </>
  );
}
