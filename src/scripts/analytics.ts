// Vercel Web Analytics: privacy-friendly page-view counting (no cookies, no cross-site tracking, no personal data).
// The script is bundled with our own code and talks only to our own origin (/_vercel/insights/*), so the strict
// Content-Security-Policy needs no changes. It is switched on by BaseLayout only for Vercel builds.
import { inject } from '@vercel/analytics';

if (document.querySelector('meta[name="vercel-analytics"]') && navigator.doNotTrack !== '1') {
  inject({ mode: 'production' });
}
