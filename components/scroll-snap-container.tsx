"use client";

import { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from "react";

interface ScrollSnapContextType {
  activeSection: number;
  totalSections: number;
  scrollToSection: (index: number) => void;
}

const ScrollSnapContext = createContext<ScrollSnapContextType | null>(null);

export function useScrollSnap() {
  return useContext(ScrollSnapContext);
}

interface ScrollSnapContainerProps {
  children: ReactNode;
}

// Apple-style easing - very smooth deceleration
function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

// Custom smooth scroll with buttery 60fps animation
function smoothScrollTo(
  element: HTMLElement,
  targetPosition: number,
  duration: number = 1200,
  onComplete?: () => void
) {
  const startPosition = element.scrollTop;
  const distance = targetPosition - startPosition;
  let startTime: number | null = null;
  let rafId: number;

  function animate(currentTime: number) {
    if (startTime === null) startTime = currentTime;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutExpo(progress);
    
    element.scrollTop = startPosition + distance * easedProgress;

    if (progress < 1) {
      rafId = requestAnimationFrame(animate);
    } else {
      onComplete?.();
    }
  }

  rafId = requestAnimationFrame(animate);
  return () => cancelAnimationFrame(rafId);
}

export function ScrollSnapContainer({ children }: ScrollSnapContainerProps) {
  const [activeSection, setActiveSection] = useState(0);
  const [totalSections, setTotalSections] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const currentSectionRef = useRef(0);
  const wheelAccumulatorRef = useRef(0);
  const lastWheelTime = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sections = container.querySelectorAll("[data-scroll-section]");
    setTotalSections(sections.length);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const index = Number(entry.target.getAttribute("data-section-index"));
            setActiveSection(index);
            currentSectionRef.current = index;
          }
        });
      },
      {
        root: container,
        threshold: [0.5],
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Smooth scroll to section by index
  const scrollToSection = useCallback((index: number, duration: number = 1000) => {
    const container = containerRef.current;
    if (!container || isScrollingRef.current) return;
    
    const sections = container.querySelectorAll("[data-scroll-section]");
    const maxIndex = sections.length - 1;
    const clampedIndex = Math.max(0, Math.min(index, maxIndex));
    
    const section = container.querySelector(`[data-section-index="${clampedIndex}"]`) as HTMLElement;
    if (section) {
      isScrollingRef.current = true;
      const targetPosition = section.offsetTop;
      
      smoothScrollTo(container, targetPosition, duration, () => {
        isScrollingRef.current = false;
        currentSectionRef.current = clampedIndex;
        setActiveSection(clampedIndex);
      });
    }
  }, []);

  // Handle wheel events for smooth section transitions (desktop only)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Only on desktop
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (isMobile) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      if (isScrollingRef.current) return;

      const now = Date.now();
      const timeDelta = now - lastWheelTime.current;
      
      // Reset accumulator if too much time passed (new scroll gesture)
      if (timeDelta > 200) {
        wheelAccumulatorRef.current = 0;
      }
      lastWheelTime.current = now;

      // Accumulate wheel delta
      wheelAccumulatorRef.current += e.deltaY;

      // Threshold to trigger section change (prevents tiny scrolls from triggering)
      const threshold = 50;
      
      if (Math.abs(wheelAccumulatorRef.current) >= threshold) {
        const direction = wheelAccumulatorRef.current > 0 ? 1 : -1;
        const nextSection = currentSectionRef.current + direction;
        
        wheelAccumulatorRef.current = 0;
        scrollToSection(nextSection, 900);
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [scrollToSection]);

  // Handle touch events for smooth section transitions (mobile)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let touchStartY = 0;
    let touchEndY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isScrollingRef.current) return;
      
      touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY - touchEndY;
      const threshold = 50;

      if (Math.abs(deltaY) >= threshold) {
        const direction = deltaY > 0 ? 1 : -1;
        const nextSection = currentSectionRef.current + direction;
        scrollToSection(nextSection, 800);
      }
    };

    // Only enable touch handling on mobile
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (!isMobile) return;

    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [scrollToSection]);

  return (
    <ScrollSnapContext.Provider value={{ activeSection, totalSections, scrollToSection }}>
      <div
        ref={containerRef}
        className="h-screen overflow-y-auto overscroll-none"
        style={{ 
          WebkitOverflowScrolling: "touch",
          overflowY: "auto",
        }}
      >
        {children}
      </div>
    </ScrollSnapContext.Provider>
  );
}

interface ScrollSnapSectionProps {
  children: ReactNode;
  index: number;
  className?: string;
  bgColor?: string;
}

export function ScrollSnapSection({ children, index, className = "", bgColor }: ScrollSnapSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: [0, 0.1, 0.25, 0.5],
      }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-scroll-section
      data-section-index={index}
      className={`min-h-[auto] md:min-h-screen md:h-screen md:snap-start md:snap-always relative flex items-center justify-center overflow-hidden ${className}`}
      style={{
        backgroundColor: bgColor,
      }}
    >
      <div
        className="w-full h-full flex items-center justify-center transition-all duration-500 md:duration-700 ease-out"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.99)",
        }}
      >
        {children}
      </div>
    </section>
  );
}

export function ScrollSnapDots() {
  const context = useScrollSnap();
  const [mounted, setMounted] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Detect scrolling to disable clicks during scroll
  useEffect(() => {
    let scrollTimeout: ReturnType<typeof setTimeout>;
    
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => setIsScrolling(false), 150);
    };

    const container = document.querySelector('[class*="overflow-y-auto"]');
    container?.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container?.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  if (!context || !mounted) return null;

  const { activeSection, totalSections, scrollToSection } = context;

  return (
    <div className="hidden md:flex fixed right-4 lg:right-8 top-1/2 -translate-y-1/2 z-50 flex-col gap-3 lg:gap-4">
      {Array.from({ length: totalSections }).map((_, index) => (
        <button
          key={index}
          onClick={() => !isScrolling && scrollToSection(index)}
          disabled={isScrolling}
          className="group relative flex items-center justify-center w-5 h-5 disabled:cursor-default"
          aria-label={`Go to section ${index + 1}`}
        >
          {/* Outer ring - shows on hover or active */}
          <span
            className={`absolute inset-0 rounded-full transition-all duration-500 ease-out ${
              activeSection === index
                ? "bg-primary/20 scale-150"
                : "bg-transparent scale-100 group-hover:bg-primary/10 group-hover:scale-150"
            }`}
          />
          {/* Inner dot */}
          <span
            className={`relative z-10 rounded-full transition-all duration-300 ease-out ${
              activeSection === index
                ? "w-3 h-3 bg-primary shadow-lg shadow-primary/30"
                : "w-2 h-2 bg-muted-foreground/40 group-hover:bg-primary/60 group-hover:scale-110"
            }`}
          />
          {/* Ping animation for active dot */}
          {activeSection === index && (
            <span className="absolute inset-0 rounded-full border-2 border-primary/40 animate-ping" />
          )}
        </button>
      ))}
    </div>
  );
}
