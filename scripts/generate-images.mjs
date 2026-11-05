/**
 * Generates the site's illustrated imagery (blog covers, hero, social-share card, logo, favicon).
 * Run:  npm run images
 *
 * These are original vector illustrations rendered with sharp, so there are no licensing issues.
 * Swap in real photos of your crew/vans later by replacing the files in src/assets/blog/.
 */
import sharp from 'sharp';
import opentype from 'opentype.js';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';

const OUT_BLOG = 'src/assets/blog';
const OUT_IMG = 'src/assets/img';
mkdirSync(OUT_BLOG, { recursive: true });
mkdirSync(OUT_IMG, { recursive: true });
mkdirSync('public', { recursive: true });

import { C, MARK, MARK_COLORS, MARK_ASPECT, markBody, markEl, markDoc, markTile, manrope, FONTS, pathData, outline, textWidth, NAME_HEAD, vehicleName, rng, defs, sky, sun, cloud, skyline, hills, road, tree, house, van, lorry, box, pin, star, coin, clipboard, tapeRoll, bubbleWrap, plate, shield, frame } from './lib/art.mjs';

// ---------- scenes ----------
const scenes = {};

scenes.hero = (W = 1200, H = 1000) => frame(W, H, `
  ${sky(W, H, '#f9a15a', '#fcd9a0', '#fff3dc')}
  ${sun(W * 0.7, H * 0.36, 70, '#fff1c4')}
  ${cloud(180, 150, 1.1)}${cloud(W - 260, 110, 0.9, 0.7)}${cloud(W * 0.45, 230, 0.7, 0.6)}
  ${skyline(W, H * 0.68, { seed: 7, color: '#f0b98a', minH: 170, maxH: 330, minW: 70, maxW: 150 })}
  ${skyline(W, H * 0.7, { seed: 11, color: '#c98f7c', minH: 120, maxH: 280, windows: true, lit: '#ffe2a6', dim: '#8d5f66' })}
  ${skyline(W, H * 0.74, { seed: 21, color: C.navy2, minH: 80, maxH: 220, windows: true, lit: C.amberL, dim: '#2a4f86' })}
  <rect x="0" y="${H * 0.74}" width="${W}" height="${H * 0.26}" fill="#2a3a58"/>
  <rect x="0" y="${H * 0.74}" width="${W}" height="10" fill="#3e5176"/>
  ${road(W, H * 0.8, 120)}
  ${box(90, H * 0.8 - 6, 96, 82, { label: true })}${box(150, H * 0.8 - 88, 78, 66, { tilt: -3 })}${box(52, H * 0.8 - 6, 62, 54)}
  ${van(W * 0.2, H * 0.8 + 100, 1.35)}
  ${tree(W - 90, H * 0.75, 1.1)}
  <rect x="0" y="${H * 0.8 + 120}" width="${W}" height="${H * 0.2}" fill="#1f2c47"/>`);

scenes.checklist = (W = 1600, H = 900) => frame(W, H, `
  ${sky(W, H, '#d7ebfb', '#eaf5fd', '#fdf7ea')}
  ${sun(1330, 170, 56, '#ffe9a8')}${cloud(260, 150, 1.2)}${cloud(880, 110, 0.8, 0.7)}
  ${hills(W, 640, '#bfe3cc', 50, 3)}${hills(W, 700, '#8fd1ac', 40, 5)}
  <rect x="0" y="760" width="${W}" height="140" fill="#6cbd8f"/>
  ${house(1130, 770, 1.6)}
  ${tree(1420, 770, 1.3)}${tree(790, 770, 1)}
  ${clipboard(180, 150, 470, 600, 5, 3)}
  ${box(700, 770, 150, 120, { label: true })}${box(740, 650, 110, 90, { tilt: -4 })}${box(870, 770, 120, 100)}
  ${van(930, 880, 0.8)}`);

scenes.cost = (W = 1600, H = 900) => frame(W, H, `
  ${sky(W, H, C.navy, C.navy2, '#1d4a85')}
  ${Array.from({ length: 40 }, (_, i) => { const r = rng(i + 3); return `<circle cx="${r() * W}" cy="${r() * 420}" r="${1 + r() * 2.2}" fill="#fff" opacity="${0.2 + r() * 0.5}"/>`; }).join('')}
  ${skyline(W, 700, { seed: 31, color: '#183a6b', minH: 140, maxH: 360, windows: true, lit: C.amberL, dim: '#2a5594' })}
  <rect x="0" y="700" width="${W}" height="200" fill="#14233c"/>
  ${road(W, 740, 110)}
  ${coin(430, 380, 220)}${coin(250, 560, 100)}${coin(610, 600, 90)}
  <g transform="translate(850 190)">
    <rect x="0" y="0" width="360" height="230" rx="26" fill="#fff"/>
    <rect x="28" y="30" width="304" height="62" rx="12" fill="${C.navy}"/>
    <text x="316" y="76" text-anchor="end" font-family="Inter, sans-serif" font-weight="800" font-size="40" fill="${C.amber}">£££</text>
    ${Array.from({ length: 12 }, (_, i) => `<rect x="${28 + (i % 4) * 78}" y="${112 + Math.floor(i / 4) * 38}" width="64" height="28" rx="8" fill="${i === 11 ? C.amber : '#dbe4f2'}"/>`).join('')}
  </g>
  ${van(960, 840, 1.3)}`);

scenes.packing = (W = 1600, H = 900) => frame(W, H, `
  <rect width="${W}" height="${H}" fill="${C.cream}"/>
  <circle cx="1300" cy="140" r="340" fill="#f7e2bb"/><circle cx="200" cy="820" r="300" fill="#f7e2bb"/>
  <rect x="0" y="720" width="${W}" height="180" fill="#e9d2a6"/>
  ${box(160, 720, 380, 290, { label: true })}
  ${box(210, 430, 270, 200, { tilt: -2 })}
  ${box(600, 720, 300, 230, { label: true })}
  ${box(980, 720, 260, 190)}
  ${box(1040, 530, 170, 130, { tilt: 3 })}
  <g transform="translate(560 420)"><rect x="0" y="0" width="360" height="260" rx="18" fill="${C.card}"/><polygon points="0,0 -50,-110 70,-130 360,0" fill="${C.cardL}"/><polygon points="360,0 420,-110 310,-130 0,0" fill="${C.cardD}" opacity=".7"/>
    ${plate(90, 90, 54)}${plate(180, 120, 54)}${plate(270, 90, 54)}
    <rect x="60" y="160" width="240" height="60" rx="12" fill="#bfe5f7" opacity=".9"/></g>
  ${tapeRoll(1380, 640, 90)}
  ${bubbleWrap(1180, 700, 330, 130)}
  <g transform="translate(1250 300) rotate(12)"><rect x="0" y="0" width="180" height="40" rx="10" fill="${C.navy2}"/><rect x="14" y="12" width="120" height="8" rx="4" fill="${C.amber}"/></g>
  <rect x="1380" y="230" width="22" height="130" rx="8" fill="${C.amber}" transform="rotate(26 1390 300)"/>`);

scenes.longdistance = (W = 1600, H = 900) => frame(W, H, `
  ${sky(W, H, '#8fd0f2', '#cdeafa', '#fff2d8')}
  ${sun(300, 210, 60, '#fff1b8')}${cloud(840, 140, 1.2)}${cloud(1300, 230, 0.9, 0.8)}${cloud(150, 400, 0.7, 0.7)}
  ${hills(W, 470, '#a9dcc0', 70, 8)}${hills(W, 560, '#74c39a', 60, 12)}${hills(W, 640, '#4aa87b', 50, 17)}
  <path d="M130 430 C 450 220, 700 560, 1000 380 S 1400 300, 1480 380" stroke="#fff" stroke-width="10" fill="none" stroke-dasharray="4 24" stroke-linecap="round"/>
  ${pin(130, 440, 1.1, C.amber)}${pin(1480, 390, 1.1, C.red)}
  <rect x="0" y="770" width="${W}" height="130" fill="#26324a"/>
  <rect x="0" y="770" width="${W}" height="8" fill="#3b4a68"/>
  ${Array.from({ length: 14 }, (_, i) => `<rect x="${i * 130 + 30}" y="828" width="74" height="8" rx="4" fill="#f4e7c4"/>`).join('')}
  ${tree(120, 770, 0.9)}${tree(1480, 770, 1)}${tree(1330, 770, 0.8)}
  ${lorry(520, 850, 1.05)}`);

scenes.compare = (W = 1600, H = 900) => frame(W, H, `
  ${sky(W, H, '#e5eefb', '#f4f7fd', '#fdf3df')}
  ${cloud(240, 150, 1, 0.9)}${cloud(1250, 120, 1.1, 0.8)}
  ${skyline(W, 690, { seed: 41, color: '#cfdcf0', minH: 150, maxH: 340, minW: 80, maxW: 160 })}
  <rect x="0" y="690" width="${W}" height="210" fill="#2a3a58"/>
  <rect x="0" y="690" width="${W}" height="10" fill="#3e5176"/>
  ${road(W, 730, 120)}
  <line x1="800" y1="140" x2="800" y2="740" stroke="${C.navy2}" stroke-width="5" stroke-dasharray="14 14" opacity=".5"/>
  <circle cx="800" cy="440" r="44" fill="${C.navy}"/>
  <text x="800" y="456" text-anchor="middle" font-family="Inter, sans-serif" font-weight="800" font-size="36" fill="${C.amber}">vs</text>
  ${van(120, 850, 1.45)}
  ${lorry(880, 860, 1.0)}
  ${box(90, 740, 88, 72)}${box(150, 810, 70, 56)}`);

scenes.trust = (W = 1600, H = 900) => frame(W, H, `
  ${sky(W, H, '#13335f', '#1d4a85', '#2e65ad')}
  ${Array.from({ length: 30 }, (_, i) => { const r = rng(i + 90); return `<circle cx="${r() * W}" cy="${r() * 360}" r="${1 + r() * 2}" fill="#fff" opacity="${0.2 + r() * 0.5}"/>`; }).join('')}
  <circle cx="800" cy="360" r="300" fill="#fff" opacity=".06"/><circle cx="800" cy="360" r="220" fill="#fff" opacity=".07"/>
  ${shield(800, 370, 2.3)}
  ${[0, 1, 2, 3, 4].map((i) => star(560 + i * 120, 130, 44)).join('')}
  ${skyline(W, 760, { seed: 55, color: '#0f2a4f', minH: 80, maxH: 220, windows: true, lit: C.amberL, dim: '#1f4379' })}
  <rect x="0" y="760" width="${W}" height="140" fill="#0c1f3d"/>
  ${van(110, 880, 0.95)}${van(1050, 880, 0.95, C.amberL)}`);

scenes.og = (W = 1200, H = 630) => frame(W, H, `
  ${sky(W, H, C.navy, C.navy2, C.navy3)}
  ${skyline(W, 520, { seed: 9, color: '#1b4580', minH: 100, maxH: 260, windows: true, lit: C.amberL, dim: '#2f5fa3' })}
  <rect x="0" y="520" width="${W}" height="110" fill="#14233c"/>
  ${road(W, 540, 80)}
  ${van(660, 610, 1.1)}
  ${markEl(70, 62, 100, { onDark: true })}
  ${outline('Moving', 184, 148, 58, '#ffffff')}${outline('Pal', 184 + textWidth('Moving', 58), 148, 58, C.amber)}
  ${outline('Stress-free removals', 70, 272, 64, '#ffffff')}
  ${outline('across the UK', 70, 346, 64, C.amber)}
  ${outline('House · Flat · Office · City-to-city', 70, 410, 28, '#c9d6ee', 600, -0.01)}`);

// ---------- render ----------
const blog = [
  ['how-much-does-moving-house-cost-uk', 'cost'],
  ['moving-house-checklist-uk', 'checklist'],
  ['how-to-pack-for-a-house-move', 'packing'],
  ['long-distance-moving-tips-uk', 'longdistance'],
  ['man-and-van-vs-removal-company', 'compare'],
  ['how-to-choose-a-removal-company-uk', 'trust'],
];

for (const [slug, scene] of blog) {
  const svg = scenes[scene](1600, 900);
  await sharp(Buffer.from(svg)).webp({ quality: 90, effort: 5 }).toFile(`${OUT_BLOG}/${slug}.webp`);
  console.log('blog', slug);
}
await sharp(Buffer.from(scenes.hero(1200, 1000))).webp({ quality: 90, effort: 5 }).toFile(`${OUT_IMG}/hero.webp`);
await sharp(Buffer.from(scenes.og())).png().toFile('public/og-default.png');

/** Tab icon: the mark alone (no tile) filling the square, so it is as large as possible at 16px.
 *  `adaptive` adds a dark-mode rule inside the SVG so the navy face turns cream on dark browser tabs. */
const markSquare = (size, { pad = 0.03, adaptive = false } = {}) => {
  const h = size * (1 - 2 * pad);
  const w = h * MARK_ASPECT;
  const style = adaptive ? '<style>@media (prefers-color-scheme: dark){.n{fill:#FFF4DC}}</style>' : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${style}${markEl(((size - w) / 2).toFixed(2), (size * pad).toFixed(2), h.toFixed(2), { adaptive })}</svg>`;
};
/** Minimal .ico writer (PNG-compressed entries, supported by every current browser). */
const makeIco = (pngs) => {
  const head = Buffer.alloc(6 + 16 * pngs.length);
  head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(pngs.length, 4);
  let offset = head.length;
  pngs.forEach(({ size, buf }, i) => {
    const o = 6 + 16 * i;
    head.writeUInt8(size >= 256 ? 0 : size, o); head.writeUInt8(size >= 256 ? 0 : size, o + 1);
    head.writeUInt8(0, o + 2); head.writeUInt8(0, o + 3);
    head.writeUInt16LE(1, o + 4); head.writeUInt16LE(32, o + 6);
    head.writeUInt32LE(buf.length, o + 8); head.writeUInt32LE(offset, o + 12);
    offset += buf.length;
  });
  return Buffer.concat([head, ...pngs.map((p) => p.buf)]);
};

// Logo files used by the website (public/) and by search engines
writeFileSync('public/logo-mark.svg', markDoc(120));
writeFileSync('public/logo-mark-light.svg', markDoc(120, { onDark: true })); // for dark backgrounds (footer)
writeFileSync('public/favicon.svg', markSquare(100, { adaptive: true })); // browser tab (modern browsers; adapts to dark tabs)
// Raster tab icons: rendered large, then downsampled with Lanczos for the cleanest 16/32/48px result
const big = await sharp(Buffer.from(markSquare(1024)), { density: 72 }).png().toBuffer();
const tab = async (n) => ({ size: n, buf: await sharp(big).resize(n, n, { kernel: 'lanczos3' }).sharpen({ sigma: 0.6 }).png().toBuffer() });
const tabs = await Promise.all([16, 32, 48].map(tab));
writeFileSync('public/favicon.ico', makeIco(tabs)); // Safari, older browsers, and anything that requests /favicon.ico
await sharp(big).resize(48, 48, { kernel: 'lanczos3' }).png().toFile('public/favicon-48.png'); // Google Search wants a multiple of 48px
await sharp(Buffer.from(markTile(512, { round: 0, scale: 0.7 }))).png().toFile('public/logo.png'); // schema.org logo
await sharp(Buffer.from(markTile(512, { round: 0, scale: 0.62 }))).png().toFile('public/icon-512.png'); // installable-app icon
await sharp(Buffer.from(markTile(192, { round: 0, scale: 0.62 }))).png().toFile('public/icon-192.png');
await sharp(Buffer.from(markTile(180, { round: 0, scale: 0.62 }))).png().toFile('public/apple-touch-icon.png'); // iOS applies its own rounding

// Email signature logo: mark + "MovingPal" wordmark, PNG (email apps do not reliably show SVG). Shown at ~200px wide.
{
  const H = 176, pad = 6, markH = 120, gap = 26, size = 92;
  const markW = markH * MARK_ASPECT;
  const w1 = textWidth('Moving', size), w2 = textWidth('Pal', size);
  const W = Math.ceil(pad + markW + gap + w1 + w2 + pad);
  const baseline = H / 2 + size * 0.36;
  const art = `${markEl(pad, (H - markH) / 2, markH)}${outline('Moving', pad + markW + gap, baseline, size, '#0c1f3d')}${outline('Pal', pad + markW + gap + w1, baseline, size, '#b36200')}`;
  const doc = (bg) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${bg ? `<rect width="${W}" height="${H}" fill="#ffffff"/>` : ''}${art}</svg>`;
  await sharp(Buffer.from(doc(true)), { density: 72 }).png().toFile('public/email-logo.png'); // white background: safe in dark-mode mail apps
  await sharp(Buffer.from(doc(false)), { density: 72 }).png().toFile('public/email-logo-transparent.png'); // for your own email signature / documents
}

// Round profile picture for WhatsApp Business / Google Business Profile / social media (docs/brand/, not part of the website).
{
  const S = 1024, mid = 512, rIn = 478, amber = '#f5a524', ink = '#0c1f3d';
  // lockup: mark + wordmark, centred near the top
  const lockSize = 100, markH = 100, gap = 18;
  const markW = markH * MARK_ASPECT, w1 = textWidth('Moving', lockSize), w2 = textWidth('Pal', lockSize);
  const lockW = markW + gap + w1 + w2, lx = (S - lockW) / 2, lcy = 232, lbase = lcy + lockSize * 0.36;
  const lockup = `${markEl(lx, lcy - markH / 2, markH)}${outline('Moving', lx + markW + gap, lbase, lockSize, ink)}${outline('Pal', lx + markW + gap + w1, lbase, lockSize, '#b36200')}`;
  // tagline between two amber rules
  const tag = 'STRESS-FREE REMOVALS ACROSS THE UK', tSize = 25, tLS = 0.07, tW = textWidth(tag, tSize, 800, tLS), tx = (S - tW) / 2, ty = 334;
  const tagline = `<rect x="${tx - 86}" y="${ty - 10}" width="70" height="4" rx="2" fill="${amber}"/><rect x="${tx + tW + 16}" y="${ty - 10}" width="70" height="4" rx="2" fill="${amber}"/>${outline(tag, tx, ty, tSize, ink, 800, tLS)}`;
  // benefits row (the same promises the website makes)
  const cy = 792, cols = [-215, -72, 72, 215].map((d) => mid + d);
  const ring = (cx) => `<circle cx="${cx}" cy="${cy}" r="35" fill="none" stroke="${amber}" stroke-width="3.5"/>`;
  const gw = textWidth('£', 44), glyphs = [
    outline('£', cols[0] - gw / 2, cy + 15, 44, amber),
    `<g fill="${amber}"><circle cx="${cols[1] - 10}" cy="${cy - 9}" r="7.5"/><circle cx="${cols[1] + 10}" cy="${cy - 9}" r="7.5"/><path d="M${cols[1] - 24} ${cy + 17} q4 -17 14 -17 q10 0 14 17 Z"/><path d="M${cols[1] - 2} ${cy + 17} q4 -17 14 -17 q10 0 14 17 Z"/></g>`,
    `<path d="M${cols[2]} ${cy + 20} C${cols[2] - 20} ${cy + 2} ${cols[2] - 15} ${cy - 20} ${cols[2]} ${cy - 20} C${cols[2] + 15} ${cy - 20} ${cols[2] + 20} ${cy + 2} ${cols[2]} ${cy + 20} Z" fill="${amber}"/><circle cx="${cols[2]}" cy="${cy - 5}" r="6" fill="${ink}"/>`,
    `<path d="M${cols[3] - 14} ${cy + 1} L${cols[3] - 4} ${cy + 12} L${cols[3] + 16} ${cy - 11}" fill="none" stroke="${amber}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`,
  ];
  const labels = [['FIXED', 'PRICES'], ['TRAINED', 'CREWS'], ['UK', 'WIDE'], ['FREE', 'QUOTES']];
  const lab = (cx, [a, b]) => outline(a, cx - textWidth(a, 22, 800, 0.05) / 2, cy + 68, 22, '#ffffff', 800, 0.05) + outline(b, cx - textWidth(b, 22, 800, 0.05) / 2, cy + 94, 22, '#ffffff', 800, 0.05);
  const url = 'www.movingpal.co.uk', uW = textWidth(url, 27, 800, 0.02);
  const doc = `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
    <defs><clipPath id="inner"><circle cx="${mid}" cy="${mid}" r="${rIn}"/></clipPath></defs>
    <rect width="${S}" height="${S}" fill="${ink}"/>
    <circle cx="${mid}" cy="${mid}" r="${mid}" fill="${ink}"/>
    <circle cx="${mid}" cy="${mid}" r="${rIn + 12}" fill="none" stroke="${amber}" stroke-width="3"/>
    <g clip-path="url(#inner)">
      <rect width="${S}" height="${S}" fill="#f4f7fc"/>
      ${skyline(S, 700, { seed: 5, color: '#dbe5f4', minH: 190, maxH: 320, minW: 60, maxW: 110 })}
      ${skyline(S, 700, { seed: 13, color: '#bccde7', minH: 100, maxH: 210, minW: 50, maxW: 100 })}
      ${road(S, 696, 50)}
      ${van(mid - 268, 718, 1.39)}
      <rect x="0" y="744" width="${S}" height="300" fill="${ink}"/>
      <rect x="0" y="744" width="${S}" height="12" fill="${amber}"/>
      ${lockup}${tagline}
      ${cols.map(ring).join('')}${glyphs.join('')}${labels.map((l, i) => lab(cols[i], l)).join('')}
      ${outline(url, (S - uW) / 2, 944, 27, amber, 800, 0.02)}
    </g></svg>`;
  mkdirSync('docs/brand', { recursive: true });
  await sharp(Buffer.from(doc), { density: 72 }).png().toFile('docs/brand/movingpal-profile-1024.png');
  await sharp(Buffer.from(doc), { density: 72 }).resize(640, 640).png().toFile('docs/brand/movingpal-profile-640.png');
}
console.log('done');
