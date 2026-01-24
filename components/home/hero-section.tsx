"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useInView } from "@/hooks/use-in-view";

export function HeroSection() {
  const { t } = useI18n();
  const words = [t("hero.word1"), t("hero.word2"), t("hero.word3")];
  
  const [currentWord, setCurrentWord] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const { ref: sectionRef, isInView } = useInView();

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
    <section ref={sectionRef} className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted" />
      
      {/* Subtle decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div 
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary dark:text-accent text-sm font-medium mb-6 transition-all duration-1000 ease-out ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-primary dark:bg-accent animate-pulse" />
            {t("hero.badge")}
          </div>

          {/* Main headline */}
          <h1 
            className={`font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-medium tracking-tight text-foreground leading-[1.1] text-balance transition-all duration-1000 ease-out delay-150 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
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

          {/* Subtitle */}
          <p 
            className={`mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed transition-all duration-1000 ease-out delay-300 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {t("hero.subtitle")}
          </p>

          {/* CTA Buttons - Apple style */}
          <div 
            className={`mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 ease-out delay-500 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
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
        </div>
      </div>
    </section>
  );
}
