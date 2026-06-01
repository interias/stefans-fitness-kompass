"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BookOpen, Compass, ExternalLink, Menu, Search, X } from "lucide-react";
import type { ChapterMeta } from "@/lib/content";
import { getDictionary, localeLabels, locales, type Locale, localizePath, stripLocalePrefix } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type SiteHeaderProps = {
  chapters: ChapterMeta[];
  locale: Locale;
};

export function SiteHeader({ chapters, locale }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const dictionary = getDictionary(locale);
  const resourcePath = stripLocalePrefix(pathname || "/");

  const languageTabs = (
    <div className="flex rounded-md border border-stone-200 bg-white p-0.5" aria-label="Sprache waehlen">
      {locales.map((targetLocale) => {
        const label = localeLabels[targetLocale];
        const active = targetLocale === locale;

        return (
          <Link
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex h-8 min-w-10 items-center justify-center rounded px-2 text-sm transition",
              active ? "bg-teal-900 text-white" : "text-stone-700 hover:bg-stone-100",
            )}
            href={localizePath(targetLocale, resourcePath)}
            hrefLang={label.htmlLang}
            key={targetLocale}
            title={label.label}
          >
            <span aria-hidden="true">{label.flag}</span>
            <span className="sr-only">{label.label}</span>
          </Link>
        );
      })}
    </div>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[112rem] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link className="flex min-w-0 items-center gap-3 font-semibold text-stone-950" href={localizePath(locale, "/")}>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-teal-900 text-white">
            <Compass className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="truncate">{dictionary.siteTitle}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Hauptnavigation">
          <Link className="rounded-md px-3 py-2 text-sm text-stone-700 hover:bg-stone-100" href={localizePath(locale, "/kapitel")}>
            {dictionary.chapters}
          </Link>
          <Link className="rounded-md px-3 py-2 text-sm text-stone-700 hover:bg-stone-100" href={localizePath(locale, "/#suche")}>
            {dictionary.searchNav}
          </Link>
          <a
            className="rounded-md px-3 py-2 text-sm text-stone-700 hover:bg-stone-100"
            href="https://github.com/interias/stefans-fitness-kompass/"
            rel="noreferrer"
            target="_blank"
          >
            {dictionary.github}
          </a>
          <div className="ml-2">{languageTabs}</div>
        </nav>

        <button
          aria-expanded={open}
          aria-label={open ? dictionary.closeNavigation : dictionary.openNavigation}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-stone-200 text-stone-700 md:hidden"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>

      <div
        className={cn(
          "border-t border-stone-200 bg-white px-4 py-4 md:hidden",
          open ? "block" : "hidden",
        )}
      >
        <div className="mb-3 md:hidden">{languageTabs}</div>
        <div className="mb-3 grid grid-cols-3 gap-2">
          <Link
            className="flex items-center gap-2 rounded-md border border-stone-200 px-3 py-2 text-sm font-medium text-stone-800"
            href={localizePath(locale, "/kapitel")}
            onClick={() => setOpen(false)}
          >
            <BookOpen className="h-4 w-4 text-teal-800" aria-hidden="true" />
            {dictionary.chapters}
          </Link>
          <Link
            className="flex items-center gap-2 rounded-md border border-stone-200 px-3 py-2 text-sm font-medium text-stone-800"
            href={localizePath(locale, "/#suche")}
            onClick={() => setOpen(false)}
          >
            <Search className="h-4 w-4 text-teal-800" aria-hidden="true" />
            {dictionary.searchNav}
          </Link>
          <a
            className="flex items-center gap-2 rounded-md border border-stone-200 px-3 py-2 text-sm font-medium text-stone-800"
            href="https://github.com/interias/stefans-fitness-kompass/"
            onClick={() => setOpen(false)}
            rel="noreferrer"
            target="_blank"
          >
            <ExternalLink className="h-4 w-4 text-teal-800" aria-hidden="true" />
            {dictionary.github}
          </a>
        </div>
        <div className="max-h-80 overflow-y-auto rounded-md border border-stone-200">
          {chapters.map((chapter) => (
            <Link
              className="flex gap-3 border-b border-stone-100 px-3 py-2 text-sm text-stone-700 last:border-b-0"
              href={localizePath(locale, `/kapitel/${chapter.slug}`)}
              key={chapter.slug}
              onClick={() => setOpen(false)}
            >
              <span className="w-6 shrink-0 tabular-nums text-stone-500">{chapter.number}</span>
              <span>{chapter.title.replace(/^\d+\s*/, "")}</span>
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
