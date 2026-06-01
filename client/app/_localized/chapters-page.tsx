import { AppShell } from "@/components/app-shell";
import { ChapterSearch } from "@/components/chapter-search";
import { getAllChapters, getSearchEntries } from "@/lib/content";
import { getDictionary, type Locale } from "@/lib/i18n";

type ChaptersPageProps = {
  locale: Locale;
};

export function LocalizedChaptersPage({ locale }: ChaptersPageProps) {
  const chapters = getAllChapters(locale);
  const searchEntries = getSearchEntries(locale);
  const dictionary = getDictionary(locale);

  return (
    <AppShell locale={locale}>
      <main className="bg-stone-50">
        <section className="border-b border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase text-teal-800">{dictionary.chaptersEyebrow}</p>
            <h1 className="mt-3 text-3xl font-semibold text-stone-950 md:text-5xl">{dictionary.chaptersTitle}</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-stone-700">{dictionary.chaptersDescription}</p>
          </div>
        </section>
        <ChapterSearch chapters={chapters} locale={locale} searchEntries={searchEntries} />
      </main>
    </AppShell>
  );
}
