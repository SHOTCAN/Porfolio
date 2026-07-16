'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

const timeline = [
  {
    year: '2025 — Present',
    role: 'Graphic Designer',
    company: 'Anomali Digital',
    description: 'Crafting visual identities, brand systems, and digital experiences for diverse clients across industries.',
    type: 'work' as const,
  },
  {
    year: '2024',
    role: 'Photography Student',
    company: 'Politeknik Negeri Media Kreatif',
    description: 'Explored visual storytelling and photographic techniques for 1 semester.',
    type: 'education' as const,
  },
  {
    year: '2022 — 2025',
    role: 'Visual Communication Design',
    company: 'SMK Budhiwarman 1',
    description: 'Built a strong foundation in design principles, typography, branding, and digital media production.',
    type: 'education' as const,
  },
];

const stats = [
  { value: '30+', label: 'Projects Completed' },
  { value: '1.5+', label: 'Years Experience' },
  { value: '15+', label: 'Happy Clients' },
  { value: '∞', label: 'Creativity' },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation
      gsap.from(headingRef.current, {
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 80%',
          end: 'top 50%',
          toggleActions: 'play none none reverse',
        },
        y: 100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });

      // Image parallax
      gsap.from(imageRef.current, {
        scrollTrigger: {
          trigger: imageRef.current,
          start: 'top 85%',
          end: 'top 30%',
          toggleActions: 'play none none reverse',
        },
        y: 80,
        opacity: 0,
        scale: 0.95,
        duration: 1.2,
        ease: 'power3.out',
      });

      // Timeline items stagger
      const timelineItems = timelineRef.current?.querySelectorAll('.timeline-item');
      if (timelineItems) {
        gsap.from(timelineItems, {
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
          x: -60,
          opacity: 0,
          stagger: 0.2,
          duration: 0.8,
          ease: 'power3.out',
        });
      }

      // Stats counter
      const statItems = statsRef.current?.querySelectorAll('.stat-item');
      if (statItems) {
        gsap.from(statItems, {
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
          y: 40,
          opacity: 0,
          stagger: 0.15,
          duration: 0.6,
          ease: 'power3.out',
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-32 md:py-44 overflow-hidden"
    >
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section label */}
        <div ref={headingRef} className="mb-20">
          <p className="text-[var(--accent)] font-mono text-sm tracking-[0.3em] uppercase mb-4">
            01 — About
          </p>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
            Designing experiences
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              that captivate.
            </span>
          </h2>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-24">
          {/* Profile image */}
          <div ref={imageRef} className="relative group">
            <div className="relative overflow-hidden rounded-2xl aspect-[3/4] bg-[var(--card)]">
              <Image
                src="/images/profile.png"
                alt="Baldyas Satrio Albani"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)]/60 via-transparent to-transparent" />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-4 md:bottom-6 md:right-6 bg-[var(--card)] backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4 shadow-2xl">
              <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Currently at</p>
              <p className="text-lg font-semibold text-white">Anomali Digital</p>
            </div>
          </div>

          {/* Bio + Timeline */}
          <div className="flex flex-col justify-center">
            <p className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed mb-10">
              I&apos;m Baldyas — a creative designer who transforms ideas into visual 
              stories. With expertise spanning graphic design, branding, motion 
              graphics, and photography, I bring a multidisciplinary approach to 
              every project. My goal is to create designs that don&apos;t just look 
              beautiful — they <em className="text-white not-italic font-medium">communicate, engage, and inspire.</em>
            </p>

            {/* Timeline */}
            <div ref={timelineRef} className="space-y-6">
              <h3 className="text-sm font-mono text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-4">
                Journey
              </h3>
              {timeline.map((item, i) => (
                <div
                  key={i}
                  className="timeline-item group relative pl-8 pb-6 border-l border-white/10 last:pb-0 hover:border-l-indigo-500/50 transition-colors duration-300"
                >
                  <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full bg-[var(--card)] border-2 border-white/20 -translate-x-[5.5px] group-hover:border-indigo-400 group-hover:bg-indigo-400/20 transition-all duration-300" />
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-mono text-[var(--accent)] tracking-wider">{item.year}</span>
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      item.type === 'work' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                    }`}>
                      {item.type}
                    </span>
                  </div>
                  <h4 className="text-white font-medium text-lg">{item.role}</h4>
                  <p className="text-[var(--text-secondary)] text-sm">{item.company}</p>
                  <p className="text-[var(--text-secondary)] text-sm mt-1 opacity-0 max-h-0 overflow-hidden group-hover:opacity-100 group-hover:max-h-20 transition-all duration-500">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="stat-item group relative p-8 rounded-2xl bg-[var(--card)]/50 border border-white/5 hover:border-indigo-500/30 transition-all duration-500 hover:bg-[var(--card)] cursor-default"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent relative z-10">
                {stat.value}
              </p>
              <p className="text-sm text-[var(--text-secondary)] mt-2 relative z-10">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
