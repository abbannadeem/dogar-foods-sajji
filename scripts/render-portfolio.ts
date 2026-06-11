/**
 * Renders the portfolio compose.html into individual high-res PNGs
 * suitable for Upwork / Fiverr / personal portfolio upload.
 *
 * Run: npx tsx scripts/render-portfolio.ts
 *
 * Outputs to portfolio/final/*.png
 */
import { chromium } from "playwright";
import path from "path";
import fs from "fs";
import { pathToFileURL } from "url";

const ROOT = path.join(__dirname, "..", "portfolio");
const HTML = path.join(ROOT, "compose.html");
const OUT = path.join(ROOT, "final");

type Section = { id: string; outName: string; width: number; height: number };

const SECTIONS: Section[] = [
  { id: "cover",            outName: "00-cover.png",             width: 1920, height: 1080 },
  { id: "page-home",        outName: "01-home-desktop.png",      width: 1600, height: 1000 },
  { id: "page-menu",        outName: "02-menu-desktop.png",      width: 1600, height: 1000 },
  { id: "page-product",     outName: "03-product-desktop.png",   width: 1600, height: 1000 },
  { id: "page-branches",    outName: "04-branches-desktop.png",  width: 1600, height: 1000 },
  // New combined mobile showcase (replaces the empty-side 800x1500 cards)
  { id: "mobile-showcase",  outName: "05-mobile-showcase.png",   width: 1600, height: 1000 },
];

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  if (!fs.existsSync(HTML)) {
    console.error("compose.html not found at", HTML);
    process.exit(1);
  }

  console.log("Launching Chromium...");
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1500 },
    deviceScaleFactor: 2,
    colorScheme: "dark",
  });

  const page = await context.newPage();
  const fileUrl = pathToFileURL(HTML).toString();
  await page.goto(fileUrl, { waitUntil: "networkidle" });
  // Make sure web fonts + images settle
  await page.waitForTimeout(2000);

  console.log(`\nRendering ${SECTIONS.length} portfolio images...`);
  for (const s of SECTIONS) {
    const el = await page.$(`#${s.id}`);
    if (!el) {
      console.log(`  ✗ #${s.id} not found`);
      continue;
    }
    const outPath = path.join(OUT, s.outName);
    await el.screenshot({ path: outPath });
    console.log(`  ✓ ${s.outName} (${s.width}×${s.height})`);
  }

  await browser.close();
  console.log(`\n✓ Done. Open: ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
