"use client";

import { Building2, Award, Search, Megaphone, Leaf, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { useInView } from "@/hooks/use-in-view";

export function ServicesSection() {
  const { locale } = useI18n();
  const { ref: sectionRef, isInView } = useInView();

  const services = [
    {
      icon: Building2,
      title: "Hotel Management",
      description: locale === "ro" 
        ? "Management hotelier și managementul veniturilor pentru excelență operațională."
        : "Hotel management and revenue management for operational excellence.",
    },
    {
      icon: Award,
      title: locale === "ro" ? "Certificări" : "Certifications",
      description: locale === "ro"
        ? "Autorizații și certificate de clasificare în hotelărie cu ghidare expertă."
        : "Authorizations and classification certificates in hospitality with expert guidance.",
    },
    {
      icon: Search,
      title: "Mystery Shopper",
      description: locale === "ro"
        ? "Evaluări obiective ale calității pentru identificarea punctelor forte."
        : "Objective quality assessments to identify strengths.",
    },
    {
      icon: Megaphone,
      title: "SEO & Marketing",
      description: locale === "ro"
        ? "SEO și marketing digital pentru hoteluri și industria turismului."
        : "SEO and digital marketing for hotels and the tourism industry.",
    },
    {
      icon: Leaf,
      title: locale === "ro" ? "Sustenabilitate" : "Sustainability",
      description: locale === "ro"
        ? "Consultanță în mediu pentru construirea practicilor hoteliere sustenabile."
        : "Environmental consulting for building sustainable hotel practices.",
    },
    {
      icon: ShieldCheck,
      title: "GDPR & DPO",
      description: locale === "ro"
        ? "Consultanța DPO (Data Protection Officer) în hotelărie."
        : "DPO (Data Protection Officer) consulting in hospitality.",
    },
  ];

  return (
    <section ref={sectionRef} className="py-16 lg:py-20 bg-muted">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl">
          <span 
            className={`text-sm font-medium uppercase tracking-widest text-primary transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {locale === "ro" ? "Serviciile Noastre" : "Our Services"}
          </span>
          <h2 
            className={`mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-foreground transition-all duration-700 delay-100 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {locale === "ro" ? "Consultanță de Specialitate în Turism" : "Specialized Tourism Consulting"}
          </h2>
          <p 
            className={`mt-4 text-base text-muted-foreground leading-relaxed transition-all duration-700 delay-200 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {locale === "ro" 
              ? "Abordăm fiecare proiect cu un amestec unic de creativitate și atenție la detalii, asigurând soluții de consultanță turistică care depășesc standardele industriei."
              : "We approach each project with a unique blend of creativity and attention to detail, ensuring tourism consulting solutions that exceed industry standards."
            }
          </p>
        </div>

        {/* Services Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={cn(
                "group relative bg-card p-6 rounded-xl border border-border",
                "hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-500",
                "cursor-pointer",
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: isInView ? `${300 + index * 80}ms` : "0ms" }}
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                <service.icon className="w-5 h-5 text-primary" />
              </div>

              {/* Content */}
              <h3 className="font-serif text-lg font-medium text-foreground mb-2">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {service.description}
              </p>

              {/* Number decoration */}
              <span className="absolute top-4 right-4 font-serif text-3xl font-medium text-muted-foreground/50" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
