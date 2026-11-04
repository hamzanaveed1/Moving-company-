/**
 * Single source of truth for the business. Edit this file first.
 * Anything left empty ('') is hidden on the site rather than shown as a blank or made-up claim.
 */
export const site = {
  name: 'MovingPal',
  legalName: 'MovingPal', // OWNER: change to your registered company name once incorporated, e.g. 'MovingPal Removals Ltd'
  tagline: 'Stress-free removals across the UK',
  url: (import.meta.env.SITE as string | undefined) || 'https://movingpal.co.uk',
  locale: 'en-GB',

  // ---- Contact (NAP): keep identical to your Google Business Profile ----
  // No public phone number: customers contact us by email, the contact form or the quote form.
  email: 'customersupport@movingpal.co.uk',
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

  // Google AdSense (OFF by default). Set PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX only after your
  // AdSense account is approved. See docs/ADSENSE.md. Ads only ever load on blog articles.
  adsenseClient: (import.meta.env.PUBLIC_ADSENSE_CLIENT as string | undefined) || '',
  adsenseSlot: (import.meta.env.PUBLIC_ADSENSE_SLOT as string | undefined) || '',

  // Form endpoint (set in your host's env vars)
  formEndpoint: (import.meta.env.PUBLIC_FORM_ENDPOINT as string | undefined) || '',
  formAccessKey: (import.meta.env.PUBLIC_FORM_ACCESS_KEY as string | undefined) || '',
  // Contact form posts to /api/contact when the bundled functions are in use; otherwise to the external endpoint.
  contactEndpoint: '',
};
site.contactEndpoint =
  (import.meta.env.PUBLIC_CONTACT_ENDPOINT as string | undefined) || (site.formEndpoint === '/api/quote' ? '/api/contact' : site.formEndpoint);

export const nav = [
  { label: 'Services', href: '/services/' },
  { label: 'Locations', href: '/locations/' },
  { label: 'Routes', href: '/routes/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
];

export const abs = (path: string) => new URL(path, site.url).toString();
