import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PortfolioHero } from "@/components/portfolio/portfolio-hero";
import { ProjectsGrid } from "@/components/portfolio/projects-grid";
import { ServicesShowcase } from "@/components/portfolio/services-showcase";
import { Testimonials } from "@/components/portfolio/testimonials";
import { BreadcrumbSchema } from "@/components/structured-data";

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
