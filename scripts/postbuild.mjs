/**
 * Runs after `astro build`. Writes deploy-time files into ./dist:
 *   _headers                       security + cache headers (Cloudflare Pages and Netlify read this format)
 *   .well-known/security.txt       RFC 9116 vulnerability-disclosure contact (Expires rolls forward every build)
 *   ads.txt                        only when PUBLIC_ADSENSE_CLIENT is set
 *
 * Environment:
 *   PUBLIC_FORM_ENDPOINT   absolute URL of an external form endpoint (adds its origin to connect-src)
 *   PUBLIC_ADSENSE_CLIENT  e.g. ca-pub-1234567890123456. Relaxes the CSP for Google ads (see docs/ADSENSE.md)
 *   SECURITY_CONTACT       e.g. mailto:customersupport@movingpal.co.uk (defaults to the site email)
 *   SITE_URL               canonical origin
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';

// Modes:  (none)            write dist/ files after a build
//         --write-vercel    regenerate ./vercel.json (commit the result)
//         --check-vercel    exit 1 if ./vercel.json is out of date (used in CI)
const mode = process.argv[2] || '';
const DIST = 'dist';
if (!mode && !existsSync(DIST)) throw new Error('Run `astro build` first');

const site = (process.env.SITE_URL || 'https://movingpal.co.uk').replace(/\/$/, '');
// A Web3Forms key in src/data/form-provider.json makes the forms post to Web3Forms, so that origin must be allowed.
const web3formsKey = String(JSON.parse(readFileSync('src/data/form-provider.json', 'utf8')).web3formsAccessKey || '').trim();
const formEndpoint = web3formsKey ? 'https://api.web3forms.com/submit' : process.env.PUBLIC_FORM_ENDPOINT || '';
const adsClient = process.env.PUBLIC_ADSENSE_CLIENT || '';
const securityContact = process.env.SECURITY_CONTACT || 'mailto:customersupport@movingpal.co.uk';

// ---------- Content-Security-Policy ----------
const connect = ["'self'"];
if (/^https:\/\//.test(formEndpoint)) connect.push(new URL(formEndpoint).origin);

let csp;
if (!adsClient) {
  // Strict policy: no third-party code at all, no inline scripts, no inline <style> blocks.
  // 'unsafe-inline' is allowed only for style *attributes* (style="..."), which cannot run script.
  csp = {
    'default-src': ["'none'"],
    'script-src': ["'self'"],
    'style-src': ["'self'"],
    'style-src-attr': ["'unsafe-inline'"],
    'img-src': ["'self'", 'data:'],
    'font-src': ["'self'"],
    'connect-src': connect,
    'manifest-src': ["'self'"],
    'form-action': ["'self'"],
    'base-uri': ["'self'"],
    'frame-ancestors': ["'none'"],
    'object-src': ["'none'"],
    'upgrade-insecure-requests': [],
  };
} else {
  // Google AdSense needs third-party scripts, frames and inline bootstrap code. This is a documented
  // relaxation, applied ONLY when PUBLIC_ADSENSE_CLIENT is set. Verify in the browser console after enabling.
  const g = ['https://pagead2.googlesyndication.com', 'https://partner.googleadservices.com', 'https://tpc.googlesyndication.com', 'https://www.googletagservices.com', 'https://fundingchoicesmessages.google.com', 'https://*.adtrafficquality.google', 'https://www.google.com', 'https://ep1.adtrafficquality.google', 'https://ep2.adtrafficquality.google'];
  csp = {
    'default-src': ["'none'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", ...g],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'https:'],
    'font-src': ["'self'", 'data:'],
    'connect-src': [...connect, ...g, 'https://*.g.doubleclick.net', 'https://*.google.com'],
    'frame-src': ['https://googleads.g.doubleclick.net', 'https://tpc.googlesyndication.com', 'https://*.safeframe.googlesyndication.com', 'https://www.google.com', 'https://fundingchoicesmessages.google.com'],
    'manifest-src': ["'self'"],
    'form-action': ["'self'"],
    'base-uri': ["'self'"],
    'frame-ancestors': ["'none'"],
    'object-src': ["'none'"],
    'upgrade-insecure-requests': [],
  };
}
const cspHeader = Object.entries(csp).map(([k, v]) => [k, ...v].join(' ')).join('; ');

const securityHeaders = {
  'Content-Security-Policy': cspHeader,
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=(), accelerometer=(), gyroscope=(), magnetometer=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'X-Permitted-Cross-Domain-Policies': 'none',
};

// ---------- Vercel (does not read _headers; it needs vercel.json committed at the repo root) ----------
const vercelConfig = {
  $schema: 'https://openapi.vercel.sh/vercel.json',
  trailingSlash: true,
  headers: [
    { source: '/(.*)', headers: Object.entries(securityHeaders).map(([key, value]) => ({ key, value })) },
    { source: '/_astro/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
    ...['/logo.png', '/og-default.png', '/apple-touch-icon.png', '/favicon.svg', '/favicon.ico', '/icon-192.png', '/icon-512.png'].map((source) => ({
      source,
      headers: [{ key: 'Cache-Control', value: 'public, max-age=604800' }],
    })),
  ],
};
const vercelJson = JSON.stringify(vercelConfig, null, 2) + '\n';

if (mode === '--write-vercel') {
  writeFileSync('vercel.json', vercelJson);
  console.log(`wrote vercel.json (${adsClient ? 'AdSense' : 'strict'} CSP)`);
  process.exit(0);
}
if (mode === '--check-vercel') {
  const current = existsSync('vercel.json') ? readFileSync('vercel.json', 'utf8') : '';
  if (current !== vercelJson) {
    console.error('vercel.json is out of date. Run: npm run vercel:config  (then commit it)');
    process.exit(1);
  }
  console.log('vercel.json is up to date');
  process.exit(0);
}

const block = (path, headers) => `${path}\n${Object.entries(headers).map(([k, v]) => `  ${k}: ${v}`).join('\n')}\n`;

// NOTE: no Cache-Control on /* so HTML keeps the host default (always revalidate). Only fingerprinted assets are cached forever.
const headersFile = [
  block('/*', securityHeaders),
  block('/_astro/*', { 'Cache-Control': 'public, max-age=31536000, immutable' }),
  block('/favicon.ico', { 'Cache-Control': 'public, max-age=604800' }),
  block('/*.png', { 'Cache-Control': 'public, max-age=604800' }),
  block('/*.svg', { 'Cache-Control': 'public, max-age=604800' }),
  block('/.well-known/*', { 'Content-Type': 'text/plain; charset=utf-8' }),
].join('\n');
writeFileSync(`${DIST}/_headers`, headersFile);

// ---------- security.txt (RFC 9116) ----------
mkdirSync(`${DIST}/.well-known`, { recursive: true });
const expires = new Date(Date.now() + 330 * 24 * 3600 * 1000).toISOString().replace(/\.\d{3}Z$/, '.000Z');
writeFileSync(
  `${DIST}/.well-known/security.txt`,
  `Contact: ${securityContact}\nExpires: ${expires}\nPreferred-Languages: en\nCanonical: ${site}/.well-known/security.txt\nPolicy: ${site}/security/\n`,
);

// ---------- ads.txt (only when AdSense is configured) ----------
if (adsClient) {
  const pub = adsClient.replace(/^ca-/, '');
  writeFileSync(`${DIST}/ads.txt`, `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`);
}

if (process.env.VERCEL) {
  const current = existsSync('vercel.json') ? readFileSync('vercel.json', 'utf8') : '';
  if (current !== vercelJson) {
    console.warn('\n!! WARNING: vercel.json does not match the headers this build needs (for example you enabled AdSense or an external form endpoint).\n!! Run `npm run vercel:config` locally with the same environment variables and commit vercel.json, or the live CSP will be wrong.\n');
  }
}

console.log(`postbuild: wrote _headers (${adsClient ? 'AdSense CSP' : 'strict CSP'}), security.txt${adsClient ? ', ads.txt' : ''}`);
