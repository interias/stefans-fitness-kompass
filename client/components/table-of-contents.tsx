"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/content";
import { getDictionary, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type TableOfContentsProps = {
  headings: Heading[];
  locale: Locale;
};

export function TableOfContents({ headings, locale }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) {
      return;
    }

    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visible.add(entry.target.id);
          } else {
            visible.delete(entry.target.id);
          }
        });

        const firstVisible = headings.find((heading) => visible.has(heading.id));
        if (firstVisible) {
          setActiveId(firstVisible.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px" },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  const dictionary = getDictionary(locale);

  return (
    <nav aria-label={dictionary.onThisPage}>
      <div className="mb-3 font-fk-mono text-[10.5px] font-medium uppercase tracking-[0.08em] text-fk-ink-faint">
        {dictionary.onThisPage}
      </div>
      <ol className="border-l border-fk-line text-[13px] leading-5">
        {headings.map((heading) => {
          const active = activeId === heading.id;

          return (
            <li key={`${heading.id}-${heading.text}`}>
              <a
                aria-current={active ? "location" : undefined}
                className={cn(
                  "-ml-px block border-l-2 py-1 pl-3 transition-colors duration-150",
                  heading.level === 3 && "pl-6",
                  active
                    ? "border-fk-teal font-semibold text-fk-teal-dark"
                    : "border-transparent text-fk-ink-soft hover:text-fk-teal-dark",
                )}
                href={`#${heading.id}`}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
