/**
 * Locale-bewusste SEO-Bausteine: Metadata (Canonical, hreflang, Open Graph,
 * Twitter) und JSON-LD (WebSite, Article, BreadcrumbList).
 *
 * Eine einzige Quelle für URL-Aufbau und Alternates, damit alle Routen (de
 * unpräfigiert sowie /en und /zh) konsistente, wechselseitig korrekte Angaben
 * erhalten.
 */
import type { Metadata } from "next";
import {
  defaultLocale,
  getDictionary,
  localeLabels,
  locales,
  type Locale,
  localizePath,
} from "@/lib/i18n";
import {
  absoluteUrl,
  authorName,
  githubUrl,
  licenseUrl,
  ogImage,
  ogImageHeight,
  ogImageType,
  ogImageWidth,
} from "@/lib/site";

/* ---------------------------------------------------------------------------
 * URL-Aufbau (mit abschließendem Slash, passend zu trailingSlash: true)
 * ------------------------------------------------------------------------ */

function withTrailingSlash(path: string): string {
  return path.endsWith("/") ? path : `${path}/`;
}

export function homePath(locale: Locale): string {
  return withTrailingSlash(localizePath(locale, "/"));
}

export function chaptersPath(locale: Locale): string {
  return withTrailingSlash(localizePath(locale, "/kapitel"));
}

export function chapterPath(locale: Locale, slug: string): string {
  return withTrailingSlash(localizePath(locale, `/kapitel/${slug}`));
}

export function disclaimerPath(locale: Locale): string {
  return withTrailingSlash(localizePath(locale, "/disclamer"));
}

/* ---------------------------------------------------------------------------
 * Open-Graph-Locale (Format sprache_TERRITORIUM)
 * ------------------------------------------------------------------------ */

const ogLocaleByLocale: Record<Locale, string> = {
  de: "de_DE",
  en: "en_US",
  zh: "zh_CN",
};

/* ---------------------------------------------------------------------------
 * Canonical + hreflang-Alternates
 * ------------------------------------------------------------------------ */

/**
 * hreflang-Zuordnung für eine Seite. `pathFor` liefert den (root-relativen)
 * Pfad je Locale; x-default zeigt auf die Standardsprache (de).
 */
function languagesFor(pathFor: (locale: Locale) => string): Record<string, string> {
  const languages: Record<string, string> = {};

  for (const locale of locales) {
    languages[localeLabels[locale].htmlLang] = pathFor(locale);
  }

  languages["x-default"] = pathFor(defaultLocale);

  return languages;
}

function alternatesFor(
  locale: Locale,
  pathFor: (locale: Locale) => string,
): NonNullable<Metadata["alternates"]> {
  return {
    canonical: pathFor(locale),
    languages: languagesFor(pathFor),
  };
}

/* ---------------------------------------------------------------------------
 * Gemeinsame Open-Graph-/Twitter-Defaults
 * ------------------------------------------------------------------------ */

const ogImages = [
  {
    url: ogImage,
    width: ogImageWidth,
    height: ogImageHeight,
    type: ogImageType,
    alt: "Stefans Fitness-Kompass",
  },
];

type PageMetaInput = {
  locale: Locale;
  title: string;
  description: string;
  pathFor: (locale: Locale) => string;
  type?: "website" | "article";
  /** true → `title` nicht über das Layout-Template ergänzen (für die Startseite). */
  absoluteTitle?: boolean;
};

function buildPageMetadata({
  locale,
  title,
  description,
  pathFor,
  type = "website",
  absoluteTitle = false,
}: PageMetaInput): Metadata {
  const dictionary = getDictionary(locale);
  const url = pathFor(locale);

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: alternatesFor(locale, pathFor),
    openGraph: {
      type,
      title,
      description,
      url,
      siteName: dictionary.siteTitle,
      locale: ogLocaleByLocale[locale],
      alternateLocale: locales.filter((other) => other !== locale).map((other) => ogLocaleByLocale[other]),
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages.map((image) => image.url),
    },
  };
}

/* ---------------------------------------------------------------------------
 * Metadata pro Seitentyp
 * ------------------------------------------------------------------------ */

export function homeMetadata(locale: Locale): Metadata {
  const dictionary = getDictionary(locale);

  return buildPageMetadata({
    locale,
    title: `${dictionary.siteTitle} — ${dictionary.siteSubtitle}`,
    description: dictionary.siteDescription,
    pathFor: homePath,
    absoluteTitle: true,
  });
}

export function chaptersMetadata(locale: Locale): Metadata {
  const dictionary = getDictionary(locale);

  return buildPageMetadata({
    locale,
    title: dictionary.chaptersTitle,
    description: dictionary.chaptersDescription,
    pathFor: chaptersPath,
  });
}

export function disclaimerMetadata(locale: Locale): Metadata {
  const description =
    locale === "de"
      ? "Medizinischer und rechtlicher Hinweis zum Fitness-Kompass."
      : locale === "zh"
        ? "关于健身指南的医学与法律说明。"
        : "Medical and legal notice for the Fitness Compass.";

  return buildPageMetadata({
    locale,
    title: locale === "zh" ? "免责声明" : "Disclaimer",
    description,
    pathFor: disclaimerPath,
  });
}

type ChapterMetaInput = {
  slug: string;
  title: string;
  summary: string;
};

export function chapterMetadata(locale: Locale, chapter: ChapterMetaInput): Metadata {
  return buildPageMetadata({
    locale,
    title: chapter.title,
    description: chapter.summary,
    pathFor: (target) => chapterPath(target, chapter.slug),
    type: "article",
  });
}

/* ---------------------------------------------------------------------------
 * JSON-LD
 * ------------------------------------------------------------------------ */

type JsonLdObject = Record<string, unknown>;

function publisher(): JsonLdObject {
  return {
    "@type": "Person",
    name: authorName,
    url: githubUrl,
  };
}

/** WebSite-Knoten für die Startseite (inkl. SearchAction auf die interne Suche). */
export function websiteJsonLd(locale: Locale): JsonLdObject {
  const dictionary = getDictionary(locale);
  const homeUrl = absoluteUrl(homePath(locale));

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${homeUrl}#website`,
    name: dictionary.siteTitle,
    alternateName: "Fitness-Kompass",
    url: homeUrl,
    description: dictionary.siteDescription,
    inLanguage: localeLabels[locale].htmlLang,
    publisher: publisher(),
    license: licenseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${homeUrl}?q={search_term_string}#suche`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/** Article-Knoten für eine Kapitelseite. */
export function chapterArticleJsonLd(
  locale: Locale,
  chapter: { slug: string; title: string; summary: string },
  lastModifiedIso: string,
): JsonLdObject {
  const canonical = absoluteUrl(chapterPath(locale, chapter.slug));
  const homeUrl = absoluteUrl(homePath(locale));

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: chapter.title,
    description: chapter.summary,
    inLanguage: localeLabels[locale].htmlLang,
    url: canonical,
    mainEntityOfPage: canonical,
    image: ogImages.map((image) => absoluteUrl(image.url)),
    datePublished: lastModifiedIso,
    dateModified: lastModifiedIso,
    author: publisher(),
    publisher: publisher(),
    license: licenseUrl,
    isPartOf: { "@id": `${homeUrl}#website` },
  };
}

/** BreadcrumbList: Start → Kapitelübersicht (mit Gruppenlabel) → Kapitel. */
export function chapterBreadcrumbJsonLd(
  locale: Locale,
  chapter: { slug: string; title: string },
  groupLabel: string,
): JsonLdObject {
  const dictionary = getDictionary(locale);

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: dictionary.breadcrumbHome,
        item: absoluteUrl(homePath(locale)),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: groupLabel,
        item: absoluteUrl(chaptersPath(locale)),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: chapter.title,
        item: absoluteUrl(chapterPath(locale, chapter.slug)),
      },
    ],
  };
}
