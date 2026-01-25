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
      className="relative w-full h-full flex items-center justify-center overflow-hidden"
      style={{ perspective: "1000px" }}
    >
      {/* Background gradient with parallax */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/50"
      />

      {/* Decorative elements with parallax */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <RevealWrapper delay={0} duration={1000}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary dark:text-accent text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-primary dark:bg-accent animate-pulse" />
              {t("hero.badge")}
            </div>
          </RevealWrapper>

          {/* Main headline */}
          <RevealWrapper delay={100} duration={1000}>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-medium tracking-tight text-foreground leading-[1.1] text-balance">
              <span className="block">{t("hero.title1")}</span>
              <span className="block mt-2">
                {t("hero.title2")}{" "}
                <span
                  className={`text-primary dark:text-accent inline-block transition-all duration-500 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                >
                  {words[currentWord]}
                </span>
              </span>
            </h1>
          </RevealWrapper>

          {/* Subtitle */}
          <RevealWrapper delay={200} duration={1000}>
            <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t("hero.subtitle")}
            </p>
          </RevealWrapper>

          {/* CTA Buttons */}
          <RevealWrapper delay={300} duration={1000}>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact#form"
                className="group relative inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-medium text-primary-foreground bg-primary rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25 active:scale-100"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {t("hero.cta")}
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
              <Link
                href="/portfolio"
                className="group relative inline-flex items-center justify-center px-7 py-3.5 text-base font-medium text-primary rounded-full overflow-hidden transition-all duration-300 hover:scale-105 active:scale-100"
              >
                <span className="absolute inset-0 bg-primary/10 transition-colors duration-300 group-hover:bg-primary/15" />
                <span className="relative z-10">{t("hero.about")}</span>
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
