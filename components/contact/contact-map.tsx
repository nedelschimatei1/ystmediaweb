"use client";

import { MapPin } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function ContactMap() {
  const { t } = useI18n();

  return (
    <section className="py-12 lg:py-16 bg-muted">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-sm font-medium uppercase tracking-widest text-primary">
            {t("contact.map.label")}
          </span>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-medium tracking-tight text-foreground">
            {t("contact.map.title")}
          </h2>
        </div>

        {/* Map Container */}
        <div className="relative rounded-xl overflow-hidden border border-border shadow-sm">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2849.5!2d26.1547!3d44.4083!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b1ff5b6b5b5b5b%3A0x0!2sDrumul%20Lunca%20S%C4%83teasc%C4%83%2023%2C%20Bucharest%2C%20Romania!5e0!3m2!1sen!2sus!4v1706100000000!5m2!1sen!2sus"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="YST Media Location - Drumul Lunca Sătească 23, București, România"
            className="w-full"
          />
          
          {/* Overlay card */}
          <div className="absolute bottom-4 left-4 bg-card border border-border rounded-lg p-4 shadow-lg max-w-xs">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-serif font-medium text-foreground">YST Media</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Drumul Lunca Sătească 23<br />
                  {t("contact.map.address")}
                </p>
                <a
                  href="https://maps.google.com/?q=Drumul+Lunca+Sătească+23,+Bucharest,+Romania"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-xs text-primary font-medium hover:underline"
                >
                  {t("contact.map.openMaps")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
