import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocalizedChapterPage } from "@/app/_localized/chapter-page";
import { getAllChapters, getChapter } from "@/lib/content";
import { isLocale, locales, type Locale } from "@/lib/i18n";

type PageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getAllChapters(locale).map((chapter) => ({
      locale,
      slug: chapter.slug,
    })),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const chapter = getChapter(slug, locale);

  if (!chapter) {
    return {};
  }

  return {
    title: chapter.title,
    description: chapter.summary,
  };
}

export default async function LocaleChapterPage({ params }: PageProps) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return <LocalizedChapterPage locale={locale as Locale} slug={slug} />;
}
