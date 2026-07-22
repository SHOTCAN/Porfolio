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

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isMobile, isVisible]);

  useEffect(() => {
    if (isMobile) return;

    const animate = () => {
      const dot = dotRef.current;
      const ring = ringRef.current;

      if (dot && ring) {
        dotPos.current.x = lerp(dotPos.current.x, mouse.current.x, 0.35);
        dotPos.current.y = lerp(dotPos.current.y, mouse.current.y, 0.35);

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
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          backgroundColor: '#059669',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.3s ease, background-color 0.3s ease',
          willChange: 'transform',
        }}
      />

      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          border: `1.5px solid ${isHovering ? 'rgba(5, 150, 105, 0.9)' : 'rgba(16, 185, 129, 0.4)'}`,
          backgroundColor: isHovering ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.3s ease, border-color 0.4s ease, background-color 0.4s ease',
          willChange: 'transform',
        }}
      />
    </>
  );
}
