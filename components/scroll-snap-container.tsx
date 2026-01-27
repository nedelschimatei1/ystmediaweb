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
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const currentSectionRef = useRef(0);
  const wheelAccumulatorRef = useRef(0);
  const lastWheelTime = useRef(0);

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 767px)").matches);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
        root: isMobile ? null : container, // Use viewport as root on mobile
        threshold: [0.5],
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [isMobile]);

  // Smooth scroll to section by index (or to footer if beyond last section)
  const scrollToSection = useCallback((index: number, duration: number = 650) => {
    const container = containerRef.current;
    if (!container || isScrollingRef.current) return;
    
    const sections = container.querySelectorAll("[data-scroll-section]");
    const maxIndex = sections.length - 1;
    
    // If trying to scroll past the last section, scroll to the very bottom (footer)
    if (index > maxIndex) {
      isScrollingRef.current = true;
      const targetPosition = container.scrollHeight - container.clientHeight;
      
      smoothScrollTo(container, targetPosition, duration, () => {
        isScrollingRef.current = false;
        currentSectionRef.current = maxIndex + 1; // Mark as "beyond last section"
      });
      return;
    }
    
    // If scrolling back from footer to last section
    if (index < 0) {
      index = 0;
    }
    
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
    if (!container || isMobile) return; // Skip on mobile

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      if (isScrollingRef.current) return;

      const now = Date.now();
      const timeDelta = now - lastWheelTime.current;
      
      // Reset accumulator if too much time passed (new scroll gesture)
      if (timeDelta > 150) {
        wheelAccumulatorRef.current = 0;
      }
      lastWheelTime.current = now;

      // Accumulate wheel delta
      wheelAccumulatorRef.current += e.deltaY;

      // Threshold to trigger section change (prevents tiny scrolls from triggering)
      const threshold = 25;
      
      if (Math.abs(wheelAccumulatorRef.current) >= threshold) {
        const direction = wheelAccumulatorRef.current > 0 ? 1 : -1;
        const nextSection = currentSectionRef.current + direction;
        
        wheelAccumulatorRef.current = 0;
        scrollToSection(nextSection, 600);
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [scrollToSection, isMobile]);

  // Touch handling removed - let mobile scroll naturally like portfolio/contact pages

  return (
    <ScrollSnapContext.Provider value={{ activeSection, totalSections, scrollToSection }}>
      <div
        ref={containerRef}
        className={
          isMobile 
            ? "min-h-screen" // Natural document flow on mobile
            : "h-screen overflow-y-auto overscroll-none" // Scroll container on desktop
        }
        style={
          isMobile 
            ? undefined 
            : { 
                WebkitOverflowScrolling: "touch",
                overflowY: "auto",
              }
        }
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

  // Section labels
  const sectionLabels = [
    "Acasă",
    "Despre",
    "Servicii",
    "Echipă",
    "Contact",
  ];

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
          className="group relative flex items-center justify-end w-auto disabled:cursor-default"
          aria-label={`Go to ${sectionLabels[index] || `section ${index + 1}`}`}
        >
          {/* Label - shows on hover */}
          <span
            className={`mr-3 text-sm font-medium whitespace-nowrap transition-all duration-300 ease-out ${
              activeSection === index
                ? "opacity-100 text-primary translate-x-0"
                : "opacity-0 text-muted-foreground translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
            }`}
          >
            {sectionLabels[index] || `Section ${index + 1}`}
          </span>
          
          {/* Dot container */}
          <div className="relative flex items-center justify-center w-5 h-5">
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
          </div>
        </button>
      ))}
    </div>
  );
}
