"use client";

import { Mail } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useInView } from "@/hooks/use-in-view";

const team = [
  {
    name: "Nicolae Istrate",
    role: "Founder & CEO",
    email: "nicolae.istrate@ystmedia.com",
    initials: "NI",
  },
  {
    name: "Andrei Istrate",
    role: "Managing Director",
    email: "andrei.istrate@ystmedia.com",
    initials: "AI",
  },
  {
    name: "David Istrate",
    role: "Operations Director",
    email: "david.istrate@ystmedia.com",
    initials: "DI",
  },
  {
    name: "Vlad Brancoveanu",
    role: "Digital Strategy Lead",
    email: "vlad.brancoveanu@ystmedia.com",
    initials: "VB",
  },
];

export function TeamSection() {
  const { t } = useI18n();
  const { ref: sectionRef, isInView } = useInView();

  return (
    <section ref={sectionRef} className="w-full py-8 sm:py-12 md:py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-4 sm:mb-8">
          <span 
            className={`text-xs font-medium uppercase tracking-widest text-primary transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {t("team.label")}
          </span>
          <h2 
            className={`mt-1.5 sm:mt-3 font-serif text-xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-foreground transition-all duration-700 delay-100 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {t("team.title")}
          </h2>
          <p 
            className={`mt-1.5 sm:mt-3 text-sm text-muted-foreground leading-relaxed transition-all duration-700 delay-200 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {t("team.desc")}
          </p>
        </div>

        {/* Team Grid - Apple style staggered animation */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          {team.map((member, index) => (
            <div
              key={member.name}
              className={`group bg-card border border-border rounded-lg sm:rounded-xl p-3 sm:p-5 transition-all duration-700 hover:border-primary/30 hover:shadow-xl hover:-translate-y-2 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ 
                transitionDelay: isInView ? `${300 + index * 100}ms` : "0ms"
              }}
            >
              {/* Avatar placeholder */}
              <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2 sm:mb-4 mx-auto group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-500">
                <span className="font-serif text-xs sm:text-lg font-semibold text-primary">
                  {member.initials}
                </span>
              </div>

              {/* Info */}
              <div className="text-center">
                <h3 className="font-serif text-xs sm:text-base font-medium text-foreground">
                  {member.name}
                </h3>
                <p className="mt-0.5 text-[9px] sm:text-xs text-muted-foreground">{member.role}</p>

                {/* Email - hidden on mobile */}
                <a
                  href={`mailto:${member.email}`}
                  className="hidden sm:inline-flex mt-3 items-center gap-1.5 text-xs text-primary hover:underline group-hover:gap-2 transition-all"
                >
                  <Mail className="w-3 h-3" />
                  {t("team.contact")}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
