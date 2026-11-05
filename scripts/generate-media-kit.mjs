/**
 * Builds the MovingPal social media kit into docs/media-kit/.
 *   Run:  npm run media-kit
 *
 * Output: profile photos, LinkedIn + Facebook banners, 10 launch posts in the right size for LinkedIn, Facebook and
 * Instagram, and CAPTIONS.md. Everything is original vector artwork drawn from the same brand mark, colours and
 * font as the website (scripts/lib/art.mjs), so it is licence-free and always matches the logo.
 * Post wording lives in scripts/media-kit-posts.mjs.
 */
import sharp from 'sharp';
import { mkdirSync, writeFileSync, copyFileSync, existsSync } from 'node:fs';
import { C, MARK_ASPECT, markEl, outline, textWidth, skyline, road, van, house, box, pin, coin, clipboard, frame } from './lib/art.mjs';
import { posts, SITE, EMAIL } from './media-kit-posts.mjs';

const OUT = 'docs/media-kit';
const dirs = { profile: `${OUT}/1-profile-photos`, banners: `${OUT}/2-banners`, li: `${OUT}/3-posts/linkedin-1200x627`, fb: `${OUT}/3-posts/facebook-1080x1080`, ig: `${OUT}/3-posts/instagram-1080x1350` };
Object.values(dirs).forEach((d) => mkdirSync(d, { recursive: true }));
const save = (svg, file) => sharp(Buffer.from(svg), { density: 72 }).png({ compressionLevel: 9 }).toFile(file);

// ---------- text helpers ----------
const fit = (text, maxW, maxSize, ls = -0.03) => Math.min(maxSize, Math.floor((maxW / textWidth(text, 100, 800, ls)) * 100));
const txt = (t, x, y, size, fill, ls = -0.03, anchor = 'start', weight = 800) => {
  const w = textWidth(t, size, weight, ls);
  return outline(t, anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x, y, size, fill, weight, ls);
};

// ---------- themes ----------
const TH = {
  navy: { bg: C.navy, text: '#ffffff', sub: '#c9d6ee', kicker: C.amber, accent: C.amber, panel: '#14325f', panelText: '#ffffff', sceneBg: '#10294f', skyA: '#173a6b', skyB: '#1d4a85', lock: 'dark', houseRoof: '#1d4a85' },
  light: { bg: '#f4f7fc', text: C.navy, sub: '#4a5873', kicker: '#b36200', accent: '#b36200', panel: '#ffffff', panelText: C.navy, sceneBg: '#e6edf8', skyA: '#d3def0', skyB: '#b6c8e4', lock: 'light', houseRoof: C.navy2 },
  amber: { bg: C.amber, text: C.navy, sub: '#3a2905', kicker: C.navy, accent: C.navy, panel: C.navy, panelText: '#ffffff', sceneBg: '#fbd486', skyA: '#f8bd57', skyB: '#f3a92d', lock: 'pill', houseRoof: C.navy2 },
};

// Logo lockup: mark + "MovingPal". mode: 'dark' (on navy), 'light' (on white) or 'pill' (white pill, for amber).
function lockup(x, cy, size, mode) {
  const markH = size * 1.1, mW = markH * MARK_ASPECT, gap = size * 0.2;
  const w1 = textWidth('Moving', size), w2 = textWidth('Pal', size), base = cy + size * 0.36;
  const dark = mode === 'dark';
  const inner = `${markEl(x, cy - markH / 2, markH, dark ? { onDark: true } : undefined)}${outline('Moving', x + mW + gap, base, size, dark ? '#fff' : C.navy)}${outline('Pal', x + mW + gap + w1, base, size, dark ? C.amber : '#b36200')}`;
  const w = mW + gap + w1 + w2;
  if (mode !== 'pill') return { svg: inner, w };
  const p = size * 0.34;
  return { svg: `<rect x="${x - p}" y="${cy - markH / 2 - p * 0.8}" width="${w + 2 * p}" height="${markH + p * 1.6}" rx="${(markH + p * 1.6) / 2}" fill="#fff"/>${inner}`, w };
}

// ---------- art panels for posts ----------
let uid = 0;
const panel = (b, t, fill = t.sceneBg) => `<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="30" fill="${fill}"/>`;
const clipped = (b, inner) => { const id = `kc${++uid}`; return `<clipPath id="${id}"><rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="30"/></clipPath><g clip-path="url(#${id})">${inner}</g>`; };

function scene(b, t, withVan = true) {
  const ground = b.y + b.h - Math.max(34, b.h * 0.15);
  const layers = `<g transform="translate(${b.x} 0)">${skyline(b.w, ground, { seed: 5, color: t.skyA, minH: b.h * 0.34, maxH: b.h * 0.7, minW: 50, maxW: 100 })}${skyline(b.w, ground, { seed: 13, color: t.skyB, minH: b.h * 0.18, maxH: b.h * 0.42, minW: 44, maxW: 90 })}</g>`;
  const rd = `<g transform="translate(${b.x} 0)">${road(b.w, ground - 4, b.y + b.h - ground + 8)}</g>`;
  let v = '';
  if (withVan) { const s = Math.min(b.w / 450, b.h / 250); v = van(b.x + (b.w - 392 * s) / 2, ground + 10 * s, s); }
  return clipped(b, panel(b, t) + layers + rd + v);
}

function sceneHouse(b, t) {
  const ground = b.y + b.h - Math.max(30, b.h * 0.13), s = Math.min(b.w / 520, b.h / 300);
  const grass = `<rect x="${b.x}" y="${ground}" width="${b.w}" height="${b.h}" fill="${t.lock === 'light' ? '#8fcf9e' : '#2f8a5c'}"/>`;
  const bx = b.x + b.w * 0.07, u = 52 * s;
  const boxes = box(bx, ground, u * 1.5, u * 1.1, { label: true }) + box(bx + u * 1.6, ground, u * 1.3, u * 0.95) + box(bx + u * 0.3, ground - u * 1.1, u * 1.2, u * 0.9, { tilt: -3 });
  const h = house(b.x + b.w * 0.66, ground, 1.45 * s, C.cream, t.houseRoof);
  const p = pin(b.x + b.w * 0.66, ground - 1.45 * s * 200 - 12, 0.5 * s);
  return clipped(b, panel(b, t) + grass + boxes + h + p);
}

function sceneCoin(b, t) {
  const r = Math.min(b.w * 0.26, b.h * 0.36), cx = b.x + b.w * 0.3, cy = b.y + b.h * 0.5;
  const cw = Math.min(b.w * 0.34, b.h * 0.7), ch = Math.min(b.h * 0.86, cw * 1.25);
  return clipped(b, panel(b, t) + coin(cx + r * 0.25, cy + r * 0.45, r * 0.42) + coin(cx, cy, r) + clipboard(b.x + b.w - cw - b.w * 0.07, b.y + (b.h - ch) / 2 + 10, cw, ch, 4, 4));
}

function sceneBoxes(b, t) {
  const ground = b.y + b.h - Math.max(28, b.h * 0.1), u = Math.min(b.w / 4.6, b.h / 3.3), cx = b.x + b.w / 2;
  const row = (n, y, w, h, o = {}) => Array.from({ length: n }, (_, i) => box(cx - (n * w) / 2 + i * w + (o.gap || 0) * (i - (n - 1) / 2), y, w - 4, h, { label: i === 0 && o.label })).join('');
  const floor = `<rect x="${b.x}" y="${ground}" width="${b.w}" height="${b.h}" fill="${t.lock === 'light' ? '#cdd9ec' : t.lock === 'pill' ? '#f0a420' : '#0d2447'}"/>`;
  return clipped(b, panel(b, t) + floor + row(3, ground, u * 1.35, u * 1.0, { label: true }) + row(2, ground - u * 1.0, u * 1.35, u * 0.95) + row(1, ground - u * 1.95, u * 1.35, u * 0.9));
}

function sceneClipboard(b, t) {
  const ch = b.h * 0.9, cw = Math.min(b.w * 0.5, ch * 0.78), cx = b.x + (b.w - cw) / 2;
  const u = Math.min(b.w / 8, b.h / 4.5), gy = b.y + b.h - 14;
  return clipped(b, panel(b, t) + clipboard(cx, b.y + (b.h - ch) / 2 + 14, cw, ch - 10, 5, 3) + box(b.x + b.w * 0.06, gy, u * 1.7, u * 1.2, { label: true }) + box(b.x + b.w * 0.94 - u * 1.5, gy, u * 1.5, u * 1.1));
}

function sceneRoute(b, t, spec) {
  const ax = b.x + b.w * 0.22, bx = b.x + b.w * 0.78, y = b.y + b.h * 0.64, top = b.y + b.h * 0.12;
  const arc = `<path d="M${ax} ${y} Q${(ax + bx) / 2} ${top - b.h * 0.2} ${bx} ${y}" fill="none" stroke="${C.amber}" stroke-width="${Math.max(5, b.h * 0.018)}" stroke-dasharray="2 16" stroke-linecap="round"/>`;
  const sc = Math.min(b.w / 520, b.h / 300);
  const lab = (name, x) => txt(name.toUpperCase(), x, y + 52 * sc + 22, Math.max(18, 24 * sc), t.text, 0.06, 'middle');
  return clipped(b, panel(b, t) + `<g opacity=".5">${txt('', 0, 0, 10, t.text)}</g>` + arc + pin(ax, y, 0.62 * sc * 1.3) + pin(bx, y, 0.62 * sc * 1.3, '#22a06b') + lab(spec.routeFrom, ax) + lab(spec.routeTo, bx));
}

function sceneList(b, t, spec) {
  const n = spec.list.length, padx = Math.max(28, b.w * 0.05), padY = Math.max(14, b.h * 0.05), rowH = (b.h - padY * 2) / n;
  const dark = t.lock !== 'light';
  const bg = `<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="30" fill="${t.panel}"${t.lock === 'light' ? ' stroke="#d5deec" stroke-width="2"' : ''}/>`;
  const ink = t.panelText, dot = Math.min(rowH * 0.62, 70), tx = b.x + padx + dot + 24, maxW = b.w - (tx - b.x) - padx;
  const size = Math.min(Math.min(...spec.list.map((s) => fit(s, maxW, 46, -0.02))), rowH * 0.42);
  const rows = spec.list.map((s, i) => {
    const cy = b.y + padY + rowH * i + rowH / 2, cx = b.x + padx + dot / 2;
    const marker = spec.listStyle === 'steps'
      ? `<circle cx="${cx}" cy="${cy}" r="${dot / 2}" fill="${dark && t.lock === 'dark' ? C.amber : C.amber}"/>${txt(String(i + 1), cx, cy + dot * 0.2, dot * 0.58, C.navy, -0.02, 'middle')}`
      : `<circle cx="${cx}" cy="${cy}" r="${dot / 2}" fill="${C.amber}"/><path d="M${cx - dot * 0.2} ${cy + dot * 0.02} l${dot * 0.14} ${dot * 0.16} l${dot * 0.26} ${-dot * 0.32}" fill="none" stroke="${C.navy}" stroke-width="${dot * 0.11}" stroke-linecap="round" stroke-linejoin="round"/>`;
    const sep = i < n - 1 ? `<rect x="${b.x + padx}" y="${cy + rowH / 2}" width="${b.w - padx * 2}" height="2" fill="${ink}" opacity=".14"/>` : '';
    return marker + txt(s, tx, cy + size * 0.34, size, ink, -0.02) + sep;
  }).join('');
  return bg + rows;
}

const ART = { van: (b, t) => scene(b, t), house: sceneHouse, coin: sceneCoin, boxes: sceneBoxes, clipboard: sceneClipboard, route: sceneRoute, list: sceneList };

// ---------- one post, any size ----------
function post(spec, W, H) {
  const t = TH[spec.theme], land = W > H * 1.4, portrait = H > W * 1.2, pad = Math.round(W * (land ? 0.05 : 0.065));
  const lock = lockup(pad + (t.lock === 'pill' ? 20 : 0), pad + (land ? 18 : 28), land ? 30 : 38, t.lock);
  const kSize = land ? 22 : 28, kY = pad + (land ? 100 : 150);
  const artX = land && spec.art === 'list' ? 0.47 : 0.575;
  const textW = land ? W * (artX - 0.03) - pad : W - 2 * pad;
  const footY = H - pad + 6, urlSize = land ? 28 : 34;

  // headline: shrink until the art area has enough room (portrait / square)
  let hs = land ? 74 : portrait ? 108 : 96;
  const longest = (s) => Math.min(...spec.headline.map((l) => fit(l, textW, s)));
  const subLines = spec.sub || [];
  let layout;
  for (; hs >= 52; hs -= 4) {
    const size = longest(hs), step = size * 1.06;
    const first = kY + 26 + size * 0.82, last = first + step * (spec.headline.length - 1);
    const subSize = land ? 28 : 36, subEnd = subLines.length ? last + 34 + subSize + (subLines.length - 1) * (subSize * 1.3) : last;
    layout = { size, step, first, last, subSize, subEnd };
    if (land) break;
    const artTop = subEnd + 40, artBottom = footY - urlSize - 36;
    if (artBottom - artTop >= H * (spec.art === 'list' ? 0.42 : 0.35)) break;
  }
  const { size, step, first, subSize, subEnd } = layout;
  const head = spec.headline.map((l, i) => txt(l, pad, first + step * i, size, t.text)).join('');
  const sub = subLines.map((l, i) => txt(l, pad, layout.last + 34 + subSize + i * subSize * 1.3, subSize, t.sub, -0.01, 'start', 600)).join('');
  const kick = txt(spec.kicker, pad, kY, kSize, t.kicker, 0.14);
  const bar = `<rect x="${pad}" y="${kY - kSize - 22}" width="56" height="6" rx="3" fill="${spec.theme === 'amber' ? C.navy : C.amber}"/>`;

  const box_ = land
    ? { x: Math.round(W * artX), y: pad + 6, w: W - pad - Math.round(W * artX), h: H - pad * 2 - 20 }
    : { x: pad, y: Math.round(subEnd + 44), w: W - 2 * pad, h: Math.round(footY - urlSize - 38 - (subEnd + 44)) };
  const art = ART[spec.art](box_, t, spec);
  const foot = `${txt(SITE, pad, footY, urlSize, t.accent === C.amber ? C.amber : t.text, -0.01)}`;
  const bg = `<rect width="${W}" height="${H}" fill="${t.bg}"/>`;
  return frame(W, H, `${bg}${lock.svg}${bar}${kick}${head}${sub}${art}${foot}`);
}

// ---------- banners ----------
function banner(W, H, c) {
  const ground = H - c.road;
  const sky = `${skyline(W, ground, { seed: 5, color: '#14325f', minH: H * 0.22, maxH: H * 0.5, minW: 60, maxW: 130 })}${skyline(W, ground, { seed: 13, color: '#1d4a85', minH: H * 0.1, maxH: H * 0.28, minW: 50, maxW: 110 })}`;
  const rd = `${road(W, ground, c.road)}<rect x="0" y="${ground - 5}" width="${W}" height="5" fill="${C.amber}"/>`;
  const v = van(c.vanX, ground + c.road * 0.28, c.vanS);
  const lines = c.lines.map(([a, b], i) => {
    const y = c.headY + i * c.headSize * 1.08, wa = textWidth(a, c.headSize);
    return outline(a, c.textX, y, c.headSize, '#ffffff') + (b ? outline(b, c.textX + wa, y, c.headSize, C.amber) : '');
  }).join('');
  const subY = c.headY + (c.lines.length - 1) * c.headSize * 1.08 + c.subSize * 1.9;
  const sub = txt(c.sub, c.textX, subY, c.subSize, C.amber, 0.12) + txt(SITE, c.textX, subY + c.subSize * 1.9, c.subSize * 1.15, '#c9d6ee', -0.01, 'start', 600);
  return frame(W, H, `<rect width="${W}" height="${H}" fill="${C.navy}"/>${sky}${rd}${v}${lines}${c.hideSub ? '' : sub}`);
}

function bannerOneLine(W, H, c) {
  const ground = H - c.road;
  const sky = `${skyline(W, ground, { seed: 5, color: '#14325f', minH: H * 0.25, maxH: H * 0.55, minW: 40, maxW: 90 })}`;
  const rd = `${road(W, ground, c.road)}<rect x="0" y="${ground - 3}" width="${W}" height="3" fill="${C.amber}"/>`;
  const v = van(c.vanX, ground + c.road * 0.25, c.vanS);
  const a = 'Moving made ', b = 'simple', d = ', anywhere in the UK';
  const wa = textWidth(a, c.headSize), wb = textWidth(b, c.headSize);
  const head = outline(a, c.textX, c.headY, c.headSize, '#fff') + outline(b, c.textX + wa, c.headY, c.headSize, C.amber) + outline(d, c.textX + wa + wb, c.headY, c.headSize, '#fff');
  const sub = txt('HOUSE · FLAT · OFFICE · CITY-TO-CITY   |   ' + SITE.toUpperCase(), c.textX, c.headY + c.subSize * 2.1, c.subSize, '#c9d6ee', 0.1, 'start', 600);
  return frame(W, H, `<rect width="${W}" height="${H}" fill="${C.navy}"/>${sky}${rd}${v}${head}${sub}`);
}

// ---------- profile photos ----------
const profile = (size, mode) => {
  const mh = size * 0.58, mw = mh * MARK_ASPECT, dark = mode === 'navy';
  return frame(size, size, `<rect width="${size}" height="${size}" fill="${dark ? C.navy : '#ffffff'}"/>${markEl((size - mw) / 2, (size - mh) / 2, mh, dark ? { onDark: true } : undefined)}`);
};

// ---------- render everything ----------
await save(profile(1080, 'white'), `${dirs.profile}/linkedin-facebook-instagram-profile-white-1080.png`);
await save(profile(1080, 'navy'), `${dirs.profile}/linkedin-facebook-instagram-profile-navy-1080.png`);
if (existsSync('docs/brand/movingpal-profile-1024.png')) copyFileSync('docs/brand/movingpal-profile-1024.png', `${dirs.profile}/whatsapp-profile-1024.png`);

await save(banner(1584, 396, { road: 44, textX: 400, headY: 168, headSize: 64, lines: [['Moving made ', 'simple,'], ['anywhere in the UK', '']], subSize: 24, sub: 'HOUSE  ·  FLAT  ·  OFFICE  ·  CITY-TO-CITY', vanX: 1120, vanS: 0.9 }), `${dirs.banners}/linkedin-personal-banner-1584x396.png`);
await save(bannerOneLine(1128, 191, { road: 26, textX: 232, headY: 82, headSize: 40, subSize: 14, vanX: 880, vanS: 0.34 }), `${dirs.banners}/linkedin-company-banner-1128x191.png`);
await save(banner(1640, 624, { road: 60, textX: 330, headY: 268, headSize: 76, lines: [['Moving made ', 'simple,'], ['anywhere in the UK', '']], subSize: 28, sub: 'HOUSE  ·  FLAT  ·  OFFICE  ·  CITY-TO-CITY', vanX: 1010, vanS: 0.95 }), `${dirs.banners}/facebook-cover-1640x624.png`);

for (const p of posts) {
  await save(post(p, 1200, 627), `${dirs.li}/${p.id}.png`);
  await save(post(p, 1080, 1080), `${dirs.fb}/${p.id}.png`);
  await save(post(p, 1080, 1350), `${dirs.ig}/${p.id}.png`);
}

// ---------- captions document ----------
const sched = ['Day 1', 'Day 3', 'Day 5', 'Day 7', 'Day 9', 'Day 11', 'Day 13', 'Day 15', 'Day 17', 'Day 19'];
let md = `# MovingPal: first 10 posts for every platform\n\nTen posts, each with a design (in \`3-posts/\`) and a caption written for LinkedIn, Facebook and Instagram. Suggested rhythm: one post every two days, starting with the launch post.\n\n**Before you post**\n- Instagram does not make links clickable in captions: put ${SITE}/get-a-quote/ in your bio and keep "link in our bio".\n- Add your website and email (${EMAIL}) to each profile's contact details.\n- Everything here only claims what the website already promises. Do not add numbers, years, awards, insurance cover or reviews unless they are true and you can prove them.\n- Each design has alt text below: paste it into the image's alt-text box (LinkedIn, Facebook and Instagram all have one).\n\n---\n\n`;
posts.forEach((p, i) => {
  md += `## Post ${i + 1}: ${p.title}  (${sched[i]})\n\nFiles: \`${p.id}.png\` in \`linkedin-1200x627\`, \`facebook-1080x1080\` and \`instagram-1080x1350\`.\n\n**Alt text:** ${p.alt}\n\n### LinkedIn\n\`\`\`\n${p.li}\n\`\`\`\n\n### Facebook\n\`\`\`\n${p.fb}\n\`\`\`\n\n### Instagram\n\`\`\`\n${p.ig}\n\`\`\`\n\n---\n\n`;
});
writeFileSync(`${OUT}/CAPTIONS.md`, md);

writeFileSync(`${OUT}/README.md`, `# MovingPal media kit\n\n| Folder | What | Where to use it |\n|---|---|---|\n| \`1-profile-photos/\` | Logo-mark profile photos (white and navy) at 1080x1080, plus the detailed round WhatsApp badge | LinkedIn, Facebook, Instagram profile picture (all show it in a circle: the mark sits safely inside); WhatsApp Business |\n| \`2-banners/\` | LinkedIn personal banner 1584x396, LinkedIn company-page banner 1128x191, Facebook cover 1640x624 | LinkedIn / Facebook cover images. The left side is kept clear for the profile photo; on phones Facebook crops the sides, so the key content sits in the middle |\n| \`3-posts/\` | 10 posts in 3 sizes: LinkedIn 1200x627, Facebook 1080x1080, Instagram 1080x1350 | The first ten posts. Wording in \`CAPTIONS.md\` |\n\nInstagram has no banner image, so it uses a profile photo only.\n\nRegenerate everything with \`npm run media-kit\` (edit wording in \`scripts/media-kit-posts.mjs\`).\n`);
console.log('media kit done:', posts.length, 'posts x 3 sizes');
