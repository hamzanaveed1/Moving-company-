// Vercel Web Analytics (page views) and Speed Insights (real-visitor page speed: LCP, CLS, INP and more).
// Both are cookieless and send no personal data. They are bundled with our own code and talk only to our own
// origin (/_vercel/insights/* and /_vercel/speed-insights/*), so the strict Content-Security-Policy needs no changes.
// BaseLayout switches them on only for Vercel builds, and they are skipped for visitors who send Do Not Track.
import { inject } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights';

if (document.querySelector('meta[name="vercel-analytics"]') && navigator.doNotTrack !== '1') {
  inject({ mode: 'production' });
  injectSpeedInsights();
}
