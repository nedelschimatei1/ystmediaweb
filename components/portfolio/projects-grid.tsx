"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export function ProjectsGrid() {
  const { t, locale } = useI18n();
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { key: "all", label: t("portfolio.filter.all") },
    { key: "hotel-management", label: t("portfolio.filter.hotelManagement") },
    { key: "digital-marketing", label: t("portfolio.filter.digitalMarketing") },
    { key: "certifications", label: t("portfolio.filter.certifications") },
    { key: "consulting", label: t("portfolio.filter.consulting") },
  ];

  const projects = [
    {
      id: 1,
      title: "Grand Palace Hotel",
      category: "hotel-management",
      categoryLabel: t("portfolio.filter.hotelManagement"),
      description: locale === "ro" 
        ? "Revizuire completă a sistemului de management al veniturilor cu creștere de 35% RevPAR."
        : "Complete revenue management system overhaul with 35% RevPAR increase.",
      location: locale === "ro" ? "București, România" : "Bucharest, Romania",
      year: "2024",
      featured: true,
    },
    {
      id: 2,
      title: "Mountain Resort",
      category: "digital-marketing",
      categoryLabel: t("portfolio.filter.digitalMarketing"),
      description: locale === "ro"
        ? "Transformare digitală completă incluzând redesign website și optimizare SEO."
        : "Complete digital transformation including website redesign and SEO optimization.",
      location: locale === "ro" ? "Brașov, România" : "Brasov, Romania",
      year: "2023",
      featured: false,
    },
    {
      id: 3,
      title: "Seaside Luxury Resort",
      category: "certifications",
      categoryLabel: t("portfolio.filter.certifications"),
      description: locale === "ro"
        ? "Obținerea cu succes a certificatului de clasificare 5 stele pentru resort de lux."
        : "Successful acquisition of 5-star classification certificate for luxury resort.",
      location: locale === "ro" ? "Constanța, România" : "Constanta, Romania",
      year: "2024",
      featured: true,
    },
    {
      id: 4,
      title: "Boutique Hotel Chain",
      category: "consulting",
      categoryLabel: t("portfolio.filter.consulting"),
      description: locale === "ro"
        ? "Consultanță strategică de expansiune pentru grup hotelier în piețe noi."
        : "Strategic expansion consulting for hotel group in new markets.",
      location: locale === "ro" ? "Locații Multiple" : "Multiple Locations",
      year: "2023",
      featured: false,
    },
    {
      id: 5,
      title: "Wellness Spa Resort",
      category: "hotel-management",
      categoryLabel: t("portfolio.filter.hotelManagement"),
      description: locale === "ro"
        ? "Restructurare operațională și implementare program training personal."
        : "Operational restructuring and staff training program implementation.",
      location: "Cluj-Napoca, România",
      year: "2024",
      featured: false,
    },
    {
      id: 6,
      title: "Historic Castle Hotel",
      category: "digital-marketing",
      categoryLabel: t("portfolio.filter.digitalMarketing"),
      description: locale === "ro"
        ? "Campanie marketing turism cultural cu creștere 200% în rezervări."
        : "Cultural tourism marketing campaign with 200% booking increase.",
      location: "Sibiu, România",
      year: "2023",
      featured: true,
    },
  ];

  const filteredProjects =
    activeCategory === "all"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <section className="py-12 lg:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Filter */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={cn(
                "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                activeCategory === cat.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <article
              key={project.id}
              className={cn(
                "group relative bg-card border border-border rounded-2xl overflow-hidden",
                "hover:border-primary/30 hover:shadow-xl transition-all duration-500",
                project.featured && "md:col-span-2 lg:col-span-1"
              )}
            >
              {/* Image placeholder */}
              <div className="relative h-48 bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-serif text-6xl font-medium text-primary/20">
                    {String(project.id).padStart(2, "0")}
                  </span>
                </div>
                
                {/* Featured badge */}
                {project.featured && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                    {t("portfolio.featured")}
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-primary/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 rounded-full bg-primary-foreground flex items-center justify-center">
                    <ArrowUpRight className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <span>{project.categoryLabel}</span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                  <span>{project.year}</span>
                </div>

                <h3 className="font-serif text-xl font-medium text-foreground mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>

                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {project.description}
                </p>

                <div className="pt-4 border-t border-border">
                  <span className="text-xs text-muted-foreground">{project.location}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
