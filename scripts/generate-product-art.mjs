// Generates the art-directed product illustrations used by the seed catalog.
// Run: node scripts/generate-product-art.mjs
// Output: public/products/<slug>-<n>.svg  (3 images per product)
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { PRODUCT_ART } from "./product-art-spec.mjs";

const OUT = join(process.cwd(), "public", "products");
mkdirSync(OUT, { recursive: true });

const W = 800;
const H = 1000;

/* ---------------------------------------------------------- helpers */
let seed = 1;
const rand = () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};
const shade = (hex, amt) => {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) + amt, g = ((n >> 8) & 255) + amt, b = (n & 255) + amt;
  r = Math.max(0, Math.min(255, r)); g = Math.max(0, Math.min(255, g)); b = Math.max(0, Math.min(255, b));
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};
let uid = 0;
const id = (p) => `${p}${++uid}`;

const defs = () => `
<defs>
  <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#f6e3a1"/><stop offset=".45" stop-color="#c9a14a"/><stop offset=".7" stop-color="#e9cf7f"/><stop offset="1" stop-color="#9c7a2e"/>
  </linearGradient>
  <linearGradient id="goldV" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#f3dc92"/><stop offset=".5" stop-color="#c9a14a"/><stop offset="1" stop-color="#8f6d25"/>
  </linearGradient>
  <radialGradient id="glow" cx=".5" cy=".5" r=".5">
    <stop offset="0" stop-color="#fff6d8" stop-opacity=".95"/><stop offset=".4" stop-color="#ffd27a" stop-opacity=".45"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="glass" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".25" stop-color="#fff" stop-opacity=".08"/><stop offset=".8" stop-color="#fff" stop-opacity=".05"/><stop offset="1" stop-color="#fff" stop-opacity=".35"/>
  </linearGradient>
  <filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="18"/></filter>
  <filter id="soft2" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"/></filter>
  <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .05 0"/></filter>
</defs>`;

/* ---------------------------------------------------------- scenery */
function backdrop(bg, floor, variant) {
  const g = id("bg");
  const spot = variant === 2 ? 0.32 : 0.5;
  return `
  <radialGradient id="${g}" cx="${spot}" cy=".38" r=".85">
    <stop offset="0" stop-color="${shade(bg, 26)}"/><stop offset=".6" stop-color="${bg}"/><stop offset="1" stop-color="${shade(bg, -22)}"/>
  </radialGradient>
  <rect width="${W}" height="${H}" fill="url(#${g})"/>
  <path d="M0 ${H * 0.78} Q ${W / 2} ${H * 0.74} ${W} ${H * 0.78} L ${W} ${H} L 0 ${H} Z" fill="${floor}" opacity=".9"/>
`;
}
const floorShadow = (cx, cy, rx, ry = 26, o = 0.28) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#2a1418" opacity="${o}" filter="url(#soft)"/>`;

function confetti(n, palette) {
  let s = "";
  for (let i = 0; i < n; i++) {
    const x = rand() * W, y = rand() * H * 0.72, c = palette[i % palette.length];
    const r = rand() * 360;
    s += rand() > 0.5
      ? `<rect x="${x}" y="${y}" width="${8 + rand() * 8}" height="${4 + rand() * 4}" rx="1.5" fill="${c}" transform="rotate(${r} ${x} ${y})" opacity=".85"/>`
      : `<circle cx="${x}" cy="${y}" r="${2.5 + rand() * 4}" fill="${c}" opacity=".8"/>`;
  }
  return s;
}
function petals(n, color) {
  let s = "";
  for (let i = 0; i < n; i++) {
    const x = 40 + rand() * (W - 80), y = H * 0.8 + rand() * H * 0.16, r = rand() * 360;
    s += `<path d="M${x} ${y} q 12 -16 26 0 q -12 14 -26 0z" fill="${shade(color, Math.round(rand() * 30 - 15))}" transform="rotate(${r} ${x} ${y})" opacity=".9"/>`;
  }
  return s;
}
function sparkles(n) {
  let s = "";
  for (let i = 0; i < n; i++) {
    const x = rand() * W, y = rand() * H * 0.7, k = 6 + rand() * 10;
    s += `<path d="M${x} ${y - k} L${x + k * 0.22} ${y - k * 0.22} L${x + k} ${y} L${x + k * 0.22} ${y + k * 0.22} L${x} ${y + k} L${x - k * 0.22} ${y + k * 0.22} L${x - k} ${y} L${x - k * 0.22} ${y - k * 0.22}Z" fill="#fff4c9" opacity="${0.5 + rand() * 0.5}"/>`;
  }
  return s;
}

/* ---------------------------------------------------------- flowers */
function rose(x, y, r, c) {
  const d = shade(c, -45), l = shade(c, 28);
  return `<g>
    <circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>
    <path d="M${x - r * 0.95} ${y + r * 0.1} Q ${x - r * 0.6} ${y + r * 1.05} ${x + r * 0.2} ${y + r * 0.92} Q ${x + r * 0.85} ${y + r * 0.7} ${x + r * 0.95} ${y + r * 0.05}" fill="none" stroke="${d}" stroke-width="${r * 0.12}" stroke-linecap="round" opacity=".55"/>
    <path d="M${x - r * 0.62} ${y - r * 0.15} Q ${x - r * 0.4} ${y + r * 0.62} ${x + r * 0.32} ${y + r * 0.48} Q ${x + r * 0.7} ${y + r * 0.2} ${x + r * 0.55} ${y - r * 0.35}" fill="none" stroke="${d}" stroke-width="${r * 0.1}" stroke-linecap="round" opacity=".6"/>
    <path d="M${x - r * 0.3} ${y - r * 0.3} Q ${x - r * 0.25} ${y + r * 0.25} ${x + r * 0.22} ${y + r * 0.12} Q ${x + r * 0.38} ${y - r * 0.18} ${x + r * 0.05} ${y - r * 0.38} Q ${x - r * 0.12} ${y - r * 0.12} ${x + r * 0.05} ${y}" fill="none" stroke="${d}" stroke-width="${r * 0.09}" stroke-linecap="round" opacity=".75"/>
    <ellipse cx="${x - r * 0.35}" cy="${y - r * 0.45}" rx="${r * 0.32}" ry="${r * 0.18}" fill="${l}" opacity=".45" transform="rotate(-30 ${x} ${y})"/>
  </g>`;
}
function hydrangea(x, y, r, c) {
  let s = `<circle cx="${x}" cy="${y}" r="${r}" fill="${shade(c, -18)}"/>`;
  for (let i = 0; i < 22; i++) {
    const a = rand() * Math.PI * 2, d = rand() * r * 0.8;
    const px = x + Math.cos(a) * d, py = y + Math.sin(a) * d;
    s += `<g transform="translate(${px} ${py}) rotate(${rand() * 90})"><path d="M0 -7 L5 0 L0 7 L-5 0Z M-7 0 L0 -5 L7 0 L0 5Z" fill="${shade(c, Math.round(rand() * 30))}"/><circle r="1.6" fill="${shade(c, -40)}"/></g>`;
  }
  return s;
}
function babysBreath(x, y, n, spread) {
  let s = "";
  for (let i = 0; i < n; i++) {
    const px = x + (rand() - 0.5) * spread, py = y + (rand() - 0.5) * spread * 0.6;
    s += `<circle cx="${px}" cy="${py}" r="${2 + rand() * 3}" fill="#fffaf2"/>`;
  }
  return s;
}
function leaf(x, y, len, ang, c = "#3f6b45") {
  return `<path d="M${x} ${y} q ${len * 0.45} ${-len * 0.35} ${len} 0 q ${-len * 0.45} ${len * 0.35} ${-len} 0z" fill="${c}" transform="rotate(${ang} ${x} ${y})"/>`;
}
function roseCluster(cx, cy, rx, ry, r, colors, opts = {}) {
  let s = "";
  const pts = [];
  for (let row = -4; row <= 4; row++) {
    for (let col = -6; col <= 6; col++) {
      const x = cx + col * r * 1.55 + (row % 2 ? r * 0.78 : 0);
      const y = cy + row * r * 1.3;
      if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1) pts.push([x + (rand() - 0.5) * 6, y + (rand() - 0.5) * 6]);
    }
  }
  pts.sort((a, b) => a[1] - b[1]);
  for (const [x, y] of pts) {
    if (opts.leaves && rand() > 0.7) s += leaf(x - r, y + r * 0.6, r * 1.3, 160 + rand() * 40);
  }
  for (const [x, y] of pts) {
    const c = colors[Math.floor(rand() * colors.length)];
    if (c === "hydrangea") s += hydrangea(x, y, r * 1.15, opts.hydrangea || "#b9d48a");
    else s += rose(x, y, r * (0.92 + rand() * 0.16), c);
  }
  if (opts.breath) s += babysBreath(cx, cy, opts.breath, rx * 1.8);
  return s;
}
function bouquet(o) {
  const cx = 400;
  const paperA = o.paper || "#1d1416", paperB = shade(paperA, 22);
  return `${floorShadow(cx, 820, 170)}
  <g>
    <path d="M${cx - 230} 380 L${cx + 230} 380 L${cx + 40} 790 L${cx - 40} 790Z" fill="${paperB}"/>
    ${roseCluster(cx, 360, 215, 140, o.r || 30, o.colors, { breath: o.breath, leaves: true, hydrangea: o.hydrangea })}
    <path d="M${cx - 250} 420 Q ${cx - 120} 470 ${cx} 455 Q ${cx + 120} 470 ${cx + 250} 420 L ${cx + 50} 800 L ${cx - 50} 800Z" fill="${paperA}"/>
    <path d="M${cx - 250} 420 Q ${cx - 150} 460 ${cx - 60} 458 L ${cx - 30} 800 L${cx - 50} 800Z" fill="${shade(paperA, 14)}" opacity=".8"/>
    <path d="M${cx + 250} 420 Q ${cx + 160} 462 ${cx + 70} 458 L ${cx + 32} 800 L ${cx + 50} 800Z" fill="${shade(paperA, -14)}" opacity=".9"/>
    <path d="M${cx - 60} 458 L${cx - 20} 790" stroke="${shade(paperA, 40)}" stroke-width="2" opacity=".4"/>
    ${bow(cx, 640, 0.9, o.ribbon || "url(#gold)")}
  </g>`;
}
function bow(x, y, s = 1, fill = "url(#gold)") {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M0 0 C -60 -70 -130 -30 -110 10 C -95 40 -40 25 0 0Z" fill="${fill}"/>
    <path d="M0 0 C 60 -70 130 -30 110 10 C 95 40 40 25 0 0Z" fill="${fill}"/>
    <path d="M-6 6 L -50 110 L -28 98 L -14 120 L 4 10Z" fill="${fill}"/>
    <path d="M6 6 L 46 112 L 26 100 L 12 122 L -4 10Z" fill="${fill}"/>
    <path d="M0 0 C -40 -40 -90 -26 -92 4" fill="none" stroke="#000" stroke-opacity=".18" stroke-width="3"/>
    <path d="M0 0 C 40 -40 90 -26 92 4" fill="none" stroke="#000" stroke-opacity=".18" stroke-width="3"/>
    <ellipse cx="0" cy="2" rx="16" ry="13" fill="${fill}" stroke="#000" stroke-opacity=".15"/>
  </g>`;
}
function hatbox(o) {
  const cx = 400, top = 470, bottom = 790, rx = 220, ry = 62;
  const body = o.box || "#f3d6db";
  const clip = id("hb");
  return `${floorShadow(cx, 800, 240)}
  <clipPath id="${clip}"><ellipse cx="${cx}" cy="${top}" rx="${rx + 30}" ry="${ry + 150}"/></clipPath>
  <path d="M${cx - rx} ${top} L${cx - rx} ${bottom} A ${rx} ${ry} 0 0 0 ${cx + rx} ${bottom} L ${cx + rx} ${top}Z" fill="${body}"/>
  <path d="M${cx - rx} ${top} L${cx - rx} ${bottom} A ${rx} ${ry} 0 0 0 ${cx - rx + 70} ${bottom + 44} L ${cx - rx + 70} ${top + 44}Z" fill="#fff" opacity=".18"/>
  <path d="M${cx + rx} ${top} L${cx + rx} ${bottom} A ${rx} ${ry} 0 0 1 ${cx + rx - 90} ${bottom + 50} L ${cx + rx - 90} ${top + 50}Z" fill="#000" opacity=".08"/>
  <path d="M${cx - rx} ${top + 120} A ${rx} ${ry} 0 0 0 ${cx + rx} ${top + 120} L ${cx + rx} ${top + 150} A ${rx} ${ry} 0 0 1 ${cx - rx} ${top + 150}Z" fill="${o.band || "url(#gold)"}"/>
  ${o.label ? `<text x="${cx}" y="${top + 255}" text-anchor="middle" font-family="Georgia, serif" font-size="34" letter-spacing="6" fill="${o.labelColor || "#9c7a2e"}">${o.label}</text>` : ""}
  <ellipse cx="${cx}" cy="${top}" rx="${rx}" ry="${ry}" fill="${shade(body, -30)}"/>
  <g clip-path="url(#${clip})">${roseCluster(cx, top - 30, rx - 6, ry + 70, o.r || 30, o.colors, { breath: o.breath, hydrangea: o.hydrangea })}</g>
  ${o.bow ? bow(cx + 150, top + 135, 0.7, o.bowFill || "url(#gold)") : ""}`;
}
function dome(o) {
  const cx = 400;
  const stem = "#3f6b45";
  let lights = "";
  for (let i = 0; i < 16; i++) {
    const t = i / 15, x = cx - 120 + t * 240 + Math.sin(t * 9) * 30, y = 330 + Math.sin(t * 13) * 120 + t * 220;
    lights += `<circle cx="${x}" cy="${y}" r="18" fill="url(#glow)"/><circle cx="${x}" cy="${y}" r="3.5" fill="#fff3c4"/>`;
  }
  return `${floorShadow(cx, 820, 200)}
  <ellipse cx="${cx}" cy="790" rx="190" ry="40" fill="#3b2418"/>
  <rect x="${cx - 190}" y="740" width="380" height="50" fill="#5a3826"/>
  <ellipse cx="${cx}" cy="740" rx="190" ry="40" fill="#7a4e35"/>
  <ellipse cx="${cx}" cy="738" rx="160" ry="30" fill="#8b5c40"/>
  <path d="M${cx} 735 C ${cx - 6} 640 ${cx + 8} 560 ${cx} 470" stroke="${stem}" stroke-width="10" fill="none"/>
  ${leaf(cx, 620, 90, 200, stem)} ${leaf(cx, 560, 80, -20, "#4f7f55")} ${leaf(cx, 670, 70, -30, "#4f7f55")}
  ${rose(cx, 420, 82, o.colors[0])}
  <path d="M${cx - 170} 740 L ${cx - 170} 360 A 170 170 0 0 1 ${cx + 170} 360 L ${cx + 170} 740Z" fill="url(#glass)" stroke="#fff" stroke-opacity=".55" stroke-width="3"/>
  <path d="M${cx - 135} 700 L ${cx - 135} 380 A 140 140 0 0 1 ${cx - 40} 240" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="8" stroke-linecap="round"/>
  <circle cx="${cx}" cy="186" r="18" fill="url(#goldV)"/>
  ${o.lights ? lights : ""}`;
}

/* ---------------------------------------------------------- boxes & hampers */
function giftBox(o) {
  const cx = 400, w = 340, h = 280, d = 90, x = cx - w / 2, y = 470;
  const c = o.box || "#151012", rib = o.ribbon || "url(#gold)";
  return `${floorShadow(cx + 30, 790, 230)}
  <path d="M${x} ${y} L ${x + d} ${y - d * 0.6} L ${x + w + d} ${y - d * 0.6} L ${x + w} ${y}Z" fill="${shade(c, 28)}"/>
  <path d="M${x + w} ${y} L ${x + w + d} ${y - d * 0.6} L ${x + w + d} ${y + h - d * 0.6} L ${x + w} ${y + h}Z" fill="${shade(c, -10)}"/>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>
  <rect x="${x - 10}" y="${y - 6}" width="${w + 12}" height="56" fill="${shade(c, 12)}"/>
  <path d="M${x + w + 2} ${y - 6} L ${x + w + d + 8} ${y - d * 0.6 - 6} L ${x + w + d + 8} ${y - d * 0.6 + 50} L ${x + w + 2} ${y + 50}Z" fill="${shade(c, 2)}"/>
  <rect x="${cx - 22}" y="${y - 6}" width="44" height="${h + 6}" fill="${rib}"/>
  <path d="M${x + w + 2} ${y + 110} L ${x + w + d} ${y + 110 - d * 0.6} L ${x + w + d} ${y + 150 - d * 0.6} L ${x + w + 2} ${y + 150}Z" fill="${rib}" opacity=".85"/>
  <rect x="${x}" y="${y + 110}" width="${w}" height="40" fill="${rib}"/>
  <path d="M${cx - 22 + d / 2} ${y - d * 0.3 - 3} L ${cx + 22 + d / 2} ${y - d * 0.3 - 3}" stroke="${rib}" stroke-width="0"/>
  <path d="M${cx - 22} ${y - 6} L ${cx - 22 + d} ${y - d * 0.6 - 6} L ${cx + 22 + d} ${y - d * 0.6 - 6} L ${cx + 22} ${y - 6}Z" fill="${rib}"/>
  <path d="M${x - 10} ${y - 6} L ${x + d - 10} ${y - d * 0.6 - 6} L ${x + w + d + 8} ${y - d * 0.6 - 6}" fill="none" stroke="#fff" stroke-opacity=".15" stroke-width="2"/>
  ${bow(cx + d / 2, y - d * 0.32, 1.1, rib)}
  ${o.tag !== false ? `<g transform="translate(${x + w - 10} ${y + 200}) rotate(-12)"><path d="M0 0 L 70 0 L 92 22 L 70 44 L 0 44Z" fill="#fbf4e6" stroke="#c9a14a" stroke-width="2"/><circle cx="78" cy="22" r="5" fill="none" stroke="#c9a14a" stroke-width="2"/><path d="M28 16 c -6 -6 -14 0 -8 7 l 8 8 l 8 -8 c 6 -7 -2 -13 -8 -7z" fill="#b3123a"/></g>` : ""}
  ${o.monogram ? `<text x="${cx}" y="${y + 230}" text-anchor="middle" font-family="Georgia, serif" font-size="30" letter-spacing="8" fill="#c9a14a">${o.monogram}</text>` : ""}`;
}
function bottle(x, y, s, c = "#2b3d2a", label = "#f3e6c8") {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M-22 0 L -22 -110 Q -22 -140 -8 -150 L -8 -200 L 8 -200 L 8 -150 Q 22 -140 22 -110 L 22 0Z" fill="${c}"/>
    <rect x="-9" y="-212" width="18" height="22" fill="url(#gold)"/>
    <rect x="-22" y="-90" width="44" height="50" fill="${label}"/>
    <rect x="-14" y="-78" width="28" height="4" fill="#9c7a2e"/><rect x="-10" y="-66" width="20" height="3" fill="#9c7a2e"/>
    <path d="M-14 -10 L -14 -105" stroke="#fff" stroke-opacity=".25" stroke-width="5"/></g>`;
}
function jar(x, y, s, c, lid = "url(#gold)") {
  return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-34" y="-90" width="68" height="90" rx="12" fill="${c}"/><rect x="-36" y="-108" width="72" height="22" rx="4" fill="${lid}"/><rect x="-26" y="-62" width="52" height="30" fill="#fff8ec" opacity=".9"/><path d="M-24 -80 L -24 -12" stroke="#fff" stroke-opacity=".3" stroke-width="5"/></g>`;
}
function hamper(o) {
  const cx = 400, top = 520, bottom = 790;
  const pat = id("weave");
  const wc = o.wicker || "#b88a56";
  const items = (o.items || ["bottle", "jar", "flowers", "box"]).map((it, i) => {
    const x = cx - 170 + i * 110;
    if (it === "bottle") return bottle(x + 20, top + 30, 1.05, o.bottle || "#3a2330");
    if (it === "jar") return jar(x, top + 20, 1.1, o.jar || "#e8b9c2");
    if (it === "flowers") return roseCluster(x + 10, top - 70, 70, 60, 22, o.colors || ["#e7a1ae", "#f6e3e6"], { breath: 20 });
    if (it === "box") return `<rect x="${x - 50}" y="${top - 90}" width="100" height="110" rx="6" fill="${o.box || "#1d1416"}"/><rect x="${x - 8}" y="${top - 90}" width="16" height="110" fill="url(#gold)"/>`;
    if (it === "towel") return `<rect x="${x - 60}" y="${top - 70}" width="120" height="90" rx="30" fill="${o.towel || "#fbf7ef"}"/><rect x="${x - 60}" y="${top - 40}" width="120" height="10" fill="#e8d6c2"/>`;
    if (it === "candle") return `<rect x="${x - 36}" y="${top - 80}" width="72" height="100" rx="10" fill="#f4ece0"/><rect x="${x - 36}" y="${top - 46}" width="72" height="34" fill="#1d1416"/><circle cx="${x}" cy="${top - 110}" r="28" fill="url(#glow)"/><path d="M${x} ${top - 124} q 9 14 0 24 q -9 -10 0 -24z" fill="#ffcf6a"/>`;
    if (it === "snack") return `<path d="M${x - 46} ${top + 10} L ${x - 40} ${top - 110} L ${x + 40} ${top - 110} L ${x + 46} ${top + 10}Z" fill="${o.snack || "#c94f3d"}"/><rect x="${x - 30}" y="${top - 80}" width="60" height="34" rx="4" fill="#fff4dc"/>`;
    if (it === "cheese") return `<path d="M${x - 60} ${top} L ${x + 60} ${top} L ${x + 60} ${top - 50} L ${x - 60} ${top - 20}Z" fill="#f1c95a"/><circle cx="${x - 20}" cy="${top - 20}" r="7" fill="#d9ab3c"/><circle cx="${x + 25}" cy="${top - 30}" r="5" fill="#d9ab3c"/>`;
    return "";
  }).join("");
  return `${floorShadow(cx, 800, 260)}
  <pattern id="${pat}" width="34" height="22" patternUnits="userSpaceOnUse">
    <rect width="34" height="22" fill="${wc}"/>
    <path d="M0 11 Q 8.5 0 17 11 T 34 11" fill="none" stroke="${shade(wc, -35)}" stroke-width="3"/>
    <path d="M0 22 L 0 0 M17 22 L17 0" stroke="${shade(wc, 25)}" stroke-width="2" opacity=".7"/>
  </pattern>
  <path d="M${cx - 230} ${top - 20} Q ${cx} ${top - 380} ${cx + 230} ${top - 20}" fill="none" stroke="${shade(wc, -20)}" stroke-width="22"/>
  <path d="M${cx - 230} ${top - 20} Q ${cx} ${top - 380} ${cx + 230} ${top - 20}" fill="none" stroke="${shade(wc, 15)}" stroke-width="8" stroke-dasharray="14 10"/>
  ${o.cello ? `<path d="M${cx - 270} ${top} Q ${cx - 300} ${top - 300} ${cx - 40} ${top - 330} L ${cx + 40} ${top - 330} Q ${cx + 300} ${top - 300} ${cx + 270} ${top}Z" fill="#fff" opacity=".12"/>` : ""}
  <g transform="translate(${cx} ${top}) scale(1.35) translate(${-cx} ${-top})">${items}</g>
  <path d="M${cx - 260} ${top} L ${cx + 260} ${top} L ${cx + 210} ${bottom} L ${cx - 210} ${bottom}Z" fill="url(#${pat})"/>
  <path d="M${cx - 260} ${top} L ${cx + 260} ${top} L ${cx + 255} ${top + 30} L ${cx - 255} ${top + 30}Z" fill="${shade(wc, -25)}"/>
  <path d="M${cx - 260} ${top} L ${cx + 260} ${top} L ${cx + 210} ${bottom} L ${cx - 210} ${bottom}Z" fill="url(#glass)" opacity=".25"/>
  ${o.liner ? `<path d="M${cx - 250} ${top + 2} L ${cx - 210} ${top + 70} L ${cx - 160} ${top + 4} L ${cx - 110} ${top + 70} L ${cx - 60} ${top + 4} L ${cx - 10} ${top + 70} L ${cx + 40} ${top + 4} L ${cx + 90} ${top + 70} L ${cx + 140} ${top + 4} L ${cx + 190} ${top + 70} L ${cx + 250} ${top + 2}Z" fill="${o.liner}"/>` : ""}
  ${bow(cx + 190, top + 10, 0.75, o.ribbon || "url(#gold)")}`;
}

/* ---------------------------------------------------------- sweets */
function drips(x, y, w, c) {
  let d = `M${x} ${y}`;
  const n = Math.round(w / 34);
  for (let i = 0; i < n; i++) {
    const sx = x + (i * w) / n, l = 18 + rand() * 46;
    d += ` L${sx + 4} ${y} L${sx + 4} ${y + l} a 10 10 0 0 0 20 0 L${sx + 24} ${y}`;
  }
  d += ` L${x + w} ${y} L${x + w} ${y - 14} L${x} ${y - 14}Z`;
  return `<path d="${d}" fill="${c}"/>`;
}
function cake(o) {
  const cx = 400, c1 = o.sponge || "#f6e5e1", frost = o.frost || "#7a0f24";
  let candles = "";
  for (let i = 0; i < (o.candles || 3); i++) {
    const x = cx - 50 + i * 50;
    candles += `<rect x="${x - 6}" y="330" width="12" height="70" rx="3" fill="${i % 2 ? "#f3d6db" : "url(#goldV)"}"/><circle cx="${x}" cy="312" r="30" fill="url(#glow)"/><path d="M${x} 298 q 10 16 0 28 q -10 -12 0 -28z" fill="#ffc94f"/>`;
  }
  return `${floorShadow(cx, 820, 210)}
  <ellipse cx="${cx}" cy="790" rx="200" ry="26" fill="url(#gold)"/>
  <rect x="${cx - 18}" y="760" width="36" height="34" fill="url(#goldV)"/>
  <ellipse cx="${cx}" cy="760" rx="250" ry="34" fill="url(#gold)"/>
  <rect x="${cx - 210}" y="560" width="420" height="190" rx="14" fill="${c1}"/>
  <rect x="${cx - 210}" y="560" width="70" height="190" fill="#fff" opacity=".18"/>
  ${drips(cx - 210, 574, 420, frost)}
  <rect x="${cx - 210}" y="712" width="420" height="22" fill="${o.trim || "url(#gold)"}" opacity=".95"/>
  <rect x="${cx - 145}" y="400" width="290" height="165" rx="12" fill="${c1}"/>
  ${drips(cx - 145, 414, 290, frost)}
  <rect x="${cx - 145}" y="400" width="50" height="165" fill="#fff" opacity=".18"/>
  ${o.text ? `<text x="${cx}" y="520" text-anchor="middle" font-family="'Brush Script MT', cursive" font-style="italic" font-size="36" fill="${frost}">${o.text}</text>` : ""}
  ${roseCluster(cx + 120, 545, 80, 34, 22, o.roses || ["#9d0f2f", "#b3123a", "#7a0f24"], { breath: 10 })}
  ${roseCluster(cx - 120, 395, 50, 20, 18, o.roses || ["#9d0f2f", "#b3123a"], {})}
  ${candles}
  ${o.topper ? `<text x="${cx}" y="290" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="44" fill="url(#gold)">${o.topper}</text>` : ""}`;
}
function chocolates(o) {
  const cx = 400;
  let t = "";
  const cols = 4, rows = 3, s = 74;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const x = cx - 150 + c * 100 + 50, y = 560 + r * 70;
    const flavors = o.truffles || ["#3b2116", "#5a3324", "#f1e3cf", "#2a160f", "#8a4b2f"];
    const col = flavors[(r * cols + c) % flavors.length];
    t += `<ellipse cx="${x}" cy="${y + 20}" rx="${s / 2}" ry="${s / 4}" fill="url(#gold)"/>
      <circle cx="${x}" cy="${y}" r="${s / 2.6}" fill="${col}"/>
      <path d="M${x - 18} ${y - 4} q 9 -10 18 0 t 18 0" stroke="${col === "#f1e3cf" ? "#8a4b2f" : "#f1e3cf"}" stroke-width="3" fill="none"/>
      <ellipse cx="${x - 9}" cy="${y - 12}" rx="8" ry="4" fill="#fff" opacity=".35"/>`;
  }
  return `${floorShadow(cx, 820, 260)}
  <g transform="rotate(-6 ${cx} 400)"><rect x="${cx - 240}" y="250" width="480" height="270" rx="10" fill="${o.lid || "#1d1416"}"/><rect x="${cx - 240}" y="370" width="480" height="30" fill="url(#gold)"/>
  <text x="${cx}" y="335" text-anchor="middle" font-family="Georgia, serif" font-size="34" letter-spacing="10" fill="url(#gold)">${o.label || "TRUFFES"}</text></g>
  ${bow(cx + 170, 300, 0.6)}
  <path d="M${cx - 250} 520 L ${cx + 250} 520 L ${cx + 270} 800 L ${cx - 270} 800Z" fill="${o.box || "#2a1a1d"}"/>
  <path d="M${cx - 230} 530 L ${cx + 230} 530 L ${cx + 246} 780 L ${cx - 246} 780Z" fill="${shade(o.box || "#2a1a1d", 18)}"/>
  ${t}`;
}
function macarons(o) {
  const cx = 400;
  const colors = o.colors || ["#f3c6cf", "#c9e4c5", "#f7e3a3", "#d9c7f0", "#f5d0b5", "#b9dbe9"];
  let m = "";
  for (let r = 0; r < 2; r++) for (let i = 0; i < 6; i++) {
    const x = cx - 200 + i * 80, y = 600 + r * 110, c = colors[(i + r * 2) % colors.length];
    m += `<g><ellipse cx="${x}" cy="${y + 22}" rx="36" ry="14" fill="${shade(c, -18)}"/><rect x="${x - 36}" y="${y - 2}" width="72" height="24" fill="${shade(c, -10)}"/>
      <rect x="${x - 34}" y="${y - 6}" width="68" height="12" rx="6" fill="#fffaf0"/>
      <ellipse cx="${x}" cy="${y - 6}" rx="36" ry="14" fill="${c}"/><rect x="${x - 36}" y="${y - 26}" width="72" height="20" fill="${c}"/><ellipse cx="${x}" cy="${y - 26}" rx="36" ry="16" fill="${shade(c, 14)}"/>
      <ellipse cx="${x - 12}" cy="${y - 30}" rx="12" ry="4" fill="#fff" opacity=".5"/></g>`;
  }
  return `${floorShadow(cx, 820, 270)}
  <g transform="rotate(4 ${cx} 400)"><rect x="${cx - 260}" y="300" width="520" height="230" rx="16" fill="${o.lid || "#f3d6db"}"/><text x="${cx}" y="440" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="56" fill="#9c7a2e">Paris</text><rect x="${cx - 260}" y="470" width="520" height="16" fill="url(#gold)"/></g>
  <path d="M${cx - 270} 540 L ${cx + 270} 540 L ${cx + 270} 790 L ${cx - 270} 790Z" fill="${shade(o.lid || "#f3d6db", -10)}"/>
  <path d="M${cx - 252} 552 L ${cx + 252} 552 L ${cx + 252} 774 L ${cx - 252} 774Z" fill="#fffaf2"/>
  ${m}`;
}
function strawberries(o) {
  const cx = 400;
  let s = "";
  for (let r = 0; r < 3; r++) for (let i = 0; i < 4; i++) {
    const x = cx - 165 + i * 110 + (r % 2 ? 20 : 0), y = 560 + r * 75;
    const dip = ["#3b2116", "#f1e3cf", "#f3a6b8", "#3b2116"][(i + r) % 4];
    s += `<g transform="rotate(${-15 + rand() * 30} ${x} ${y})">
      <path d="M${x} ${y + 55} C ${x - 50} ${y + 20} ${x - 48} ${y - 40} ${x} ${y - 40} C ${x + 48} ${y - 40} ${x + 50} ${y + 20} ${x} ${y + 55}Z" fill="#c8102e"/>
      <path d="M${x - 44} ${y - 5} C ${x - 40} ${y + 30} ${x - 20} ${y + 48} ${x} ${y + 55} C ${x + 20} ${y + 48} ${x + 40} ${y + 30} ${x + 44} ${y - 5} Q ${x} ${y + 12} ${x - 44} ${y - 5}Z" fill="${dip}"/>
      <path d="M${x - 30} ${y + 10} l 60 -6 M${x - 26} ${y + 24} l 52 -6" stroke="${dip === "#3b2116" ? "#f1e3cf" : "#3b2116"}" stroke-width="3" opacity=".8"/>
      <path d="M${x - 22} ${y - 38} l 10 -16 l 12 12 l 12 -12 l 10 16Z" fill="#3f8f45"/>
      <ellipse cx="${x - 16}" cy="${y - 22}" rx="8" ry="5" fill="#fff" opacity=".35"/></g>`;
  }
  return `${floorShadow(cx, 820, 270)}
  <rect x="${cx - 270}" y="500" width="540" height="300" rx="14" fill="${o.box || "#1d1416"}"/>
  <rect x="${cx - 252}" y="516" width="504" height="268" rx="8" fill="${shade(o.box || "#1d1416", 20)}"/>
  <rect x="${cx - 270}" y="500" width="540" height="20" fill="url(#gold)"/>
  ${s}
  ${bow(cx, 500, 0.8)}`;
}

/* ---------------------------------------------------------- bears & balloons */
function teddy(o, scale = 1, ox = 400, oy = 0) {
  const f = o.fur || "#c8996b", d = shade(f, -35), l = shade(f, 30);
  const heart = o.heart ? `<path d="M0 30 C -80 -30 -50 -95 0 -55 C 50 -95 80 -30 0 30Z" fill="${o.heart}" transform="translate(0 640) scale(2)"/>
      <path d="M-70 560 q 16 -24 44 -10" stroke="#fff" stroke-opacity=".6" stroke-width="6" fill="none" stroke-linecap="round"/>
      ${o.heartText ? `<text x="0" y="650" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="30" fill="#fff">${o.heartText}</text>` : ""}` : "";
  return `<g transform="translate(${ox} ${oy}) scale(${scale})">
    ${floorShadow(0, 830, 220)}
    <ellipse cx="-120" cy="780" rx="80" ry="60" fill="${f}"/><ellipse cx="120" cy="780" rx="80" ry="60" fill="${f}"/>
    <ellipse cx="-128" cy="790" rx="44" ry="36" fill="${l}"/><ellipse cx="128" cy="790" rx="44" ry="36" fill="${l}"/>
    <ellipse cx="0" cy="650" rx="175" ry="175" fill="${f}"/>
    <ellipse cx="0" cy="680" rx="110" ry="120" fill="${l}"/>
    <ellipse cx="-170" cy="590" rx="58" ry="100" fill="${f}" transform="rotate(30 -170 590)"/>
    <ellipse cx="170" cy="590" rx="58" ry="100" fill="${f}" transform="rotate(-30 170 590)"/>
    ${heart}
    <circle cx="-120" cy="250" r="62" fill="${f}"/><circle cx="120" cy="250" r="62" fill="${f}"/>
    <circle cx="-120" cy="250" r="34" fill="${l}"/><circle cx="120" cy="250" r="34" fill="${l}"/>
    <circle cx="0" cy="360" r="150" fill="${f}"/>
    <ellipse cx="0" cy="410" rx="70" ry="54" fill="${l}"/>
    <ellipse cx="0" cy="386" rx="26" ry="19" fill="#2a1a14"/>
    <path d="M0 405 L 0 428 M -24 440 Q 0 456 24 440" stroke="#2a1a14" stroke-width="6" fill="none" stroke-linecap="round"/>
    <circle cx="-55" cy="330" r="14" fill="#1a110d"/><circle cx="55" cy="330" r="14" fill="#1a110d"/>
    <circle cx="-50" cy="325" r="4" fill="#fff"/><circle cx="60" cy="325" r="4" fill="#fff"/>
    <ellipse cx="-95" cy="395" rx="22" ry="12" fill="#f19aae" opacity=".55"/><ellipse cx="95" cy="395" rx="22" ry="12" fill="#f19aae" opacity=".55"/>
    <path d="M-60 500 L -10 520 L -60 545Z M 60 500 L 10 520 L 60 545Z" fill="${o.bowtie || "#b3123a"}"/><circle cx="0" cy="522" r="13" fill="${shade(o.bowtie || "#b3123a", -25)}"/>
    <path d="M-150 300 Q -100 240 -40 230" stroke="${d}" stroke-width="4" fill="none" opacity=".25"/>
  </g>`;
}
function balloon(x, y, r, c, sx = 0) {
  return `<g>
    <path d="M${x} ${y + r * 1.15} Q ${x + sx * 0.4 + 20} ${y + r * 1.15 + 120} ${400 + sx * 0.1} 790" stroke="#c9a14a" stroke-width="2" fill="none" opacity=".8"/>
    <ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 1.15}" fill="${c}"/>
    <path d="M${x - 8} ${y + r * 1.15} L ${x + 8} ${y + r * 1.15} L ${x} ${y + r * 1.15 - 10}Z" fill="${shade(c, -30)}"/>
    <ellipse cx="${x - r * 0.4}" cy="${y - r * 0.45}" rx="${r * 0.22}" ry="${r * 0.34}" fill="#fff" opacity=".45" transform="rotate(-25 ${x} ${y})"/>
  </g>`;
}
function heartBalloon(x, y, s, c) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M0 90 Q 30 240 0 420" stroke="#c9a14a" stroke-width="2" fill="none"/>
    <path d="M0 90 C -150 -10 -90 -140 0 -60 C 90 -140 150 -10 0 90Z" fill="${c}"/>
    <path d="M-70 -50 q 20 -30 50 -10" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round" opacity=".55"/></g>`;
}
function balloons(o) {
  const pal = o.colors || ["#b3123a", "#f3d6db", "url(#gold)", "#1d1416", "#f6e3a1"];
  const spots = [[270, 260, 85], [400, 200, 95], [530, 270, 85], [330, 400, 80], [480, 410, 82], [200, 430, 70], [610, 440, 70]];
  let s = floorShadow(400, 820, 120);
  spots.forEach(([x, y, r], i) => (s += balloon(x, y, r, pal[i % pal.length], x - 400)));
  if (o.foil) s += heartBalloon(400, 330, 0.9, "url(#gold)");
  s += `<path d="M370 790 L 430 790 L 420 740 L 380 740Z" fill="url(#goldV)"/>`;
  if (o.banner) {
    const letters = o.banner.split("");
    letters.forEach((ch, i) => {
      const x = 400 - (letters.length * 46) / 2 + i * 46 + 23;
      s += `<path d="M${x - 20} 600 L ${x + 20} 600 L ${x} 650Z" fill="${i % 2 ? "#f3d6db" : "#1d1416"}"/><text x="${x}" y="625" text-anchor="middle" font-family="Georgia, serif" font-size="20" font-weight="700" fill="${i % 2 ? "#1d1416" : "#f6e3a1"}">${ch}</text>`;
    });
    s += `<path d="M${400 - (letters.length * 46) / 2} 600 Q 400 615 ${400 + (letters.length * 46) / 2} 600" stroke="#c9a14a" stroke-width="2" fill="none"/>`;
  }
  return s;
}

/* ---------------------------------------------------------- personalized */
function jewelry(o) {
  const cx = 400, v = o.velvet || "#7a0f24";
  const metal = o.metal === "silver" ? "#d9dde3" : "url(#gold)";
  return `${floorShadow(cx, 800, 220)}
  <path d="M${cx - 200} 520 L ${cx - 170} 250 L ${cx + 170} 250 L ${cx + 200} 520Z" fill="${shade(v, -25)}"/>
  <path d="M${cx - 180} 505 L ${cx - 155} 270 L ${cx + 155} 270 L ${cx + 180} 505Z" fill="#fbf4e6"/>
  <text x="${cx}" y="330" text-anchor="middle" font-family="Georgia, serif" font-size="22" letter-spacing="6" fill="#9c7a2e">GIFTS &amp; SURPRISES</text>
  <rect x="${cx - 210}" y="520" width="420" height="260" rx="14" fill="${v}"/>
  <rect x="${cx - 190}" y="535" width="380" height="200" rx="12" fill="${shade(v, 18)}"/>
  <rect x="${cx - 210}" y="740" width="420" height="10" fill="url(#gold)"/>
  <path d="M${cx - 120} 560 Q ${cx} 700 ${cx + 120} 560" stroke="${metal}" stroke-width="4" fill="none"/>
  <path d="M${cx} 690 C ${cx - 50} 650 ${cx - 40} 600 ${cx} 625 C ${cx + 40} 600 ${cx + 50} 650 ${cx} 690Z" fill="${metal}" stroke="#7a5a1f" stroke-opacity=".3" transform="translate(0 -6)"/>
  <text x="${cx}" y="652" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="20" fill="${o.metal === "silver" ? "#6b7280" : "#7a5a1f"}">${o.initial || "A"}</text>
  <circle cx="${cx + 14}" cy="618" r="4" fill="#fff"/>
  ${sparkles(6)}`;
}
function frame(o) {
  const cx = 400;
  const fr = o.frame || "url(#gold)";
  const sky = id("sky");
  return `${floorShadow(cx, 810, 220)}
  <linearGradient id="${sky}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${o.sky1 || "#f7b7a3"}"/><stop offset="1" stop-color="${o.sky2 || "#f3d6db"}"/></linearGradient>
  <path d="M${cx + 60} 790 L ${cx + 140} 300 L ${cx + 160} 300 L ${cx + 100} 790Z" fill="#5a3826"/>
  <rect x="${cx - 220}" y="230" width="440" height="560" rx="10" fill="${fr}"/>
  <rect x="${cx - 196}" y="254" width="392" height="512" fill="#fffaf2"/>
  <rect x="${cx - 160}" y="290" width="320" height="360" fill="url(#${sky})"/>
  <circle cx="${cx}" cy="520" r="70" fill="#fff4dc" opacity=".8"/>
  <path d="M${cx - 160} 600 Q ${cx - 60} 540 ${cx} 590 T ${cx + 160} 570 L ${cx + 160} 650 L ${cx - 160} 650Z" fill="${shade(o.sky1 || "#f7b7a3", -60)}" opacity=".6"/>
  <g fill="#2a1a1d"><circle cx="${cx - 34}" cy="470" r="20"/><path d="M${cx - 64} 600 Q ${cx - 64} 500 ${cx - 34} 496 Q ${cx - 4} 500 ${cx - 6} 600Z"/>
  <circle cx="${cx + 30}" cy="476" r="18"/><path d="M${cx + 2} 600 Q ${cx + 4} 506 ${cx + 30} 502 Q ${cx + 58} 506 ${cx + 58} 600Z"/></g>
  <path d="M${cx} 420 C ${cx - 22} 400 ${cx - 16} 380 ${cx} 392 C ${cx + 16} 380 ${cx + 22} 400 ${cx} 420Z" fill="#b3123a"/>
  <text x="${cx}" y="710" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="34" fill="#2a1a1d">${o.caption || "Forever &amp; Always"}</text>
  <text x="${cx}" y="744" text-anchor="middle" font-family="Georgia, serif" font-size="16" letter-spacing="5" fill="#9c7a2e">${o.date || "EST. 2019"}</text>`;
}
function mug(o) {
  const cx = 380, c = o.mug || "#fbf7ef";
  let steam = "";
  for (let i = 0; i < 3; i++) steam += `<path d="M${cx - 50 + i * 50} 380 c -20 -30 20 -50 0 -80 c -20 -30 20 -50 0 -80" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round" opacity=".55"/>`;
  return `${floorShadow(cx + 20, 800, 200)}
  ${steam}
  <path d="M${cx + 150} 480 C ${cx + 270} 480 ${cx + 270} 680 ${cx + 150} 680" stroke="${shade(c, -20)}" stroke-width="40" fill="none"/>
  <path d="M${cx - 160} 420 L ${cx - 150} 760 Q ${cx} 800 ${cx + 150} 760 L ${cx + 160} 420Z" fill="${c}"/>
  <ellipse cx="${cx}" cy="420" rx="160" ry="36" fill="${shade(c, -25)}"/>
  <ellipse cx="${cx}" cy="424" rx="142" ry="28" fill="#5a3324"/>
  <path d="M${cx - 160} 420 L ${cx - 150} 760 Q ${cx - 110} 776 ${cx - 90} 778 L ${cx - 100} 450Z" fill="#fff" opacity=".35"/>
  <path d="M${cx + 160} 420 L ${cx + 150} 760 Q ${cx + 120} 776 ${cx + 90} 780 L ${cx + 110} 450Z" fill="#000" opacity=".06"/>
  <text x="${cx}" y="560" text-anchor="middle" font-family="Georgia, serif" font-size="30" letter-spacing="4" fill="${o.ink || "#1d1416"}">${o.line1 || "BEST MOM"}</text>
  <text x="${cx}" y="620" text-anchor="middle" font-family="'Brush Script MT', cursive" font-style="italic" font-size="54" fill="${o.accent || "#b3123a"}">${o.line2 || "Ever"}</text>
  <path d="M${cx - 30} 660 C ${cx - 42} 648 ${cx - 36} 636 ${cx - 26} 644 L ${cx - 20} 650 L ${cx - 14} 644 C ${cx - 4} 636 ${cx + 2} 648 ${cx - 10} 660 L ${cx - 20} 670Z" fill="#c9a14a"/>`;
}
function candle(o) {
  const cx = 400, jar = o.jar || "#1d1416";
  return `${floorShadow(cx, 800, 200)}
  <circle cx="${cx}" cy="300" r="140" fill="url(#glow)"/>
  <path d="M${cx} 262 q 26 40 0 72 q -26 -32 0 -72z" fill="#ffc94f"/><path d="M${cx} 290 q 10 18 0 34 q -10 -16 0 -34z" fill="#fff6d8"/>
  <rect x="${cx - 3}" y="332" width="6" height="30" fill="#2a1a14"/>
  <rect x="${cx - 170}" y="350" width="340" height="440" rx="34" fill="${jar}"/>
  <rect x="${cx - 160}" y="362" width="320" height="40" rx="18" fill="#f4ece0"/>
  <rect x="${cx - 170}" y="350" width="60" height="440" rx="30" fill="#fff" opacity=".1"/>
  <rect x="${cx - 120}" y="480" width="240" height="200" rx="8" fill="#fbf4e6"/>
  <rect x="${cx - 108}" y="492" width="216" height="176" rx="4" fill="none" stroke="#c9a14a" stroke-width="2"/>
  <text x="${cx}" y="575" text-anchor="middle" font-family="Georgia, serif" font-size="64" fill="#1d1416">${o.monogram || "S"}</text>
  <text x="${cx}" y="620" text-anchor="middle" font-family="Georgia, serif" font-size="15" letter-spacing="5" fill="#9c7a2e">${o.scent || "ROSE · OUD"}</text>
  <text x="${cx}" y="648" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="16" fill="#5a3324">hand-poured soy</text>`;
}

/* ---------------------------------------------------------- scenes */
function scene(o) {
  const cx = 400;
  let lights = "";
  for (let i = 0; i < 14; i++) {
    const x = 30 + i * 57, y = 120 + Math.sin(i * 0.9) * 18 + (i % 2) * 8;
    lights += `<circle cx="${x}" cy="${y}" r="20" fill="url(#glow)"/><circle cx="${x}" cy="${y}" r="5" fill="#fff3c4"/>`;
  }
  const arch = [];
  for (let i = 0; i < 20; i++) {
    const a = Math.PI + (i / 19) * Math.PI, rr = 300;
    arch.push(balloon(cx + Math.cos(a) * rr + (rand() - 0.5) * 20, 560 + Math.sin(a) * rr * 1.05 + (rand() - 0.5) * 20, 46 + rand() * 18, (o.colors || ["#b3123a", "#f3d6db", "url(#gold)", "#fbf7ef"])[i % 4], 0).replace(/<path d="M[^"]*Q[^"]*790"[^>]*\/>/, ""));
  }
  return `<path d="M30 110 Q 400 160 770 110" stroke="#5a3324" stroke-width="2" fill="none"/>${lights}
  ${arch.join("")}
  ${o.banner ? (() => { const L = o.banner.split(""); return L.map((ch, i) => { const x = cx - (L.length * 34) / 2 + i * 34 + 17; return `<path d="M${x - 15} 250 L ${x + 15} 250 L ${x} 290Z" fill="${i % 2 ? "#f3d6db" : "#1d1416"}"/><text x="${x}" y="270" text-anchor="middle" font-family="Georgia, serif" font-size="15" font-weight="700" fill="${i % 2 ? "#1d1416" : "#f6e3a1"}">${ch}</text>`; }).join(""); })() : ""}
  ${floorShadow(cx, 830, 300)}
  <rect x="${cx - 260}" y="700" width="520" height="24" rx="6" fill="#efe3d0"/>
  <rect x="${cx - 240}" y="724" width="480" height="96" fill="#e3d2b8"/>
  <path d="M${cx - 240} 724 L ${cx - 240} 820 M ${cx + 240} 724 L ${cx + 240} 820" stroke="#c9a14a" stroke-width="4"/>
  <g transform="translate(70 310) scale(.5)">${o.cake !== false ? cake({ candles: 3, topper: o.topper, roses: o.roses }) : ""}</g>
  <g transform="translate(${o.cake !== false ? 370 : o.bear ? 360 : 240} 385) scale(.4)">${hatbox({ colors: o.roses || ["#b3123a", "#9d0f2f", "#c8102e"], box: "#1d1416", band: "url(#gold)" })}</g>
  ${o.bear ? `<g>${teddy({ fur: "#f4ece0", heart: "#b3123a" }, 0.3, 260, 456)}</g>` : ""}
  ${o.candles ? [0, 1, 2, 3].map((i) => `<rect x="${110 + i * 170}" y="${640 - (i % 2) * 20}" width="26" height="${60 + (i % 2) * 20}" fill="#fbf7ef"/><circle cx="${123 + i * 170}" cy="${625 - (i % 2) * 20}" r="22" fill="url(#glow)"/><path d="M${123 + i * 170} ${614 - (i % 2) * 20} q 8 12 0 22 q -8 -10 0 -22z" fill="#ffc94f"/>`).join("") : ""}`;
}

/* ---------------------------------------------------------- composer */
const RENDER = { bouquet, hatbox, dome, giftBox, hamper, cake, chocolates, macarons, strawberries, teddy: (o) => teddy(o, 0.9, 400, 60), balloons, jewelry, frame, mug, candle, scene,
  combo: (o) => `${bouquet({ ...o, r: 22 }).replace(/<g>/, '<g transform="translate(130 120) scale(.75)">')}${teddy({ fur: o.fur || "#c8996b", heart: o.heart, bowtie: "#b3123a" }, 0.55, 250, 360)}` };

function render(spec, variant) {
  seed = spec.seed * 31 + variant * 7;
  uid = 0;
  const bgs = spec.bg;
  const bg = bgs[(variant - 1) % bgs.length];
  const floor = shade(bg, -18);
  const content = RENDER[spec.type](spec.opts || {});
  let deco = "";
  if (variant === 2) deco = spec.deco === "petals" ? petals(18, "#b3123a") : spec.deco === "confetti" ? confetti(40, ["#c9a14a", "#b3123a", "#f3d6db", "#fbf7ef"]) : sparkles(10);
  const vb = variant === 3 ? (spec.zoom || "160 160 480 600") : `0 0 ${W} ${H}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice">${defs()}
  ${backdrop(bg, floor, variant)}
  ${variant === 2 ? `<g opacity=".95">${deco}</g>` : ""}
  ${variant === 2 ? `<g transform="translate(400 500) scale(.92) translate(-400 -500)">${content}</g>` : content}
</svg>`;
}

let count = 0;
for (const spec of PRODUCT_ART) {
  for (const v of [1, 2, 3]) {
    writeFileSync(join(OUT, `${spec.slug}-${v}.svg`), render(spec, v).replace(/\n\s+/g, "\n"));
    count++;
  }
}
console.log(`wrote ${count} images to ${OUT}`);
