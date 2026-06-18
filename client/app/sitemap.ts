import type { MetadataRoute } from "next";
import {
  getAllChapters,
  getChapterLastModified,
  getDisclaimerLastModified,
  getNewestChapterLastModified,
} from "@/lib/content";
import { localeLabels, locales, type Locale } from "@/lib/i18n";
import { chapterPath, chaptersPath, disclaimerPath, homePath } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

/**
 * Erzeugt für eine logische Seite je Locale einen <url>-Eintrag mit absoluter
 * URL und vollständigen hreflang-Alternates (de, en, zh-Hans, x-default).
 */
function localizedEntries(
  pathFor: (locale: Locale) => string,
  lastModifiedFor: (locale: Locale) => Date,
  changeFrequency: ChangeFrequency,
  priority: number,
): MetadataRoute.Sitemap {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[localeLabels[locale].htmlLang] = absoluteUrl(pathFor(locale));
  }
  languages["x-default"] = absoluteUrl(pathFor("de"));

  return locales.map((locale) => ({
    url: absoluteUrl(pathFor(locale)),
    lastModified: lastModifiedFor(locale),
    changeFrequency,
    priority,
    alternates: { languages },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const chapterSlugs = getAllChapters("de").map((chapter) => chapter.slug);

  const staticEntries: MetadataRoute.Sitemap = [
    ...localizedEntries(homePath, getNewestChapterLastModified, "weekly", 1),
    ...localizedEntries(chaptersPath, getNewestChapterLastModified, "monthly", 0.8),
    ...localizedEntries(disclaimerPath, getDisclaimerLastModified, "yearly", 0.3),
  ];

  const chapterEntries = chapterSlugs.flatMap((slug) =>
    localizedEntries(
      (locale) => chapterPath(locale, slug),
      (locale) => getChapterLastModified(slug, locale),
      "monthly",
      0.7,
    ),
  );

  return [...staticEntries, ...chapterEntries];
}
