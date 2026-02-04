"use client";

import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function Testimonials() {
  const { t } = useI18n();

  const testimonials = [
    {
      quote: t("portfolio.testimonial1.quote"),
      author: "Maria Popescu",
      role: t("portfolio.testimonial1.role"),
      company: "Grand Palace Hotel",
    },
    {
      quote: t("portfolio.testimonial2.quote"),
      author: "Alexandru Ionescu",
      role: t("portfolio.testimonial2.role"),
      company: "Seaside Luxury Resort",
    },
    {
      quote: t("portfolio.testimonial3.quote"),
      author: "Elena Dumitrescu",
      role: t("portfolio.testimonial3.role"),
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
            prefetch={false}
            className="group inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-primary-foreground bg-primary dark:bg-accent dark:text-accent-foreground rounded-full hover:bg-primary/90 dark:hover:bg-accent/90 transition-all duration-300"
          >
            {t("portfolio.testimonials.cta")}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
