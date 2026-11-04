// Cookie consent for Google Analytics 4 (UK PECR / UK GDPR).
// Nothing from Google is loaded, and no cookie is set, until the visitor clicks Accept. Declining is as easy as accepting.
// The choice is remembered in this browser (localStorage). "Cookie settings" in the footer reopens the banner.
// This is an external module so the Content-Security-Policy can stay strict (no inline scripts).

const KEY = 'consent-analytics'; // 'granted' | 'denied'
const box = document.querySelector<HTMLElement>('[data-consent]');
const id = box?.dataset.ga ?? '';

const read = (): string | null => { try { return localStorage.getItem(KEY); } catch { return null; } };
const write = (v: string) => { try { localStorage.setItem(KEY, v); } catch { /* private mode: the choice lasts for this page only */ } };

declare global { interface Window { dataLayer: unknown[]; gtag: (...a: unknown[]) => void } }

let loaded = false;
const loadAnalytics = () => {
  if (loaded || !id) return;
  if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) return; // never count local development
  loaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); }; // gtag expects the arguments object itself
  window.gtag('js', new Date());
  window.gtag('config', id, { anonymize_ip: true, allow_google_signals: false, allow_ad_personalization_signals: false });
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s);
};

// Remove Google Analytics cookies (_ga, _ga_<id>) if someone withdraws consent after accepting
const clearCookies = () => {
  const host = location.hostname.split('.');
  const domains = [location.hostname, ...host.map((_, i) => '.' + host.slice(i).join('.')).filter((d) => d.includes('.', 1))];
  document.cookie.split(';').map((c) => c.split('=')[0].trim()).filter((n) => n === '_ga' || n.startsWith('_ga_') || n === '_gid').forEach((n) => {
    domains.forEach((d) => { document.cookie = `${n}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${d}`; });
    document.cookie = `${n}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  });
};

if (box && id) {
  const dnt = navigator.doNotTrack === '1' || (navigator as unknown as { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
  const show = () => { box.hidden = false; };
  const hide = () => { box.hidden = true; };

  const saved = read();
  if (saved === 'granted') loadAnalytics();
  else if (saved === 'denied' || dnt) { /* respect the stored choice or the browser's privacy signal: no banner, no analytics */ }
  else show();

  box.querySelector('[data-consent-accept]')?.addEventListener('click', () => { write('granted'); hide(); loadAnalytics(); });
  box.querySelector('[data-consent-decline]')?.addEventListener('click', () => { write('denied'); hide(); clearCookies(); });
  document.querySelectorAll('[data-consent-open]').forEach((b) => b.addEventListener('click', () => {
    show();
    box.querySelector<HTMLElement>('[data-consent-accept]')?.focus();
  }));
}

export {};
