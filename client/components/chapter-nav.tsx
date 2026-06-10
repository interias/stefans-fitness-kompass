import Link from "next/link";
import { chapterDisplayTitle, groupChapters } from "@/lib/chapter-groups";
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
  const groups = groupChapters(chapters);

  return (
    <nav aria-label={dictionary.chapterNavLabel}>
      {groups.map((group) => (
        <div className="mb-4 last:mb-0" key={group.key}>
          <div className="mb-1.5 px-2.5 font-fk-mono text-[10.5px] font-medium uppercase tracking-[0.08em] text-fk-ink-faint">
            {dictionary.groups[group.key]}
          </div>
          <ol>
            {group.chapters.map((chapter) => {
              const active = activeSlug === chapter.slug;

              return (
                <li key={chapter.slug}>
                  <Link
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex gap-2.5 rounded-l-md px-2.5 py-1.5 text-[14px] leading-5 transition-colors duration-150",
                      active
                        ? "border-r-2 border-fk-teal bg-fk-muted font-semibold text-fk-teal-dark"
                        : "text-fk-ink-soft hover:bg-fk-muted hover:text-fk-teal-dark",
                    )}
                    href={localizePath(locale, `/kapitel/${chapter.slug}`)}
                  >
                    <span className="w-6 shrink-0 font-fk-mono text-[12px] leading-5 text-fk-ink-faint">
                      {chapter.number}
                    </span>
                    <span>{chapterDisplayTitle(chapter)}</span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      ))}
    </nav>
  );
}
