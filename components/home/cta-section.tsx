"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useInView } from "@/hooks/use-in-view";

export function CTASection() {
  const { t } = useI18n();
  const { ref: sectionRef, isInView } = useInView({ threshold: 0.2 });

  return (
    <section ref={sectionRef} className="py-16 lg:py-20 bg-primary dark:bg-gradient-to-b dark:from-background dark:via-accent/5 dark:to-background text-primary-foreground dark:text-foreground overflow-hidden relative">
      {/* Elegant decorative elements for dark mode */}
      <div className="hidden dark:block absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      </div>
        
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div 
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 dark:bg-accent/10 border border-primary-foreground/20 dark:border-accent/20 text-primary-foreground dark:text-foreground text-sm font-medium mb-6 transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {t("cta.badge")}
          </div>

          {/* Headline */}
          <h2 
            className={`font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight leading-[1.1] text-primary-foreground dark:text-foreground transition-all duration-700 delay-100 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {t("cta.title")}
          </h2>

          {/* Subtitle */}
          <p 
            className={`mt-4 text-base text-primary-foreground/80 dark:text-foreground/80 leading-relaxed transition-all duration-700 delay-200 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {t("cta.desc")}
          </p>

          {/* CTA Buttons */}
          <div 
            className={`mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-300 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <Link
              href="/contact#form"
              className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-medium bg-primary-foreground text-primary dark:bg-accent dark:text-accent-foreground rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg dark:shadow-accent/20 dark:hover:shadow-accent/40 active:scale-100"
            >
              {t("cta.button")}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <div className="flex flex-col items-center sm:items-start sm:border-l sm:border-primary-foreground/20 dark:sm:border-accent/30 sm:pl-6">
              <a
                href="tel:+40721469039"
                className="text-lg font-semibold hover:underline transition-all dark:text-foreground"
              >
                +40 721 469 039
              </a>
              <span className="text-xs text-primary-foreground/60 dark:text-foreground/60">{t("cta.hours")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
