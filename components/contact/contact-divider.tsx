"use client";

import { useI18n } from "@/lib/i18n";

export function ContactDivider() {
  const { t } = useI18n();

  return (
    <div className="py-8 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-sm text-muted-foreground font-medium">
            {t("schedule.or")}
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>
      </div>
    </div>
  );
}
