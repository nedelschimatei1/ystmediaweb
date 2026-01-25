"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
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

    const duration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(end * easeOutCubic);
      
      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [hasStarted, end]);

  return (
    <span ref={ref} className="block font-serif text-3xl lg:text-4xl font-semibold text-primary tabular-nums">
      {count}{suffix}
    </span>
  );
}

export function AboutSection() {
  const { t } = useI18n();
  const { ref: sectionRef, isInView } = useInView();

  const pillars = [
    t("about.pillar1"),
    t("about.pillar2"),
    t("about.pillar3"),
    t("about.pillar4"),
  ];

  const stats = [
    { value: 40, suffix: "+", label: t("stats.years") },
    { value: 250, suffix: "+", label: t("stats.businesses") },
    { value: 115, suffix: "", label: t("stats.collaborators") },
    { value: 600, suffix: "", label: t("stats.projects") },
  ];

  return (
    <section ref={sectionRef} className="w-full py-8 md:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Content */}
          <div>
            <span 
              className={`text-sm font-medium uppercase tracking-widest text-primary transition-all duration-700 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              {t("about.label")}
            </span>
            <h2 
              className={`mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-foreground leading-[1.1] transition-all duration-700 delay-100 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              {t("about.title")}
            </h2>
            <p 
              className={`mt-4 text-base text-muted-foreground leading-relaxed transition-all duration-700 delay-200 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              {t("about.desc1")}
            </p>
            <p 
              className={`mt-3 text-base text-muted-foreground leading-relaxed transition-all duration-700 delay-300 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              {t("about.desc2")}
            </p>

            {/* Pillars */}
            <div 
              className={`mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 transition-all duration-700 delay-400 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              {pillars.map((pillar, index) => (
                <div 
                  key={pillar} 
                  className="flex items-center gap-3"
                  style={{ transitionDelay: `${400 + index * 50}ms` }}
                >
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-foreground font-medium">{pillar}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div 
              className={`mt-6 transition-all duration-700 delay-500 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <Link
                href="/portfolio"
                className="group inline-flex items-center gap-2 text-primary font-medium hover:gap-4 transition-all"
              >
                {t("about.discover")}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Stats */}
          <div 
            className={`relative transition-all duration-1000 delay-300 ${
              isInView ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
            }`}
          >
            {/* Background decoration */}
            <div className="absolute inset-0 bg-primary/5 rounded-2xl -rotate-3" />
            
            <div className="relative bg-card border border-border rounded-2xl p-6 lg:p-8">
              <h3 className="font-serif text-xl font-medium text-foreground mb-6">
                {t("about.statsTitle")}
              </h3>
              
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                    <span className="block mt-1 text-xs text-muted-foreground">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Quote */}
              <div className="mt-6 pt-6 border-t border-border">
                <blockquote className="text-muted-foreground italic leading-relaxed text-sm">
                  {'"'}{t("about.quote")}{'"'}
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
