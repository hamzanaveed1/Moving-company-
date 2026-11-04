// Light / dark theme switch. The initial theme is applied by /theme-init.js before first paint; this adds the
// toggle button, remembers the choice, and follows the system setting until the visitor chooses.

const root = document.documentElement;
const KEY = 'theme';
const COLORS = { light: '#ffffff', dark: '#0d1016' }; // browser UI colour (mobile address bar)

const stored = (): 'light' | 'dark' | null => {
  try { const v = localStorage.getItem(KEY); return v === 'light' || v === 'dark' ? v : null; } catch { return null; }
};
const systemDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches;
const current = (): 'light' | 'dark' => (root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');

const apply = (theme: 'light' | 'dark') => {
  root.setAttribute('data-theme', theme);
  // One colour for the browser chrome that matches the page, even if it differs from the system theme
  document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((m) => { m.content = COLORS[theme]; m.removeAttribute('media'); });
  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((b) => {
    const toDark = theme === 'light';
    b.setAttribute('aria-label', toDark ? 'Switch to dark mode' : 'Switch to light mode');
    b.setAttribute('title', toDark ? 'Dark mode' : 'Light mode');
    b.setAttribute('aria-pressed', String(theme === 'dark'));
  });
};

apply(stored() ?? (systemDark() ? 'dark' : 'light'));

document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((b) =>
  b.addEventListener('click', () => {
    const next = current() === 'dark' ? 'light' : 'dark';
    // Choosing the same theme the phone is already using goes back to "automatic" (follow the phone from now on);
    // choosing the opposite is remembered as an override.
    try {
      if ((next === 'dark') === systemDark()) localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, next);
    } catch { /* private mode: the choice lasts for this visit only */ }
    // A short cross-fade so the switch feels smooth (skipped for reduced motion)
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.classList.add('theme-fade');
      window.setTimeout(() => root.classList.remove('theme-fade'), 400);
    }
    apply(next);
  }),
);

// Until the visitor chooses, follow the system theme live
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => { if (!stored()) apply(e.matches ? 'dark' : 'light'); });

export {};
