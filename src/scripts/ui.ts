// Site-wide UI polish. External file (no inline script) so the Content-Security-Policy stays strict.

// 1) Header gains a hairline + soft shadow once the page has scrolled.
const header = document.querySelector<HTMLElement>('.site-header');
if (header) {
  let ticking = false;
  const update = () => { header.classList.toggle('is-scrolled', window.scrollY > 6); ticking = false; };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

// 2) Gentle reveal-on-scroll.
//    Nothing is hidden until the visitor ACTUALLY starts scrolling. Until then (and always, for crawlers,
//    screenshots, accessibility tools, and anyone with JavaScript off or reduced motion) every section is
//    fully visible. On the first scroll, sections still below the screen are tucked away and then
//    eased in as they approach. An element is revealed once its top edge is at or above ~90% of the
//    viewport height. "At or above" (not "inside") means content can never get stuck invisible after a
//    fast jump or an in-page link.
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduce) {
  const selector =
    'main .section-head, main .grid > *, main .steps > li, main .table-wrap, main .cta-band, main .pills, main .faq, main .contact-list > li, main .form-card, main .split > *, main .post-cover, main .todo-group';
  let pending: HTMLElement[] = [];
  let queued = false;

  const check = () => {
    queued = false;
    const limit = window.innerHeight * 0.9;
    pending = pending.filter((el) => {
      if (el.getBoundingClientRect().top < limit) { el.classList.add('in'); return false; }
      return true;
    });
  };
  const onScroll = () => { if (!queued) { queued = true; requestAnimationFrame(check); } };

  const start = () => {
    window.removeEventListener('scroll', start);
    const vh = window.innerHeight;
    document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
      if (el.getBoundingClientRect().top < vh * 0.95) return; // in view (or above) right now: leave visible
      // Stagger siblings slightly so a row of cards settles in sequence (capped, so it never feels slow).
      const idx = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      el.style.transitionDelay = `${Math.min(idx, 4) * 70}ms`;
      el.classList.add('reveal');
      pending.push(el);
    });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    // Printing (or saving as PDF) must never miss content that has not been scrolled to yet.
    window.addEventListener('beforeprint', () => { pending.forEach((el) => el.classList.add('in')); pending = []; });
    check();
  };
  window.addEventListener('scroll', start, { passive: true });
}

export {}; // makes this file a module so its top-level names are private
