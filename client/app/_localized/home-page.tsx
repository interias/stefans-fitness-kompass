import Link from "next/link";
import { Activity, ArrowRight, Dumbbell, LineChart, Salad, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ChapterSearch } from "@/components/chapter-search";
import { getAllChapters, getSearchEntries } from "@/lib/content";
import { getDictionary, type Locale, localizePath } from "@/lib/i18n";

const principleIcons = {
  health: ShieldCheck,
  nutrition: Salad,
  tracking: LineChart,
  training: Dumbbell,
};

type HomePageProps = {
  locale: Locale;
};

export function LocalizedHomePage({ locale }: HomePageProps) {
  const chapters = getAllChapters(locale);
  const searchEntries = getSearchEntries(locale);
  const dictionary = getDictionary(locale);

  return (
    <AppShell locale={locale}>
      <main>
        <section
          className="home-hero relative flex min-h-[72svh] items-end"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(12, 10, 9, 0.86), rgba(12, 10, 9, 0.52), rgba(12, 10, 9, 0.18)), url('/assets/fitness-kompass-readme-hero.webp')",
          }}
        >
          <div className="mx-auto w-full max-w-7xl px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-md bg-white/12 px-3 py-2 text-sm font-medium ring-1 ring-white/20">
                <Activity className="h-4 w-4" aria-hidden="true" />
                {dictionary.home.kicker}
              </div>
              <h1 className="text-4xl font-semibold leading-tight md:text-6xl">{dictionary.siteTitle}</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-100 md:text-xl">{dictionary.home.lead}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  className="inline-flex h-11 items-center gap-2 rounded-md bg-white px-4 text-sm font-semibold text-stone-950 hover:bg-stone-100"
                  href={localizePath(locale, "/kapitel/01-kurzfassung")}
                >
                  {dictionary.home.primaryCta}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  className="inline-flex h-11 items-center gap-2 rounded-md border border-white/40 px-4 text-sm font-semibold text-white hover:bg-white/10"
                  href={localizePath(locale, "/kapitel")}
                >
                  {dictionary.home.secondaryCta}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-stone-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:px-6 md:grid-cols-4 lg:px-8">
            {dictionary.home.principles.map((principle) => {
              const Icon = principleIcons[principle.key];

              return (
                <div className="rounded-lg border border-stone-200 p-5" key={principle.title}>
                  <Icon className="mb-4 h-5 w-5 text-teal-800" aria-hidden="true" />
                  <h2 className="text-base font-semibold text-stone-950">{principle.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{principle.text}</p>
                </div>
              );
            })}
          </div>
        </section>

        <ChapterSearch chapters={chapters} locale={locale} searchEntries={searchEntries} />

        <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase text-teal-800">{dictionary.home.workEyebrow}</p>
            <h2 className="mt-2 text-2xl font-semibold text-stone-950 md:text-3xl">{dictionary.home.workTitle}</h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-stone-700">{dictionary.home.workLead}</p>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
