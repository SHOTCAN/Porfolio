'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: 'About', href: '#about' },
  { label: 'Works', href: '#works' },
  { label: 'Skills', href: '#skills' },
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

  // ─── Scroll Show/Hide Logic ───
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const nav = navRef.current;
      if (!nav) return;

      setHasScrolled(currentY > 50);

      if (currentY > lastScrollY.current && currentY > 100) {
        // Scrolling down — hide
        if (tween.current) tween.current.kill();
        tween.current = gsap.to(nav, {
          y: -120,
          duration: 0.5,
          ease: 'power3.inOut',
        });
      } else {
        // Scrolling up — show
        if (tween.current) tween.current.kill();
        tween.current = gsap.to(nav, {
          y: 0,
          duration: 0.5,
          ease: 'power3.out',
        });
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ─── Active Section Detection ───
  useEffect(() => {
    const sections = NAV_LINKS.map((link) =>
      document.querySelector(link.href)
    ).filter(Boolean) as Element[];

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      {
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // ─── Mobile Menu Animation ───
  useEffect(() => {
    const menu = mobileMenuRef.current;
    if (!menu) return;

    if (isOpen) {
      gsap.set(menu, { display: 'flex', opacity: 0 });
      gsap.to(menu, {
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out',
      });

      // Stagger links
      const links = menu.querySelectorAll('.mobile-nav-link');
      gsap.fromTo(
        links,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power3.out',
          delay: 0.15,
        }
      );
    } else {
      gsap.to(menu, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => gsap.set(menu, { display: 'none' }),
      });
    }
  }, [isOpen]);

  // ─── Smooth Scroll to Section ───
  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      setIsOpen(false);

      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    []
  );

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-[100] transition-colors duration-500 ${
        hasScrolled ? 'glass-strong' : 'bg-transparent'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* ─── Logo ─── */}
          <a
            href="#"
            className="group relative z-10 flex items-center"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <span
              className="font-heading text-2xl font-bold tracking-tight text-text transition-colors duration-300 group-hover:text-accent"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              BSA
            </span>
            <span className="text-accent text-2xl font-bold">.</span>
          </a>

          {/* ─── Desktop Links ─── */}
          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`nav-link group relative px-5 py-2.5 text-sm font-medium transition-colors duration-300 ${
                  activeSection === link.href
                    ? 'text-text'
                    : 'text-text-secondary hover:text-text'
                }`}
              >
                {link.label}

                {/* Animated Underline */}
                <span
                  className={`absolute bottom-1 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-accent transition-all duration-500 ease-[var(--ease-out-expo)] ${
                    activeSection === link.href
                      ? 'w-5 opacity-100'
                      : 'w-0 opacity-0 group-hover:w-5 group-hover:opacity-100'
                  }`}
                />
              </a>
            ))}

            {/* CTA Button */}
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="ml-4 rounded-full border border-accent/30 bg-accent/10 px-5 py-2 text-sm font-medium text-accent transition-all duration-300 hover:border-accent/60 hover:bg-accent/20 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]"
            >
              Let&apos;s Talk
            </a>
          </div>

          {/* ─── Mobile Hamburger ─── */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative z-10 flex h-10 w-10 items-center justify-center md:hidden"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            <div className="flex w-6 flex-col items-end gap-1.5">
              <span
                className={`block h-[1.5px] rounded-full bg-text transition-all duration-500 ease-[var(--ease-out-expo)] ${
                  isOpen
                    ? 'w-6 translate-y-[4.5px] rotate-45'
                    : 'w-6'
                }`}
              />
              <span
                className={`block h-[1.5px] rounded-full bg-text transition-all duration-500 ease-[var(--ease-out-expo)] ${
                  isOpen ? 'w-0 opacity-0' : 'w-4'
                }`}
              />
              <span
                className={`block h-[1.5px] rounded-full bg-text transition-all duration-500 ease-[var(--ease-out-expo)] ${
                  isOpen
                    ? 'w-6 -translate-y-[4.5px] -rotate-45'
                    : 'w-5'
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* ─── Mobile Menu ─── */}
      <div
        ref={mobileMenuRef}
        className="fixed inset-0 z-[99] hidden flex-col items-center justify-center gap-8 bg-bg/95 backdrop-blur-2xl md:hidden"
        style={{ display: 'none' }}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => handleNavClick(e, link.href)}
            className={`mobile-nav-link text-3xl font-bold tracking-tight transition-colors duration-300 ${
              activeSection === link.href
                ? 'text-gradient'
                : 'text-text-secondary hover:text-text'
            }`}
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {link.label}
          </a>
        ))}

        <a
          href="#contact"
          onClick={(e) => handleNavClick(e, '#contact')}
          className="mobile-nav-link mt-4 rounded-full border border-accent/40 bg-accent/10 px-8 py-3 text-lg font-semibold text-accent transition-all duration-300 hover:bg-accent/20"
        >
          Let&apos;s Talk
        </a>
      </div>
    </nav>
  );
}
