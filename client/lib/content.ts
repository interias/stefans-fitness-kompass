import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";
import matter from "gray-matter";
import { defaultLocale, getDictionary, type Locale, localizePath } from "@/lib/i18n";

const clientRoot = process.cwd();
const repositoryRoot = path.resolve(process.cwd(), "..");
const docsDirectory = path.join(repositoryRoot, "docs");
const localizedContentRoot = path.join(clientRoot, "content");
const chapterFilePattern = /^\d{2}-.+\.md$/;

export type Heading = {
  id: string;
  level: 2 | 3;
  text: string;
};

export type ChapterMeta = {
  fileName: string;
  heroImage?: string;
  number: string;
  searchText: string;
  slug: string;
  summary: string;
  title: string;
};

export type Chapter = ChapterMeta & {
  headings: Heading[];
  markdown: string;
};

export type ChapterContext = {
  next?: ChapterMeta;
  previous?: ChapterMeta;
};

export type SearchEntry = {
  chapterNumber: string;
  chapterSlug: string;
  chapterTitle: string;
  heading: string;
  href: string;
  id: string;
  searchText: string;
  text: string;
};

function getCollator(locale: Locale) {
  return new Intl.Collator(locale === "zh" ? "zh-Hans" : locale, { numeric: true });
}

function getContentDirectory(locale: Locale) {
  if (locale === defaultLocale) {
    return docsDirectory;
  }

  return path.join(localizedContentRoot, locale);
}

function readChapterFile(fileName: string, locale: Locale) {
  return fs.readFileSync(path.join(getContentDirectory(locale), fileName), "utf8");
}

export function readDisclaimer(locale: Locale) {
  const filePath =
    locale === defaultLocale
      ? path.join(repositoryRoot, "DISCLAIMER.md")
      : path.join(getContentDirectory(locale), "DISCLAIMER.md");

  return fs.readFileSync(filePath, "utf8");
}

function getChapterFileNames(locale: Locale) {
  return fs
    .readdirSync(getContentDirectory(locale))
    .filter((fileName) => chapterFilePattern.test(fileName))
    .sort((a, b) => getCollator(locale).compare(a, b));
}

function stripInlineMarkup(value: string) {
  return value
    .replace(/<[^>]+>/g, "")
    .replace(/!\[[^\]]*]\([^)]+\)/g, "")
    .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTitle(markdown: string, slug: string) {
  const titleMatch = markdown.match(/^#\s+(.+)$/m);
  return titleMatch ? stripInlineMarkup(titleMatch[1]) : slug;
}

function extractSummary(markdown: string) {
  const withoutTitle = markdown.replace(/^#\s+.+$/m, "");
  const beforeFirstSection = withoutTitle.split(/\n#{2,6}\s+/)[0];
  const beforeFirstList = beforeFirstSection.split(/\n[-*]\s+/)[0].split(/\n---+/)[0];
  const withoutMedia = beforeFirstList
    .replace(/^#\s+.+$/m, "")
    .replace(/<p[^>]*>\s*<img[\s\S]*?<\/p>/gi, "")
    .replace(/!\[[^\]]*]\([^)]+\)/g, "");

  const block = withoutMedia
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .find(
      (part) =>
        part.length > 0 &&
        !part.startsWith("#") &&
        !part.startsWith("|") &&
        !part.startsWith("- ") &&
        !part.startsWith("*"),
    );

  const summary = block ? stripInlineMarkup(block) : "";
  return summary.length > 180 ? `${summary.slice(0, 177).trim()}...` : summary;
}

export function toPublicAssetPath(value: string) {
  const normalized = value.replace(/\\/g, "/");

  if (
    normalized.startsWith("http://") ||
    normalized.startsWith("https://") ||
    normalized.startsWith("data:") ||
    normalized.startsWith("#") ||
    normalized.startsWith("/")
  ) {
    return normalized;
  }

  if (normalized.startsWith("../assets/")) {
    return `/${normalized.replace(/^\.\.\//, "")}`;
  }

  if (normalized.startsWith("./assets/")) {
    return `/${normalized.replace(/^\.\//, "")}`;
  }

  if (normalized.startsWith("assets/")) {
    return `/${normalized}`;
  }

  return normalized;
}

export function toOptimizedAssetPath(value: string) {
  const publicPath = toPublicAssetPath(value);
  const suffixMatch = publicPath.match(/([?#].*)$/);
  const suffix = suffixMatch?.[1] ?? "";
  const pathWithoutSuffix = suffix ? publicPath.slice(0, -suffix.length) : publicPath;

  if (!pathWithoutSuffix.startsWith("/assets/")) {
    return publicPath;
  }

  if (!/\.(jpe?g|png)$/i.test(pathWithoutSuffix)) {
    return publicPath;
  }

  return `${pathWithoutSuffix.replace(/\.(jpe?g|png)$/i, ".webp")}${suffix}`;
}

function extractHeroImage(markdown: string) {
  const htmlImageMatch = markdown.match(/<img[^>]+src=["']([^"']+)["']/i);
  const markdownImageMatch = markdown.match(/!\[[^\]]*]\(([^)]+)\)/);
  const imagePath = htmlImageMatch?.[1] ?? markdownImageMatch?.[1];
  return imagePath ? toOptimizedAssetPath(imagePath) : undefined;
}

function extractHeadings(markdown: string) {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  const headingPattern = /^(#{1,6})\s+(.+)$/gm;
  let match: RegExpExecArray | null;

  while ((match = headingPattern.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = stripInlineMarkup(match[2]);
    const id = slugger.slug(text);

    if (!text || (level !== 2 && level !== 3)) {
      continue;
    }

    headings.push({
      id,
      level: level as 2 | 3,
      text,
    });
  }

  return headings;
}

function removeBlockMarkup(value: string) {
  return value
    .replace(/<p[^>]*>\s*<img[\s\S]*?<\/p>/gi, " ")
    .replace(/!\[[^\]]*]\([^)]+\)/g, " ")
    .replace(/^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/gm, " ")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/^\s*>\s?/gm, "")
    .replace(/\|/g, " ");
}

function createSearchText(markdown: string) {
  return stripInlineMarkup(removeBlockMarkup(markdown))
    .replace(/\s+/g, " ")
    .trim();
}

function truncateText(value: string, maxLength = 280) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 3).trim()}...`;
}

function addSearchEntry(
  entries: SearchEntry[],
  meta: ChapterMeta,
  locale: Locale,
  heading: string,
  headingId: string | undefined,
  rawText: string,
  index: number,
) {
  const searchText = createSearchText(rawText);

  if (searchText.length < 18) {
    return;
  }

  entries.push({
    chapterNumber: meta.number,
    chapterSlug: meta.slug,
    chapterTitle: meta.title,
    heading,
    href: localizePath(locale, `/kapitel/${meta.slug}${headingId ? `#${headingId}` : ""}`),
    id: `${meta.slug}-${headingId ?? "intro"}-${index}`,
    searchText,
    text: truncateText(searchText),
  });
}

function createChapterSearchEntries(meta: ChapterMeta, markdown: string, locale: Locale) {
  const slugger = new GithubSlugger();
  const entries: SearchEntry[] = [];
  const lines = markdown.split(/\r?\n/);
  let heading = getDictionary(locale).overview;
  let headingId: string | undefined;
  let block: string[] = [];
  let index = 0;

  const flushBlock = () => {
    if (block.length === 0) {
      return;
    }

    addSearchEntry(entries, meta, locale, heading, headingId, block.join("\n"), index);
    block = [];
    index += 1;
  };

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);

    if (headingMatch) {
      flushBlock();

      const level = headingMatch[1].length;
      const text = stripInlineMarkup(headingMatch[2]);
      const id = slugger.slug(text);

      if (level === 2 || level === 3) {
        heading = text;
        headingId = id;
      }

      continue;
    }

    if (/^\s*$/.test(line) || /^\s*---+\s*$/.test(line)) {
      flushBlock();
      continue;
    }

    if (/<img[^>]+src=/i.test(line) || /!\[[^\]]*]\([^)]+\)/.test(line)) {
      continue;
    }

    if (/^\s*([-*+]|\d+\.)\s+/.test(line)) {
      flushBlock();
      addSearchEntry(entries, meta, locale, heading, headingId, line, index);
      index += 1;
      continue;
    }

    block.push(line);
  }

  flushBlock();

  return entries;
}

function createChapterMeta(fileName: string, locale: Locale): ChapterMeta {
  const slug = fileName.replace(/\.md$/, "");
  const number = slug.slice(0, 2);
  const markdown = matter(readChapterFile(fileName, locale)).content;

  return {
    fileName,
    heroImage: extractHeroImage(markdown),
    number,
    searchText: createSearchText(markdown),
    slug,
    summary: extractSummary(markdown),
    title: extractTitle(markdown, slug),
  };
}

export function getAllChapters(locale: Locale = defaultLocale) {
  return getChapterFileNames(locale).map((fileName) => createChapterMeta(fileName, locale));
}

export function getSearchEntries(locale: Locale = defaultLocale) {
  return getChapterFileNames(locale).flatMap((fileName) => {
    const parsed = matter(readChapterFile(fileName, locale));
    const meta = createChapterMeta(fileName, locale);
    return createChapterSearchEntries(meta, parsed.content, locale);
  });
}

export function getChapter(slug: string, locale: Locale = defaultLocale): Chapter | undefined {
  const fileName = `${slug}.md`;

  if (!chapterFilePattern.test(fileName)) {
    return undefined;
  }

  const fullPath = path.join(getContentDirectory(locale), fileName);
  if (!fs.existsSync(fullPath)) {
    return undefined;
  }

  const parsed = matter(readChapterFile(fileName, locale));
  const meta = createChapterMeta(fileName, locale);

  return {
    ...meta,
    headings: extractHeadings(parsed.content),
    markdown: parsed.content,
  };
}

export function getChapterContext(slug: string, locale: Locale = defaultLocale): ChapterContext {
  const chapters = getAllChapters(locale);
  const index = chapters.findIndex((chapter) => chapter.slug === slug);

  return {
    previous: index > 0 ? chapters[index - 1] : undefined,
    next: index >= 0 && index < chapters.length - 1 ? chapters[index + 1] : undefined,
  };
}

/* ---------------------------------------------------------------------------
 * Letzte Änderung (für sitemap lastmod und JSON-LD dateModified)
 *
 * Bevorzugt das Git-Commit-Datum der Quelldatei (inhaltlich aussagekräftig);
 * fällt auf die Datei-mtime und schließlich auf "jetzt" zurück, falls Git im
 * Build nicht verfügbar ist. Ergebnisse werden je Pfad gecacht.
 * ------------------------------------------------------------------------ */

const lastModifiedCache = new Map<string, Date>();

function lastModifiedForFile(absolutePath: string): Date {
  const cached = lastModifiedCache.get(absolutePath);
  if (cached) {
    return cached;
  }

  let result: Date | undefined;

  try {
    const iso = execFileSync("git", ["log", "-1", "--format=%cI", "--", absolutePath], {
      cwd: repositoryRoot,
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();

    if (iso) {
      const parsed = new Date(iso);
      if (!Number.isNaN(parsed.getTime())) {
        result = parsed;
      }
    }
  } catch {
    // Git nicht verfügbar – Fallback unten.
  }

  if (!result) {
    try {
      result = fs.statSync(absolutePath).mtime;
    } catch {
      result = new Date();
    }
  }

  lastModifiedCache.set(absolutePath, result);
  return result;
}

function getChapterSourcePath(slug: string, locale: Locale) {
  return path.join(getContentDirectory(locale), `${slug}.md`);
}

function getDisclaimerSourcePath(locale: Locale) {
  return locale === defaultLocale
    ? path.join(repositoryRoot, "DISCLAIMER.md")
    : path.join(getContentDirectory(locale), "DISCLAIMER.md");
}

export function getChapterLastModified(slug: string, locale: Locale = defaultLocale): Date {
  return lastModifiedForFile(getChapterSourcePath(slug, locale));
}

export function getDisclaimerLastModified(locale: Locale = defaultLocale): Date {
  return lastModifiedForFile(getDisclaimerSourcePath(locale));
}

/** Neueste Änderung über alle Kapitel – für Startseite und Kapitelübersicht. */
export function getNewestChapterLastModified(locale: Locale = defaultLocale): Date {
  const dates = getChapterFileNames(locale).map((fileName) =>
    lastModifiedForFile(path.join(getContentDirectory(locale), fileName)),
  );

  return dates.reduce((newest, current) => (current > newest ? current : newest), new Date(0));
}
