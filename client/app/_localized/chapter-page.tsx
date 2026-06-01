import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ChapterNav } from "@/components/chapter-nav";
import { SearchHighlighter } from "@/components/search-highlighter";
import { TableOfContents } from "@/components/table-of-contents";
import { getAllChapters, getChapter, getChapterContext } from "@/lib/content";
import { getDictionary, type Locale, localizePath } from "@/lib/i18n";
import { renderMarkdown } from "@/lib/markdown";

type LocalizedChapterPageProps = {
  locale: Locale;
  slug: string;
};

export async function LocalizedChapterPage({ locale, slug }: LocalizedChapterPageProps) {
  const chapter = getChapter(slug, locale);

  if (!chapter) {
    notFound();
  }

  const [chapters, html, context] = await Promise.all([
    Promise.resolve(getAllChapters(locale)),
    renderMarkdown(chapter.markdown, locale),
    Promise.resolve(getChapterContext(slug, locale)),
  ]);
  const dictionary = getDictionary(locale);

  return (
    <AppShell locale={locale}>
      <main className="bg-stone-50">
        <div className="mx-auto grid max-w-[112rem] gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[15rem_minmax(0,1fr)_13rem] 2xl:grid-cols-[16rem_minmax(0,1fr)_14rem] lg:px-8">
          <aside className="hidden lg:block">
            <div className="sticky top-24 max-h-[calc(100svh-7rem)] overflow-y-auto rounded-lg border border-stone-200 bg-white p-3">
              <ChapterNav activeSlug={slug} chapters={chapters} locale={locale} />
            </div>
          </aside>

          <article className="min-w-0 rounded-lg border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="prose-kompass" dangerouslySetInnerHTML={{ __html: html }} />
            <Suspense fallback={null}>
              <SearchHighlighter />
            </Suspense>

            <nav className="mt-8 grid gap-3 border-t border-stone-200 pt-6 sm:grid-cols-2" aria-label={`${dictionary.previousChapter} / ${dictionary.nextChapter}`}>
              {context.previous ? (
                <Link
                  className="rounded-lg border border-stone-200 p-4 text-sm text-stone-700 hover:border-teal-300 hover:bg-teal-50"
                  href={localizePath(locale, `/kapitel/${context.previous.slug}`)}
                >
                  <span className="mb-2 flex items-center gap-2 font-semibold text-stone-950">
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    {dictionary.previousChapter}
                  </span>
                  {context.previous.title}
                </Link>
              ) : (
                <span />
              )}

              {context.next ? (
                <Link
                  className="rounded-lg border border-stone-200 p-4 text-sm text-stone-700 hover:border-teal-300 hover:bg-teal-50 sm:text-right"
                  href={localizePath(locale, `/kapitel/${context.next.slug}`)}
                >
                  <span className="mb-2 flex items-center gap-2 font-semibold text-stone-950 sm:justify-end">
                    {dictionary.nextChapter}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                  {context.next.title}
                </Link>
              ) : null}
            </nav>
          </article>

          <aside className="hidden xl:block">
            <div className="sticky top-24 max-h-[calc(100svh-7rem)] overflow-y-auto rounded-lg border border-stone-200 bg-white p-4">
              <TableOfContents headings={chapter.headings} locale={locale} />
            </div>
          </aside>
        </div>
      </main>
    </AppShell>
  );
}
