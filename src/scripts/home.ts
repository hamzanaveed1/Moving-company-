// Home page interactivity. External file (no inline script) so the Content-Security-Policy stays strict.
// Everything here is progressive enhancement: with JavaScript off, the scene still animates (CSS only),
// the journey shows all four steps, and the map is a set of plain links.

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (n: number, a = 0, b = 1) => Math.min(b, Math.max(a, n));

/* ------------------------------------------------------------------ Hero scene */
document.querySelectorAll<HTMLElement>('[data-scene]').forEach((card) => {
  // Pause / play (WCAG 2.2.2: moving content that lasts more than 5 seconds needs a way to stop it)
  const btn = card.querySelector<HTMLButtonElement>('[data-pause]');
  btn?.addEventListener('click', () => {
    const paused = card.classList.toggle('is-paused');
    btn.setAttribute('aria-pressed', String(paused));
    btn.setAttribute('aria-label', paused ? 'Play animation' : 'Pause animation');
  });

  // Save battery: animate only while the scene is on screen
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => card.classList.toggle('is-offscreen', !e.isIntersecting), { threshold: 0.05 }).observe(card);
  }

  // Each completed delivery, show the next real route (from src/data/routes.ts)
  if (reduce) return;
  let routes: { from: string; to: string; miles: number; drive: string; href: string }[] = [];
  try { routes = JSON.parse(card.dataset.routes || '[]'); } catch { /* keep the first route */ }
  if (routes.length < 2) return;
  const q = (s: string) => card.querySelector<HTMLElement>(s);
  const from = q('[data-from]'), to = q('[data-to]'), miles = q('[data-miles]'), drive = q('[data-drive]');
  const link = q('[data-routelink]') as HTMLAnchorElement | null;
  const truck = card.querySelector('.sc-truck');
  let i = 0;
  truck?.addEventListener('animationiteration', (ev) => {
    if ((ev as AnimationEvent).animationName !== 'sc-truck') return;
    i = (i + 1) % routes.length;
    const r = routes[i];
    if (from) from.textContent = r.from;
    if (to) to.textContent = r.to;
    if (miles) miles.textContent = `~${r.miles} miles`;
    if (drive) drive.textContent = r.drive;
    if (link) link.href = r.href;
  });
});

/* ------------------------------------------------------------------ Scroll journey */
document.querySelectorAll<HTMLElement>('[data-journey]').forEach((j) => {
  const steps = [...j.querySelectorAll<HTMLElement>('[data-step]')];
  const dots = steps.map((s) => s.querySelector<HTMLElement>('.jt-dot')!);
  const mobile = window.matchMedia('(max-width: 760px)');

  // Put the road exactly between the centres of the first and last stop, whatever the screen size
  const measure = () => {
    const box = j.getBoundingClientRect();
    const c = (d: HTMLElement) => { const r = d.getBoundingClientRect(); return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top }; };
    const a = c(dots[0]), b = c(dots[dots.length - 1]);
    if (mobile.matches) {
      j.style.setProperty('--tt', `${a.y}px`);
      j.style.setProperty('--tb', `${box.height - b.y}px`);
    } else {
      j.style.setProperty('--tl', `${a.x}px`);
      j.style.setProperty('--tr', `${box.width - b.x}px`);
    }
  };

  if (reduce) { measure(); window.addEventListener('resize', measure); return; } // static: full road, every step shown

  j.classList.add('is-live');
  let queued = false;
  const update = () => {
    queued = false;
    const vh = window.innerHeight;
    const r = j.getBoundingClientRect();
    // The van starts when the journey's top reaches 85% of the screen height and arrives after the page has
    // scrolled a further ~45% of a screen (or most of the journey's own height when it is tall, as on phones).
    const distance = Math.max(vh * 0.45, r.height * 0.8);
    const p = clamp((vh * 0.85 - r.top) / distance);
    j.style.setProperty('--p', p.toFixed(4));
    steps.forEach((s, n) => s.classList.toggle('on', p >= n / (steps.length - 1) - 0.001));
  };
  const request = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  measure(); update();
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', () => { measure(); request(); }, { passive: true });
});

/* ------------------------------------------------------------------ UK route map */
document.querySelectorAll<HTMLElement>('[data-routemap]').forEach((map) => {
  const svg = map.querySelector('svg') as SVGSVGElement;
  const caption = map.querySelector<HTMLElement>('[data-caption]')!;
  const cities = [...map.querySelectorAll<SVGAElement>('.mp-city')];
  const routeEls = [...map.querySelectorAll<SVGElement>('.rt, .mp-van')];
  const idle = caption.innerHTML;
  if (reduce) (svg as unknown as { pauseAnimations?: () => void }).pauseAnimations?.();

  let active: string | null = null;
  const show = (slug: string | null) => {
    active = slug;
    cities.forEach((c) => c.classList.toggle('is-active', c.dataset.slug === slug));
    if (!slug) {
      map.removeAttribute('data-active');
      routeEls.forEach((e) => e.classList.remove('hot'));
      caption.innerHTML = idle;
      return;
    }
    map.setAttribute('data-active', slug);
    routeEls.forEach((e) => e.classList.toggle('hot', e.getAttribute('data-from') === slug || e.getAttribute('data-to') === slug));
    const c = cities.find((x) => x.dataset.slug === slug)!;
    const n = Number(c.dataset.n);
    caption.textContent = '';
    const strong = document.createElement('strong'); strong.textContent = c.dataset.name!;
    const info = document.createElement('span'); info.textContent = `${n} route${n === 1 ? '' : 's'}`;
    const a = document.createElement('a'); a.href = c.getAttribute('href')!; a.textContent = `Removals in ${c.dataset.name} →`;
    caption.append(strong, info, a);
  };

  cities.forEach((c) => {
    const slug = c.dataset.slug!;
    c.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') show(slug); });
    c.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') show(null); });
    // Keyboard focus shows the routes; a tap also focuses the link first, so ignore focus that is not keyboard-driven
    c.addEventListener('focus', () => { if (c.matches(':focus-visible')) show(slug); });
    c.addEventListener('blur', () => show(null));
    // Touch: the first tap shows the routes, the second tap (or the caption link) opens the page
    let lastPointer = '';
    c.addEventListener('pointerdown', (e) => { lastPointer = e.pointerType; });
    c.addEventListener('click', (e) => {
      // Trust the real input type of this tap; fall back to the device's hover capability
      const touch = lastPointer ? lastPointer !== 'mouse' : window.matchMedia('(hover: none)').matches;
      if (touch && active !== slug) { e.preventDefault(); show(slug); }
    });
  });
  document.addEventListener('click', (e) => { if (!map.contains(e.target as Node)) show(null); });
});

export {}; // makes this file a module so its top-level names are private
