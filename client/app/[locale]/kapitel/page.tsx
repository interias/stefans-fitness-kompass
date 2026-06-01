import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocalizedChaptersPage } from "@/app/_localized/chapters-page";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const dictionary = getDictionary(locale);

  return {
    title: dictionary.chapters,
    description: dictionary.chaptersDescription,
  };
}

export default async function LocaleChaptersPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return <LocalizedChaptersPage locale={locale as Locale} />;
}
