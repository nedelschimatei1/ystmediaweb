import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ContactHero } from "@/components/contact/contact-hero";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactInfo } from "@/components/contact/contact-info";
import { ContactMap } from "@/components/contact/contact-map";
import { FAQ } from "@/components/contact/faq";

export const metadata = {
  title: "Contact | YST Media - Consultanță Turistică",
  description: "Contactați YST Media pentru consultanță în turism și hotelărie. Suntem aici pentru a vă transforma afacerea.",
};

export default function ContactPage() {
  return (
    <>
      <Navigation />
      <main>
        <ContactHero />
        <section id="form" className="py-12 lg:py-16 bg-background scroll-mt-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
              <div className="lg:col-span-3">
                <ContactForm />
              </div>
              <div className="lg:col-span-2">
                <ContactInfo />
              </div>
            </div>
          </div>
        </section>
        <ContactMap />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
