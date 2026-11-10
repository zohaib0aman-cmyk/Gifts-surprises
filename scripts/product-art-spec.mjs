// Art direction for each seeded product (consumed by generate-product-art.mjs)
const CREAM = "#f4ece0", BLUSH = "#f2dcdf", SAGE = "#e2e7da", SAND = "#ece0d1", NOIR = "#231a1d", PLUM = "#3b1e2b", ROSEBG = "#f6e4e6", MIST = "#e6e2ea";
const REDS = ["#b3123a", "#9d0f2f", "#c8102e", "#8a0c26"];
const PINKS = ["#f2b8c3", "#f6ccd4", "#e99aab", "#fbe1e6"];

export const PRODUCT_ART = [
  { slug: "crimson-velvet-rose-bouquet", seed: 1, type: "bouquet", bg: [BLUSH, CREAM, BLUSH], deco: "petals", opts: { colors: REDS, paper: "#1d1416", r: 28 }, zoom: "150 180 500 520" },
  { slug: "blush-whisper-rose-hatbox", seed: 2, type: "hatbox", bg: [CREAM, ROSEBG, SAND], deco: "sparkles", opts: { colors: ["#b3123a", "#c8102e", "#9d0f2f"], box: "#fbf4ef", band: "url(#gold)", breath: 70, bow: true, label: "FOR YOU", r: 27 }, zoom: "160 260 480 500" },
  { slug: "eternal-rose-glass-dome", seed: 3, type: "dome", bg: [NOIR, PLUM, NOIR], deco: "sparkles", opts: { colors: ["#b3123a"], lights: true }, zoom: "200 160 400 520" },
  { slug: "garden-party-mixed-bouquet", seed: 4, type: "bouquet", bg: [SAGE, CREAM, SAGE], deco: "sparkles", opts: { colors: ["#f8efe2", "hydrangea", "#f2b8c3", "#fbf4e6", "#e99aab"], paper: "#f4e7d5", r: 30, hydrangea: "#b9d48a", breath: 30, ribbon: "#b3123a" }, zoom: "150 180 500 520" },

  { slug: "signature-gold-gift-box", seed: 5, type: "giftBox", bg: [CREAM, BLUSH, SAND], deco: "confetti", opts: { box: "#151012" }, zoom: "180 300 460 520" },
  { slug: "spa-day-self-care-hamper", seed: 6, type: "hamper", bg: [MIST, BLUSH, CREAM], deco: "sparkles", opts: { items: ["towel", "jar", "candle", "flowers"], jar: "#e8b9c2", towel: "#fbf7ef", colors: PINKS, liner: "#f2dcdf", cello: true }, zoom: "120 220 560 600" },
  { slug: "gourmet-snack-basket", seed: 7, type: "hamper", bg: [SAND, CREAM, SAND], deco: "confetti", opts: { items: ["snack", "jar", "box", "snack"], jar: "#8a4b2f", snack: "#c94f3d", box: "#1d1416", liner: "#b3123a", ribbon: "#b3123a" }, zoom: "120 220 560 600" },
  { slug: "wine-cheese-celebration-basket", seed: 8, type: "hamper", bg: [PLUM, NOIR, PLUM], deco: "sparkles", opts: { items: ["cheese", "bottle", "jar", "flowers"], bottle: "#4a1626", jar: "#7a0f24", colors: REDS, liner: "#f4ece0" }, zoom: "120 220 560 600" },

  { slug: "red-velvet-rose-celebration-cake", seed: 9, type: "cake", bg: [BLUSH, CREAM, BLUSH], deco: "confetti", opts: { frost: "#7a0f24", sponge: "#f6e5e1", text: "Happy Birthday", candles: 3 }, zoom: "110 230 580 640" },
  { slug: "belgian-truffle-collection", seed: 10, type: "chocolates", bg: [SAND, CREAM, SAND], deco: "sparkles", opts: { label: "TRUFFLES" }, zoom: "150 460 500 400" },
  { slug: "parisian-macaron-gift-box", seed: 11, type: "macarons", bg: [ROSEBG, MIST, ROSEBG], deco: "confetti", opts: { lid: "#f3d6db" }, zoom: "130 520 540 330" },
  { slug: "chocolate-dipped-strawberries", seed: 12, type: "strawberries", bg: [CREAM, BLUSH, CREAM], deco: "petals", opts: { box: "#1d1416" }, zoom: "130 470 540 380" },

  { slug: "giant-cuddle-bear", seed: 13, type: "teddy", bg: [CREAM, SAND, CREAM], deco: "confetti", opts: { fur: "#f1e6d6", bowtie: "#b3123a" }, zoom: "140 200 520 600" },
  { slug: "be-mine-heart-teddy", seed: 14, type: "teddy", bg: [BLUSH, ROSEBG, BLUSH], deco: "petals", opts: { fur: "#fbf7f2", heart: "#b3123a", heartText: "Love You", bowtie: "#b3123a" }, zoom: "140 300 520 560" },
  { slug: "happy-birthday-balloon-bouquet", seed: 15, type: "balloons", bg: [MIST, CREAM, MIST], deco: "confetti", opts: { banner: "HAPPY BIRTHDAY", foil: true }, zoom: "120 100 560 640" },
  { slug: "teddy-roses-love-bundle", seed: 16, type: "combo", bg: [ROSEBG, BLUSH, ROSEBG], deco: "petals", opts: { colors: REDS, paper: "#f3d6db", fur: "#c8996b", heart: "#b3123a" }, zoom: "100 220 600 640" },

  { slug: "engraved-heart-necklace", seed: 17, type: "jewelry", bg: [NOIR, PLUM, NOIR], deco: "sparkles", opts: { velvet: "#7a0f24", metal: "gold", initial: "A" }, zoom: "200 480 400 320" },
  { slug: "custom-photo-frame", seed: 18, type: "frame", bg: [SAND, CREAM, SAND], deco: "sparkles", opts: { caption: "Forever &amp; Always", date: "EST. 2019" }, zoom: "180 260 440 520" },
  { slug: "personalized-name-mug", seed: 19, type: "mug", bg: [BLUSH, CREAM, BLUSH], deco: "confetti", opts: { line1: "BEST MOM", line2: "Ever" }, zoom: "150 330 500 480" },
  { slug: "monogram-luxury-candle", seed: 20, type: "candle", bg: [CREAM, SAND, CREAM], deco: "sparkles", opts: { monogram: "S", scent: "ROSE · OUD" }, zoom: "200 420 400 320" },

  { slug: "ultimate-birthday-surprise-setup", seed: 21, type: "scene", bg: [BLUSH, CREAM, BLUSH], deco: "confetti", opts: { banner: "HAPPY BIRTHDAY", topper: "", colors: ["#b3123a", "#f3d6db", "url(#gold)", "#fbf7ef"] }, zoom: "100 140 600 700" },
  { slug: "anniversary-romance-package", seed: 22, type: "scene", bg: [PLUM, NOIR, PLUM], deco: "petals", opts: { banner: "HAPPY ANNIVERSARY", candles: true, cake: false, colors: ["#b3123a", "#7a0f24", "url(#gold)", "#f3d6db"] }, zoom: "100 140 600 700" },
  { slug: "doorstep-surprise-delivery", seed: 23, type: "scene", bg: [CREAM, ROSEBG, CREAM], deco: "confetti", opts: { banner: "SURPRISE", bear: true, cake: false, colors: ["#f3d6db", "url(#gold)", "#b3123a", "#fbf7ef"] }, zoom: "60 300 540 560" },
  { slug: "mothers-day-pamper-package", seed: 24, type: "hamper", bg: [ROSEBG, CREAM, ROSEBG], deco: "petals", opts: { items: ["flowers", "candle", "jar", "towel"], colors: PINKS, jar: "#f2b8c3", liner: "#fbf4ef", cello: true, ribbon: "#e99aab" }, zoom: "120 220 560 600" },
];
