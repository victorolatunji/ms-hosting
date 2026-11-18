// Makes the small, fast WebP copies the site actually serves.
//   photo-originals/stays/<slug>/NN.jpg  -> public/stays/<slug>/NN.webp
//   photo-originals/cities/<x>.jpg        -> public/cities/<x>.webp
// Max 1600px on the long side, quality 78. Skips files already converted.
// Uses sharp, which ships with Next.js.
// Run from the project root:  node scripts/compress-photos.mjs
import { readdir, mkdir, access } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = "photo-originals";
let made = 0, skipped = 0, failed = 0;

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "cities-unused" && entry.name !== "retired") await walk(full);
      continue;
    }
    if (!/\.(jpe?g|png)$/i.test(entry.name)) continue;
    const rel = path.relative(SRC, full).replace(/\.(jpe?g|png)$/i, ".webp");
    const out = path.join("public", rel);
    try { await access(out); skipped++; continue; } catch {}
    try {
      await mkdir(path.dirname(out), { recursive: true });
      await sharp(full).rotate().resize(1600, 1600, { fit: "inside", withoutEnlargement: true }).webp({ quality: 78 }).toFile(out);
      made++;
    } catch (e) {
      failed++;
      console.error(`x ${full}: ${e.message}`);
    }
  }
}

await walk(SRC);
console.log(`Compressed ${made}, already done ${skipped}, failed ${failed}.`);
