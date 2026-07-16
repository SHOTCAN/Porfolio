'use client';

import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────── helpers ─────────────────────────── */

/** Split a string into an array of <span> elements per character */
function splitChars(text: string, className?: string) {
  return text.split('').map((char, i) => (
    <span
      key={i}
      className={`inline-block char-reveal ${className ?? ''}`}
      style={{ display: char === ' ' ? 'inline' : undefined }}
    >
      {char === ' ' ? '\u00A0' : char}
    </span>
  ));
}

/* ═══════════════════════════ COMPONENT ═══════════════════════════ */

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);

  /* ── mouse parallax for orbs ── */
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const { clientX, clientY } = e;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (clientX - cx) / cx; // -1 → 1
    const dy = (clientY - cy) / cy;

    // Move opposite to mouse direction for parallax depth
    gsap.to(orb1Ref.current, {
      x: -dx * 40,
      y: -dy * 40,
      duration: 1.2,
      ease: 'power2.out',
    });
    gsap.to(orb2Ref.current, {
      x: -dx * 60,
      y: -dy * 55,
      duration: 1.4,
      ease: 'power2.out',
    });
    gsap.to(orb3Ref.current, {
      x: -dx * 25,
      y: -dy * 30,
      duration: 1.6,
      ease: 'power2.out',
    });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  /* ── GSAP entrance + scroll-out timeline ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      /* 1 ▸ character reveals – staggered from below with rotation */
      tl.fromTo(
        '.char-reveal',
        {
          y: 120,
          opacity: 0,
          rotateX: -90,
          transformOrigin: 'bottom center',
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.2,
          stagger: 0.035,
        },
      );

      /* 2 ▸ subtitle fade in */
      tl.fromTo(
        '.hero-subtitle',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9 },
        '-=0.4',
      );

      /* 3 ▸ status line */
      tl.fromTo(
        '.hero-status',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        '-=0.5',
      );

      /* 4 ▸ scroll indicator */
      tl.fromTo(
        '.scroll-indicator',
        { opacity: 0 },
        { opacity: 1, duration: 0.8 },
        '-=0.2',
      );

      /* 5 ▸ orb entrance */
      tl.fromTo(
        '.hero-orb',
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.4, stagger: 0.2, ease: 'elastic.out(1, 0.75)' },
        0.3,
      );

      /* ── scroll-triggered parallax fade ── */
      gsap.to(contentRef.current, {
        y: -150,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* ════════════════════════════ JSX ════════════════════════════ */

  return (
    <section
      ref={sectionRef}
      className="relative flex h-screen w-full items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#0a0a0f' }}
    >
      {/* ── noise / grain overlay ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-30 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />

      {/* ── gradient orbs (background) ── */}
      <div
        ref={orb1Ref}
        aria-hidden
        className="hero-orb absolute -left-[10%] top-[10%] h-[45vw] w-[45vw] rounded-full opacity-0"
        style={{
          background:
            'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'float-slow 14s ease-in-out infinite',
        }}
      />
      <div
        ref={orb2Ref}
        aria-hidden
        className="hero-orb absolute -right-[8%] bottom-[5%] h-[40vw] w-[40vw] rounded-full opacity-0"
        style={{
          background:
            'radial-gradient(circle, rgba(34,211,238,0.15) 0%, transparent 70%)',
          filter: 'blur(90px)',
          animation: 'float-slow 18s ease-in-out infinite reverse',
        }}
      />
      <div
        ref={orb3Ref}
        aria-hidden
        className="hero-orb absolute left-[30%] bottom-[20%] h-[30vw] w-[30vw] rounded-full opacity-0"
        style={{
          background:
            'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)',
          filter: 'blur(100px)',
          animation: 'float-slow 22s ease-in-out infinite 2s',
        }}
      />

      {/* ── main content ── */}
      <div
        ref={contentRef}
        className="relative z-10 flex flex-col items-center px-4 text-center"
        style={{ perspective: '1200px' }}
      >
        {/* name – line 1 */}
        <h1 className="hero-name select-none font-space-grotesk font-bold uppercase leading-[0.9] tracking-[-0.03em] text-white"
          style={{ fontSize: 'clamp(3rem, 11vw, 14rem)' }}
        >
          {splitChars('BALDYAS')}
        </h1>

        {/* name – line 2 */}
        <h1
          className="hero-name select-none font-space-grotesk font-bold uppercase leading-[0.9] tracking-[-0.03em]"
          style={{
            fontSize: 'clamp(2rem, 6vw, 7.5rem)',
            background: 'linear-gradient(90deg, #e2e8f0, #94a3b8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {splitChars('SATRIO ALBANI')}
        </h1>

        {/* subtitle */}
        <p
          className="hero-subtitle mt-6 font-space-grotesk text-sm font-light uppercase tracking-[0.35em] text-white/50 sm:text-base md:text-lg"
        >
          Creative Designer &amp; Digital Craftsman
        </p>

        {/* status */}
        <div className="hero-status mt-5 flex items-center gap-2 font-space-grotesk text-xs uppercase tracking-[0.25em] text-white/40 sm:text-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          Currently at Anomali Digital
        </div>

        {/* scroll indicator */}
        <div className="scroll-indicator absolute -bottom-28 flex flex-col items-center gap-2 opacity-0 sm:-bottom-32">
          <span className="font-space-grotesk text-[10px] uppercase tracking-[0.3em] text-white/30">
            Scroll to explore
          </span>
          <div className="flex h-9 w-[1.5px] items-start justify-center overflow-hidden">
            <span
              className="block h-4 w-full bg-white/40"
              style={{ animation: 'scroll-line 2s ease-in-out infinite' }}
            />
          </div>
        </div>
      </div>

      {/* ── vignette edges ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, #0a0a0f 100%)',
        }}
      />
    </section>
  );
}
