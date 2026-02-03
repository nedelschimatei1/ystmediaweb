"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useInView } from "@/hooks/use-in-view";

export function CTASection() {
  const { t } = useI18n();
  const { ref: sectionRef, isInView } = useInView({ threshold: 0.2 });
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    try {
      // Do not send a real request; log client-side only for demo
      console.log('Newsletter subscribe (client):', { email });
      setIsSuccess(true);
      setEmail('');
    } catch (err) {
      console.error('Subscribe error', err);
      alert('A apărut o eroare. Încearcă din nou.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={sectionRef} className="w-full min-h-[50vh] md:h-full flex items-center justify-center bg-primary dark:bg-gradient-to-b dark:from-background dark:via-accent/5 dark:to-background text-primary-foreground dark:text-foreground overflow-hidden relative py-10 sm:py-12 md:py-16">
      {/* Elegant decorative elements for dark mode */}
      <div className="hidden dark:block absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      </div>
        
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Headline */}
          <h2 
            className={`font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium tracking-tight leading-[1.1] text-primary-foreground dark:text-foreground transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {t("newsletter.title")}
          </h2>

          {/* Subtitle */}
          <p 
            className={`mt-3 sm:mt-6 text-base sm:text-lg md:text-xl text-primary-foreground dark:text-foreground leading-relaxed transition-all duration-700 delay-100 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {t("newsletter.subtitle")}
          </p>

          {/* Newsletter Form */}
          {!isSuccess ? (
            <form 
              onSubmit={handleSubmit}
              className={`mt-8 sm:mt-10 transition-all duration-700 delay-200 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("newsletter.placeholder")}
                  required
                  className="flex-1 px-4 sm:px-5 py-3 sm:py-4 sm:rounded-l-full sm:rounded-r-none rounded-full bg-primary-foreground dark:bg-background border-2 border-primary-foreground dark:border-border text-primary dark:text-foreground placeholder:text-primary/60 dark:placeholder:text-muted-foreground focus:outline-none transition-colors text-sm sm:text-base"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold bg-foreground dark:bg-foreground text-background dark:text-background sm:rounded-r-full sm:rounded-l-none rounded-full transition-all duration-300 hover:opacity-90 disabled:opacity-70"
                >
                  {isSubmitting ? t("newsletter.processing") : t("newsletter.button")}
                  {!isSubmitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />}
                </button>
              </div>

              {/* Privacy notice */}
              <p className="mt-5 text-sm text-primary-foreground/80 dark:text-foreground/80">
                {t("newsletter.privacy")}{" "}
                <a href="/privacy" className="underline hover:text-primary-foreground dark:hover:text-foreground transition-colors">
                  {t("newsletter.privacyLink")}
                </a>
              </p>
            </form>
          ) : (
            <div 
              className={`mt-8 sm:mt-10 flex flex-col items-center gap-4 transition-all duration-500`}
            >
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-medium text-primary-foreground dark:text-foreground">
                {t("newsletter.success.title")}
              </h3>
              <p className="text-base text-primary-foreground/80 dark:text-foreground/80 max-w-md">
                {t("newsletter.success.desc")}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
