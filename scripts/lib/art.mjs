/** Shared drawing helpers for the generated artwork (blog covers, hero, OG card, logos, media kit). Run from the repo root. */
import sharp from 'sharp';
import opentype from 'opentype.js';
import { readFileSync } from 'node:fs';

// ---------- palette ----------
export const C = {
  navy: '#0c1f3d', navy2: '#12305c', navy3: '#1d4a85',
  amber: '#f5a524', amberD: '#e08a00', amberL: '#ffd27a',
  cream: '#fbf3e4', white: '#ffffff', ink: '#0f1b2d',
  card: '#d9a566', cardD: '#b8803f', cardL: '#ecc48f',
  green: '#22a06b', red: '#e5484d', teal: '#14b8a6',
};

// ---------- brand mark: the MovingPal logo ----------
// The logo is a vector trace of the approved design (scripts/logo-mark.json: tight viewBox, silhouette clip
// path and three flat colour layers). One definition drives every output below (site files, favicon, app icons,
// social card, vans), so the logo is identical everywhere.
export const MARK = JSON.parse(readFileSync('scripts/logo-mark.json', 'utf8'));
export const MARK_COLORS = { light: '#F5A524', dark: '#DA8418', navy: '#0C1F3D' };
export const MARK_ASPECT = MARK.viewBox[2] / MARK.viewBox[3];
let markUid = 0;
export const markBody = ({ onDark = false, adaptive = false } = {}) => {
  const id = `lbm${markUid++}`;
  const layers = MARK.layers.map((l) => `<path d="${l.d}"${adaptive && l.role === 'navy' ? ' class="n"' : ''} fill="${l.role === 'navy' && onDark ? '#FFF4DC' : MARK_COLORS[l.role]}" fill-rule="evenodd"/>`).join('');
  return `<defs><clipPath id="${id}"><path d="${MARK.clip}" clip-rule="evenodd"/></clipPath></defs><g clip-path="url(#${id})">${layers}</g>`;
};
/** Mark as a nested <svg> placed at (x, y) with the given height (width follows the aspect ratio). */
export const markEl = (x, y, h, opts) => `<svg x="${x}" y="${y}" width="${(h * MARK_ASPECT).toFixed(2)}" height="${h}" viewBox="${MARK.viewBox.join(' ')}">${markBody(opts)}</svg>`;
/** Standalone SVG document of the mark (used for public/logo-mark*.svg). */
export const markDoc = (h, opts) => `<svg xmlns="http://www.w3.org/2000/svg" width="${(h * MARK_ASPECT).toFixed(1)}" height="${h}" viewBox="${MARK.viewBox.join(' ')}">${markBody(opts)}</svg>`;
/** Square tile: mark centred on a white rounded square (favicon, app icons, schema logo). */
export const markTile = (size, { round = 0.22, scale = 0.72 } = {}) => {
  const h = size * scale;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" rx="${size * round}" fill="#ffffff"/>${markEl(((size - h * MARK_ASPECT) / 2).toFixed(2), ((size - h) / 2).toFixed(2), h)}</svg>`;
};

// Outlined text (real Manrope glyph shapes as vector paths, so the social card needs no installed fonts)
export const manrope = (w) => { const b = readFileSync(`node_modules/@fontsource/manrope/files/manrope-latin-${w}-normal.woff`); return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength)); };
export const FONTS = { 600: manrope(600), 800: manrope(800) };
// opentype.js's own toPathData() occasionally emits "NaN" for a valid curve (the geometry is fine), and the
// SVG renderer then silently stops drawing the path (the headline got cut off after "Stre"). So serialise the
// glyph commands ourselves.
export const pathData = (commands) =>
  commands
    .map((c) => {
      const n = (v) => Number(v).toFixed(2);
      if (c.type === 'M' || c.type === 'L') return `${c.type}${n(c.x)} ${n(c.y)}`;
      if (c.type === 'Q') return `Q${n(c.x1)} ${n(c.y1)} ${n(c.x)} ${n(c.y)}`;
      if (c.type === 'C') return `C${n(c.x1)} ${n(c.y1)} ${n(c.x2)} ${n(c.y2)} ${n(c.x)} ${n(c.y)}`;
      return 'Z';
    })
    .join('');
export const outline = (text, x, y, size, fill, weight = 800, letterSpacing = -0.03) => {
  const d = pathData(FONTS[weight].getPath(text, x, y, size, { letterSpacing }).commands);
  if (/NaN|undefined|Infinity/.test(d)) throw new Error(`Bad glyph path for "${text}"`); // never ship a truncated logo
  return `<path d="${d}" fill="${fill}"/>`;
};
export const textWidth = (text, size, weight = 800, letterSpacing = -0.03) => FONTS[weight].getAdvanceWidth(text, size, { letterSpacing });

/** The company name as painted on the side of a vehicle: "Moving" in navy + "Pal" in dark amber, sized to fit `maxW`. */
export const NAME_HEAD = 'Moving', NAME_TAIL = 'Pal';
export const vehicleName = (x, baseline, maxW) => {
  const size = Math.floor((maxW / textWidth(NAME_HEAD + NAME_TAIL, 100)) * 100);
  return outline(NAME_HEAD, x, baseline, size, '#0c1f3d') + outline(NAME_TAIL, x + textWidth(NAME_HEAD, size), baseline, size, '#b36200');
};

// ---------- deterministic random ----------
export function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------- building blocks ----------
export const defs = (id, stops, x2 = 0, y2 = 1) =>
  `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops
    .map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`)
    .join('')}</linearGradient>`;

export const sky = (W, H, top, mid, bottom) => `
  <defs>${defs('sky', [[0, top], [0.6, mid], [1, bottom]])}</defs>
  <rect width="${W}" height="${H}" fill="url(#sky)"/>`;

export const sun = (x, y, r, color = C.amberL) => `
  <defs><radialGradient id="sunglow"><stop offset="0" stop-color="${color}" stop-opacity=".9"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient></defs>
  <circle cx="${x}" cy="${y}" r="${r * 3}" fill="url(#sunglow)"/>
  <circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>`;

export const cloud = (x, y, s = 1, o = 0.85) => `
  <g transform="translate(${x} ${y}) scale(${s})" fill="#fff" opacity="${o}">
    <ellipse cx="0" cy="0" rx="70" ry="22"/><ellipse cx="-30" cy="-16" rx="34" ry="24"/>
    <ellipse cx="22" cy="-22" rx="40" ry="28"/><ellipse cx="55" cy="-6" rx="28" ry="18"/>
  </g>`;

export function skyline(W, baseY, { seed, color, minH, maxH, minW = 60, maxW = 130, windows = false, lit = C.amberL, dim }) {
  const r = rng(seed);
  let x = -20, out = '';
  while (x < W + 20) {
    const w = minW + r() * (maxW - minW);
    const h = minH + r() * (maxH - minH);
    out += `<rect x="${x.toFixed(1)}" y="${(baseY - h).toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" fill="${color}"/>`;
    if (r() > 0.78) out += `<rect x="${(x + w * 0.45).toFixed(1)}" y="${(baseY - h - 28).toFixed(1)}" width="4" height="28" fill="${color}"/>`;
    if (windows) {
      const cols = Math.max(2, Math.floor(w / 18));
      const rows = Math.max(2, Math.floor(h / 26));
      for (let i = 0; i < cols; i++)
        for (let j = 0; j < rows; j++) {
          const on = r() > 0.62;
          out += `<rect x="${(x + 8 + i * ((w - 16) / cols)).toFixed(1)}" y="${(baseY - h + 10 + j * ((h - 20) / rows)).toFixed(1)}" width="7" height="11" rx="1.5" fill="${on ? lit : dim}" opacity="${on ? 0.9 : 0.35}"/>`;
        }
    }
    x += w + (r() > 0.7 ? 6 : 0);
  }
  return out;
}

export const hills = (W, y, color, amp = 60, seed = 1, opacity = 1) => {
  const r = rng(seed);
  let d = `M0 ${y + amp}`;
  const step = 200;
  for (let x = 0; x <= W + step; x += step) d += ` Q ${x + step / 2} ${y - amp * (0.4 + r())} ${x + step} ${y + amp * (r() - 0.2)}`;
  d += ` L${W} 1200 L0 1200Z`;
  return `<path d="${d}" fill="${color}" opacity="${opacity}"/>`;
};

export const road = (W, y, h = 90) => `
  <rect x="0" y="${y}" width="${W}" height="${h}" fill="#26324a"/>
  <rect x="0" y="${y}" width="${W}" height="6" fill="#3b4a68"/>
  ${Array.from({ length: Math.ceil(W / 120) }, (_, i) => `<rect x="${i * 120 + 20}" y="${y + h / 2 - 3}" width="64" height="6" rx="3" fill="#f4e7c4"/>`).join('')}`;

export const tree = (x, y, s = 1, c1 = '#1f8a5b', c2 = '#2fa56f') => `
  <g transform="translate(${x} ${y}) scale(${s})">
    <rect x="-6" y="-40" width="12" height="40" rx="3" fill="#7a5230"/>
    <circle cx="0" cy="-70" r="34" fill="${c1}"/><circle cx="-22" cy="-52" r="24" fill="${c2}"/><circle cx="22" cy="-52" r="24" fill="${c2}"/>
  </g>`;

export const house = (x, y, s = 1, wall = C.cream, roof = C.navy2) => `
  <g transform="translate(${x} ${y}) scale(${s})">
    <rect x="-90" y="-120" width="180" height="120" fill="${wall}"/>
    <polygon points="-110,-118 0,-200 110,-118" fill="${roof}"/>
    <rect x="-18" y="-70" width="36" height="70" rx="4" fill="${C.amber}"/>
    <circle cx="9" cy="-34" r="3" fill="${C.navy}"/>
    <rect x="-70" y="-95" width="34" height="34" rx="4" fill="#bfe0f5"/><rect x="36" y="-95" width="34" height="34" rx="4" fill="#bfe0f5"/>
    <path d="M-53 -95v34M-70 -78h34M53 -95v34M36 -78h34" stroke="${wall}" stroke-width="3"/>
    <rect x="52" y="-190" width="22" height="46" fill="${C.cardD}"/>
  </g>`;

/** Removal van, facing right. (x, y) is the ground contact line at the van's left. */
export const van = (x, y, s = 1, accent = C.amber) => `
  <g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="190" cy="2" rx="205" ry="12" fill="#000" opacity=".22"/>
    <rect x="0" y="-178" width="262" height="146" rx="16" fill="#fff"/>
    <rect x="0" y="-62" width="262" height="30" fill="${C.navy2}"/>
    <rect x="0" y="-92" width="262" height="12" fill="${accent}"/>
    ${markEl(32, -166, 62)}
    ${vehicleName(102, -124, 146)}
    <path d="M262 -150 L322 -150 Q346 -148 358 -118 L378 -84 Q386 -70 386 -50 L386 -32 L262 -32 Z" fill="#fff"/>
    <path d="M276 -138 L318 -138 Q334 -136 342 -116 L352 -94 L276 -94 Z" fill="#a9d4f0"/>
    <path d="M276 -138 L318 -138 L304 -94 L276 -94 Z" fill="#fff" opacity=".35"/>
    <rect x="262" y="-62" width="124" height="30" fill="${C.navy2}"/>
    <rect x="372" y="-76" width="16" height="12" rx="4" fill="${C.amberL}"/>
    <rect x="372" y="-50" width="20" height="14" rx="5" fill="#1a1f2b"/>
    <rect x="-4" y="-44" width="14" height="12" rx="4" fill="#1a1f2b"/>
    ${[78, 318].map((cx) => `<g><circle cx="${cx}" cy="-24" r="32" fill="#161b27"/><circle cx="${cx}" cy="-24" r="16" fill="#cfd6e4"/><circle cx="${cx}" cy="-24" r="5" fill="#161b27"/></g>`).join('')}
  </g>`;

/** Big lorry, facing right */
export const lorry = (x, y, s = 1) => `
  <g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="300" cy="2" rx="320" ry="14" fill="#000" opacity=".22"/>
    <rect x="0" y="-250" width="430" height="212" rx="16" fill="#fff"/>
    <rect x="0" y="-92" width="430" height="54" fill="${C.navy2}"/>
    <rect x="0" y="-132" width="430" height="14" fill="${C.amber}"/>
    ${markEl(46, -236, 86)}
    ${vehicleName(152, -180, 262)}
    <path d="M430 -210 L500 -210 Q526 -208 540 -170 L560 -118 Q568 -100 568 -78 L568 -38 L430 -38 Z" fill="#fff"/>
    <path d="M446 -196 L494 -196 Q512 -194 522 -170 L534 -140 L446 -140 Z" fill="#a9d4f0"/>
    <rect x="430" y="-92" width="138" height="54" fill="${C.navy2}"/>
    <rect x="550" y="-110" width="20" height="14" rx="5" fill="${C.amberL}"/>
    ${[96, 218, 486].map((cx) => `<g><circle cx="${cx}" cy="-30" r="40" fill="#161b27"/><circle cx="${cx}" cy="-30" r="20" fill="#cfd6e4"/><circle cx="${cx}" cy="-30" r="6" fill="#161b27"/></g>`).join('')}
  </g>`;

export const box = (x, y, w, h, o = {}) => {
  const { tape = true, label = false, tilt = 0 } = o;
  return `
  <g transform="translate(${x} ${y}) rotate(${tilt})">
    <rect x="0" y="${-h}" width="${w}" height="${h}" rx="4" fill="${C.card}"/>
    <rect x="0" y="${-h}" width="${w}" height="${h * 0.18}" rx="4" fill="${C.cardL}"/>
    <rect x="${w * 0.82}" y="${-h}" width="${w * 0.18}" height="${h}" fill="${C.cardD}" opacity=".35"/>
    ${tape ? `<rect x="${w * 0.4}" y="${-h}" width="${w * 0.2}" height="${h * 0.55}" fill="#c98a4a" opacity=".85"/>` : ''}
    ${label ? `<rect x="${w * 0.12}" y="${-h * 0.45}" width="${w * 0.34}" height="${h * 0.26}" rx="3" fill="#fff" opacity=".9"/><path d="M${w * 0.16} ${-h * 0.36} h${w * 0.26}" stroke="${C.navy2}" stroke-width="3"/>` : ''}
  </g>`;
};

export const pin = (x, y, s = 1, color = C.amber) => `
  <g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="0" cy="4" rx="26" ry="8" fill="#000" opacity=".2"/>
    <path d="M0 0 C-40 -50 -52 -74 -52 -96 A52 52 0 1 1 52 -96 C52 -74 40 -50 0 0Z" fill="${color}"/>
    <circle cx="0" cy="-96" r="20" fill="#fff"/>
  </g>`;

export const star = (x, y, r, fill = C.amber) => {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 ? r * 0.45 : r;
    return `${(x + Math.cos(a) * rr).toFixed(1)},${(y + Math.sin(a) * rr).toFixed(1)}`;
  }).join(' ');
  return `<polygon points="${pts}" fill="${fill}"/>`;
};

export const coin = (x, y, r, symbol = '£') => `
  <g>
    <circle cx="${x}" cy="${y + 8}" r="${r}" fill="${C.amberD}"/>
    <circle cx="${x}" cy="${y}" r="${r}" fill="${C.amber}"/>
    <circle cx="${x}" cy="${y}" r="${r * 0.78}" fill="none" stroke="${C.amberL}" stroke-width="${r * 0.07}"/>
    <text x="${x}" y="${y + r * 0.34}" text-anchor="middle" font-family="Inter, sans-serif" font-weight="800" font-size="${r * 1.05}" fill="${C.navy}">${symbol}</text>
  </g>`;

export const clipboard = (x, y, w, h, rows = 5, done = 3) => `
  <g transform="translate(${x} ${y})">
    <rect x="0" y="0" width="${w}" height="${h}" rx="22" fill="${C.navy2}"/>
    <rect x="14" y="26" width="${w - 28}" height="${h - 40}" rx="12" fill="#fff"/>
    <rect x="${w / 2 - 54}" y="-14" width="108" height="44" rx="12" fill="${C.amber}"/>
    <rect x="${w / 2 - 14}" y="-26" width="28" height="22" rx="8" fill="${C.amberD}"/>
    ${Array.from({ length: rows }, (_, i) => {
      const ry = 62 + i * ((h - 100) / rows);
      const ok = i < done;
      return `<g>
        <rect x="38" y="${ry}" width="34" height="34" rx="9" fill="${ok ? C.green : '#fff'}" stroke="${ok ? C.green : '#b9c4d6'}" stroke-width="4"/>
        ${ok ? `<path d="M46 ${ry + 18} l8 8 l14 -17" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` : ''}
        <rect x="92" y="${ry + 6}" width="${(w - 160) * (0.55 + ((i * 37) % 40) / 100)}" height="12" rx="6" fill="${ok ? '#b9c4d6' : C.navy2}"/>
        <rect x="92" y="${ry + 24}" width="${(w - 160) * 0.35}" height="8" rx="4" fill="#d6deea"/>
      </g>`;
    }).join('')}
  </g>`;

export const tapeRoll = (x, y, r) => `
  <g><circle cx="${x}" cy="${y}" r="${r}" fill="${C.amber}"/><circle cx="${x}" cy="${y}" r="${r * 0.58}" fill="${C.cream}"/>
  <circle cx="${x}" cy="${y}" r="${r * 0.58}" fill="none" stroke="${C.cardD}" stroke-width="3" opacity=".5"/>
  <path d="M${x + r * 0.9} ${y + r * 0.5} q${r * 0.7} ${r * 0.7} ${r * 1.5} ${r * 0.7} h${r * 0.9}" stroke="${C.amber}" stroke-width="${r * 0.35}" fill="none" stroke-linecap="round"/></g>`;

export const bubbleWrap = (x, y, w, h) => `
  <g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="#bfe5f7" opacity=".85"/>
  ${Array.from({ length: Math.floor(h / 26) }, (_, j) => Array.from({ length: Math.floor(w / 26) }, (_, i) => `<circle cx="${x + 18 + i * 26}" cy="${y + 18 + j * 26}" r="9" fill="#e9f7ff" stroke="#8cc9e8" stroke-width="2"/>`).join('')).join('')}</g>`;

export const plate = (x, y, r) => `
  <g><circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="#dbe3ef" stroke-width="4"/>
  <circle cx="${x}" cy="${y}" r="${r * 0.62}" fill="none" stroke="#bcd3ee" stroke-width="3"/></g>`;

export const shield = (x, y, s = 1) => `
  <g transform="translate(${x} ${y}) scale(${s})">
    <path d="M0 -150 L110 -112 V-30 C110 40 60 86 0 114 C-60 86 -110 40 -110 -30 V-112Z" fill="${C.navy2}"/>
    <path d="M0 -132 L94 -100 V-30 C94 30 52 70 0 94 C-52 70 -94 30 -94 -30 V-100Z" fill="${C.navy3}"/>
    <path d="M-44 -22 l30 32 l62 -70" stroke="${C.amber}" stroke-width="22" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </g>`;

export const frame = (W, H, inner, extraDefs = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${extraDefs}${inner}</svg>`;

