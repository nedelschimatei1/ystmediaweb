"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export function ServicesShowcase() {
  const { t } = useI18n();
  const [openService, setOpenService] = useState<string | null>("hotel-management");

  const services = [
    {
      id: "hotel-management",
      title: t("portfolio.service.hotelManagement"),
      content: t("portfolio.service.hotelManagement.desc"),
    },
    {
      id: "certifications",
      title: t("portfolio.service.certifications"),
      content: t("portfolio.service.certifications.desc"),
    },
    {
      id: "digital-marketing",
      title: t("portfolio.service.digitalMarketing"),
      content: t("portfolio.service.digitalMarketing.desc"),
    },
    {
      id: "sustainability",
      title: t("portfolio.service.sustainability"),
      content: t("portfolio.service.sustainability.desc"),
    },
    {
      id: "mystery-shopper",
      title: t("portfolio.service.mysteryShopper"),
      content: t("portfolio.service.mysteryShopper.desc"),
    },
  ];

  return (
    <section className="py-12 lg:py-16 bg-muted">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left content */}
          <div>
            <span className="text-sm font-medium uppercase tracking-widest text-primary">
              {t("portfolio.services.label")}
            </span>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-medium tracking-tight text-foreground leading-[1.1]">
              {t("portfolio.services.title")}
            </h2>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed">
              {t("portfolio.services.desc")}
            </p>

            {/* Decorative element */}
            <div className="mt-8 hidden lg:block">
              <div className="relative w-full h-48 bg-card border border-border rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-xs text-muted-foreground">{t("portfolio.services.trusted")}</span>
                  <p className="mt-1 font-serif text-xl font-medium text-foreground">
                    {t("portfolio.services.trustedCount")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Accordion */}
          <div className="space-y-3">
            {services.map((service) => (
              <div
                key={service.id}
                className={cn(
                  "bg-card border border-border rounded-xl overflow-hidden transition-all duration-300",
                  openService === service.id && "border-primary/30"
                )}
              >
                <button
                  onClick={() =>
                    setOpenService(openService === service.id ? null : service.id)
                  }
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-serif text-lg font-medium text-foreground">
                    {service.title}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 ml-4">
                    {openService === service.id ? (
                      <Minus className="w-4 h-4 text-foreground" />
                    ) : (
                      <Plus className="w-4 h-4 text-foreground" />
                    )}
                  </div>
                </button>
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300",
                    openService === service.id ? "max-h-48" : "max-h-0"
                  )}
                >
                  <p className="px-6 pb-6 text-muted-foreground leading-relaxed">
                    {service.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
