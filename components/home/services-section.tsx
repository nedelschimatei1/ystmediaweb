"use client";

import { Building2, Award, Search, Megaphone, Leaf, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { useInView } from "@/hooks/use-in-view";

export function ServicesSection() {
  const { t } = useI18n();
  const { ref: sectionRef, isInView } = useInView();

  const services = [
    {
      icon: Building2,
      title: t("services.hotelManagement.title"),
      description: t("services.hotelManagement.desc"),
    },
    {
      icon: Award,
      title: t("services.certifications.title"),
      description: t("services.certifications.desc"),
    },
    {
      icon: Search,
      title: t("services.mysteryShopper.title"),
      description: t("services.mysteryShopper.desc"),
    },
    {
      icon: Megaphone,
      title: t("services.seoMarketing.title"),
      description: t("services.seoMarketing.desc"),
    },
    {
      icon: Leaf,
      title: t("services.sustainability.title"),
      description: t("services.sustainability.desc"),
    },
    {
      icon: ShieldCheck,
      title: t("services.gdpr.title"),
      description: t("services.gdpr.desc"),
    },
  ];

  return (
    <section ref={sectionRef} className="w-full py-8 sm:py-12 md:py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl text-center sm:text-left mx-auto sm:mx-0">
          <span 
            className={`text-xs font-medium uppercase tracking-widest text-primary transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {t("services.label")}
          </span>
          <h2 
            className={`mt-1.5 sm:mt-3 font-serif text-xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-foreground transition-all duration-700 delay-100 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {t("services.title")}
          </h2>
          <p 
            className={`mt-2 sm:mt-4 text-sm text-muted-foreground leading-relaxed transition-all duration-700 delay-200 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {t("services.desc")}
          </p>
        </div>

        {/* Services Grid */}
        <div className="mt-5 sm:mt-10 grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={cn(
                "group relative bg-card p-3 sm:p-6 rounded-lg sm:rounded-xl border border-border",
                "hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-500",
                "cursor-pointer",
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: isInView ? `${300 + index * 80}ms` : "0ms" }}
            >
              {/* Icon */}
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2 sm:mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                <service.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>

              {/* Content */}
              <h3 className="font-serif text-sm sm:text-lg font-medium text-foreground mb-1 sm:mb-2">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2 sm:line-clamp-none">
                {service.description}
              </p>

              {/* Number decoration - hidden on mobile */}
              <span className="hidden sm:block absolute top-3 right-3 sm:top-4 sm:right-4 font-serif text-2xl sm:text-3xl font-medium text-muted-foreground/50" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
