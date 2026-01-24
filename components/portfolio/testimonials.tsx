"use client";

import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function Testimonials() {
  const { t, locale } = useI18n();

  const testimonials = [
    {
      quote: locale === "ro"
        ? "YST Media a transformat complet operațiunile hotelului nostru. Expertiza lor în managementul veniturilor singură a crescut profitabilitatea cu 40% în primul an."
        : "YST Media completely transformed our hotel operations. Their revenue management expertise alone increased profitability by 40% in the first year.",
      author: "Maria Popescu",
      role: locale === "ro" ? "Manager General" : "General Manager",
      company: "Grand Palace Hotel",
    },
    {
      quote: locale === "ro"
        ? "Procesul de certificare părea copleșitor până am colaborat cu YST Media. Ne-au ghidat prin fiecare pas și am obținut clasificarea de 5 stele."
        : "The certification process seemed overwhelming until we worked with YST Media. They guided us through every step and we achieved 5-star classification.",
      author: "Alexandru Ionescu",
      role: locale === "ro" ? "Proprietar" : "Owner",
      company: "Seaside Luxury Resort",
    },
    {
      quote: locale === "ro"
        ? "Strategiile lor de marketing digital ne-au schimbat complet prezența online. Am văzut o creștere de 200% în rezervările directe în șase luni."
        : "Their digital marketing strategies completely changed our online presence. We saw a 200% increase in direct bookings within six months.",
      author: "Elena Dumitrescu",
      role: locale === "ro" ? "Director Marketing" : "Marketing Director",
      company: "Mountain View Hotel Chain",
    },
  ];

  return (
    <section className="py-12 lg:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-sm font-medium uppercase tracking-widest text-primary">
            {t("portfolio.testimonials.label")}
          </span>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-medium tracking-tight text-foreground">
            {t("portfolio.testimonials.title")}
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.author}
              className="group bg-card border border-border rounded-xl p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-500"
            >
              {/* Quote icon */}
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Quote className="w-3 h-3 text-primary" />
              </div>

              {/* Quote */}
              <blockquote className="text-foreground leading-relaxed text-sm mb-6">
                {'"'}{testimonial.quote}{'"'}
              </blockquote>

              {/* Author */}
              <div className="pt-4 border-t border-border">
                <p className="font-medium text-foreground text-sm">{testimonial.author}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {testimonial.role}, {testimonial.company}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link
            href="/contact"
            className="group inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-primary-foreground bg-primary rounded-full hover:bg-primary/90 transition-all duration-300"
          >
            {t("portfolio.testimonials.cta")}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
