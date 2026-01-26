import dynamic from "next/dynamic";
import { Navigation } from "@/components/navigation";
import { ContactHero } from "@/components/contact/contact-hero";
import { FAQSchema, BreadcrumbSchema } from "@/components/structured-data";

// Lazy load below-the-fold components
const ScheduleConsultation = dynamic(() => import("@/components/contact/schedule-consultation").then(mod => ({ default: mod.ScheduleConsultation })));
const ContactForm = dynamic(() => import("@/components/contact/contact-form").then(mod => ({ default: mod.ContactForm })));
const ContactInfo = dynamic(() => import("@/components/contact/contact-info").then(mod => ({ default: mod.ContactInfo })));
const ContactMap = dynamic(() => import("@/components/contact/contact-map").then(mod => ({ default: mod.ContactMap })));
const FAQ = dynamic(() => import("@/components/contact/faq").then(mod => ({ default: mod.FAQ })));
const ContactDivider = dynamic(() => import("@/components/contact/contact-divider").then(mod => ({ default: mod.ContactDivider })));
const Footer = dynamic(() => import("@/components/footer").then(mod => ({ default: mod.Footer })));

// FAQ data for schema (English versions for SEO)
const faqSchemaData = [
  {
    question: "What types of tourism businesses do you work with?",
    answer: "We work with a wide range of tourism and hospitality businesses, including hotels, resorts, boutique accommodations, travel agencies, and destination management companies. Our expertise spans from small boutique properties to large hotel chains."
  },
  {
    question: "How long does a typical consulting engagement last?",
    answer: "Duration varies based on the scope and complexity of the project. Initial assessments typically take 2-4 weeks, while complete implementations can range from 3-12 months. We work with you to define realistic timelines."
  },
  {
    question: "Do you offer ongoing support after the initial project?",
    answer: "Yes, we offer various ongoing support packages, including monthly retainers, quarterly reviews, and on-demand consulting. Many of our clients maintain long-term relationships with us for continuous improvement."
  },
  {
    question: "What makes YST Media different from other consultants?",
    answer: "Our team brings over 40 years of combined experience specifically in tourism and hospitality. We combine deep industry knowledge with innovative digital strategies, providing personalized solutions."
  },
  {
    question: "How do you measure the success of consulting services?",
    answer: "We establish clear KPIs at the beginning of each engagement, whether it's revenue growth, occupancy rates, guest satisfaction scores, or digital metrics. We provide regular reporting."
  },
];

const breadcrumbData = [
  { name: "Home", url: "https://ystmedia.com" },
  { name: "Contact", url: "https://ystmedia.com/contact" },
];

export const metadata = {
  title: "Contact | YST Media - Tourism Consulting",
  description: "Contact YST Media for tourism and hospitality consulting. Schedule a consultation or send us a message. We're here to transform your business.",
};

export default function ContactPage() {
  return (
    <>
      <FAQSchema faqs={faqSchemaData} />
      <BreadcrumbSchema items={breadcrumbData} />
      <Navigation />
      <main>
        <ContactHero />
        
        {/* Primary CTA - Schedule Consultation */}
        <ScheduleConsultation />
        
        {/* Divider */}
        <ContactDivider />

        {/* Secondary - Contact Form */}
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
