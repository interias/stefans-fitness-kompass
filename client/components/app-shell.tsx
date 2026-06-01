import Link from "next/link";
import type { ReactNode } from "react";
import { HtmlLang } from "@/components/html-lang";
import { SiteHeader } from "@/components/site-header";
import { getAllChapters } from "@/lib/content";
import { getDictionary, type Locale, localizePath } from "@/lib/i18n";

type AppShellProps = {
  children: ReactNode;
  locale: Locale;
};

export function AppShell({ children, locale }: AppShellProps) {
  const chapters = getAllChapters(locale);
  const dictionary = getDictionary(locale);

  return (
    <>
      <HtmlLang locale={locale} />
      <SiteHeader chapters={chapters} locale={locale} />
      {children}
      <footer className="border-t border-stone-200 bg-white">
        <div className="mx-auto flex max-w-[112rem] flex-wrap justify-center gap-4 px-4 py-8 text-center text-sm leading-6 text-stone-600 sm:px-6 lg:px-8">
          <Link className="font-medium text-stone-800 hover:text-teal-800" href={localizePath(locale, "/kapitel")}>
            {dictionary.chapters}
          </Link>
          <Link className="font-medium text-stone-800 hover:text-teal-800" href={localizePath(locale, "/disclamer")}>
            Disclaimer
          </Link>
          <a className="font-medium text-stone-800 hover:text-teal-800" href="https://creativecommons.org/publicdomain/zero/1.0/">
            {dictionary.license}
          </a>
        </div>
      </footer>
    </>
  );
}
