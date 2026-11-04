import formProvider from './form-provider.json';
import googleIds from './google.json';

/**
 * Single source of truth for the business. Edit this file first.
 * Anything left empty ('') is hidden on the site rather than shown as a blank or made-up claim.
 */
const web3formsKey = String(formProvider.web3formsAccessKey || '').trim();
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

export const site = {
  name: 'MovingPal',
  legalName: 'MovingPal', // OWNER: change to your registered compny name once incorporated, e.g. 'MovingPal Removals Ltd'
  tagline: 'Stress-free removals across the UK',
  url: (import.meta.env.SITE as string | undefined) || 'https://www.movingpal.co.uk',
  locale: 'en-GB',

  // ---- Contact (NAP): keep identical to your Google Business Profile ----
  // No public phone number: customers contact us by email, the contact form or the quote form.
  email: 'customersupport@movingpal.co.uk',
  // No public business address yet, so none is shown anywhere. When you have one, fill it in, for example:
  //   { street: '12 High Street', city: 'Manchester', region: 'Greater Manchester', postcode: 'M1 1AA', country: 'GB' }
  address: null as { street: string; city: string; region: string; postcode: string; country: string } | null,
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
  // Only used with an address above; leave null until then.
  geo: null as { lat: number; lng: number } | null,

  // Google AdSense (OFF by default). Set PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX only after your
  // AdSense account is approved. See docs/ADSENSE.md. Ads only ever load on blog articles.
  adsenseClient: (import.meta.env.PUBLIC_ADSENSE_CLIENT as string | undefined) || '',
  adsenseSlot: (import.meta.env.PUBLIC_ADSENSE_SLOT as string | undefined) || '',

  // Google Search Console (HTML tag) and Google Analytics 4. Values live in src/data/google.json.
  googleSiteVerification: googleIds.siteVerification as string,
  googleAnalyticsMeasurementId: googleIds.analyticsMeasurementId as string, // GA4 loads only after the visitor accepts the consent banner

  // Form endpoint (set in your host's env vars)
  // If src/data/form-provider.json has a Web3Forms key, every form posts straight to Web3Forms with it.
  formEndpoint: web3formsKey ? WEB3FORMS_ENDPOINT : (import.meta.env.PUBLIC_FORM_ENDPOINT as string | undefined) || '',
  formAccessKey: web3formsKey || (import.meta.env.PUBLIC_FORM_ACCESS_KEY as string | undefined) || '',
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
