"use client";

import { Mail, X, Copy } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useInView } from "@/hooks/use-in-view";

const team = [
  {
    name: "Nicolae Istrate",
    role: "Vicepreședinte FPTR | Consultant strategic HoReCa",
    email: "nicolae.istrate@ystmedia.com",
    initials: "NI",
    description: "Cu o experiență vastă în turism și reprezentare patronală, Nicolae Istrate este unul dintre oamenii care cunosc industria din interior.\nCoordoneză direcția strategică și oferă consultanță de specialitate pentru dezvoltarea sănătoasă a afacerilor din HoReCa.",
  },
  {
    name: "Andrei Istrate",
    role: "Consultant HoReCa | Fost CEO Hotel Ambasador București",
    email: "andrei.istrate@ystmedia.com",
    initials: "AI",
    description: "Andrei aduce experiență de top în management hotelier, acumulată în poziții de conducere la nivel înalt.\nContribuie cu soluții aplicate pentru organizare, eficiență operațională și creșterea performanței unităților turistice.",
  },
  {
    name: "David Istrate",
    role: "General Manager | Marketing & Operațiuni",
    email: "david.istrate@ystmedia.com",
    initials: "DI",
    description: "David coordonează implementarea proiectelor și asigură legătura dintre strategie și execuție.\nEste implicat direct în dezvoltarea campaniilor, organizarea proceselor și optimizarea rezultatelor pentru fiecare client.",
  },
  {
    name: "Vlad Brancoveanu",
    role: "Digital Strategy Lead | Sales & Marketing",
    email: "vlad.brancoveanu@ystmedia.com",
    initials: "VB",
    description: "Cu peste 15 ani de experiență în vânzări și marketing digital și roluri de management în hoteluri de 4 stele, Vlad construiește strategii orientate pe conversii, vizibilitate și creștere reală.\nEste responsabil de direcția digitală și performanța campaniilor.",
  },
  {
    name: "Gelu Cătălin",
    role: "Marketing Specialist | Meta & TikTok Ads",
    email: "gelu.catalin@ystmedia.com",
    initials: "GC",
    description: "Gelu este specialistul din spatele campaniilor plătite.\nCreează, testează și optimizează reclame pe Meta și TikTok, cu focus pe rezultate clare: lead-uri, rezervări și vânzări.",
  },
];

type TeamMember = typeof team[number];

export function TeamSection() {
  const { t } = useI18n();
  const { ref: sectionRef, isInView } = useInView();
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  return (
    <>
      <section ref={sectionRef} className="w-full py-8 sm:py-12 md:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-4 sm:mb-8">
            <span 
              className={`text-sm font-semibold uppercase tracking-widest text-primary transition-all duration-700 ${
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

          {/* Team Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 auto-rows-fr items-stretch">
            {team.map((member, index) => (
              <div
                key={member.name}
                onClick={() => setSelectedMember(member)}
                className={`group cursor-pointer bg-card border border-border rounded-lg sm:rounded-xl py-3 px-4 sm:py-4 sm:px-5 transition-all duration-700 hover:duration-200 hover:border-primary/30 hover:shadow-xl hover:-translate-y-2 flex flex-col justify-between h-full ${
                  isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: isInView ? `${300 + index * 100}ms` : "0ms" }}
              >
                <div className="flex flex-col items-center gap-2 text-center flex-1">
                  <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2 sm:mb-4 mx-auto group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-500">
                    <span className="font-serif text-xs sm:text-lg font-semibold text-primary">{member.initials}</span>
                  </div>

                  <h3 className="font-serif text-sm sm:text-lg font-medium text-foreground">{member.name}</h3>
                  <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground h-8 sm:h-10 flex items-center justify-center">{member.role.split(" | ")[1] || member.role}</p>

                  <span className="mt-2 text-xs sm:text-sm text-foreground group-hover:text-foreground/80 transition-colors cursor-pointer font-medium">
                    <span className="sm:hidden">Atinge pentru mai multe detalii</span>
                    <span className="hidden sm:inline">Mai multe detalii</span>
                  </span>
                </div>

                <div className="mt-3 flex flex-col sm:flex-row items-center gap-1 w-full pt-1">
                  <a
                    href={`mailto:${member.email}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 inline-block text-center sm:text-left whitespace-nowrap overflow-hidden text-ellipsis text-[0.78rem] sm:text-[0.74rem] text-accent font-medium hover:underline"
                    aria-label={`Email ${member.name}`}
                  >
                    <span className="inline-flex items-center gap-1 justify-center sm:justify-start">
                      <Mail className="w-3 h-3 text-accent" />
                      <span className="align-middle">{member.email}</span>
                    </span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedMember && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedMember(null)}
        >
          <div 
            className="relative bg-card border border-border rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            {/* Avatar */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
              <span className="font-serif text-2xl sm:text-3xl font-semibold text-primary">
                {selectedMember.initials}
              </span>
            </div>

            {/* Info */}
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-semibold text-foreground text-center">
                {selectedMember.name}
              </h3>
              <p className="mt-1 text-sm text-primary font-medium text-center">{selectedMember.role}</p>
              
              <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                {selectedMember.description}
              </p>

              <div className="text-center">
                  <div className="flex items-center justify-center gap-3 mt-6">
                    <a
                      href={`mailto:${selectedMember.email}`}
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-primary text-primary-foreground text-[0.85rem] font-medium hover:opacity-90 transition-opacity max-w-full break-words whitespace-normal"
                    >
                      <Mail className="w-4 h-4" />
                      {selectedMember.email}
                    </a>
                    <button
                      onClick={() => {
                        navigator?.clipboard?.writeText(selectedMember.email).then(() => {
                          setCopiedEmail(selectedMember.email);
                          setTimeout(() => setCopiedEmail((prev) => (prev === selectedMember.email ? null : prev)), 1500);
                        });
                      }}
                      className="px-3 py-2 rounded-full bg-muted text-[0.75rem] text-foreground/90"
                    >
                      Copy
                    </button>
                  </div>
                  {copiedEmail === selectedMember.email && (
                    <div className="mt-3 text-sm text-green-400">Copiat!</div>
                  )}
                </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
