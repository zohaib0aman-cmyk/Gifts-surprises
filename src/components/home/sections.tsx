"use client";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Gift, Heart, MapPin, Package, Send, Sparkles, Video } from "lucide-react";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { DrawCheck, InstagramGlyph } from "../icons";
import { Reveal, Stagger, StaggerItem } from "../motion";
import { ProductCard } from "../product-card";
import { ProductImage } from "../product-image";
import { useSettings } from "../providers";
import { Button, buttonClass, Container, Input, SectionHeading, Stars } from "../ui";
import { OCCASIONS, RECIPIENTS } from "@/data/catalog";
import type { Product, Review } from "@/lib/types";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------ occasions */
const OCC_ART: Record<string, string> = {
  birthday: "/products/red-velvet-rose-celebration-cake-1.svg",
  anniversary: "/products/crimson-velvet-rose-bouquet-1.svg",
  valentines: "/products/be-mine-heart-teddy-1.svg",
  "mothers-day": "/products/mothers-day-pamper-package-1.svg",
  graduation: "/products/happy-birthday-balloon-bouquet-1.svg",
  "new-baby": "/products/parisian-macaron-gift-box-1.svg",
  "get-well": "/products/garden-party-mixed-bouquet-1.svg",
  "thank-you": "/products/signature-gold-gift-box-1.svg",
  "just-because": "/products/eternal-rose-glass-dome-1.svg",
};

export function OccasionGrid() {
  const list = OCCASIONS.filter((o) => OCC_ART[o.slug]);
  return (
    <section className="py-16 sm:py-24" aria-labelledby="occ-h">
      <Container>
        <SectionHeading eyebrow="Shop by occasion" title={<span id="occ-h">Every moment, <em className="gold-text">beautifully</em> marked</span>} sub="From first birthdays to fiftieth anniversaries — find the gift that fits the feeling." action={<Link href="/shop" className="group inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-gold-ink">All occasions <ArrowRight size={16} className="transition group-hover:translate-x-1" /></Link>} />
        <Stagger className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {list.map((o, i) => (
            <StaggerItem key={o.slug} className={cn(i === 0 && "col-span-2 row-span-2 lg:col-span-2")}>
              <Link href={`/shop?occasion=${o.slug}`} className="group relative block h-full overflow-hidden rounded-[1.75rem] bg-surface-2 shadow-soft">
                <div className={cn("relative", i === 0 ? "aspect-square lg:aspect-auto lg:h-full lg:min-h-[520px]" : "aspect-[4/5]")}>
                  <ProductImage src={OCC_ART[o.slug]} alt="" fill sizes={i === 0 ? "(min-width:1024px) 50vw, 100vw" : "(min-width:1024px) 25vw, 50vw"} className="transition duration-[1.2s] ease-out-expo group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-6">
                    <span className="mb-1 block text-2xl" aria-hidden>{o.emoji}</span>
                    <h3 className={cn("font-display leading-tight", i === 0 ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl")}>{o.name}</h3>
                    <p className="mt-1 hidden text-sm text-white/80 sm:block">{o.blurb}</p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#f3dc92]">Shop now <ArrowUpRight size={14} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span>
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------ recipients */
const REC_IMG: Record<string, string> = {
  her: "/products/blush-whisper-rose-hatbox-2.svg", him: "/products/wine-cheese-celebration-basket-2.svg", mom: "/products/spa-day-self-care-hamper-2.svg",
  dad: "/products/gourmet-snack-basket-2.svg", couples: "/products/anniversary-romance-package-2.svg", kids: "/products/giant-cuddle-bear-2.svg",
  friends: "/products/parisian-macaron-gift-box-2.svg", colleagues: "/products/belgian-truffle-collection-2.svg",
};
export function RecipientRail() {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (d: number) => ref.current?.scrollBy({ left: d * ref.current.clientWidth * 0.8, behavior: "smooth" });
  return (
    <section className="bg-surface-2/60 py-16 sm:py-24" aria-labelledby="rec-h">
      <Container>
        <SectionHeading eyebrow="Shop by recipient" title={<span id="rec-h">Who are we surprising?</span>} action={
          <div className="hidden gap-2 sm:flex">
            <button onClick={() => scroll(-1)} aria-label="Scroll left" className="grid h-12 w-12 place-items-center rounded-full border border-line bg-surface transition hover:border-gold"><ArrowLeft size={18} /></button>
            <button onClick={() => scroll(1)} aria-label="Scroll right" className="grid h-12 w-12 place-items-center rounded-full border border-line bg-surface transition hover:border-gold"><ArrowRight size={18} /></button>
          </div>
        } />
      </Container>
      <div ref={ref} className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-4 sm:px-6 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))]">
        {RECIPIENTS.map((r, i) => (
          <Reveal key={r.slug} delay={i * 0.05} className="w-[44%] shrink-0 snap-start sm:w-[30%] lg:w-[19%]">
            <Link href={`/shop?recipient=${r.slug}`} className="group block text-center">
              <div className="relative mx-auto aspect-square overflow-hidden rounded-full border-4 border-surface bg-surface shadow-soft transition duration-500 group-hover:-translate-y-1.5 group-hover:shadow-lift">
                <ProductImage src={REC_IMG[r.slug]} alt="" fill sizes="(min-width:1024px) 20vw, 45vw" className="transition duration-700 group-hover:scale-110" />
              </div>
              <p className="mt-4 font-display text-lg sm:text-xl">{r.name}</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ product rails */
export function ProductSection({ id, eyebrow, title, sub, products, href }: { id: string; eyebrow: string; title: React.ReactNode; sub?: string; products: Product[]; href: string }) {
  return (
    <section className="py-16 sm:py-24" aria-labelledby={id}>
      <Container>
        <SectionHeading eyebrow={eyebrow} title={<span id={id}>{title}</span>} sub={sub} action={<Link href={href} className={buttonClass("outline", "sm", "self-start sm:self-auto")}>View all <ArrowRight size={15} /></Link>} />
        <Stagger className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => <StaggerItem key={p.id}><ProductCard product={p} /></StaggerItem>)}
        </Stagger>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------ how it works / story */
export function HowItWorks() {
  const steps = [
    { icon: Gift, title: "Pick your surprise", body: "Choose a gift or a full setup. Add a handwritten message and gift wrap." },
    { icon: MapPin, title: "Order from anywhere", body: "Pay securely from any country. We deliver across all 50 states." },
    { icon: Package, title: "We plan & prepare", body: "Our florists, bakers and planners craft everything by hand." },
    { icon: Video, title: "Watch the moment", body: "We deliver, set up and send you photos — even the reaction video." },
  ];
  return (
    <section className="relative overflow-hidden bg-[#140e0f] py-20 text-[#f3ebe1] sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,161,74,.22),transparent_60%)]" aria-hidden />
      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="mb-4 flex items-center gap-3 text-[0.72rem] font-bold uppercase tracking-[0.28em] text-gold"><span className="h-px w-8 bg-gold" />Surprise planners</p>
            <h2 className="text-4xl leading-[1.05] sm:text-5xl">You dream it. <br /><em className="gold-text">We make it happen.</em></h2>
            <p className="mt-5 max-w-lg leading-relaxed text-[#cdbfb3]">Living abroad? Can&apos;t be there in person? Message us and our USA team becomes your hands — choosing the freshest roses, baking the cake, and setting up a moment they&apos;ll never forget.</p>
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
              {[["2,000+", "surprises delivered"], ["40+", "US metros"], ["4.9★", "average rating"]].map(([n, l]) => (
                <div key={l}><p className="gold-text font-display text-3xl sm:text-4xl">{n}</p><p className="mt-1 text-xs text-[#a89a8f]">{l}</p></div>
              ))}
            </div>
          </Reveal>
          <ol className="grid gap-4 sm:grid-cols-2">
            {steps.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 0.08} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
                <div className="flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold/15 text-gold"><s.icon size={22} /></span>
                  <span className="font-display text-3xl text-white/15">0{i + 1}</span>
                </div>
                <h3 className="mt-5 text-xl">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#bfb0a4]">{s.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------ gift finder quiz */
type QuizKey = "recipient" | "occasion" | "budget" | "vibe";
const QUIZ: { key: QuizKey; q: string; options: { v: string; label: string; emoji: string }[] }[] = [
  { key: "recipient", q: "Who's the lucky one?", options: RECIPIENTS.slice(0, 6).map((r) => ({ v: r.slug, label: r.name.replace("For ", ""), emoji: r.emoji ?? "🎁" })) },
  { key: "occasion", q: "What are we celebrating?", options: OCCASIONS.slice(0, 6).map((o) => ({ v: o.slug, label: o.name, emoji: o.emoji ?? "✨" })).concat({ v: "just-because", label: "Just because", emoji: "✨" }) },
  { key: "budget", q: "What's your budget?", options: [{ v: "0-60", label: "Under $60", emoji: "💌" }, { v: "60-130", label: "$60 – $130", emoji: "🎁" }, { v: "130-250", label: "$130 – $250", emoji: "💝" }, { v: "250-9999", label: "Go all out", emoji: "👑" }] },
  { key: "vibe", q: "Pick a vibe", options: [{ v: "flowers", label: "Romantic blooms", emoji: "🌹" }, { v: "cakes-sweets", label: "Sweet treats", emoji: "🍰" }, { v: "teddy-balloons", label: "Cute & cuddly", emoji: "🧸" }, { v: "surprise-packages", label: "Big wow moment", emoji: "🎉" }, { v: "personalized", label: "Personal keepsake", emoji: "💎" }, { v: "gift-boxes", label: "Pamper & treat", emoji: "🧺" }] },
];

function scoreProducts(products: Product[], a: Partial<Record<QuizKey, string>>) {
  const [lo, hi] = (a.budget ?? "0-9999").split("-").map(Number);
  return products
    .map((p) => {
      let s = 0;
      if (a.recipient && p.recipients.includes(a.recipient)) s += 3;
      if (a.occasion && p.occasions.includes(a.occasion)) s += 3;
      if (a.vibe && p.category === a.vibe) s += 4;
      const price = p.variants?.options.length ? Math.min(...p.variants.options.map((o) => o.price)) : p.price;
      if (price >= lo && price <= hi) s += 3; else s -= 2;
      s += p.rating / 5;
      return { p, s };
    })
    .sort((x, y) => y.s - x.s)
    .slice(0, 3)
    .map((x) => x.p);
}

export function GiftFinderQuiz({ products }: { products: Product[] }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Record<QuizKey, string>>>({});
  const done = step >= QUIZ.length;
  const results = useMemo(() => (done ? scoreProducts(products, answers) : []), [done, products, answers]);
  const pick = (k: QuizKey, v: string) => { setAnswers((a) => ({ ...a, [k]: v })); setTimeout(() => setStep((s) => s + 1), 220); };
  const reset = () => { setAnswers({}); setStep(0); };
  return (
    <section id="gift-finder" className="scroll-mt-24 py-16 sm:py-24" aria-labelledby="quiz-h">
      <Container>
        <div className="relative overflow-hidden rounded-[2.5rem] border border-line bg-surface p-6 shadow-soft sm:p-12">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blush blur-3xl" aria-hidden />
          <div className="relative grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="mb-3 flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.28em] text-gold-ink"><Sparkles size={14} /> Gift finder</p>
              <h2 id="quiz-h" className="text-4xl leading-tight sm:text-5xl">Not sure what to send?</h2>
              <p className="mt-4 text-muted">Answer four quick questions and our gift concierge will hand-pick three perfect surprises.</p>
              <div className="mt-8 flex gap-2" aria-hidden>
                {QUIZ.map((q, i) => (
                  <motion.span key={q.key} className="h-1.5 flex-1 rounded-full bg-surface-2" animate={{ backgroundColor: i < step ? "var(--gold)" : i === step ? "color-mix(in oklab, var(--gold) 45%, transparent)" : "var(--surface-2)" }} />
                ))}
              </div>
              <p className="mt-3 text-sm text-muted" aria-live="polite">{done ? "Your matches are ready ✨" : `Question ${step + 1} of ${QUIZ.length}`}</p>
            </div>
            <div className="min-h-[340px]">
              <AnimatePresence mode="wait">
                {!done ? (
                  <motion.fieldset key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                    <legend className="mb-5 font-display text-2xl sm:text-3xl">{QUIZ[step].q}</legend>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {QUIZ[step].options.map((o, i) => {
                        const sel = answers[QUIZ[step].key] === o.v;
                        return (
                          <motion.button key={o.v} type="button" onClick={() => pick(QUIZ[step].key, o.v)} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} whileTap={{ scale: 0.95 }}
                            className={cn("flex min-h-[88px] flex-col items-center justify-center gap-1.5 rounded-2xl border p-3 text-center text-sm font-semibold transition", sel ? "border-gold bg-blush" : "border-line bg-bg hover:-translate-y-0.5 hover:border-gold hover:shadow-soft")}>
                            <span className="text-2xl" aria-hidden>{o.emoji}</span>{o.label}
                          </motion.button>
                        );
                      })}
                    </div>
                    {step > 0 && <button type="button" onClick={() => setStep((s) => s - 1)} className="mt-5 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-muted hover:text-fg"><ArrowLeft size={15} /> Back</button>}
                  </motion.fieldset>
                ) : (
                  <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="mb-5 flex items-center justify-between gap-3">
                      <h3 className="font-display text-2xl sm:text-3xl">We think they&apos;ll love…</h3>
                      <button onClick={reset} className="min-h-11 shrink-0 text-sm font-semibold text-gold-ink underline-offset-4 hover:underline">Start over</button>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 [&>*:nth-child(3)]:hidden sm:[&>*:nth-child(3)]:block">
                      {results.map((p, i) => (
                        <motion.div key={p.id} initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: i * 0.12 }}>
                          <ProductCard product={p} />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------ reviews */
export function ReviewsSection({ reviews, products }: { reviews: Review[]; products: Product[] }) {
  const byId = new Map(products.map((p) => [p.id, p]));
  const top = reviews.filter((r) => r.rating === 5 && r.body.length > 90).slice(0, 10);
  const row = [...top, ...top];
  const avg = reviews.reduce((a, r) => a + r.rating, 0) / Math.max(1, reviews.length);
  return (
    <section className="overflow-hidden bg-surface-2/60 py-16 sm:py-24" aria-labelledby="rev-h">
      <Container>
        <SectionHeading align="center" eyebrow="Loved across the USA" title={<span id="rev-h">Happy tears, delivered</span>} sub={`${avg.toFixed(1)} out of 5 from ${reviews.length.toLocaleString()} verified reviews`} />
      </Container>
      <div className="group relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[var(--surface-2)] to-transparent sm:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[var(--surface-2)] to-transparent sm:w-32" />
        <ul className="flex w-max animate-marquee gap-4 group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {row.map((r, i) => {
            const p = byId.get(r.productId);
            return (
              <li key={`${r.id}-${i}`} aria-hidden={i >= top.length} className="w-[300px] shrink-0 rounded-3xl border border-line bg-surface p-6 shadow-soft sm:w-[360px]">
                <Stars rating={r.rating} />
                <p className="mt-3 font-display text-lg leading-snug">“{r.title}”</p>
                <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-muted">{r.body}</p>
                <div className="mt-5 flex items-center gap-3 border-t border-line pt-4">
                  {p && <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-surface-2"><ProductImage src={p.images[0]} alt="" fill sizes="44px" /></span>}
                  <div className="min-w-0">
                    <p className="flex items-center gap-1 text-sm font-semibold">{r.author}{r.verified && <Check size={13} className="text-emerald-600" aria-label="Verified buyer" />}</p>
                    <p className="truncate text-xs text-muted">{r.location}{p ? ` · ${p.name}` : ""}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ instagram */
export function InstagramFeed() {
  const { social } = useSettings();
  const posts = [1, 2, 3, 4, 5, 6].map((n) => `/instagram/ig-${n}.webp`);
  const captions = ["Birthday rose cake & 100-rose bouquet", "Pink wrapped, ready for delivery", "Fresh from the flower market", "Red rose heart cake", "Hand-tied bouquets for today's surprises", "The best gifts in USA 🇺🇸"];
  return (
    <section className="py-16 sm:py-24" aria-labelledby="ig-h">
      <Container>
        <SectionHeading eyebrow="@gifts.surprises.usa" title={<span id="ig-h">Real surprises, <em className="gold-text">real smiles</em></span>} sub="Straight from our Instagram — tag us in your moments for a chance to be featured." action={<a href={social.instagram} target="_blank" rel="noreferrer" className={buttonClass("primary", "sm")}><InstagramGlyph className="h-4 w-4" /> Follow us</a>} />
        <Stagger className="grid grid-cols-3 gap-1.5 sm:gap-3 lg:grid-cols-6">
          {posts.map((src, i) => (
            <StaggerItem key={src}>
              <a href={social.instagram} target="_blank" rel="noreferrer" className="group relative block aspect-[4/5] overflow-hidden rounded-xl bg-surface-2 sm:rounded-2xl" aria-label={`Instagram post: ${captions[i]}`}>
                <ProductImage src={src} alt={captions[i]} fill sizes="(min-width:1024px) 16vw, 33vw" className="transition duration-700 group-hover:scale-110" />
                <span className="absolute inset-0 grid place-items-center bg-black/0 text-white opacity-0 transition duration-300 group-hover:bg-black/40 group-hover:opacity-100">
                  <span className="flex items-center gap-1.5 text-sm font-semibold"><Heart size={16} fill="currentColor" /> View</span>
                </span>
              </a>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------ newsletter */
export function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("loading");
    try {
      const r = await fetch("/api/newsletter", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email }) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      setState("done");
      setMsg(j.already ? "You're already on the list — thank you!" : "Check your inbox for 10% off: WELCOME10");
    } catch (err) {
      setState("error");
      setMsg(err instanceof Error && err.message ? err.message : "Please enter a valid email.");
    }
  };
  return (
    <section className="py-16 sm:py-24" aria-labelledby="nl-h">
      <Container>
        <Reveal className="relative overflow-hidden rounded-[2.5rem] bg-blush px-6 py-14 text-center sm:px-16 sm:py-20">
          <div className="paper pointer-events-none absolute inset-0 opacity-50" aria-hidden />
          <motion.span className="absolute left-[8%] top-[18%] text-3xl" animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity }} aria-hidden>🎀</motion.span>
          <motion.span className="absolute bottom-[16%] right-[10%] text-3xl" animate={{ y: [0, 10, 0], rotate: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity }} aria-hidden>🌹</motion.span>
          <div className="relative mx-auto max-w-xl">
            <p className="mb-4 text-[0.72rem] font-bold uppercase tracking-[0.28em] text-gold-ink">The Surprise List</p>
            <h2 id="nl-h" className="text-4xl leading-tight sm:text-5xl">10% off your first surprise</h2>
            <p className="mt-4 text-muted">Early access to holiday collections, occasion reminders and members-only offers. No spam, ever.</p>
            <AnimatePresence mode="wait">
              {state === "done" ? (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-8 flex flex-col items-center gap-3">
                  <DrawCheck size={72} />
                  <p className="font-semibold">{msg}</p>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={submit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row" exit={{ opacity: 0, y: -10 }}>
                  <label htmlFor="nl-email" className="sr-only">Email address</label>
                  <Input id="nl-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="h-14 rounded-full bg-surface px-6" autoComplete="email" />
                  <Button type="submit" size="lg" loading={state === "loading"} className="shrink-0"><Send size={16} /> Subscribe</Button>
                </motion.form>
              )}
            </AnimatePresence>
            {state === "error" && <p role="alert" className="mt-3 text-sm text-rose">{msg}</p>}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
