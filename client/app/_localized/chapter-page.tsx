import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ChapterNav } from "@/components/chapter-nav";
import { JsonLd } from "@/components/json-ld";
import { SearchHighlighter } from "@/components/search-highlighter";
import { TableOfContents } from "@/components/table-of-contents";
import { chapterDisplayTitle, getGroupKeyForNumber } from "@/lib/chapter-groups";
import { getAllChapters, getChapter, getChapterContext, getChapterLastModified } from "@/lib/content";
import { getDictionary, type Locale, localizePath } from "@/lib/i18n";
import { renderMarkdown } from "@/lib/markdown";
import { chapterArticleJsonLd, chapterBreadcrumbJsonLd } from "@/lib/seo";

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
    renderMarkdown(chapter.markdown, locale, { stripChapterHeader: true }),
    Promise.resolve(getChapterContext(slug, locale)),
  ]);
  const dictionary = getDictionary(locale);
  const groupLabel = dictionary.groups[getGroupKeyForNumber(chapter.number)];
  const title = chapterDisplayTitle(chapter);
  const lastModifiedIso = getChapterLastModified(slug, locale).toISOString();
  const structuredData = [
    chapterArticleJsonLd(locale, { slug, title, summary: chapter.summary }, lastModifiedIso),
    chapterBreadcrumbJsonLd(locale, { slug, title }, groupLabel),
  ];

  return (
    <AppShell locale={locale}>
      <JsonLd data={structuredData} />
      <main className="bg-fk-bg">
        <div className="mx-auto grid max-w-[1600px] px-4 md:px-10 min-[1200px]:grid-cols-[248px_minmax(0,1040px)_232px] min-[1200px]:justify-center">
          <aside className="hidden border-r border-fk-line py-7 pr-4 min-[1200px]:block">
            <div className="sticky top-[88px] max-h-[calc(100svh-7rem)] overflow-y-auto">
              <ChapterNav activeSlug={slug} chapters={chapters} locale={locale} />
            </div>
          </aside>

          <article className="min-w-0 py-7 min-[1200px]:px-8">
            <div className="mx-auto max-w-[1040px]">
            <nav
              className="fk-reading mb-5 flex flex-wrap items-center gap-1.5 text-[13.5px] text-fk-ink-faint"
              aria-label="Breadcrumb"
            >
              <Link className="transition-colors duration-150 hover:text-fk-teal-dark" href={localizePath(locale, "/")}>
                {dictionary.breadcrumbHome}
              </Link>
              <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
              <span>{groupLabel}</span>
              <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
              <span aria-current="page">{title}</span>
            </nav>

            {chapter.heroImage ? (
              <img
                alt=""
                className="mb-7 w-full rounded-[10px] border border-fk-line object-cover [aspect-ratio:4/1]"
                src={chapter.heroImage}
              />
            ) : null}

            {chapter.headings.length > 0 ? (
              <details className="fk-reading mb-6 rounded-[10px] border border-fk-line bg-white px-4 py-3 min-[1200px]:hidden">
                <summary className="cursor-pointer font-fk-mono text-[11px] font-medium uppercase tracking-[0.08em] text-fk-ink-faint">
                  {dictionary.onThisPage}
                </summary>
                <ol className="mt-3 space-y-1.5 text-[14px]">
                  {chapter.headings.map((heading) => (
                    <li className={heading.level === 3 ? "pl-4" : undefined} key={`${heading.id}-${heading.text}`}>
                      <a className="block py-0.5 text-fk-ink-soft hover:text-fk-teal-dark" href={`#${heading.id}`}>
                        {heading.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </details>
            ) : null}

            <div>
              <p className="fk-kicker fk-reading">
                {dictionary.chapterKicker(chapter.number)} · {title}
              </p>
              <h1 className="fk-reading mb-6 mt-2 font-fk-serif text-[34px] font-semibold leading-[1.2] text-fk-teal-dark">
                {title}
              </h1>
              <div className="prose-kompass" dangerouslySetInnerHTML={{ __html: html }} />
            </div>
            <Suspense fallback={null}>
              <SearchHighlighter />
            </Suspense>

            <nav
              className="fk-reading mt-10 grid gap-3 border-t border-fk-line pt-6 sm:grid-cols-2"
              aria-label={`${dictionary.previousChapter} / ${dictionary.nextChapter}`}
            >
              {context.previous ? (
                <Link
                  className="rounded-[10px] border border-fk-line bg-white p-4 shadow-[var(--fk-card-shadow)] transition-colors duration-150 hover:border-fk-teal"
                  href={localizePath(locale, `/kapitel/${context.previous.slug}`)}
                >
                  <span className="block text-[13px] text-fk-ink-faint">← {dictionary.previousChapter}</span>
                  <span className="mt-1 block text-[15px] font-semibold text-fk-teal-dark">
                    {chapterDisplayTitle(context.previous)}
                  </span>
                </Link>
              ) : (
                <span />
              )}

              {context.next ? (
                <Link
                  className="rounded-[10px] border border-fk-line bg-white p-4 shadow-[var(--fk-card-shadow)] transition-colors duration-150 hover:border-fk-teal sm:text-right"
                  href={localizePath(locale, `/kapitel/${context.next.slug}`)}
                >
                  <span className="block text-[13px] text-fk-ink-faint">{dictionary.nextChapter} →</span>
                  <span className="mt-1 block text-[15px] font-semibold text-fk-teal-dark">
                    {chapterDisplayTitle(context.next)}
                  </span>
                </Link>
              ) : null}
            </nav>
            </div>
          </article>

          <aside className="hidden py-7 pl-2 min-[1200px]:block">
            <div className="sticky top-[88px] max-h-[calc(100svh-7rem)] overflow-y-auto">
              <TableOfContents headings={chapter.headings} locale={locale} />
            </div>
          </aside>
        </div>
      </main>
    </AppShell>
  );
}
