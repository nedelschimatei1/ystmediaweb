"use client";

import { useI18n } from "@/lib/i18n";

export function ContactHero() {
  const { t, locale } = useI18n();

  return (
    <section className="relative pt-28 pb-6 lg:pt-32 lg:pb-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted to-background" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {t("contact.hero.label")}
          </div>

          {/* Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-foreground leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            {t("contact.hero.title")}
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            {t("contact.hero.desc")}
          </p>
        </div>
      </div>
    </section>
  );
}
