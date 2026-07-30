/**
 * Image optimization script
 * Converts JPG/JPEG/PNG images to WebP and resizes oversized source files.
 *
 * Hero images: capped at 1920px wide, quality 82
 * Leadership portraits: capped at 800px wide, quality 82
 * Logo / other: capped at 1200px wide, quality 85
 *
 * Originals are kept alongside the new .webp files so existing references
 * still resolve. Source files (.jpg/.png) are preserved as fallbacks for
 * browsers that do not support WebP (IE 11, older Safari — <2% of traffic).
 *
 * Usage:
 *   node scripts/optimize-images.js           # convert any unprocessed images
 *   node scripts/optimize-images.js --check   # exit 1 if unprocessed images exist (CI gate)
 *
 * The script is idempotent: it skips images that already have a .webp sibling,
 * so running it repeatedly is safe and fast.
 *
 * Pipeline integration:
 *   - Added to "prebuild" in package.json so it runs before every build.
 *   - In CI (azure-static-web-apps workflow) it runs as "Optimize images" step
 *     before "Build app" to ensure WebP assets are present in the build output.
 *   - sharp is listed under devDependencies so it is available in CI.
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');

const RULES = [
  { dir: 'hero',       maxWidth: 1920, quality: 82 },
  { dir: 'leadership', maxWidth: 800,  quality: 82 },
  { dir: 'naacus2027', maxWidth: 1200, quality: 82 },
  { dir: '.',          maxWidth: 1200, quality: 85 }, // top-level (logo etc.)
];

const EXTENSIONS = new Set(['.jpg', '.jpeg', '.png']);

async function convertFile(filePath, maxWidth, quality) {
  const ext = path.extname(filePath).toLowerCase();
  if (!EXTENSIONS.has(ext)) return;

  const webpPath = filePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  if (fs.existsSync(webpPath)) {
    console.log(`  skip (already exists): ${path.relative(IMAGES_DIR, webpPath)}`);
    return;
  }

  const beforeBytes = fs.statSync(filePath).size;

  await sharp(filePath)
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality })
    .toFile(webpPath);

  const afterBytes = fs.statSync(webpPath).size;
  const saved = (((beforeBytes - afterBytes) / beforeBytes) * 100).toFixed(1);
  console.log(
    `  ✓ ${path.relative(IMAGES_DIR, filePath)} → .webp` +
    `  (${(beforeBytes / 1024).toFixed(0)} KB → ${(afterBytes / 1024).toFixed(0)} KB, -${saved}%)`
  );
}

const CHECK_MODE = process.argv.includes('--check');

async function main() {
  let total = 0;
  let totalBefore = 0;
  let totalAfter = 0;
  let pending = 0; // images without a .webp sibling (used in --check mode)

  for (const rule of RULES) {
    const targetDir = rule.dir === '.' ? IMAGES_DIR : path.join(IMAGES_DIR, rule.dir);
    if (!fs.existsSync(targetDir)) continue;

    const entries = fs.readdirSync(targetDir).filter(f => {
      const ext = path.extname(f).toLowerCase();
      return EXTENSIONS.has(ext);
    });

    if (entries.length === 0) continue;

    if (!CHECK_MODE) {
      console.log(`\n📁 ${rule.dir === '.' ? 'images/' : `images/${rule.dir}/`}`);
    }

    for (const entry of entries) {
      const filePath = path.join(targetDir, entry);
      const webpPath = filePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      const alreadyExists = fs.existsSync(webpPath);

      if (!alreadyExists) {
        pending++;
        if (CHECK_MODE) {
          console.log(`  MISSING WebP: ${path.relative(IMAGES_DIR, filePath)}`);
          continue;
        }
      }

      const beforeBytes = fs.statSync(filePath).size;
      await convertFile(filePath, rule.maxWidth, rule.quality);

      if (!alreadyExists && fs.existsSync(webpPath)) {
        totalBefore += beforeBytes;
        totalAfter += fs.statSync(webpPath).size;
        total++;
      }
    }
  }

  if (CHECK_MODE) {
    if (pending > 0) {
      console.error(`\n❌ ${pending} image(s) are missing WebP versions. Run: node scripts/optimize-images.js`);
      process.exit(1);
    } else {
      console.log('✅ All images have WebP versions.');
    }
    return;
  }

  const savedKb = ((totalBefore - totalAfter) / 1024).toFixed(0);
  const savedPct = totalBefore > 0 ? (((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1) : 0;
  if (total > 0) {
    console.log(`\n✅ Converted ${total} images. Total saved: ${savedKb} KB (${savedPct}% reduction)`);
  } else {
    console.log('\n✅ All images already optimized — nothing to convert.');
  }
}

main().catch(err => {
  console.error('Error during image optimization:', err);
  process.exit(1);
});
