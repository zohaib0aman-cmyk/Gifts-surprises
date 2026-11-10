// Renders public/products/*.svg to high-quality WebP (cheap to paint, optimisable by next/image).
// Requires Playwright's Chromium + Python Pillow. Run: node scripts/rasterize-product-art.mjs
import { readdirSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require("playwright")); } catch { ({ chromium } = require("@playwright/test")); }

const dir = join(process.cwd(), "public", "products");
const tmp = join(process.cwd(), ".art-tmp");
mkdirSync(tmp, { recursive: true });
const files = readdirSync(dir).filter((f) => f.endsWith(".svg"));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 800, height: 1000 }, deviceScaleFactor: 1.5 });
for (const f of files) {
  await page.goto(`file://${join(dir, f)}`);
  await page.screenshot({ path: join(tmp, f.replace(".svg", ".png")) });
}
await browser.close();
execFileSync("python3", ["-I", "-c", `
import sys, os
from PIL import Image
src, dst = sys.argv[1], sys.argv[2]
for f in os.listdir(src):
    if f.endswith('.png'):
        Image.open(os.path.join(src, f)).convert('RGB').save(os.path.join(dst, f[:-4] + '.webp'), 'WEBP', quality=84, method=6)
`, tmp, dir]);
rmSync(tmp, { recursive: true, force: true });

console.log(`rasterized ${files.length} images`);
