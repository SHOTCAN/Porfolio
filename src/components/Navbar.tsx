'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: 'Works', href: '#works' },
  { label: 'Process', href: '#process' },
  { label: 'Playground', href: '#playground' },
  { label: 'Skills', href: '#skills' },
  { label: 'About', href: '#about' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Estimator', href: '#estimator' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const tween = useRef<gsap.core.Tween | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [hasScrolled, setHasScrolled] = useState(false);

  // Scroll Show/Hide Logic
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const nav = navRef.current;
      if (!nav) return;

      setHasScrolled(currentY > 40);

      if (currentY > lastScrollY.current && currentY > 120) {
        if (tween.current) tween.current.kill();
        tween.current = gsap.to(nav, { y: -120, duration: 0.4, ease: 'power3.inOut' });
      } else {
        if (tween.current) tween.current.kill();
        tween.current = gsap.to(nav, { y: 0, duration: 0.4, ease: 'power3.out' });
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Active Section Detection
  useEffect(() => {
    const sections = NAV_LINKS.map((link) => document.querySelector(link.href)).filter(Boolean) as Element[];
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Mobile Menu Animation
  useEffect(() => {
    const menu = mobileMenuRef.current;
    if (!menu) return;

    if (isOpen) {
      gsap.set(menu, { display: 'flex', opacity: 0 });
      gsap.to(menu, { opacity: 1, duration: 0.3, ease: 'power2.out' });
      const links = menu.querySelectorAll('.mobile-nav-link');
      gsap.fromTo(
        links,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power3.out', delay: 0.1 }
      );
    } else {
      gsap.to(menu, {
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => gsap.set(menu, { display: 'none' }),
      });
    }
  }, [isOpen]);

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        hasScrolled ? 'bg-white/85 backdrop-blur-xl border-b border-slate-200/80 shadow-sm py-3' : 'bg-transparent py-5'
      }`}
      role="navigation"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          className="group flex items-center gap-1 text-xl font-bold tracking-tight text-slate-900"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <span>BSA</span>
          <span className="text-emerald-600 font-extrabold text-2xl">.</span>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`px-3.5 py-2 text-xs font-mono font-medium rounded-full transition-colors ${
                activeSection === link.href
                  ? 'text-emerald-700 bg-emerald-50 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {link.label}
            </a>
          ))}

          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            className="ml-3 rounded-full bg-emerald-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-700 transition-all hover:scale-105"
          >
            Let&apos;s Talk
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative z-10 flex h-10 w-10 items-center justify-center md:hidden"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          <div className="flex w-6 flex-col items-end gap-1.5">
            <span className={`block h-[2px] rounded-full bg-slate-900 transition-all ${isOpen ? 'w-6 translate-y-[5px] rotate-45' : 'w-6'}`} />
            <span className={`block h-[2px] rounded-full bg-slate-900 transition-all ${isOpen ? 'w-0 opacity-0' : 'w-4'}`} />
            <span className={`block h-[2px] rounded-full bg-slate-900 transition-all ${isOpen ? 'w-6 -translate-y-[5px] -rotate-45' : 'w-5'}`} />
          </div>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        ref={mobileMenuRef}
        className="fixed inset-0 z-[99] hidden flex-col items-center justify-center gap-6 bg-white/95 backdrop-blur-2xl md:hidden p-6"
        style={{ display: 'none' }}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => handleNavClick(e, link.href)}
            className={`mobile-nav-link text-2xl font-bold tracking-tight transition-colors ${
              activeSection === link.href ? 'text-emerald-600' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            {link.label}
          </a>
        ))}
        <a
          href="#contact"
          onClick={(e) => handleNavClick(e, '#contact')}
          className="mobile-nav-link mt-4 rounded-full bg-emerald-600 px-8 py-3 text-base font-semibold text-white shadow-lg"
        >
          Let&apos;s Talk
        </a>
      </div>
    </nav>
  );
}
