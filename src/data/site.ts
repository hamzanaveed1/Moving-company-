/**
 * Single source of truth for the business. Edit this file first.
 * Anything left empty ('') is hidden on the site rather than shown as a blank or made-up claim.
 */
export const site = {
  name: 'Movera',
  legalName: 'Movera Removals Ltd',
  tagline: 'Stress-free removals across the UK',
  url: (import.meta.env.SITE as string | undefined) || 'https://www.example.co.uk',
  locale: 'en-GB',

  // ---- Contact (NAP): keep identical to your Google Business Profile ----
  phone: '0800 000 0000',
  phoneHref: '+448000000000',
  whatsapp: '448000000000', // digits only, with country code, no +
  email: 'hello@example.co.uk',
  address: {
    street: '1 Example Street',
    city: 'Manchester',
    region: 'Greater Manchester',
    postcode: 'M1 1AA',
    country: 'GB',
  },
  hours: 'Mon-Sat 7am-7pm, Sun 9am-5pm',
  hoursSpec: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '07:00', closes: '19:00' },
    { days: ['Sunday'], opens: '09:00', closes: '17:00' },
  ],

  // ---- Company details for the footer (leave '' to hide) ----
  companyNumber: '',
  vatNumber: '',

  // ---- Trust claims: ONLY fill these in if they are true and verifiable ----
  trust: {
    insuredText: '', // e.g. "Goods in transit insurance up to £50,000"
    tradeBody: '', // e.g. "Member of the British Association of Removers"
    yearsTrading: '', // e.g. "12"
    movesCompleted: '', // e.g. "4,500+"
  },

  // ---- Social profiles for schema "sameAs" (leave [] to omit) ----
  social: [] as string[],

  // ---- Geo (used in LocalBusiness schema) ----
  geo: { lat: 53.4808, lng: -2.2426 },

  // Form endpoint (set in your host's env vars)
  formEndpoint: (import.meta.env.PUBLIC_FORM_ENDPOINT as string | undefined) || '',
  formAccessKey: (import.meta.env.PUBLIC_FORM_ACCESS_KEY as string | undefined) || '',
};

export const nav = [
  { label: 'Services', href: '/services/' },
  { label: 'Locations', href: '/locations/' },
  { label: 'Routes', href: '/routes/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
];

export const abs = (path: string) => new URL(path, site.url).toString();
