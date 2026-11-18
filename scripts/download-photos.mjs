// Downloads all site photos at full size into photo-originals/ (gitignored):
//   1. Every listing photo in data/airbnb-listings.json -> photo-originals/stays/<slug>/01.jpg ...
//   2. Every city landmark in lib/cities.ts             -> photo-originals/cities/<slug>-landmark.jpg
// Then run scripts/compress-photos.mjs to make the small WebP copies the site uses.
// Safe to re-run: files that already exist are skipped.
// Run from the project root:  node scripts/download-photos.mjs
import { readFile, mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";

const UA = { "User-Agent": "MSHostingSite/1.0 (info.mshostingsolutions@gmail.com)" };
let done = 0, skipped = 0, failed = 0;

async function save(url, file, fallbacks = []) {
  try { await access(file); skipped++; return; } catch {}
  let lastErr;
  for (const u of [url, ...fallbacks]) {
    try {
      const res = await fetch(u, { headers: UA });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await writeFile(file, Buffer.from(await res.arrayBuffer()));
      done++;
      return;
    } catch (e) {
      lastErr = e;
    }
  }
  failed++;
  console.error(`x ${file}: ${lastErr.message}`);
}

// 1. Listing photos
const listings = JSON.parse(await readFile("data/airbnb-listings.json", "utf8"));
for (const l of listings) {
  const dir = path.join("photo-originals", "stays", l.slug);
  await mkdir(dir, { recursive: true });
  for (const [i, url] of l.photos.entries()) {
    const ext = url.toLowerCase().endsWith(".png") ? "png" : "jpg";
    // Some Airbnb originals refuse direct download; their resized copy still works.
    await save(url, path.join(dir, `${String(i + 1).padStart(2, "0")}.${ext}`), [`${url}?im_w=1440`]);
  }
  console.log(`ok ${l.slug} (${l.photos.length} photos)`);
}

// 2. City landmark photos (read straight from lib/cities.ts)
const src = await readFile("lib/cities.ts", "utf8");
const helpers = {
  wm: (p) => `https://upload.wikimedia.org/wikipedia/commons/${p}`,
  thumb: (p, f) => `https://upload.wikimedia.org/wikipedia/commons/thumb/${p}/1920px-${f}`,
};
await mkdir(path.join("photo-originals", "cities"), { recursive: true });
for (const m of src.matchAll(/slug: "([a-z-]+)"[\s\S]*?landmarkSource: (wm|thumb)\(([^)]*)\)/g)) {
  const [, slug, fn, rawArgs] = m;
  const args = [...rawArgs.matchAll(/"([^"]+)"/g)].map((a) => a[1]);
  // Saved as <slug>-landmark.jpg so M&S's own city photos are never overwritten.
  await save(helpers[fn](...args), path.join("photo-originals", "cities", `${slug}-landmark.jpg`));
  console.log(`ok city ${slug}`);
}

console.log(`\nDownloaded ${done}, already had ${skipped}, failed ${failed}.`);
console.log("Next: node scripts/compress-photos.mjs");
