import Link from "next/link";
import type { ChapterMeta } from "@/lib/content";
import { getDictionary, type Locale, localizePath } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type ChapterNavProps = {
  activeSlug?: string;
  chapters: ChapterMeta[];
  locale: Locale;
};

export function ChapterNav({ activeSlug, chapters, locale }: ChapterNavProps) {
  const dictionary = getDictionary(locale);

  return (
    <nav aria-label={dictionary.chapterNavLabel}>
      <div className="mb-3 text-xs font-semibold uppercase text-stone-500">{dictionary.chapterNavLabel}</div>
      <ol className="space-y-1">
        {chapters.map((chapter) => (
          <li key={chapter.slug}>
            <Link
              className={cn(
                "flex gap-3 rounded-md px-3 py-2 text-sm leading-5 transition-colors hover:bg-stone-100",
                activeSlug === chapter.slug
                  ? "bg-teal-50 font-semibold text-teal-950"
                  : "text-stone-700",
              )}
              href={localizePath(locale, `/kapitel/${chapter.slug}`)}
            >
              <span className="w-6 shrink-0 tabular-nums text-stone-500">{chapter.number}</span>
              <span>{chapter.title.replace(/^\d+\s*/, "")}</span>
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
