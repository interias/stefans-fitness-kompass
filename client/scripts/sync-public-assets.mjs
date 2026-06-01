import { copyFile, mkdir, readdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const clientRoot = process.cwd();
const repositoryRoot = path.resolve(clientRoot, "..");
const sourceRoot = path.resolve(repositoryRoot, "assets");
const targetRoot = path.resolve(clientRoot, "public", "assets");
const publicRoot = path.resolve(clientRoot, "public");
const rasterExtensions = new Set([".jpeg", ".jpg", ".png"]);
const passthroughExtensions = new Set([
  ".avif",
  ".gif",
  ".svg",
  ".webp",
]);

function maxWidthFor(relativePath) {
  const normalized = relativePath.replace(/\\/g, "/");

  if (
    normalized === "fitness-kompass-readme-hero.png" ||
    normalized === "fitness-kompass-banner.png"
  ) {
    return 1920;
  }

  return 1600;
}

async function optimizeRasterImage(sourcePath, relativePath) {
  const extension = path.extname(relativePath);
  const targetRelativePath = relativePath.slice(0, -extension.length) + ".webp";
  const targetPath = path.join(targetRoot, targetRelativePath);
  const sourceStats = await stat(sourcePath);
  const metadata = await sharp(sourcePath).metadata();
  const maxWidth = maxWidthFor(relativePath);
  const targetWidth = metadata.width && metadata.width > maxWidth ? maxWidth : metadata.width;

  await mkdir(path.dirname(targetPath), { recursive: true });

  let pipeline = sharp(sourcePath).rotate();

  if (targetWidth && metadata.width && metadata.width > targetWidth) {
    pipeline = pipeline.resize({
      width: targetWidth,
      withoutEnlargement: true,
    });
  }

  const output = await pipeline
    .webp({
      effort: 6,
      quality: metadata.hasAlpha ? 90 : 82,
      smartSubsample: true,
    })
    .toFile(targetPath);

  return {
    optimizedBytes: output.size,
    originalBytes: sourceStats.size,
  };
}

async function copyPassthroughAsset(sourcePath, relativePath) {
  const targetPath = path.join(targetRoot, relativePath);
  const sourceStats = await stat(sourcePath);

  await mkdir(path.dirname(targetPath), { recursive: true });
  await copyFile(sourcePath, targetPath);

  return {
    optimizedBytes: sourceStats.size,
    originalBytes: sourceStats.size,
  };
}

async function processImages(sourceDir, targetDir, stats) {
  await mkdir(targetDir, { recursive: true });

  const entries = await readdir(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
      const sourcePath = path.join(sourceDir, entry.name);
      const targetPath = path.join(targetDir, entry.name);

      if (entry.isDirectory()) {
        await processImages(sourcePath, targetPath, stats);
        continue;
      }

      if (!entry.isFile()) {
        continue;
      }

      const extension = path.extname(entry.name).toLowerCase();
      const relativePath = path.relative(sourceRoot, sourcePath);

      if (rasterExtensions.has(extension)) {
        const result = await optimizeRasterImage(sourcePath, relativePath);
        stats.originalBytes += result.originalBytes;
        stats.optimizedBytes += result.optimizedBytes;
        stats.optimized += 1;
        continue;
      }

      if (passthroughExtensions.has(extension)) {
        const result = await copyPassthroughAsset(sourcePath, relativePath);
        stats.originalBytes += result.originalBytes;
        stats.optimizedBytes += result.optimizedBytes;
        stats.copied += 1;
      }
  }
}

function formatMegabytes(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

try {
  await stat(sourceRoot);

  if (!targetRoot.startsWith(`${publicRoot}${path.sep}`)) {
    throw new Error(`Refusing to clean unexpected target directory: ${targetRoot}`);
  }

  await rm(targetRoot, { recursive: true, force: true });

  const stats = {
    copied: 0,
    optimized: 0,
    optimizedBytes: 0,
    originalBytes: 0,
  };

  await processImages(sourceRoot, targetRoot, stats);

  console.log(
    `Optimized ${stats.optimized} raster assets and copied ${stats.copied} passthrough assets to ${path.relative(clientRoot, targetRoot)} (${formatMegabytes(stats.originalBytes)} -> ${formatMegabytes(stats.optimizedBytes)})`,
  );
} catch (error) {
  if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
    console.log("No assets directory found; skipping asset sync.");
  } else {
    throw error;
  }
}
