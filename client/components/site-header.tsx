"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BookOpen, Compass, ExternalLink, Menu, Search, X } from "lucide-react";
import type { ChapterMeta } from "@/lib/content";
import { getDictionary, localeLabels, locales, type Locale, localizePath, stripLocalePrefix } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type SiteHeaderProps = {
  chapters: ChapterMeta[];
  locale: Locale;
};

const SOURCES_SLUG = "15-quellen";

export function SiteHeader({ chapters, locale }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dictionary = getDictionary(locale);
  const resourcePath = stripLocalePrefix(pathname || "/");
  const searchHref = localizePath(locale, "/#suche");

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        const input = document.getElementById("fk-search-input");

        if (input instanceof HTMLInputElement) {
          input.focus();
          return;
        }

        router.push(searchHref);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router, searchHref]);

  const isSources = resourcePath.startsWith(`/kapitel/${SOURCES_SLUG}`);
  const navLinks = [
    { active: resourcePath === "/", href: localizePath(locale, "/"), label: dictionary.nav.compass },
    {
      active: resourcePath.startsWith("/kapitel") && !isSources,
      href: localizePath(locale, "/kapitel"),
      label: dictionary.nav.chapters,
    },
    {
      active: isSources,
      href: localizePath(locale, `/kapitel/${SOURCES_SLUG}`),
      label: dictionary.nav.sources,
    },
  ];

  const languageTabs = (
    <div className="flex rounded-lg border border-fk-line bg-white p-0.5" aria-label="Sprache waehlen">
      {locales.map((targetLocale) => {
        const label = localeLabels[targetLocale];
        const active = targetLocale === locale;

        return (
          <Link
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex h-8 min-w-10 items-center justify-center rounded-md px-2 text-[13px] transition-colors duration-150",
              active ? "bg-fk-muted font-semibold text-fk-teal-dark" : "text-fk-ink-soft hover:text-fk-teal-dark",
            )}
            href={localizePath(targetLocale, resourcePath)}
            hrefLang={label.htmlLang}
            key={targetLocale}
            title={label.switchTitle}
          >
            <span aria-hidden="true">{label.shortLabel}</span>
            <span className="sr-only">{label.label}</span>
          </Link>
        );
      })}
    </div>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-fk-line bg-[rgba(247,248,246,0.94)] backdrop-blur">
      <div className="flex h-14 items-center gap-4 px-4 md:h-16 md:px-10">
        <Link className="flex min-w-0 items-center gap-3" href={localizePath(locale, "/")}>
          <Compass className="h-[26px] w-[26px] shrink-0 text-fk-teal" strokeWidth={1.75} aria-hidden="true" />
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-[16.5px] font-semibold text-fk-teal-dark">{dictionary.siteTitle}</span>
            <span className="hidden truncate text-[12px] text-fk-ink-faint sm:block">{dictionary.siteSubtitle}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Hauptnavigation">
          {navLinks.map((link) => (
            <Link
              aria-current={link.active ? "page" : undefined}
              className={cn(
                "rounded-md px-3 py-2 text-[15px] transition-colors duration-150",
                link.active ? "font-semibold text-fk-teal-dark" : "text-fk-ink-soft hover:text-fk-teal-dark",
              )}
              href={link.href}
              key={link.label}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex-1" />

        <Link
          className="hidden items-center gap-2 rounded-lg border border-fk-line bg-white py-1.5 pl-3 pr-2 text-sm text-fk-ink-faint transition-colors duration-150 hover:border-fk-teal md:flex"
          href={searchHref}
        >
          <Search className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          <span>{dictionary.nav.searchLabel}</span>
          <kbd className="rounded bg-fk-muted px-1.5 py-0.5 font-fk-mono text-[11px] text-fk-ink-soft">⌘K</kbd>
        </Link>

        {languageTabs}

        <button
          aria-expanded={open}
          aria-label={open ? dictionary.closeNavigation : dictionary.openNavigation}
          className="flex h-11 w-11 items-center justify-center rounded-md border border-fk-line text-fk-ink-soft md:hidden"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          {open ? <X className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" /> : <Menu className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />}
        </button>
      </div>

      <div className={cn("border-t border-fk-line bg-fk-bg px-4 py-4 md:hidden", open ? "block" : "hidden")}>
        <div className="mb-3 grid grid-cols-3 gap-2">
          <Link
            className="flex min-h-11 items-center gap-2 rounded-md border border-fk-line bg-white px-3 py-2 text-sm font-medium text-fk-ink"
            href={localizePath(locale, "/kapitel")}
            onClick={() => setOpen(false)}
          >
            <BookOpen className="h-4 w-4 text-fk-teal" strokeWidth={1.75} aria-hidden="true" />
            {dictionary.nav.chapters}
          </Link>
          <Link
            className="flex min-h-11 items-center gap-2 rounded-md border border-fk-line bg-white px-3 py-2 text-sm font-medium text-fk-ink"
            href={searchHref}
            onClick={() => setOpen(false)}
          >
            <Search className="h-4 w-4 text-fk-teal" strokeWidth={1.75} aria-hidden="true" />
            {dictionary.nav.searchLabel}
          </Link>
          <a
            className="flex min-h-11 items-center gap-2 rounded-md border border-fk-line bg-white px-3 py-2 text-sm font-medium text-fk-ink"
            href="https://github.com/interias/stefans-fitness-kompass/"
            onClick={() => setOpen(false)}
            rel="noreferrer"
            target="_blank"
          >
            <ExternalLink className="h-4 w-4 text-fk-teal" strokeWidth={1.75} aria-hidden="true" />
            {dictionary.github}
          </a>
        </div>
        <div className="max-h-80 overflow-y-auto rounded-md border border-fk-line bg-white">
          {chapters.map((chapter) => (
            <Link
              className="flex min-h-11 items-center gap-3 border-b border-fk-line px-3 py-2 text-sm text-fk-ink-soft last:border-b-0"
              href={localizePath(locale, `/kapitel/${chapter.slug}`)}
              key={chapter.slug}
              onClick={() => setOpen(false)}
            >
              <span className="w-6 shrink-0 font-fk-mono text-[12px] text-fk-ink-faint">{chapter.number}</span>
              <span>{chapter.title.replace(/^\d+\s*/, "")}</span>
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
