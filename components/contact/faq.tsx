"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export function FAQ() {
  const { t } = useI18n();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    { question: t("faq.q1"), answer: t("faq.a1") },
    { question: t("faq.q2"), answer: t("faq.a2") },
    { question: t("faq.q3"), answer: t("faq.a3") },
    { question: t("faq.q4"), answer: t("faq.a4") },
    { question: t("faq.q5"), answer: t("faq.a5") },
  ];

  return (
    <section className="py-12 lg:py-16 bg-muted">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-sm font-medium uppercase tracking-widest text-primary">
            {t("faq.label")}
          </span>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-medium tracking-tight text-foreground">
            {t("faq.title")}
          </h2>
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={cn(
                "bg-card border border-border rounded-lg overflow-hidden transition-all duration-300",
                openFaq === index && "border-primary/30"
              )}
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full flex items-start justify-between p-4 text-left gap-3"
              >
                <span className="font-medium text-foreground leading-relaxed text-sm">
                  {faq.question}
                </span>
                <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                  {openFaq === index ? (
                    <Minus className="w-3.5 h-3.5 text-foreground" />
                  ) : (
                    <Plus className="w-3.5 h-3.5 text-foreground" />
                  )}
                </div>
              </button>
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300",
                  openFaq === index ? "max-h-48" : "max-h-0"
                )}
              >
                <p className="px-4 pb-4 text-muted-foreground leading-relaxed text-sm">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
