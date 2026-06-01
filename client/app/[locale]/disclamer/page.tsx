import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocalizedDisclaimerPage } from "@/app/_localized/disclaimer-page";
import { isLocale, locales, type Locale } from "@/lib/i18n";

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

  return {
    title: locale === "zh" ? "免责声明" : "Disclaimer",
    description:
      locale === "de"
        ? "Medizinischer und rechtlicher Hinweis zum Fitness-Kompass."
        : locale === "zh"
          ? "关于健身指南的医学与法律说明。"
          : "Medical and legal notice for the Fitness Compass.",
  };
}

export default async function LocaleDisclamerPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return <LocalizedDisclaimerPage locale={locale as Locale} />;
}
