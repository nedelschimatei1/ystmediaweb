"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { getCalApi } from "@calcom/embed-react";
import { useI18n } from "@/lib/i18n";

export function ScheduleConsultation() {
  const { t } = useI18n();
  const [isInView, setIsInView] = useState(false);
  const [calLoaded, setCalLoaded] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Load Cal.com embed script
    (async function () {
      const cal = await getCalApi({ namespace: "scheduling" });
      cal("ui", {
        theme: "auto",
        styles: { branding: { brandColor: "#78716c" } },
        hideEventTypeDetails: false,
      });
      setCalLoaded(true);
    })();
  }, []);

  const consultationTypes = [
    {
      slug: "15min",
      title: t("schedule.quick"),
      description: t("schedule.quickDesc"),
      icon: Clock,
    },
    {
      slug: "30min",
      title: t("schedule.full"),
      description: t("schedule.fullDesc"),
      icon: Calendar,
    },
  ];

  return (
    <section ref={sectionRef} className="py-12 lg:py-16 bg-muted">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span
            className={`text-sm font-medium uppercase tracking-widest text-primary transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {t("schedule.label")}
          </span>
          <h2
            className={`mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-foreground transition-all duration-700 delay-100 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {t("schedule.title")}
          </h2>
          <p
            className={`mt-4 text-base text-muted-foreground leading-relaxed transition-all duration-700 delay-200 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {t("schedule.subtitle")}
          </p>
        </div>

        {/* Consultation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {consultationTypes.map((type, index) => (
            <button
              key={type.slug}
              data-cal-namespace="scheduling"
              data-cal-link={`matei-nedelschi-xa1onl/${type.slug}`}
              data-cal-config='{"layout":"month_view"}'
              disabled={!calLoaded}
              className={`group relative bg-card border border-border rounded-2xl p-6 text-left transition-all duration-500 hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: isInView ? `${300 + index * 100}ms` : "0ms" }}
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <type.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>

              {/* Content */}
              <h3 className="font-serif text-xl font-medium text-foreground mb-2">
                {type.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {type.description}
              </p>

              {/* CTA */}
              <span className="inline-flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all duration-300">
                {t("schedule.book")}
                <ArrowRight className="w-4 h-4" />
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
