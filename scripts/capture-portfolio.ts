/**
 * Capture portfolio-grade screenshots of the live Dogar Foods site.
 * Run: npx tsx scripts/capture-portfolio.ts
 *
 * Outputs to portfolio/raw/{desktop,mobile}/*.png
 */
import { chromium, devices } from "playwright";
import path from "path";
import fs from "fs";

const BASE = "https://dogar-foods-sajji.vercel.app";
const ROOT = path.join(__dirname, "..", "portfolio");
const DESKTOP_DIR = path.join(ROOT, "raw", "desktop");
const MOBILE_DIR = path.join(ROOT, "raw", "mobile");

type Shot = {
  name: string;
  path: string;
  // optional viewport scroll before capture
  scrollTo?: number;
  // optional pre-actions (click, hover)
  prep?: string;
};

const PAGES: Shot[] = [
  { name: "01-home", path: "/" },
  { name: "02-menu", path: "/menu" },
  { name: "03-product", path: "/menu/full-chicken-sajji" },
  { name: "04-branches", path: "/branches" },
  { name: "05-about", path: "/about" },
  { name: "06-contact", path: "/contact" },
  { name: "07-faq", path: "/faq" },
  { name: "08-admin-login", path: "/admin/login" },
];

function ensureDir(p: string) {
  fs.mkdirSync(p, { recursive: true });
}

async function main() {
  ensureDir(DESKTOP_DIR);
  ensureDir(MOBILE_DIR);

  console.log("Launching Chromium...");
  const browser = await chromium.launch();

  // === Desktop captures @ 1440x900, 2x DPR for retina sharpness ===
  console.log("\n=== DESKTOP (1440x900 @ 2x) ===");
  const desktop = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: "dark",
  });

  for (const p of PAGES) {
    const tab = await desktop.newPage();
    try {
      await tab.goto(BASE + p.path, {
        waitUntil: "networkidle",
        timeout: 30000,
      });
      // Settle: fonts, lazy images, animations
      await tab.waitForTimeout(2500);
      // Hide the floating WhatsApp button to keep screenshots clean
      await tab.addStyleTag({
        content: `
          a[aria-label="Order on WhatsApp"] { display: none !important; }
        `,
      });
      const outPath = path.join(DESKTOP_DIR, `${p.name}.png`);
      await tab.screenshot({ path: outPath, fullPage: true });
      console.log(`  ✓ ${p.name}.png`);
    } catch (err) {
      console.log(`  ✗ ${p.name}: ${err instanceof Error ? err.message : err}`);
    } finally {
      await tab.close();
    }
  }
  await desktop.close();

  // === Mobile captures (iPhone 13) ===
  console.log("\n=== MOBILE (iPhone 13) ===");
  const mobile = await browser.newContext({
    ...devices["iPhone 13"],
  });

  const mobilePages = PAGES.slice(0, 5); // first 5
  for (const p of mobilePages) {
    const tab = await mobile.newPage();
    try {
      await tab.goto(BASE + p.path, {
        waitUntil: "networkidle",
        timeout: 30000,
      });
      await tab.waitForTimeout(2500);
      await tab.addStyleTag({
        content: `
          a[aria-label="Order on WhatsApp"] { display: none !important; }
        `,
      });
      const outPath = path.join(MOBILE_DIR, `${p.name}.png`);
      await tab.screenshot({ path: outPath, fullPage: true });
      console.log(`  ✓ ${p.name}.png`);
    } catch (err) {
      console.log(`  ✗ ${p.name}: ${err instanceof Error ? err.message : err}`);
    } finally {
      await tab.close();
    }
  }
  await mobile.close();

  // === Viewport-only desktop captures (above-the-fold heroes for cover images) ===
  console.log("\n=== HERO (1440x900, viewport only) ===");
  const hero = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: "dark",
  });

  const HERO_DIR = path.join(ROOT, "raw", "hero");
  ensureDir(HERO_DIR);

  for (const p of PAGES.slice(0, 4)) {
    const tab = await hero.newPage();
    try {
      await tab.goto(BASE + p.path, {
        waitUntil: "networkidle",
        timeout: 30000,
      });
      await tab.waitForTimeout(2500);
      await tab.addStyleTag({
        content: `
          a[aria-label="Order on WhatsApp"] { display: none !important; }
        `,
      });
      const outPath = path.join(HERO_DIR, `${p.name}.png`);
      await tab.screenshot({ path: outPath, fullPage: false });
      console.log(`  ✓ ${p.name}.png`);
    } catch (err) {
      console.log(`  ✗ ${p.name}: ${err instanceof Error ? err.message : err}`);
    } finally {
      await tab.close();
    }
  }
  await hero.close();

  await browser.close();
  console.log(`\nDone. Files in ${ROOT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
