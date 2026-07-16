'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  color: string;
  year: string;
  tags: string[];
}

const projects: Project[] = [
  {
    id: 'fotobooth-pro',
    title: 'Fotobooth Pro',
    category: 'Software / UI Design',
    description: 'Professional event photobooth system with camera integration, template design, QR sharing, and cloud upload. Built with Python & PyQt6.',
    image: '/images/projects/fotobooth-pro.png',
    color: '#a78bfa',
    year: '2025',
    tags: ['Python', 'UI/UX', 'Desktop App'],
  },
  {
    id: 'luxury-brand',
    title: 'AURÈLE',
    category: 'Brand Identity',
    description: 'Complete luxury fashion brand identity — from logo to packaging. A study in elegance, minimalism, and timeless sophistication.',
    image: '/images/projects/luxury-brand.png',
    color: '#f59e0b',
    year: '2025',
    tags: ['Branding', 'Packaging', 'Print'],
  },
  {
    id: 'tech-dashboard',
    title: 'NexusAI Dashboard',
    category: 'UI/UX Design',
    description: 'Futuristic AI analytics dashboard with real-time data visualization, glassmorphism UI, and intelligent insights. Designed for enterprise.',
    image: '/images/projects/tech-dashboard.png',
    color: '#22d3ee',
    year: '2025',
    tags: ['Dashboard', 'Data Viz', 'Dark UI'],
  },
  {
    id: 'coffee-brand',
    title: 'Roast & Co.',
    category: 'Brand & Packaging',
    description: 'Artisan coffee brand from bean to cup — identity, packaging, merchandise. Warm, earthy, authentic.',
    image: '/images/projects/coffee-brand.png',
    color: '#92400e',
    year: '2025',
    tags: ['Branding', 'Packaging', 'Photography'],
  },
  {
    id: 'architecture',
    title: 'MONO Architects',
    category: 'Web Design',
    description: 'Minimal, cinematic website concept for a modern architecture firm. Bold typography meets dramatic photography.',
    image: '/images/projects/architecture.png',
    color: '#64748b',
    year: '2025',
    tags: ['Web Design', 'Minimal', 'Architecture'],
  },
  {
    id: 'mobile-app',
    title: 'Vault Finance',
    category: 'Mobile App Design',
    description: 'Premium fintech mobile app — seamless payments, portfolio tracking, and intelligent budgeting with a sleek dark interface.',
    image: '/images/projects/mobile-app.png',
    color: '#6366f1',
    year: '2025',
    tags: ['Mobile', 'Fintech', 'UI/UX'],
  },
  {
    id: 'restaurant',
    title: 'Ember & Oak',
    category: 'Restaurant Branding',
    description: 'Fine dining restaurant brand — from menu design to interior art direction. A feast for the eyes before the palate.',
    image: '/images/projects/restaurant.png',
    color: '#dc2626',
    year: '2025',
    tags: ['Branding', 'Menu Design', 'Photography'],
  },
];

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const [activeProject, setActiveProject] = useState<string | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        y: 80,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });

      const cards = sectionRef.current?.querySelectorAll('.project-card');
      if (cards) {
        cards.forEach((card, i) => {
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
            y: 100,
            opacity: 0,
            duration: 0.8,
            delay: i * 0.1,
            ease: 'power3.out',
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="works"
      className="relative py-32 md:py-44 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section header */}
        <div ref={headingRef} className="mb-20">
          <p className="text-[var(--accent)] font-mono text-sm tracking-[0.3em] uppercase mb-4">
            02 — Selected Works
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
              Projects that
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                speak volumes.
              </span>
            </h2>
            <p className="text-[var(--text-secondary)] text-lg max-w-md">
              Each project is a journey — from concept to completion. Hover to explore.
            </p>
          </div>
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="project-card group relative overflow-hidden rounded-2xl bg-[var(--card)] border border-white/5 cursor-pointer transition-all duration-700 hover:border-white/10"
              onMouseEnter={() => setActiveProject(project.id)}
              onMouseLeave={() => setActiveProject(null)}
              style={{
                boxShadow: activeProject === project.id
                  ? `0 0 80px ${project.color}15, 0 20px 60px rgba(0,0,0,0.4)`
                  : '0 4px 20px rgba(0,0,0,0.2)',
              }}
            >
              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-75"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--card)] via-transparent to-transparent opacity-60" />
                
                {/* Hover overlay content */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="w-20 h-20 rounded-full border-2 border-white/40 flex items-center justify-center backdrop-blur-sm bg-white/5">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                  </div>
                </div>

                {/* Year badge */}
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-mono text-white/80">
                  {project.year}
                </div>
              </div>

              {/* Info */}
              <div className="p-6 md:p-8">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs font-mono uppercase tracking-[0.2em] mb-2" style={{ color: project.color }}>
                      {project.category}
                    </p>
                    <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-white/90 transition-colors">
                      {project.title}
                    </h3>
                  </div>
                </div>
                
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-4 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 rounded-full bg-white/5 text-[var(--text-secondary)] border border-white/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom glow line on hover */}
              <div
                className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(90deg, transparent, ${project.color}, transparent)` }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
