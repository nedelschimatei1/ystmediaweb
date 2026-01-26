import dynamic from "next/dynamic";
import { Navigation } from "@/components/navigation";
import { PortfolioHero } from "@/components/portfolio/portfolio-hero";
import { BreadcrumbSchema } from "@/components/structured-data";

// Lazy load below-the-fold components
const ProjectsGrid = dynamic(() => import("@/components/portfolio/projects-grid").then(mod => ({ default: mod.ProjectsGrid })));
const ServicesShowcase = dynamic(() => import("@/components/portfolio/services-showcase").then(mod => ({ default: mod.ServicesShowcase })));
const Testimonials = dynamic(() => import("@/components/portfolio/testimonials").then(mod => ({ default: mod.Testimonials })));
const Footer = dynamic(() => import("@/components/footer").then(mod => ({ default: mod.Footer })));

const breadcrumbData = [
  { name: "Home", url: "https://ystmedia.com" },
  { name: "Portfolio", url: "https://ystmedia.com/portfolio" },
];

export const metadata = {
  title: "Portfolio | YST Media - Tourism Consulting",
  description: "Explore our portfolio of successful tourism and hospitality consulting projects. From hotel management to digital transformation.",
};

export default function PortfolioPage() {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbData} />
      <Navigation />
      <main>
        <PortfolioHero />
        <ProjectsGrid />
        <ServicesShowcase />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
