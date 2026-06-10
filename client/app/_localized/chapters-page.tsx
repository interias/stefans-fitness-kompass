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
      <main>
        <section className="fk-topo border-b border-fk-line">
          <div className="mx-auto max-w-[1280px] px-4 py-12 md:px-10">
            <p className="fk-kicker">{dictionary.chaptersEyebrow}</p>
            <h1 className="mt-3 font-fk-serif text-[34px] font-semibold leading-[1.2] text-fk-teal-dark">
              {dictionary.chaptersTitle}
            </h1>
            <p className="mt-4 max-w-3xl text-[16px] leading-[1.65] text-fk-ink-soft">
              {dictionary.chaptersDescription}
            </p>
          </div>
        </section>
        <ChapterSearch chapters={chapters} locale={locale} searchEntries={searchEntries} />
      </main>
    </AppShell>
  );
}
