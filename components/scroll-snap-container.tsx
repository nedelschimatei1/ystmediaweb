"use client";

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";

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

export function ScrollSnapContainer({ children }: ScrollSnapContainerProps) {
  const [activeSection, setActiveSection] = useState(0);
  const [totalSections, setTotalSections] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sections = container.querySelectorAll("[data-scroll-section]");
    setTotalSections(sections.length);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-section-index"));
            setActiveSection(index);
          }
        });
      },
      {
        root: null,
        threshold: 0.5,
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (index: number) => {
    const container = containerRef.current;
    if (!container) return;
    
    const section = container.querySelector(`[data-section-index="${index}"]`);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <ScrollSnapContext.Provider value={{ activeSection, totalSections, scrollToSection }}>
      <div
        ref={containerRef}
        className="h-screen overflow-y-auto scroll-smooth md:snap-y md:snap-mandatory"
        style={{ scrollBehavior: "smooth", WebkitOverflowScrolling: "touch" }}
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
      className={`min-h-screen md:h-screen md:snap-start md:snap-always relative flex items-center justify-center overflow-hidden ${className}`}
      style={{
        backgroundColor: bgColor,
      }}
    >
      <div
        className="w-full h-full flex items-center justify-center transition-all duration-500 md:duration-700 ease-out py-20 md:py-0"
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

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!context || !mounted) return null;

  const { activeSection, totalSections, scrollToSection } = context;

  return (
    <div className="hidden md:flex fixed right-3 lg:right-6 top-1/2 -translate-y-1/2 z-50 flex-col gap-2 lg:gap-3">
      {Array.from({ length: totalSections }).map((_, index) => (
        <button
          key={index}
          onClick={() => scrollToSection(index)}
          className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full transition-all duration-300 ${
            activeSection === index
              ? "bg-primary scale-125"
              : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
          }`}
          aria-label={`Go to section ${index + 1}`}
        />
      ))}
    </div>
  );
}
