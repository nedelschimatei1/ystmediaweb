import dynamic from "next/dynamic";
import { ScrollSnapContainer, ScrollSnapSection, ScrollSnapDots } from "@/components/scroll-snap-container";
import { ScrollProgress } from "@/components/parallax-effects";
import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/home/hero-section";

// Lazy load below-the-fold components
const AboutSection = dynamic(() => import("@/components/home/about-section").then(mod => ({ default: mod.AboutSection })), {
  loading: () => <div className="min-h-screen" />,
});
const ServicesSection = dynamic(() => import("@/components/home/services-section").then(mod => ({ default: mod.ServicesSection })), {
  loading: () => <div className="min-h-screen" />,
});
const TeamSection = dynamic(() => import("@/components/home/team-section").then(mod => ({ default: mod.TeamSection })), {
  loading: () => <div className="min-h-screen" />,
});
const CTASection = dynamic(() => import("@/components/home/cta-section").then(mod => ({ default: mod.CTASection })), {
  loading: () => <div className="min-h-[50vh]" />,
});
const Footer = dynamic(() => import("@/components/footer").then(mod => ({ default: mod.Footer })), {
  loading: () => <div className="h-64" />,
});

export default function HomePage() {
  return (
    <>
      <ScrollProgress />
      <Navigation />
      <ScrollSnapContainer>
        <ScrollSnapDots />
        
        <ScrollSnapSection index={0}>
          <HeroSection />
        </ScrollSnapSection>

        <ScrollSnapSection index={1} className="bg-background">
          <AboutSection />
        </ScrollSnapSection>

        <ScrollSnapSection index={2} className="bg-muted">
          <ServicesSection />
        </ScrollSnapSection>

        <ScrollSnapSection index={3} className="bg-background">
          <TeamSection />
        </ScrollSnapSection>

        <ScrollSnapSection index={4}>
          <CTASection />
        </ScrollSnapSection>

        <div className="snap-start">
          <Footer />
        </div>
      </ScrollSnapContainer>
    </>
  );
}
