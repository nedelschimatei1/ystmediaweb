"use client";

import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useI18n } from "@/lib/i18n";
import { RevealWrapper } from "@/components/parallax-effects";

export function HeroSection() {
  const { t } = useI18n();
  const words = [t("hero.word1"), t("hero.word2"), t("hero.word3")];
  
  const [currentWord, setCurrentWord] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentWord((prev) => (prev + 1) % words.length);
        setIsVisible(true);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden py-20 sm:py-0"
      style={{ perspective: "1000px" }}
    >
      {/* Background gradient with parallax */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/50"
      />

      {/* Decorative elements with parallax */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 sm:top-20 left-4 sm:left-10 w-32 sm:w-72 h-32 sm:h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 sm:bottom-20 right-4 sm:right-10 w-40 sm:w-96 h-40 sm:h-96 bg-primary/3 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main headline */}
          <RevealWrapper delay={100} duration={1000}>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-medium tracking-tight text-foreground leading-[1.15]">
              <span className="block">{t("hero.title1")}</span>
              <span className="block mt-1 sm:mt-2 whitespace-nowrap lg:whitespace-normal">
                {t("hero.title2")} {" "}
                <span
                  className={`text-primary dark:text-accent inline transition-all duration-500 text-[0.85em] ${
                    isVisible ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {words[currentWord]}
                </span>
              </span>
            </h1>
          </RevealWrapper>

          {/* Subtitle */}
          <RevealWrapper delay={200} duration={1000}>
            <p className="mt-4 sm:mt-6 text-base sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t("hero.subtitle")}
            </p>
          </RevealWrapper>

          {/* CTA Buttons */}
          <RevealWrapper delay={300} duration={1000}>
            <div className="mt-6 sm:mt-8 flex flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/contact#form"
                className="group relative w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3.5 text-sm font-medium text-primary-foreground bg-primary dark:bg-accent dark:text-accent-foreground rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25 active:scale-100"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {t("hero.cta")}
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
              <Link
                href="/portfolio"
                className="btn-shine group relative w-auto inline-flex items-center justify-center px-5 sm:px-7 py-2.5 sm:py-3.5 text-sm font-medium text-foreground border-2 border-foreground/20 hover:border-foreground/40 rounded-full overflow-hidden transition-all duration-300 hover:scale-105 active:scale-100"
              >
                <span className="relative z-10">{t("hero.portfolio")}</span>
              </Link>
            </div>
          </RevealWrapper>
        </div>
      </div>

      {/* Scroll indicator - positioned at bottom of section, hidden on mobile */}
      <div className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <RevealWrapper delay={600} duration={800}>
          <div className="flex flex-col items-center gap-2 text-muted-foreground animate-bounce">
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <ChevronDown className="h-5 w-5" />
          </div>
        </RevealWrapper>
      </div>
    </section>
  );
}
