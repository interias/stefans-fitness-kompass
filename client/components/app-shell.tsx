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
      <footer className="border-t border-fk-line">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 py-7 text-center text-[13.5px] text-fk-ink-faint md:px-10">
          <span>{dictionary.footer.copyright}</span>
          <Link
            className="underline decoration-fk-line underline-offset-2 transition-colors duration-150 hover:text-fk-teal-dark"
            href={localizePath(locale, "/disclamer")}
          >
            {dictionary.footer.disclaimer}
          </Link>
          <Link
            className="transition-colors duration-150 hover:text-fk-teal-dark"
            href={localizePath(locale, "/kapitel/15-quellen")}
          >
            {dictionary.footer.sources}
          </Link>
          <a
            className="transition-colors duration-150 hover:text-fk-teal-dark"
            href="https://github.com/interias/stefans-fitness-kompass/"
            rel="noreferrer"
            target="_blank"
          >
            {dictionary.footer.github}
          </a>
        </div>
      </footer>
    </>
  );
}
