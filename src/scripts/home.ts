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

/* ------------------------------------------------------------------ "How it works" journey */
// A compact section: when it scrolls into view the van drives along the road in a couple of seconds and each
// stop lights up as it arrives. Nothing is pinned and nothing waits on scroll, so the page stays fast and short.
document.querySelectorAll<HTMLElement>('[data-journey]').forEach((j) => {
  const steps = [...j.querySelectorAll<HTMLElement>('[data-step]')];
  const dots = steps.map((s) => s.querySelector<HTMLElement>('.jt-dot')!);
  const mobile = window.matchMedia('(max-width: 760px)');
  let thresholds = steps.map((_, i) => i / steps.length); // where along the road each stop sits (0..1), measured below
  let lengthPx = 600;
  let shown = 0; // progress currently on screen (0..1)

  // Put the road exactly through the centres of the stops, and continue past the last one to the "home" marker
  const measure = () => {
    const box = j.getBoundingClientRect();
    const pts = dots.map((d) => { const r = d.getBoundingClientRect(); return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top }; });
    const a = pts[0], z = pts[pts.length - 1];
    if (mobile.matches) {
      const extra = 96, reserve = 56; // the van parks `reserve` px before the end of the road (see home.css)
      const L = z.y + extra - a.y;
      j.style.setProperty('--tt', `${a.y}px`);
      j.style.setProperty('--tb', `${box.height - (z.y + extra)}px`);
      thresholds = pts.map((p) => (p.y - a.y) / (L - reserve)); lengthPx = L - reserve;
    } else {
      const extra = Math.min(120, Math.max(60, box.width - z.x - 30));
      const reserve = 58; // the van parks `reserve` px before the end of the road (see home.css)
      const L = z.x + extra - a.x;
      j.style.setProperty('--tl', `${a.x}px`);
      j.style.setProperty('--tr', `${box.width - (z.x + extra)}px`);
      thresholds = pts.map((p) => (p.x - a.x) / (L - reserve)); lengthPx = L - reserve;
    }
  };

  const WHEEL_CIRCUMFERENCE = 36; // px, matches the van graphic
  const render = (p: number, speed: number) => {
    shown = p;
    j.style.setProperty('--p', p.toFixed(4));
    j.style.setProperty('--v', speed.toFixed(3));
    j.style.setProperty('--rot', ((p * lengthPx) / WHEEL_CIRCUMFERENCE * 360).toFixed(1));
    let last = -1;
    steps.forEach((s, n) => { const on = p >= thresholds[n] - 0.004; s.classList.toggle('on', on); if (on) last = n; });
    steps.forEach((s, n) => s.classList.toggle('cur', n === last));
    j.classList.toggle('is-done', p >= 0.995);
  };

  measure();
  window.addEventListener('resize', () => { measure(); render(shown, 0); }, { passive: true });
  if (document.fonts?.ready) document.fonts.ready.then(() => { measure(); render(shown, 0); });

  // Reduced motion: no animation, the finished road with every step shown
  if (reduce) { steps.forEach((s) => s.classList.add('on')); render(1, 0); return; }

  j.classList.add('is-live');
  render(0, 0);

  const DURATION = mobile.matches ? 2600 : 2200; // ms, start to finish
  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2); // gentle start and stop
  let started = false;
  const play = () => {
    if (started) return;
    started = true;
    const t0 = performance.now();
    let prev = 0;
    const tick = (now: number) => {
      const e = ease(clamp((now - t0) / DURATION));
      render(e, clamp((e - prev) * 110)); // speed lines and headlight only while it is moving
      prev = e;
      if (e < 1) requestAnimationFrame(tick); else render(1, 0);
    };
    requestAnimationFrame(tick);
  };

  if (!('IntersectionObserver' in window)) { play(); return; }
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (en.isIntersecting) { io.disconnect(); play(); return; }
      if (en.boundingClientRect.bottom < 0) { io.disconnect(); started = true; render(1, 0); return; } // already scrolled past: show the finished road
    }
  }, { threshold: mobile.matches ? 0.35 : 0.55 });
  io.observe(j);
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
