import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocalizedChaptersPage } from "@/app/_localized/chapters-page";
import { isLocale, prefixedLocales, type Locale } from "@/lib/i18n";
import { chaptersMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return prefixedLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  return chaptersMetadata(locale);
}

export default async function LocaleChaptersPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return <LocalizedChaptersPage locale={locale as Locale} />;
}
