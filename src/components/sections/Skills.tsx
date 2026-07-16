'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const skillCategories = [
  {
    title: 'Design',
    icon: '✦',
    color: '#6366f1',
    skills: [
      { name: 'Brand Identity', level: 95 },
      { name: 'UI/UX Design', level: 88 },
      { name: 'Typography', level: 92 },
      { name: 'Layout Design', level: 90 },
      { name: 'Packaging', level: 85 },
    ],
  },
  {
    title: 'Visual',
    icon: '◈',
    color: '#a78bfa',
    skills: [
      { name: 'Photography', level: 88 },
      { name: 'Photo Editing', level: 92 },
      { name: 'Motion Graphics', level: 80 },
      { name: 'Video Editing', level: 78 },
      { name: 'Color Grading', level: 85 },
    ],
  },
  {
    title: 'Technical',
    icon: '⬡',
    color: '#22d3ee',
    skills: [
      { name: 'Adobe Suite', level: 95 },
      { name: 'Figma', level: 90 },
      { name: 'Python', level: 75 },
      { name: 'Web Design', level: 82 },
      { name: 'AI Tools', level: 85 },
    ],
  },
];

const tools = [
  'Photoshop', 'Illustrator', 'InDesign', 'Premiere Pro',
  'After Effects', 'Lightroom', 'Figma', 'Canva',
  'DaVinci Resolve', 'Python', 'Midjourney', 'Blender',
];

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

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

      const cards = sectionRef.current?.querySelectorAll('.skill-card');
      if (cards) {
        gsap.from(cards, {
          scrollTrigger: {
            trigger: cards[0],
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          y: 60,
          opacity: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: 'power3.out',
        });
      }

      // Animate skill bars on scroll
      const bars = sectionRef.current?.querySelectorAll('.skill-bar-fill');
      if (bars) {
        bars.forEach((bar) => {
          gsap.from(bar, {
            scrollTrigger: {
              trigger: bar,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
            scaleX: 0,
            transformOrigin: 'left',
            duration: 1.2,
            ease: 'power3.out',
          });
        });
      }

      // Tools marquee
      const toolTags = sectionRef.current?.querySelectorAll('.tool-tag');
      if (toolTags) {
        gsap.from(toolTags, {
          scrollTrigger: {
            trigger: toolTags[0],
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
          scale: 0,
          opacity: 0,
          stagger: 0.05,
          duration: 0.4,
          ease: 'back.out(1.7)',
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative py-32 md:py-44 overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 w-[700px] h-[700px] bg-indigo-500/3 rounded-full blur-[150px] -translate-x-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div ref={headingRef} className="mb-20">
          <p className="text-[var(--accent)] font-mono text-sm tracking-[0.3em] uppercase mb-4">
            03 — Skills & Tools
          </p>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
            My creative
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
              arsenal.
            </span>
          </h2>
        </div>

        {/* Skill categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-20">
          {skillCategories.map((cat) => (
            <div
              key={cat.title}
              className="skill-card group relative p-8 rounded-2xl bg-[var(--card)]/60 border border-white/5 hover:border-white/10 transition-all duration-500 backdrop-blur-sm"
            >
              {/* Glow on hover */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{
                  background: `radial-gradient(circle at 50% 0%, ${cat.color}08, transparent 60%)`,
                }}
              />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <span className="text-2xl" style={{ color: cat.color }}>{cat.icon}</span>
                  <h3 className="text-xl font-bold text-white">{cat.title}</h3>
                </div>

                <div className="space-y-5">
                  {cat.skills.map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-[var(--text-secondary)]">{skill.name}</span>
                        <span className="text-xs font-mono" style={{ color: cat.color }}>{skill.level}%</span>
                      </div>
                      <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="skill-bar-fill h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${skill.level}%`,
                            background: `linear-gradient(90deg, ${cat.color}40, ${cat.color})`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tools */}
        <div>
          <h3 className="text-sm font-mono text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-8 text-center">
            Tools I Work With
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {tools.map((tool) => (
              <span
                key={tool}
                className="tool-tag px-5 py-2.5 rounded-full border border-white/10 text-sm text-[var(--text-secondary)] hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all duration-300 cursor-default"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
