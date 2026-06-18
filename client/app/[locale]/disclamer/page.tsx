import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocalizedDisclaimerPage } from "@/app/_localized/disclaimer-page";
import { isLocale, prefixedLocales, type Locale } from "@/lib/i18n";
import { disclaimerMetadata } from "@/lib/seo";

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

  return disclaimerMetadata(locale);
}

export default async function LocaleDisclamerPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return <LocalizedDisclaimerPage locale={locale as Locale} />;
}
