import { SITE_URL, SITE_NAME, SITE_DEFAULT_DESCRIPTION, SITE_LOGO_PATH } from "@/lib/site-config";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL.replace(/\/$/, "")}${SITE_LOGO_PATH}`,
  description: SITE_DEFAULT_DESCRIPTION,
  address: {
    "@type": "PostalAddress",
    addressCountry: "ID",
    addressLocality: "Indonesia",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: ["Indonesian", "English"],
    hoursAvailable: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DEFAULT_DESCRIPTION,
  publisher: {
    "@type": "Organization",
    name: SITE_NAME,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL.replace(/\/$/, "")}${SITE_LOGO_PATH}`,
    },
  },
  inLanguage: "id",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL.replace(/\/$/, "")}/price-list?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export function JsonLd() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
    </>
  );
}
