"use client";

import React from "react"
import { useState, useEffect, useRef } from "react";
import { Send, CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export function ContactForm() {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    organization: "",
    service: "",
    otherService: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const services = [
    { key: "services.hotelManagement", label: t("services.hotelManagement.title") },
    { key: "services.certifications", label: t("services.certifications.title") },
    { key: "services.mysteryShopper", label: t("services.mysteryShopper.title") },
    { key: "services.seoMarketing", label: t("services.seoMarketing.title") },
    { key: "services.sustainability", label: t("services.sustainability.title") },
    { key: "services.gdpr", label: t("services.gdpr.title") },
    { key: "other", label: t("service.other") },
  ];

  useEffect(() => {
    // Focus on form if URL has #form
    if (window.location.hash === "#form" && formRef.current) {
      setTimeout(() => {
        const firstInput = formRef.current?.querySelector("input");
        firstInput?.focus();
      }, 500);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (formRef.current) {
      observer.observe(formRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-in zoom-in duration-500">
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </div>
        <h3 className="font-serif text-xl font-medium text-foreground mb-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
          {t("contact.form.success.title")}
        </h3>
        <p className="text-muted-foreground leading-relaxed text-sm animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
          {t("contact.form.success.desc")}
        </p>
      </div>
    );
  }

  return (
    <div 
      ref={formRef}
      className={`bg-card border border-border rounded-xl p-6 lg:p-8 transition-all duration-700 ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <h2 className="font-serif text-xl font-medium text-foreground mb-1">
        {t("contact.form.title")}
      </h2>
      <p className="text-muted-foreground text-sm mb-6">
        {t("contact.form.subtitle")}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-xs font-medium text-foreground mb-1.5">
              {t("contact.form.firstName")}
            </label>
            <input
              type="text"
              id="firstName"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300"
              placeholder="Ion"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-xs font-medium text-foreground mb-1.5">
              {t("contact.form.lastName")}
            </label>
            <input
              type="text"
              id="lastName"
              required
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300"
              placeholder="Popescu"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-xs font-medium text-foreground mb-1.5">
            {t("contact.form.email")}
          </label>
          <input
            type="email"
            id="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300"
            placeholder="ion@companie.ro"
          />
        </div>

        {/* Organization & Service */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="organization" className="block text-xs font-medium text-foreground mb-1.5">
              {t("contact.form.organization")}
            </label>
            <input
              type="text"
              id="organization"
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300"
              placeholder="Numele Companiei"
            />
          </div>
          <div>
            <label htmlFor="service" className="block text-xs font-medium text-foreground mb-1.5">
              {t("contact.form.service")}
            </label>
            <select
              id="service"
              value={formData.service}
              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300 appearance-none cursor-pointer"
            >
              <option value="" disabled hidden>
                {t("contact.form.selectService")}
              </option>
              {services.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* If user selects Other, show a text input to specify */}
        {formData.service === "other" && (
          <div>
            <label htmlFor="otherService" className="block text-xs font-medium text-foreground mb-1.5">
              {t("contact.form.otherService") || "Specificați (Altele)"}
            </label>
            <input
              id="otherService"
              type="text"
              value={formData.otherService}
              onChange={(e) => setFormData({ ...formData, otherService: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300"
              placeholder={t("contact.form.otherServicePlaceholder") || "Spuneți-ne ce servicii doriți..."}
            />
          </div>
        )}

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-xs font-medium text-foreground mb-1.5">
            {t("contact.form.message")}
          </label>
          <textarea
            id="message"
            required
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300 resize-none"
            placeholder={t("contact.form.messagePlaceholder")}
          />
        </div>

        {/* Submit - Apple style button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "group w-full relative inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium",
            "bg-primary text-primary-foreground dark:bg-accent dark:text-accent-foreground rounded-full overflow-hidden",
            "transition-all duration-300",
            "hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/20",
            "active:scale-100",
            "disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
          )}
        >
          <span className="relative z-10 flex items-center gap-2">
            {isSubmitting ? (
              <>
                <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                {t("contact.form.submitting")}
              </>
            ) : (
              <>
                {t("contact.form.submit")}
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </>
            )}
          </span>
        </button>
      </form>
    </div>
  );
}
