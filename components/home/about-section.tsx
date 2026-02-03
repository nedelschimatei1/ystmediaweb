"use client";

import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useInView } from "@/hooks/use-in-view";

function AnimatedCounter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const { ref, isInView: isCounterInView } = useInView({ threshold: 0.3 });

  useEffect(() => {
    if (isCounterInView && !hasStarted) {
      setHasStarted(true);
    }
  }, [isCounterInView, hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    const duration = 1500;
    let startTime: number | null = null;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Smooth easeOutQuart for fluid motion
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.round(end * easeOutQuart);
      
      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [hasStarted, end]);

  return (
    <span ref={ref} className="block font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-primary tabular-nums">
      {count}{suffix}
    </span>
  );
}

export function AboutSection() {
  const { t } = useI18n();
  const { ref: sectionRef, isInView } = useInView();

  const pillars = [
    "Lucrăm pe baza experienței reale, nu a teoriei",
    "Comunicăm deschis și transparent",
    "Ne adaptăm rapid la piață și la obiectivele tale",
    "Suntem implicați constant și oferim suport 24/7",
  ];

  const stats = [
    { value: 20, suffix: "+", label: t("stats.years") },
    { value: 100, suffix: "+", label: t("stats.businesses") },
    { value: 120, suffix: "", label: t("stats.collaborators") },
    { value: 500, suffix: "", label: t("stats.projects") },
  ];

  return (
    <section ref={sectionRef} className="w-full py-8 sm:py-12 md:py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <span 
              className={`text-sm font-semibold uppercase tracking-widest text-primary transition-all duration-700 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              {t("about.label")}
            </span>
            <h2 
              className={`mt-2 sm:mt-4 font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-foreground leading-tight transition-all duration-700 delay-100 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              {t("about.title")}
            </h2>
            <p 
              className={`mt-4 sm:mt-6 text-base sm:text-lg text-foreground/80 leading-relaxed whitespace-pre-line transition-all duration-700 delay-200 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              {t("about.desc1")}
            </p>
            <p 
              className={`mt-3 sm:mt-4 text-base sm:text-lg text-foreground/80 leading-relaxed whitespace-pre-line transition-all duration-700 delay-300 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              {t("about.desc2")}
            </p>

            {/* Pillars */}
            <div 
              className={`mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-4 transition-all duration-700 delay-400 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              {pillars.map((pillar, index) => (
                <div 
                  key={pillar} 
                  className="flex items-start gap-3 justify-start text-left"
                  style={{ transitionDelay: `${400 + index * 50}ms` }}
                >
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base lg:text-lg text-foreground font-semibold underline decoration-primary decoration-1 underline-offset-8">{pillar}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Stats */}
          <div 
            className={`relative transition-all duration-1000 delay-300 ${
              isInView ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
            }`}
          >
            {/* Background decoration */}
            <div className="absolute inset-0 bg-primary/5 rounded-xl sm:rounded-2xl -rotate-3 hidden sm:block" />
            
            <div className="relative bg-card border border-border rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8">
              <h3 className="font-serif text-lg sm:text-xl lg:text-2xl font-medium text-foreground mb-4 sm:mb-6 text-center">
                {t("about.statsTitle")}
              </h3>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                    <span className="block mt-0.5 sm:mt-1 text-xs sm:text-sm text-muted-foreground">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Quote */}
              <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-border">
                <blockquote className="text-foreground/70 italic leading-loose text-sm sm:text-sm text-center">
                  {(() => {
                    const quote = t("about.quote");
                    const parts = quote.split('\n').map(p => p.trim()).filter(Boolean);
                    if (parts.length === 1) {
                      return (
                        <span className="block">&ldquo;{parts[0]}&rdquo;</span>
                      );
                    }
                    return (
                      <>
                        <span className="block">&ldquo;{parts[0]}</span>
                        <span className="block mt-1">{parts[1]}&rdquo;</span>
                      </>
                    );
                  })()}
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
