"use client";

import Link from "next/link";
import { ArrowRight, Phone, Clock } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useInView } from "@/hooks/use-in-view";

export function CTASection() {
  const { t } = useI18n();
  const { ref: sectionRef, isInView } = useInView({ threshold: 0.2 });

  return (
    <section ref={sectionRef} className="w-full min-h-[50vh] md:h-full flex items-center justify-center bg-primary dark:bg-gradient-to-b dark:from-background dark:via-accent/5 dark:to-background text-primary-foreground dark:text-foreground overflow-hidden relative py-6 sm:py-12 md:py-0">
      {/* Elegant decorative elements for dark mode */}
      <div className="hidden dark:block absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      </div>
        
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div 
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-amber-100 text-black dark:text-black text-sm font-medium mb-4 sm:mb-6 transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {t("cta.badge")}
          </div>

          {/* Headline */}
          <h2 
            className={`font-serif text-xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight leading-[1.1] text-white transition-all duration-700 delay-100 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {t("cta.title")}
          </h2>

          {/* Subtitle */}
          <p 
            className={`mt-3 sm:mt-4 text-sm sm:text-base font-semibold text-white/90 leading-relaxed transition-all duration-700 delay-200 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {(() => {
              const desc = t("cta.desc") || "";
              const sentences = desc.match(/[^.!?]+[.!?]*/g) || [desc];
              return sentences.map((s, i) => (
                <span key={i} className="block">{s.trim()}</span>
              ));
            })()}
          </p>

          {/* CTA Buttons */}
          <div 
            className={`mt-6 sm:mt-8 flex flex-col sm:flex-row items-center sm:items-center justify-start sm:justify-center gap-3 sm:gap-4 transition-all duration-700 delay-300 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <Link
              href="/contact#form"
              className="group inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3.5 text-sm font-medium bg-white text-black rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-100"
            >
              {t("cta.button")}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <div className="flex flex-col items-center sm:items-start sm:border-l-2 sm:border-white dark:sm:border-white sm:pl-6">
              <a
                href="tel:+40721469039"
                className="flex items-center text-lg sm:text-base font-semibold text-white hover:underline transition-all"
              >
                <Phone className="w-4 h-4 mr-2 text-white/90" aria-hidden="true" />
                <span>+40 721 469 039</span>
              </a>
              <span className="mt-1 flex items-center text-lg sm:text-base font-semibold text-white">
                <Clock className="w-4 h-4 mr-2 text-white/90" aria-hidden="true" />
                {t("cta.hours")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}