import { site, abs } from '../data/site';
import { reviews } from '../data/reviews';

export interface Crumb { name: string; href: string }

export const breadcrumbSchema = (crumbs: Crumb[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    item: abs(c.href),
  })),
});

export const faqSchema = (faqs: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});

export const businessSchema = () => {
  const hasReviews = reviews.length > 0;
  const avg = hasReviews ? reviews.reduce((n, r) => n + r.rating, 0) / reviews.length : 0;
  return {
    '@context': 'https://schema.org',
    '@type': ['MovingCompany', 'LocalBusiness'],
    '@id': abs('/#business'),
    name: site.name,
    legalName: site.legalName,
    url: abs('/'),
    logo: abs('/logo.png'),
    image: abs('/og-default.png'),
    email: site.email,
    description:
      'Professional house, flat and office removals across the UK, including local moves and long-distance city-to-city relocations.',
    priceRange: '££',
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.postcode,
      addressCountry: site.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
    areaServed: { '@type': 'Country', name: 'United Kingdom' },
    openingHoursSpecification: site.hoursSpec.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    ...(site.social.length ? { sameAs: site.social } : {}),
    ...(hasReviews
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: avg.toFixed(1),
            reviewCount: reviews.length,
          },
        }
      : {}),
  };
};

export const websiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': abs('/#website'),
  url: abs('/'),
  name: site.name,
  inLanguage: 'en-GB',
  publisher: { '@id': abs('/#business') },
});
