'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const contactLinks = [
  { label: 'Email', value: 'baldyas.albani@gmail.com', href: 'mailto:baldyas.albani@gmail.com', icon: '✉' },
  { label: 'Instagram', value: '@baldyas.sa', href: 'https://instagram.com/baldyas.sa', icon: '◎' },
  { label: 'LinkedIn', value: 'Baldyas Satrio', href: 'https://linkedin.com/in/baldyas-satrio', icon: '◆' },
  { label: 'WhatsApp', value: '+62 812 XXXX XXXX', href: 'https://wa.me/62812XXXXXXXX', icon: '◇' },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const [hoveredLink, setHoveredLink] = useState<number | null>(null);

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

      const links = sectionRef.current?.querySelectorAll('.contact-link');
      if (links) {
        gsap.from(links, {
          scrollTrigger: {
            trigger: links[0],
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          y: 40,
          opacity: 0,
          stagger: 0.1,
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
      id="contact"
      className="relative py-32 md:py-44 overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 w-[800px] h-[400px] bg-indigo-500/5 rounded-full blur-[150px] -translate-x-1/2" />
        <div className="absolute top-1/4 right-0 w-[300px] h-[300px] bg-violet-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div ref={headingRef} className="text-center mb-20">
          <p className="text-[var(--accent)] font-mono text-sm tracking-[0.3em] uppercase mb-4">
            04 — Get in Touch
          </p>
          <h2 className="text-4xl md:text-6xl lg:text-8xl font-bold leading-[1.1] tracking-tight mb-6">
            Let&apos;s create
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
              something great.
            </span>
          </h2>
          <p className="text-[var(--text-secondary)] text-lg md:text-xl max-w-xl mx-auto">
            Have a project in mind? Let&apos;s talk about how we can bring your vision to life.
          </p>
        </div>

        {/* Contact links */}
        <div className="max-w-3xl mx-auto space-y-4 mb-20">
          {contactLinks.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link group flex items-center justify-between p-6 md:p-8 rounded-2xl border border-white/5 hover:border-white/15 transition-all duration-500 relative overflow-hidden"
              onMouseEnter={() => setHoveredLink(i)}
              onMouseLeave={() => setHoveredLink(null)}
              style={{
                background: hoveredLink === i
                  ? 'rgba(99, 102, 241, 0.05)'
                  : 'rgba(26, 26, 36, 0.5)',
              }}
            >
              {/* Hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-transparent to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="flex items-center gap-4 relative z-10">
                <span className="text-2xl text-[var(--text-secondary)] group-hover:text-indigo-400 transition-colors duration-300">
                  {link.icon}
                </span>
                <div>
                  <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-1">
                    {link.label}
                  </p>
                  <p className="text-lg md:text-xl font-medium text-white group-hover:text-indigo-300 transition-colors duration-300">
                    {link.value}
                  </p>
                </div>
              </div>

              <svg
                className="w-6 h-6 text-[var(--text-secondary)] group-hover:text-indigo-400 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 relative z-10"
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <a
            href="mailto:baldyas.albani@gmail.com"
            className="group inline-flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium text-lg hover:from-indigo-500 hover:to-violet-500 transition-all duration-300 hover:shadow-[0_0_40px_rgba(99,102,241,0.3)] hover:scale-105"
          >
            Start a Project
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-32 border-t border-white/5 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <p className="text-2xl font-bold bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">
                BSA.
              </p>
            </div>
            <p className="text-sm text-[var(--text-secondary)]">
              © {new Date().getFullYear()} Baldyas Satrio Albani. Crafted with passion.
            </p>
            <div className="flex gap-6">
              <a href="https://instagram.com/baldyas.sa" target="_blank" rel="noopener noreferrer" className="text-[var(--text-secondary)] hover:text-white transition-colors text-sm">
                Instagram
              </a>
              <a href="https://linkedin.com/in/baldyas-satrio" target="_blank" rel="noopener noreferrer" className="text-[var(--text-secondary)] hover:text-white transition-colors text-sm">
                LinkedIn
              </a>
              <a href="https://github.com/SHOTCAN" target="_blank" rel="noopener noreferrer" className="text-[var(--text-secondary)] hover:text-white transition-colors text-sm">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
}
