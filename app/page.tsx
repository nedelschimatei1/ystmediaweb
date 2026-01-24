import dynamic from "next/dynamic";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/home/hero-section";

// Lazy load below-the-fold components
const ServicesSection = dynamic(() => import("@/components/home/services-section").then(mod => ({ default: mod.ServicesSection })), {
  loading: () => <div className="py-16 lg:py-20 bg-muted" />,
});

const AboutSection = dynamic(() => import("@/components/home/about-section").then(mod => ({ default: mod.AboutSection })), {
  loading: () => <div className="py-16 lg:py-20 bg-background" />,
});

const TeamSection = dynamic(() => import("@/components/home/team-section").then(mod => ({ default: mod.TeamSection })), {
  loading: () => <div className="py-16 lg:py-20 bg-muted" />,
});

const CTASection = dynamic(() => import("@/components/home/cta-section").then(mod => ({ default: mod.CTASection })), {
  loading: () => <div className="py-16 lg:py-20 bg-primary" />,
});

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main>
        <HeroSection />
        <ServicesSection />
        <AboutSection />
        <TeamSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
