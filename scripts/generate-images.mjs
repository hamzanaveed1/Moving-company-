/**
 * Generates the site's illustrated imagery (blog covers, hero, social-share card, logo, favicon).
 * Run:  npm run images
 *
 * These are original vector illustrations rendered with sharp, so there are no licensing issues.
 * Swap in real photos of your crew/vans later by replacing the files in src/assets/blog/.
 */
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';

const OUT_BLOG = 'src/assets/blog';
const OUT_IMG = 'src/assets/img';
mkdirSync(OUT_BLOG, { recursive: true });
mkdirSync(OUT_IMG, { recursive: true });
mkdirSync('public', { recursive: true });

// ---------- palette ----------
const C = {
  navy: '#0c1f3d', navy2: '#12305c', navy3: '#1d4a85',
  amber: '#f5a524', amberD: '#e08a00', amberL: '#ffd27a',
  cream: '#fbf3e4', white: '#ffffff', ink: '#0f1b2d',
  card: '#d9a566', cardD: '#b8803f', cardL: '#ecc48f',
  green: '#22a06b', red: '#e5484d', teal: '#14b8a6',
};

// ---------- deterministic random ----------
function rng(seed) {
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
const defs = (id, stops, x2 = 0, y2 = 1) =>
  `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops
    .map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`)
    .join('')}</linearGradient>`;

const sky = (W, H, top, mid, bottom) => `
  <defs>${defs('sky', [[0, top], [0.6, mid], [1, bottom]])}</defs>
  <rect width="${W}" height="${H}" fill="url(#sky)"/>`;

const sun = (x, y, r, color = C.amberL) => `
  <defs><radialGradient id="sunglow"><stop offset="0" stop-color="${color}" stop-opacity=".9"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient></defs>
  <circle cx="${x}" cy="${y}" r="${r * 3}" fill="url(#sunglow)"/>
  <circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>`;

const cloud = (x, y, s = 1, o = 0.85) => `
  <g transform="translate(${x} ${y}) scale(${s})" fill="#fff" opacity="${o}">
    <ellipse cx="0" cy="0" rx="70" ry="22"/><ellipse cx="-30" cy="-16" rx="34" ry="24"/>
    <ellipse cx="22" cy="-22" rx="40" ry="28"/><ellipse cx="55" cy="-6" rx="28" ry="18"/>
  </g>`;

function skyline(W, baseY, { seed, color, minH, maxH, minW = 60, maxW = 130, windows = false, lit = C.amberL, dim }) {
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

const hills = (W, y, color, amp = 60, seed = 1, opacity = 1) => {
  const r = rng(seed);
  let d = `M0 ${y + amp}`;
  const step = 200;
  for (let x = 0; x <= W + step; x += step) d += ` Q ${x + step / 2} ${y - amp * (0.4 + r())} ${x + step} ${y + amp * (r() - 0.2)}`;
  d += ` L${W} 1200 L0 1200Z`;
  return `<path d="${d}" fill="${color}" opacity="${opacity}"/>`;
};

const road = (W, y, h = 90) => `
  <rect x="0" y="${y}" width="${W}" height="${h}" fill="#26324a"/>
  <rect x="0" y="${y}" width="${W}" height="6" fill="#3b4a68"/>
  ${Array.from({ length: Math.ceil(W / 120) }, (_, i) => `<rect x="${i * 120 + 20}" y="${y + h / 2 - 3}" width="64" height="6" rx="3" fill="#f4e7c4"/>`).join('')}`;

const tree = (x, y, s = 1, c1 = '#1f8a5b', c2 = '#2fa56f') => `
  <g transform="translate(${x} ${y}) scale(${s})">
    <rect x="-6" y="-40" width="12" height="40" rx="3" fill="#7a5230"/>
    <circle cx="0" cy="-70" r="34" fill="${c1}"/><circle cx="-22" cy="-52" r="24" fill="${c2}"/><circle cx="22" cy="-52" r="24" fill="${c2}"/>
  </g>`;

const house = (x, y, s = 1, wall = C.cream, roof = C.navy2) => `
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
const van = (x, y, s = 1, accent = C.amber) => `
  <g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="190" cy="2" rx="205" ry="12" fill="#000" opacity=".22"/>
    <rect x="0" y="-178" width="262" height="146" rx="16" fill="#fff"/>
    <rect x="0" y="-62" width="262" height="30" fill="${C.navy2}"/>
    <rect x="0" y="-92" width="262" height="12" fill="${accent}"/>
    <rect x="30" y="-160" width="54" height="54" rx="12" fill="${C.navy}"/>
    <path d="M43 -116 V-142 L57 -129 L71 -142 V-116" stroke="${accent}" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M98 -140 h120" stroke="${C.navy2}" stroke-width="12" stroke-linecap="round"/>
    <path d="M98 -118 h80" stroke="#cfd8e6" stroke-width="10" stroke-linecap="round"/>
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
const lorry = (x, y, s = 1) => `
  <g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="300" cy="2" rx="320" ry="14" fill="#000" opacity=".22"/>
    <rect x="0" y="-250" width="430" height="212" rx="16" fill="#fff"/>
    <rect x="0" y="-92" width="430" height="54" fill="${C.navy2}"/>
    <rect x="0" y="-132" width="430" height="14" fill="${C.amber}"/>
    <rect x="44" y="-226" width="76" height="76" rx="16" fill="${C.navy}"/>
    <path d="M62 -166 V-200 L82 -183 L102 -200 V-166" stroke="${C.amber}" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M150 -204 h200" stroke="${C.navy2}" stroke-width="16" stroke-linecap="round"/>
    <path d="M150 -176 h140" stroke="#cfd8e6" stroke-width="12" stroke-linecap="round"/>
    <path d="M430 -210 L500 -210 Q526 -208 540 -170 L560 -118 Q568 -100 568 -78 L568 -38 L430 -38 Z" fill="#fff"/>
    <path d="M446 -196 L494 -196 Q512 -194 522 -170 L534 -140 L446 -140 Z" fill="#a9d4f0"/>
    <rect x="430" y="-92" width="138" height="54" fill="${C.navy2}"/>
    <rect x="550" y="-110" width="20" height="14" rx="5" fill="${C.amberL}"/>
    ${[96, 218, 486].map((cx) => `<g><circle cx="${cx}" cy="-30" r="40" fill="#161b27"/><circle cx="${cx}" cy="-30" r="20" fill="#cfd6e4"/><circle cx="${cx}" cy="-30" r="6" fill="#161b27"/></g>`).join('')}
  </g>`;

const box = (x, y, w, h, o = {}) => {
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

const pin = (x, y, s = 1, color = C.amber) => `
  <g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="0" cy="4" rx="26" ry="8" fill="#000" opacity=".2"/>
    <path d="M0 0 C-40 -50 -52 -74 -52 -96 A52 52 0 1 1 52 -96 C52 -74 40 -50 0 0Z" fill="${color}"/>
    <circle cx="0" cy="-96" r="20" fill="#fff"/>
  </g>`;

const star = (x, y, r, fill = C.amber) => {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 ? r * 0.45 : r;
    return `${(x + Math.cos(a) * rr).toFixed(1)},${(y + Math.sin(a) * rr).toFixed(1)}`;
  }).join(' ');
  return `<polygon points="${pts}" fill="${fill}"/>`;
};

const coin = (x, y, r, symbol = '£') => `
  <g>
    <circle cx="${x}" cy="${y + 8}" r="${r}" fill="${C.amberD}"/>
    <circle cx="${x}" cy="${y}" r="${r}" fill="${C.amber}"/>
    <circle cx="${x}" cy="${y}" r="${r * 0.78}" fill="none" stroke="${C.amberL}" stroke-width="${r * 0.07}"/>
    <text x="${x}" y="${y + r * 0.34}" text-anchor="middle" font-family="Inter, sans-serif" font-weight="800" font-size="${r * 1.05}" fill="${C.navy}">${symbol}</text>
  </g>`;

const clipboard = (x, y, w, h, rows = 5, done = 3) => `
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

const tapeRoll = (x, y, r) => `
  <g><circle cx="${x}" cy="${y}" r="${r}" fill="${C.amber}"/><circle cx="${x}" cy="${y}" r="${r * 0.58}" fill="${C.cream}"/>
  <circle cx="${x}" cy="${y}" r="${r * 0.58}" fill="none" stroke="${C.cardD}" stroke-width="3" opacity=".5"/>
  <path d="M${x + r * 0.9} ${y + r * 0.5} q${r * 0.7} ${r * 0.7} ${r * 1.5} ${r * 0.7} h${r * 0.9}" stroke="${C.amber}" stroke-width="${r * 0.35}" fill="none" stroke-linecap="round"/></g>`;

const bubbleWrap = (x, y, w, h) => `
  <g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="#bfe5f7" opacity=".85"/>
  ${Array.from({ length: Math.floor(h / 26) }, (_, j) => Array.from({ length: Math.floor(w / 26) }, (_, i) => `<circle cx="${x + 18 + i * 26}" cy="${y + 18 + j * 26}" r="9" fill="#e9f7ff" stroke="#8cc9e8" stroke-width="2"/>`).join('')).join('')}</g>`;

const plate = (x, y, r) => `
  <g><circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="#dbe3ef" stroke-width="4"/>
  <circle cx="${x}" cy="${y}" r="${r * 0.62}" fill="none" stroke="#bcd3ee" stroke-width="3"/></g>`;

const shield = (x, y, s = 1) => `
  <g transform="translate(${x} ${y}) scale(${s})">
    <path d="M0 -150 L110 -112 V-30 C110 40 60 86 0 114 C-60 86 -110 40 -110 -30 V-112Z" fill="${C.navy2}"/>
    <path d="M0 -132 L94 -100 V-30 C94 30 52 70 0 94 C-52 70 -94 30 -94 -30 V-100Z" fill="${C.navy3}"/>
    <path d="M-44 -22 l30 32 l62 -70" stroke="${C.amber}" stroke-width="22" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </g>`;

const frame = (W, H, inner, extraDefs = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${extraDefs}${inner}</svg>`;

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
  <g transform="translate(70 90)"><rect width="84" height="84" rx="22" fill="${C.amber}"/><path d="M24 58 V30 L42 46 L60 30 V58" stroke="${C.navy}" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>
  <text x="176" y="148" font-family="Inter, sans-serif" font-weight="800" font-size="54" fill="#fff">Movera</text>
  <text x="70" y="270" font-family="Inter, sans-serif" font-weight="800" font-size="62" fill="#fff">Stress-free removals</text>
  <text x="70" y="342" font-family="Inter, sans-serif" font-weight="800" font-size="62" fill="${C.amber}">across the UK</text>
  <text x="70" y="404" font-family="Inter, sans-serif" font-weight="500" font-size="28" fill="#c9d6ee">House · Flat · Office · City-to-city</text>`);

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

// Logo mark (SVG + PNG for schema) and favicon
const mark = (s) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 96 96"><rect width="96" height="96" rx="24" fill="${C.navy}"/><path d="M26 66 V32 L48 52 L70 32 V66" stroke="${C.amber}" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
writeFileSync('public/favicon.svg', mark(96));
await sharp(Buffer.from(mark(512))).png().toFile('public/logo.png');
await sharp(Buffer.from(mark(180))).png().toFile('public/apple-touch-icon.png');
console.log('done');
