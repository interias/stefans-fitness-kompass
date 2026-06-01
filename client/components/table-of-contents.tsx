import type { Heading } from "@/lib/content";
import { getDictionary, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type TableOfContentsProps = {
  headings: Heading[];
  locale: Locale;
};

export function TableOfContents({ headings, locale }: TableOfContentsProps) {
  if (headings.length === 0) {
    return null;
  }

  const dictionary = getDictionary(locale);

  return (
    <nav aria-label={dictionary.onThisPage}>
      <div className="mb-3 text-xs font-semibold uppercase text-stone-500">{dictionary.onThisPage}</div>
      <ol className="space-y-2 text-sm leading-5">
        {headings.map((heading) => (
          <li key={`${heading.id}-${heading.text}`}>
            <a
              className={cn(
                "block rounded-md text-stone-600 transition-colors hover:text-teal-900",
                heading.level === 3 && "pl-3 text-stone-500",
              )}
              href={`#${heading.id}`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
