import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  ChevronRight,
  CircleDot,
  Dumbbell,
  Moon,
  Repeat,
  Route,
  Scale,
  TrendingUp,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ChapterSearch } from "@/components/chapter-search";
import { chapterDisplayTitle, groupChapters } from "@/lib/chapter-groups";
import { getAllChapters, getSearchEntries } from "@/lib/content";
import { getDictionary, type Locale, localizePath } from "@/lib/i18n";

const startIcons: Record<"strength" | "protein" | "trend" | "sleep", LucideIcon> = {
  protein: CircleDot,
  sleep: Moon,
  strength: Dumbbell,
  trend: TrendingUp,
};

const leverIcons: Record<"energy" | "protein" | "strength" | "movement" | "sleep" | "consistency", LucideIcon> = {
  consistency: Repeat,
  energy: Scale,
  movement: Route,
  protein: CircleDot,
  sleep: Moon,
  strength: Dumbbell,
};

type HomePageProps = {
  locale: Locale;
};

export function LocalizedHomePage({ locale }: HomePageProps) {
  const chapters = getAllChapters(locale);
  const searchEntries = getSearchEntries(locale);
  const dictionary = getDictionary(locale);
  const groups = groupChapters(chapters);

  return (
    <AppShell locale={locale}>
      <main>
        {/* 1. Full-Bleed-Banner mit Overlay-Headline im leeren Kartenraum rechts */}
        <section className="relative hidden md:block">
          <img
            alt=""
            className="block w-full object-cover [aspect-ratio:4.4/1]"
            src="/assets/fitness-kompass-banner.webp"
          />
          <div className="absolute inset-0 flex items-center justify-end">
            <div className="max-w-[560px] p-14">
              <p className="fk-kicker">{dictionary.siteTitle}</p>
              <h1 className="mt-2 font-fk-serif text-[36px] font-semibold leading-[1.18] text-fk-teal-dark">
                {dictionary.home.heroTitle}
              </h1>
              <p className="mt-3 text-[16px] text-fk-ink-soft">{dictionary.home.heroSubline}</p>
            </div>
          </div>
        </section>

        {/* Mobile: Kicker + H1 + Subline als ruhiger Block */}
        <section className="px-4 pb-2 pt-8 md:hidden">
          <p className="fk-kicker">{dictionary.siteTitle}</p>
          <h1 className="mt-2 font-fk-serif text-[27px] font-semibold leading-[1.2] text-fk-teal-dark">
            {dictionary.home.heroTitle}
          </h1>
          <p className="mt-3 text-[15px] text-fk-ink-soft">{dictionary.home.heroSubline}</p>
        </section>

        {/* 2. Überlappende Suchleiste */}
        <div className="relative z-10 mx-auto mt-4 w-full max-w-[640px] px-4 md:-mt-[26px] md:px-0" id="suche">
          <ChapterSearch chapters={chapters} locale={locale} searchEntries={searchEntries} variant="overlay" />
        </div>

        {/* 3. Zweispaltiges Hauptlayout auf Topo-Band */}
        <section className="fk-topo mt-8 border-t border-fk-line">
          <div className="mx-auto grid max-w-[1280px] gap-10 px-4 py-9 md:px-10 md:py-11 lg:grid-cols-[1fr_380px] lg:gap-14">
            {/* Rechts: Sticky-Seitenpanel */}
            <aside className="space-y-6 self-start lg:sticky lg:top-[88px] lg:order-2">
              <div className="rounded-xl border border-fk-line bg-white p-5 shadow-[var(--fk-card-shadow)]">
                <h2 className="fk-kicker">{dictionary.home.startTitle}</h2>
                <ul className="mt-3 grid grid-cols-2 gap-3 md:block md:divide-y md:divide-fk-line">
                  {dictionary.home.startItems.map((item) => {
                    const Icon = startIcons[item.key];

                    return (
                      <li
                        className="flex flex-col gap-2 rounded-lg border border-fk-line p-3 md:flex-row md:items-center md:gap-3 md:rounded-none md:border-0 md:p-0 md:py-3"
                        key={item.key}
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-[1.5px] border-fk-teal bg-white">
                          <Icon className="h-4 w-4 text-fk-teal" strokeWidth={1.75} aria-hidden="true" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[14.5px] font-semibold leading-5 text-fk-ink">{item.title}</span>
                          <span className="block text-[13px] leading-[1.45] text-fk-ink-faint">{item.note}</span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
                <Link
                  className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-fk-teal px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-fk-teal-dark"
                  href={localizePath(locale, "/kapitel/01-kurzfassung")}
                >
                  {dictionary.home.startCta}
                  <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                </Link>
              </div>

              <div className="rounded-xl border border-fk-line bg-fk-muted p-5">
                <h2 className="fk-kicker">{dictionary.home.leversTitle}</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {dictionary.home.levers.map((lever) => {
                    const Icon = leverIcons[lever.key];

                    return (
                      <li
                        className="inline-flex items-center gap-1.5 rounded-full border border-fk-line bg-white px-3 py-1.5 text-[13.5px] text-fk-teal-dark"
                        key={lever.key}
                      >
                        <Icon className="h-3.5 w-3.5 text-fk-teal" strokeWidth={1.75} aria-hidden="true" />
                        {lever.label}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </aside>
            {/* Links: Die Route */}
            <div className="min-w-0 lg:order-1">
              <h2 className="font-fk-serif text-[24px] font-semibold text-fk-teal-dark">{dictionary.home.routeTitle}</h2>
              <p className="mt-1 text-[14.5px] text-fk-ink-soft">{dictionary.home.routeSubline}</p>

              <div className="relative mt-7">
                <div
                  className="absolute bottom-4 left-[18px] top-2 hidden border-l-2 border-dashed border-fk-dash md:block"
                  aria-hidden="true"
                />

                {groups.map((group) => (
                  <div className="mb-6 last:mb-0" key={group.key}>
                    <div className="relative mb-3 flex items-center gap-3">
                      <span
                        className="relative z-10 ml-[13px] hidden h-3 w-3 shrink-0 rounded-full bg-fk-teal md:block"
                        aria-hidden="true"
                      />
                      <span className="font-fk-mono text-[11px] font-medium uppercase tracking-[0.08em] text-fk-teal-dark">
                        {dictionary.groups[group.key]}
                      </span>
                    </div>

                    <ol className="space-y-2.5">
                      {group.chapters.map((chapter) => (
                        <li key={chapter.slug}>
                          <Link
                            className="group flex min-h-12 items-center gap-3 md:gap-4"
                            href={localizePath(locale, `/kapitel/${chapter.slug}`)}
                          >
                            <span
                              className="relative z-10 hidden h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-fk-teal bg-white font-fk-mono text-[12.5px] text-fk-teal-dark md:flex"
                              aria-hidden="true"
                            >
                              {chapter.number}
                            </span>
                            <span className="flex min-w-0 flex-1 items-center gap-3 rounded-[9px] border border-fk-line bg-white px-4 py-2.5 shadow-[var(--fk-card-shadow)] transition-colors duration-150 group-hover:border-fk-teal">
                              <span className="shrink-0 font-fk-mono text-[12px] text-fk-teal-dark md:hidden">
                                {chapter.number}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-[15.5px] font-semibold text-fk-ink">
                                  {chapterDisplayTitle(chapter)}
                                </span>
                                <span className="hidden truncate text-[13.5px] text-fk-ink-faint md:block">
                                  {chapter.summary}
                                </span>
                              </span>
                              <ChevronRight
                                className="h-4 w-4 shrink-0 text-fk-ink-faint transition-colors duration-150 group-hover:text-fk-teal"
                                strokeWidth={1.75}
                                aria-hidden="true"
                              />
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>
      </main>
    </AppShell>
  );
}
