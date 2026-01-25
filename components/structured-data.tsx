/**
 * JSON-LD Structured Data Components for SEO
 * These help search engines understand the business and content
 */

// Organization Schema - Main business identity
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://ystmedia.com/#organization",
    name: "YST Media",
    alternateName: "YST Media Tourism Consulting",
    url: "https://ystmedia.com",
    logo: {
      "@type": "ImageObject",
      url: "https://ystmedia.com/logo-light.png",
      width: 640,
      height: 427,
    },
    description: "A trusted partner for the future of tourism. Over 40 years of experience in hospitality consulting, hotel management, and digital innovation.",
    foundingDate: "1986",
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      value: 115,
    },
    slogan: "A Solid Partner for the Future of Tourism",
    knowsAbout: [
      "Hotel Management",
      "Revenue Management",
      "Tourism Consulting",
      "Hotel Certifications",
      "Mystery Shopping",
      "SEO for Hotels",
      "Digital Marketing for Tourism",
      "Sustainability Consulting",
      "GDPR Compliance",
    ],
    areaServed: {
      "@type": "Country",
      name: "Romania",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+40-721-469-039",
        contactType: "customer service",
        availableLanguage: ["Romanian", "English"],
      },
      {
        "@type": "ContactPoint",
        telephone: "+40-770-435-819",
        contactType: "customer support",
        availableLanguage: ["Romanian", "English"],
      },
    ],
    email: "contact@ystmedia.com",
    sameAs: [
      // Add social media URLs when available
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// LocalBusiness Schema - Physical location details
export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": "https://ystmedia.com/#localbusiness",
    name: "YST Media",
    image: "https://ystmedia.com/logo-light.png",
    url: "https://ystmedia.com",
    telephone: "+40-721-469-039",
    email: "contact@ystmedia.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "București",
      addressCountry: "RO",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 44.4268,
      longitude: 26.1025,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    priceRange: "$$",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "250",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Service Schema - Individual services offered
export function ServicesSchema() {
  const services = [
    {
      name: "Hotel Management & Revenue Management",
      description: "Comprehensive hotel management and revenue optimization services for operational excellence.",
    },
    {
      name: "Certifications & Authorizations",
      description: "Expert guidance for hotel classification certificates and regulatory compliance in hospitality.",
    },
    {
      name: "Mystery Shopper",
      description: "Objective quality assessments and guest experience evaluations to identify strengths and areas for improvement.",
    },
    {
      name: "SEO & Digital Marketing",
      description: "Website optimization, online presence enhancement, and booking increase strategies for hotels and tourism businesses.",
    },
    {
      name: "Sustainability Consulting",
      description: "Environmental consulting for implementing eco-friendly and sustainable practices in hospitality.",
    },
    {
      name: "GDPR & DPO Consulting",
      description: "Data Protection Officer consulting services ensuring GDPR compliance in the hospitality industry.",
    },
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: service.name,
        description: service.description,
        provider: {
          "@type": "Organization",
          name: "YST Media",
          url: "https://ystmedia.com",
        },
        areaServed: {
          "@type": "Country",
          name: "Romania",
        },
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// FAQ Schema - For FAQ section on contact page
export function FAQSchema({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// WebSite Schema - Site search and identity
export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://ystmedia.com/#website",
    url: "https://ystmedia.com",
    name: "YST Media",
    description: "Tourism Consulting Excellence - Over 40 years of experience in hospitality consulting",
    publisher: {
      "@id": "https://ystmedia.com/#organization",
    },
    inLanguage: ["ro-RO", "en-US"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// BreadcrumbList Schema - Navigation structure
export function BreadcrumbSchema({ items }: { items: Array<{ name: string; url: string }> }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Combined schemas for homepage
export function HomePageSchemas() {
  return (
    <>
      <OrganizationSchema />
      <LocalBusinessSchema />
      <WebSiteSchema />
      <ServicesSchema />
    </>
  );
}
