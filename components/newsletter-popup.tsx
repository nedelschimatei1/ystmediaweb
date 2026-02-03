"use client";

import React from "react";
import { useState, useEffect, useCallback } from "react";
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
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem("yst-newsletter-dismissed");
    const hasSubscribed = localStorage.getItem("yst-newsletter-subscribed");

    if (hasSeenPopup || hasSubscribed) return;

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  // Lock body scroll when popup is visible
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [isVisible]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
      localStorage.setItem("yst-newsletter-dismissed", "true");
    }, 300);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);

    try {
      // Do not send real requests from client during development/demo.
      console.log('Newsletter subscribe (client):', { email });
      setIsSubmitted(true);
      localStorage.setItem('yst-newsletter-subscribed', 'true');

      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (err) {
      console.error('Newsletter subscribe error', err);
      alert('A apărut o eroare. Încearcă din nou.');
    } finally {
      setIsSubmitting(false);
    }
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

      {/* Popup - Bottom sheet on mobile, centered on desktop */}
      <div
        className={cn(
          "fixed z-50 transition-all duration-300 ease-out",
          // Mobile: bottom sheet
          "sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2",
          "max-sm:inset-x-0 max-sm:bottom-0 max-sm:top-auto",
          // Width
          "w-full sm:max-w-md sm:mx-4",
          // Animation
          isClosing
            ? "sm:opacity-0 sm:scale-95 max-sm:translate-y-full"
            : "sm:opacity-100 sm:scale-100 max-sm:translate-y-0"
        )}
      >
        <div
          className={cn(
            "bg-card border border-border shadow-2xl overflow-hidden",
            // Rounded corners - top only on mobile
            "sm:rounded-2xl max-sm:rounded-t-3xl",
            // Safe area for home indicator on iOS
            "max-sm:pb-safe"
          )}
        >
          {/* Drag handle for mobile */}
          <div className="sm:hidden flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            className={cn(
              "absolute w-8 h-8 rounded-full bg-muted flex items-center justify-center",
              "text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors z-10",
              // Position - top right on desktop, top right on mobile too
              "top-4 right-4 max-sm:top-3 max-sm:right-4"
            )}
            aria-label={t("newsletter.close")}
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header section with accent background */}
          <div className="bg-primary px-5 py-6 sm:px-6 sm:py-8 text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary-foreground/20 flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Mail className="w-6 h-6 sm:w-7 sm:h-7 text-primary-foreground" />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-medium text-primary-foreground">
              {t("newsletter.title")}
            </h3>
            <p className="mt-2 text-primary-foreground/80 text-sm">
              {t("newsletter.subtitle")}
            </p>
          </div>

          {/* Content */}
          <div className="px-5 py-5 sm:px-6 sm:py-6">
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
                <p className="text-muted-foreground text-sm text-center mb-5 sm:mb-6">
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
                      className={cn(
                        "w-full px-4 py-3.5 sm:py-3 bg-background border border-border rounded-xl sm:rounded-lg",
                        "text-foreground text-base sm:text-sm placeholder:text-muted-foreground",
                        "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      )}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                      "w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-3",
                      "text-base sm:text-sm font-medium",
                      "bg-primary text-primary-foreground dark:bg-accent dark:text-accent-foreground",
                      "rounded-xl sm:rounded-lg",
                      "hover:bg-primary/90 dark:hover:bg-accent/90 transition-all duration-300",
                      "disabled:opacity-70 disabled:cursor-not-allowed",
                      // Touch feedback
                      "active:scale-[0.98]"
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
