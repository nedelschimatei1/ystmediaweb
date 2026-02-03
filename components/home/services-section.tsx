"use client";

import { Compass, Video, Users, Target, Globe, LineChart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { useInView } from "@/hooks/use-in-view";

export function ServicesSection() {
  const { t } = useI18n();
  const { ref: sectionRef, isInView } = useInView();

  const services = [
    {
      icon: Compass,
      title: t("services.hotelManagement.title"),
      description: t("services.hotelManagement.desc"),
    },
    {
      icon: Video,
      title: t("services.certifications.title"),
      description: t("services.certifications.desc"),
    },
    {
      icon: Users,
      title: t("services.mysteryShopper.title"),
      description: t("services.mysteryShopper.desc"),
    },
    {
      icon: Target,
      title: t("services.seoMarketing.title"),
      description: t("services.seoMarketing.desc"),
    },
    {
      icon: Globe,
      title: t("services.sustainability.title"),
      description: t("services.sustainability.desc"),
    },
    {
      icon: LineChart,
      title: t("services.gdpr.title"),
      description: t("services.gdpr.desc"),
    },
  ];

  return (
    <section ref={sectionRef} className="w-full pt-16 sm:pt-20 md:pt-24 pb-4 sm:pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl text-center sm:text-left mx-auto sm:mx-0">
          <span 
            className={`text-sm font-semibold uppercase tracking-widest text-primary transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {t("services.label")}
          </span>
          <h2 
            className={`mt-2 font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight text-foreground leading-snug transition-all duration-700 delay-100 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {t("services.title")}
          </h2>
          <p 
            className={`mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line transition-all duration-700 delay-200 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {t("services.desc")}
          </p>
        </div>

        {/* Services Grid */}
        <div className="mt-5 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-3">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={cn(
                "group relative bg-card p-4 sm:p-5 rounded-xl border border-border",
                "hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-500",
                "cursor-pointer",
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: isInView ? `${300 + index * 80}ms` : "0ms" }}
            >
              {/* Icon */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                <service.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>

              {/* Content */}
              <h3 className="font-serif text-base sm:text-lg font-semibold text-foreground mb-2">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                {service.description}
              </p>

              {/* Number decoration - hidden on mobile */}
              <span className="hidden sm:block absolute top-4 right-4 font-serif text-2xl sm:text-3xl font-medium text-muted-foreground/50" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
