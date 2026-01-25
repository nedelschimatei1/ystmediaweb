"use client";

import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";

export function ContactInfo() {
  const { t, locale } = useI18n();
  const [isInView, setIsInView] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const contactDetails = [
    {
      icon: Mail,
      label: t("contact.info.email"),
      value: "contact@ystmedia.com",
      href: "mailto:contact@ystmedia.com",
    },
    {
      icon: Phone,
      label: t("contact.info.phone"),
      value: "+40 721 469 039",
      href: "tel:+40721469039",
    },
    {
      icon: Phone,
      label: locale === "ro" ? "Alternativ" : "Alternative",
      value: "+40 730 738 020",
      href: "tel:+40730738020",
    },
    {
      icon: MapPin,
      label: t("contact.info.address"),
      value: "București, România",
      href: null,
    },
    {
      icon: Clock,
      label: t("contact.info.hours"),
      value: locale === "ro" ? "Luni - Vineri: 9:00 - 19:00" : "Mon - Fri: 9:00 AM - 7:00 PM",
      href: null,
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef} className="space-y-3">
      {contactDetails.map((detail, index) => (
        <div
          key={detail.label + index}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          className={`group flex items-start gap-4 p-4 bg-card border border-border rounded-xl transition-all duration-500 cursor-pointer ${
            hoveredIndex === index ? "border-primary/50 shadow-lg shadow-primary/5 -translate-y-1" : ""
          } ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: isInView ? `${index * 80}ms` : "0ms" }}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
            hoveredIndex === index ? "bg-primary scale-110" : "bg-primary/10"
          }`}>
            <detail.icon className={`w-5 h-5 transition-colors duration-300 ${
              hoveredIndex === index ? "text-primary-foreground" : "text-primary"
            }`} />
          </div>
          <div>
            <span className="block text-xs text-muted-foreground uppercase tracking-wide">
              {detail.label}
            </span>
            {detail.href ? (
              <a
                href={detail.href}
                className="block mt-0.5 text-foreground text-sm font-medium hover:text-primary transition-colors"
              >
                {detail.value}
              </a>
            ) : (
              <span className="block mt-0.5 text-foreground text-sm font-medium">
                {detail.value}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
