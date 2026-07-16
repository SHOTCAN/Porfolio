'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const dotPos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const lerp = useCallback((start: number, end: number, factor: number): number => {
    return start + (end - start) * factor;
  }, []);

  useEffect(() => {
    // Detect touch/mobile
    const checkMobile = () => {
      setIsMobile(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.innerWidth < 768
      );
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isMobile, isVisible]);

  // RAF animation loop
  useEffect(() => {
    if (isMobile) return;

    const animate = () => {
      const dot = dotRef.current;
      const ring = ringRef.current;

      if (dot && ring) {
        // Dot follows faster (more responsive)
        dotPos.current.x = lerp(dotPos.current.x, mouse.current.x, 0.35);
        dotPos.current.y = lerp(dotPos.current.y, mouse.current.y, 0.35);

        // Ring follows slower (trailing effect)
        ringPos.current.x = lerp(ringPos.current.x, mouse.current.x, 0.15);
        ringPos.current.y = lerp(ringPos.current.y, mouse.current.y, 0.15);

        dot.style.transform = `translate3d(${dotPos.current.x}px, ${dotPos.current.y}px, 0) translate(-50%, -50%)`;
        ring.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%) scale(${isHovering ? 1.8 : 1})`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafId.current);
  }, [isMobile, isHovering, lerp]);

  // Interactive element hover detection
  useEffect(() => {
    if (isMobile) return;

    const interactiveSelectors = 'a, button, [role="button"], input, textarea, select, label[for], [data-cursor-hover]';

    const handlePointerOver = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest(interactiveSelectors)) {
        setIsHovering(true);
      }
    };

    const handlePointerOut = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest(interactiveSelectors)) {
        setIsHovering(false);
      }
    };

    document.addEventListener('pointerover', handlePointerOver);
    document.addEventListener('pointerout', handlePointerOut);

    return () => {
      document.removeEventListener('pointerover', handlePointerOver);
      document.removeEventListener('pointerout', handlePointerOut);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      {/* Dot — small, sharp center point */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: '#f0f0f5',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.3s ease, background-color 0.3s ease',
          willChange: 'transform',
          mixBlendMode: 'difference',
        }}
      />

      {/* Ring — larger trailing circle */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          border: `1.5px solid ${isHovering ? 'rgba(99, 102, 241, 0.8)' : 'rgba(240, 240, 245, 0.4)'}`,
          backgroundColor: isHovering ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.3s ease, border-color 0.4s ease, background-color 0.4s ease, width 0.4s cubic-bezier(0.16,1,0.3,1), height 0.4s cubic-bezier(0.16,1,0.3,1)',
          willChange: 'transform',
        }}
      />
    </>
  );
}
