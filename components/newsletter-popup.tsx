"use client";

import React from "react"

import { useState, useEffect } from "react";
import { X, Mail, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export function NewsletterPopup() {
  const { t } = useI18n();
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Check if user has already seen/dismissed the popup
    const hasSeenPopup = localStorage.getItem("yst-newsletter-dismissed");
    const hasSubscribed = localStorage.getItem("yst-newsletter-subscribed");
    
    if (hasSeenPopup || hasSubscribed) return;

    // Show popup after 15 seconds (similar to major websites)
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
      localStorage.setItem("yst-newsletter-dismissed", "true");
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSubmitted(true);
    localStorage.setItem("yst-newsletter-subscribed", "true");

    // Auto close after showing success
    setTimeout(() => {
      handleClose();
    }, 3000);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-foreground/60 backdrop-blur-sm z-50 transition-opacity duration-300",
          isClosing ? "opacity-0" : "opacity-100"
        )}
        onClick={handleClose}
      />

      {/* Popup */}
      <div
        className={cn(
          "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50",
          "w-full max-w-md mx-4",
          "transition-all duration-300",
          isClosing ? "opacity-0 scale-95" : "opacity-100 scale-100"
        )}
      >
        <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors z-10"
            aria-label={t("newsletter.close")}
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header section with accent background */}
          <div className="bg-primary px-6 py-8 text-center">
            <div className="w-14 h-14 rounded-full bg-primary-foreground/20 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="font-serif text-2xl font-medium text-primary-foreground">
              {t("newsletter.title")}
            </h3>
            <p className="mt-2 text-primary-foreground/80 text-sm">
              {t("newsletter.subtitle")}
            </p>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {isSubmitted ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-serif text-lg font-medium text-foreground">
                  {t("newsletter.success.title")}
                </h4>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t("newsletter.success.desc")}
                </p>
              </div>
            ) : (
              <>
                <p className="text-muted-foreground text-sm text-center mb-6">
                  {t("newsletter.desc")}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("newsletter.placeholder")}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                      "w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium",
                      "bg-primary text-primary-foreground dark:bg-accent dark:text-accent-foreground rounded-lg",
                      "hover:bg-primary/90 dark:hover:bg-accent/90 transition-all duration-300",
                      "disabled:opacity-70 disabled:cursor-not-allowed"
                    )}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        {t("newsletter.processing")}
                      </>
                    ) : (
                      t("newsletter.button")
                    )}
                  </button>
                </form>

                <p className="mt-4 text-xs text-muted-foreground text-center">
                  {t("newsletter.privacy")}{" "}
                  <a href="/contact" className="text-primary hover:underline">
                    {t("newsletter.privacyLink")}
                  </a>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
