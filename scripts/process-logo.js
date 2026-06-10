// Convert logo.jpg → logo.png with white background made transparent + upscale for crispness.
// Usage: node scripts/process-logo.js
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const SRC = path.join(__dirname, "..", "public", "logo.jpg");
const OUT = path.join(__dirname, "..", "public", "logo.png");
const TARGET_SIZE = 800; // upscale for retina-sharp rendering

async function main() {
  if (!fs.existsSync(SRC)) {
    console.error("Source not found:", SRC);
    process.exit(1);
  }

  // 1) Upscale with high-quality kernel + ensure RGBA buffer
  const upscaled = await sharp(SRC)
    .resize(TARGET_SIZE, TARGET_SIZE, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 1 },
      kernel: sharp.kernel.lanczos3,
    })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { data, info } = upscaled;
  const { width, height, channels } = info;

  // 2) Walk every pixel; if it is near-white, make it transparent.
  //    Soft threshold so edges remain anti-aliased instead of jagged.
  const WHITE_LO = 235;   // pixels above this start fading to transparent
  const WHITE_HI = 252;   // pixels above this become fully transparent

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const min = Math.min(r, g, b);

    // Only treat near-greyscale-white as background (don't touch coloured pixels).
    const isColoured = Math.max(r, g, b) - min > 30;
    if (isColoured) continue;

    if (min >= WHITE_HI) {
      data[i + 3] = 0; // fully transparent
    } else if (min >= WHITE_LO) {
      // smooth fade so edges blend instead of jagged stair-step
      const t = (min - WHITE_LO) / (WHITE_HI - WHITE_LO);
      data[i + 3] = Math.round(255 * (1 - t));
    }
  }

  await sharp(data, { raw: { width, height, channels } })
    .png({ compressionLevel: 9, quality: 95 })
    .toFile(OUT);

  const finalSize = fs.statSync(OUT).size;
  console.log(`✓ Wrote ${OUT}`);
  console.log(`  ${width}×${height} px · ${(finalSize / 1024).toFixed(1)} KB`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
