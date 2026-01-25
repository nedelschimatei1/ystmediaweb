import { ScrollSnapContainer, ScrollSnapSection, ScrollSnapDots } from "@/components/scroll-snap-container";
import { ScrollProgress } from "@/components/parallax-effects";
import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/home/hero-section";
import { AboutSection } from "@/components/home/about-section";
import { ServicesSection } from "@/components/home/services-section";
import { TeamSection } from "@/components/home/team-section";
import { CTASection } from "@/components/home/cta-section";
import { Footer } from "@/components/footer";

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
