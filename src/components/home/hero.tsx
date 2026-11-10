"use client";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, RotateCcw, Sparkles, Star, Truck } from "lucide-react";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { ProductImage } from "../product-image";
import { buttonClass } from "../ui";
import type { SiteSettings } from "@/lib/types";

const COLORS = ["#c9a14a", "#e9cf7f", "#b3123a", "#f2b8c3", "#ffffff", "#1d1416"];

function seeded(n: number) {
  let s = 1337;
  const r = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
  return Array.from({ length: n }, (_, i) => {
    const angle = -Math.PI / 2 + (r() - 0.5) * Math.PI * 1.25;
    const dist = 120 + r() * 170;
    return { i, x: Math.cos(angle) * dist, y: Math.sin(angle) * dist - 40, rot: r() * 720 - 360, w: 6 + r() * 8, h: 4 + r() * 6, c: COLORS[i % COLORS.length], round: r() > 0.6, d: r() * 0.15 };
  });
}

/** Animated gift box that opens with a confetti burst. */
function GiftBox() {
  const reduce = useReducedMotion();
  const [run, setRun] = useState(0);
  const confetti = useMemo(() => seeded(42), []);
  const t = (d: number) => (reduce ? 0 : d);
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[460px]">
      {/* halo */}
      <motion.div className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle_at_50%_40%,color-mix(in_oklab,var(--gold)_45%,transparent),transparent_65%)]" animate={reduce ? {} : { scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />
      <div className="absolute inset-[14%] rounded-full border border-gold/30" />
      <motion.div className="absolute inset-[4%] rounded-full border border-dashed border-gold/25" animate={reduce ? {} : { rotate: 360 }} transition={{ duration: 80, repeat: Infinity, ease: "linear" }} />

      <svg key={run} viewBox="0 0 400 400" className="relative h-full w-full overflow-visible" role="img" aria-label="An animated black and gold gift box opening with confetti">
        <defs>
          <linearGradient id="hg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f6e3a1" /><stop offset=".45" stopColor="#c9a14a" /><stop offset=".7" stopColor="#e9cf7f" /><stop offset="1" stopColor="#9c7a2e" /></linearGradient>
          <linearGradient id="hbox" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#2a2022" /><stop offset=".5" stopColor="#151012" /><stop offset="1" stopColor="#0b0809" /></linearGradient>
          <radialGradient id="hglow" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#fff6d8" /><stop offset=".45" stopColor="#ffd27a" stopOpacity=".55" /><stop offset="1" stopColor="#ffb347" stopOpacity="0" /></radialGradient>
          <filter id="hblur"><feGaussianBlur stdDeviation="10" /></filter>
        </defs>
        <ellipse cx="200" cy="350" rx="120" ry="16" fill="#2a1418" opacity=".25" filter="url(#hblur)" />
        {/* light rays */}
        <motion.g initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: [0, 1, 0.75], scale: 1 }} transition={{ delay: t(1.35), duration: 0.9 }} style={{ transformOrigin: "200px 200px" }}>
          <circle cx="200" cy="190" r="120" fill="url(#hglow)" />
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.rect key={i} x="198" y="60" width="4" height="70" rx="2" fill="#f3dc92" opacity=".55" transform={`rotate(${-70 + i * 15.5} 200 200)`} animate={reduce ? {} : { opacity: [0.2, 0.7, 0.2] }} transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.12 }} />
          ))}
        </motion.g>
        {/* rising hearts */}
        {[0, 1, 2].map((i) => (
          <motion.path key={i} d="M0 8 C -12 -2 -8 -14 0 -6 C 8 -14 12 -2 0 8Z" fill={i === 1 ? "#b3123a" : "url(#hg)"} initial={{ x: 200, y: 200, scale: 0, opacity: 0 }} animate={{ x: 200 + (i - 1) * 46, y: [200, 120 - i * 14, 60 - i * 10], scale: [0, 1.6, 1.2], opacity: [0, 1, 0] }} transition={{ delay: t(1.5 + i * 0.15), duration: 2.6, repeat: reduce ? 0 : Infinity, repeatDelay: 1.2 }} />
        ))}
        {/* box body */}
        <motion.g initial={{ y: reduce ? 0 : -260, opacity: reduce ? 1 : 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 140, damping: 13, delay: t(0.1) }}>
          <rect x="110" y="200" width="180" height="140" rx="10" fill="url(#hbox)" />
          <rect x="182" y="200" width="36" height="140" fill="url(#hg)" />
          <rect x="110" y="250" width="180" height="26" fill="url(#hg)" opacity=".95" />
          <rect x="110" y="200" width="40" height="140" rx="10" fill="#fff" opacity=".05" />
          {/* tag */}
          <motion.g initial={{ rotate: 0 }} animate={reduce ? {} : { rotate: [0, 8, -6, 0] }} transition={{ delay: t(1.4), duration: 1.2 }} style={{ transformOrigin: "290px 262px" }}>
            <path d="M290 262 L 318 296" stroke="#c9a14a" strokeWidth="2" />
            <g transform="translate(300 292) rotate(18)"><rect width="46" height="30" rx="4" fill="#fbf4e6" stroke="#c9a14a" strokeWidth="1.5" /><path d="M23 21 c -7 -5 -9 -10 -5 -12 c 3 -2 5 1 5 3 c 0 -2 2 -5 5 -3 c 4 2 2 7 -5 12z" fill="#b3123a" /></g>
          </motion.g>
          {/* lid */}
          <motion.g
            initial={{ y: 0, rotate: 0 }}
            animate={reduce ? { y: -36, rotate: -10 } : { y: [0, -4, 0, -4, 0, -90, -70], x: [0, 0, 0, 0, 0, -30, -46], rotate: [0, -3, 3, -3, 0, -22, -16] }}
            transition={{ delay: t(0.75), duration: 1.25, times: [0, 0.12, 0.24, 0.36, 0.48, 0.8, 1], ease: "easeOut" }}
            style={{ transformOrigin: "200px 200px" }}
          >
            <rect x="100" y="172" width="200" height="38" rx="8" fill="#1f181a" />
            <rect x="100" y="172" width="200" height="12" rx="6" fill="#fff" opacity=".07" />
            <rect x="182" y="172" width="36" height="38" fill="url(#hg)" />
            <path d="M200 174 C 168 132 128 150 140 172 C 148 186 176 182 200 174Z" fill="url(#hg)" />
            <path d="M200 174 C 232 132 272 150 260 172 C 252 186 224 182 200 174Z" fill="url(#hg)" />
            <path d="M200 174 C 180 150 154 154 150 168" fill="none" stroke="#000" strokeOpacity=".18" strokeWidth="2" />
            <path d="M200 174 C 220 150 246 154 250 168" fill="none" stroke="#000" strokeOpacity=".18" strokeWidth="2" />
            <ellipse cx="200" cy="175" rx="12" ry="10" fill="url(#hg)" stroke="#9c7a2e" strokeOpacity=".4" />
          </motion.g>
        </motion.g>
        {/* confetti burst */}
        {!reduce && confetti.map((c) => (
          <motion.rect
            key={c.i}
            width={c.w}
            height={c.round ? c.w : c.h}
            rx={c.round ? c.w / 2 : 1.5}
            fill={c.c}
            stroke={c.c === "#ffffff" ? "#e9cf7f" : "none"}
            initial={{ x: 200, y: 190, opacity: 0, rotate: 0, scale: 0.4 }}
            animate={{ x: [200, 200 + c.x, 200 + c.x * 1.1], y: [190, 190 + c.y, 190 + c.y + 160], opacity: [0, 1, 1, 0], rotate: c.rot, scale: 1 }}
            transition={{ delay: 1.45 + c.d, duration: 2.2, times: [0, 0.35, 1], ease: [0.2, 0.7, 0.4, 1] }}
          />
        ))}
      </svg>

      {/* floating keepsakes */}
      <motion.div className="absolute -left-2 top-[10%] w-[30%] rotate-[-8deg] overflow-hidden rounded-2xl border-4 border-surface shadow-lift sm:-left-6" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1, y: reduce ? 0 : [0, -10, 0] }} transition={{ opacity: { delay: 1.9 }, scale: { delay: 1.9, type: "spring" }, y: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}>
        <div className="relative aspect-[4/5]"><ProductImage src="/products/blush-whisper-rose-hatbox-1.svg" alt="" fill sizes="140px" /></div>
      </motion.div>
      <motion.div className="absolute -right-1 bottom-[12%] w-[28%] rotate-[7deg] overflow-hidden rounded-2xl border-4 border-surface shadow-lift sm:-right-4" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1, y: reduce ? 0 : [0, 12, 0] }} transition={{ opacity: { delay: 2.1 }, scale: { delay: 2.1, type: "spring" }, y: { duration: 7, repeat: Infinity, ease: "easeInOut" } }}>
        <div className="relative aspect-[4/5]"><ProductImage src="/products/be-mine-heart-teddy-1.svg" alt="" fill sizes="130px" /></div>
      </motion.div>
      <motion.div className="absolute right-[6%] top-[4%] flex items-center gap-2 rounded-full border border-line bg-surface/90 px-3 py-2 text-xs font-semibold shadow-soft backdrop-blur" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.4 }}>
        <Sparkles size={14} className="text-gold-ink" /> Surprise unlocked!
      </motion.div>
      <button type="button" onClick={() => setRun((r) => r + 1)} className="absolute bottom-0 left-1/2 flex min-h-11 -translate-x-1/2 items-center gap-2 rounded-full px-4 text-xs font-semibold text-muted transition hover:text-gold-ink" aria-label="Replay gift box animation">
        <RotateCcw size={14} /> Open again
      </button>
    </div>
  );
}

export function Hero({ hero }: { hero: SiteSettings["hero"] }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);
  return (
    <section ref={ref} className="relative overflow-hidden">
      <div className="paper pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-blush blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-[color-mix(in_oklab,var(--gold)_18%,transparent)] blur-3xl" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl items-center gap-6 px-4 pb-14 pt-6 sm:px-6 sm:pt-10 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:px-8 lg:pb-24 lg:pt-14">
        <div className="relative z-10 text-center lg:text-left">
          <motion.p initial={{ y: 10 }} animate={{ y: 0 }} className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-surface/70 px-4 py-2 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-gold-ink backdrop-blur lg:mx-0">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose" /> {hero.eyebrow}
          </motion.p>
          <h1 className="text-[2.75rem] leading-[0.98] sm:text-6xl lg:text-[5.2rem]">
            <motion.span className="block" initial={{ y: 24 }} animate={{ y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>{hero.title}</motion.span>
            <motion.span className="gold-text block italic" initial={{ y: 30 }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}>{hero.highlight}</motion.span>
          </h1>
          <motion.p className="mx-auto mt-6 max-w-xl text-[1.02rem] leading-relaxed text-muted sm:text-lg lg:mx-0" initial={{ y: 16 }} animate={{ y: 0 }} transition={{ duration: 0.8, delay: 0.15 }}>{hero.subtitle}</motion.p>
          <motion.div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.25 }}>
            <Link href={hero.ctaHref} className={buttonClass("primary", "lg", "group")}>
              {hero.ctaLabel} <ArrowRight size={18} className="transition group-hover:translate-x-1" />
            </Link>
            <Link href={hero.secondaryHref} className={buttonClass("outline", "lg")}>{hero.secondaryLabel}</Link>
          </motion.div>
          <motion.ul className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted lg:justify-start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <li className="flex items-center gap-1.5"><span className="flex text-gold">{[0, 1, 2, 3, 4].map((i) => <Star key={i} size={14} fill="currentColor" strokeWidth={0} />)}</span><strong className="text-fg">4.9</strong> from 2,000+ surprises</li>
            <li className="flex items-center gap-1.5"><Truck size={16} className="text-gold-ink" /> Same-day in 40+ US cities</li>
          </motion.ul>
        </div>
        <motion.div style={{ y }} className="relative">
          <GiftBox />
        </motion.div>
      </div>
    </section>
  );
}
