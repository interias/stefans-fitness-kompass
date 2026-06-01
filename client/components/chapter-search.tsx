"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import type { ChapterMeta, SearchEntry } from "@/lib/content";
import { getDictionary, type Locale, localizePath } from "@/lib/i18n";

type ChapterSearchProps = {
  chapters: ChapterMeta[];
  locale: Locale;
  searchEntries: SearchEntry[];
};

type SearchReason = "Kapiteltitel" | "Abschnitt" | "Textstelle";

type SearchResult = {
  entry: SearchEntry;
  reasons: SearchReason[];
  score: number;
  sectionHits: number;
};

function normalizeSearchValue(value: string) {
  return value
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeCharacter(value: string) {
  return value
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getSearchTerms(query: string) {
  return Array.from(new Set(normalizeSearchValue(query).split(" ").filter((term) => term.length >= 2)));
}

function countOccurrences(value: string, term: string) {
  if (!term) {
    return 0;
  }

  let count = 0;
  let index = value.indexOf(term);

  while (index >= 0) {
    count += 1;
    index = value.indexOf(term, index + term.length);
  }

  return count;
}

function createSnippet(text: string, terms: string[]) {
  const normalizedText = normalizeSearchValue(text);
  const firstMatch = terms
    .map((term) => normalizedText.indexOf(term))
    .filter((index) => index >= 0)
    .sort((a, b) => a - b)[0];

  if (firstMatch === undefined || text.length <= 320) {
    return text.length > 320 ? `${text.slice(0, 317).trim()}...` : text;
  }

  const start = Math.max(0, firstMatch - 110);
  const end = Math.min(text.length, start + 320);
  return `${start > 0 ? "... " : ""}${text.slice(start, end).trim()}${end < text.length ? " ..." : ""}`;
}

function highlightText(text: string, terms: string[]) {
  if (terms.length === 0) {
    return text;
  }

  let normalizedText = "";
  const normalizedToOriginal: number[] = [];

  Array.from(text).forEach((character, originalIndex) => {
    const normalizedCharacter = normalizeCharacter(character);

    Array.from(normalizedCharacter).forEach((normalizedPart) => {
      normalizedText += normalizedPart;
      normalizedToOriginal.push(originalIndex);
    });
  });

  const ranges: Array<{ end: number; start: number }> = [];

  terms.forEach((term) => {
    let index = normalizedText.indexOf(term);

    while (index >= 0) {
      const start = normalizedToOriginal[index];
      const end = normalizedToOriginal[index + term.length - 1] + 1;
      ranges.push({ start, end });
      index = normalizedText.indexOf(term, index + term.length);
    }
  });

  if (ranges.length === 0) {
    return text;
  }

  const mergedRanges = ranges
    .sort((a, b) => a.start - b.start)
    .reduce<Array<{ end: number; start: number }>>((merged, range) => {
      const previous = merged[merged.length - 1];

      if (!previous || range.start > previous.end) {
        merged.push({ ...range });
        return merged;
      }

      previous.end = Math.max(previous.end, range.end);
      return merged;
    }, []);

  const parts: ReactNode[] = [];
  let cursor = 0;

  mergedRanges.forEach((range, index) => {
    if (cursor < range.start) {
      parts.push(text.slice(cursor, range.start));
    }

    parts.push(
      <mark className="rounded bg-amber-100 px-0.5 text-stone-950" key={`${range.start}-${range.end}-${index}`}>
        {text.slice(range.start, range.end)}
      </mark>,
    );
    cursor = range.end;
  });

  if (cursor < text.length) {
    parts.push(text.slice(cursor));
  }

  return parts;
}

function withSearchHighlight(href: string, query: string) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return href;
  }

  const [pathWithQuery, hash] = href.split("#");
  const separator = pathWithQuery.includes("?") ? "&" : "?";
  const highlightedPath = `${pathWithQuery}${separator}highlight=${encodeURIComponent(trimmedQuery)}`;

  return hash ? `${highlightedPath}#${hash}` : highlightedPath;
}

function scoreEntry(entry: SearchEntry, normalizedQuery: string, terms: string[], overviewLabel: string) {
  const heading = normalizeSearchValue(entry.heading);
  const chapterTitle = normalizeSearchValue(entry.chapterTitle);
  const text = normalizeSearchValue(entry.searchText);
  const haystack = `${entry.chapterNumber} ${chapterTitle} ${heading} ${text}`;
  const localHaystack = `${heading} ${text}`;
  const isOverview = entry.heading === overviewLabel;

  if (!terms.every((term) => haystack.includes(term))) {
    return undefined;
  }

  const matchesLocalContent = terms.every((term) => localHaystack.includes(term));
  const matchesChapterTitle = terms.every((term) => chapterTitle.includes(term));

  if (!matchesLocalContent && !(isOverview && matchesChapterTitle)) {
    return undefined;
  }

  const reasons = new Set<SearchReason>();
  let score = 0;

  if (isOverview && chapterTitle.includes(normalizedQuery)) {
    score += 70;
    reasons.add("Kapiteltitel");
  }

  if (heading.includes(normalizedQuery)) {
    score += 90;
    reasons.add("Abschnitt");
  }

  if (text.includes(normalizedQuery)) {
    score += 30;
    reasons.add("Textstelle");
  }

  terms.forEach((term) => {
    if (isOverview && chapterTitle.includes(term)) {
      score += 18;
      reasons.add("Kapiteltitel");
    }

    if (heading.includes(term)) {
      score += 24;
      reasons.add("Abschnitt");
    }

    const textHits = countOccurrences(text, term);
    if (textHits > 0) {
      score += Math.min(textHits, 4) * 5;
      reasons.add("Textstelle");
    }
  });

  if (score === 0) {
    return undefined;
  }

  return {
    reasons: Array.from(reasons),
    score,
  };
}

export function ChapterSearch({ chapters, locale, searchEntries }: ChapterSearchProps) {
  const [query, setQuery] = useState("");
  const dictionary = getDictionary(locale);
  const reasonLabels: Record<SearchReason, string> = {
    Abschnitt: dictionary.search.reasonHeading,
    Kapiteltitel: dictionary.search.reasonChapterTitle,
    Textstelle: dictionary.search.reasonText,
  };
  const normalizedQuery = normalizeSearchValue(query);
  const hasInput = normalizedQuery.length > 0;
  const canSearch = normalizedQuery.length >= 2;
  const queryTerms = useMemo(() => getSearchTerms(query), [query]);

  const results = useMemo(() => {
    if (!canSearch || queryTerms.length === 0) {
      return [];
    }

    const sectionResults = new Map<string, SearchResult>();

    searchEntries.forEach((entry) => {
      const scoredEntry = scoreEntry(entry, normalizedQuery, queryTerms, dictionary.overview);

      if (!scoredEntry) {
        return;
      }

      const sectionKey = `${entry.chapterSlug}:${entry.href}`;
      const existingResult = sectionResults.get(sectionKey);

      if (!existingResult || scoredEntry.score > existingResult.score) {
        sectionResults.set(sectionKey, {
          entry,
          reasons: scoredEntry.reasons,
          score: scoredEntry.score,
          sectionHits: (existingResult?.sectionHits ?? 0) + 1,
        });
        return;
      }

      existingResult.sectionHits += 1;
      scoredEntry.reasons.forEach((reason) => {
        if (!existingResult.reasons.includes(reason)) {
          existingResult.reasons.push(reason);
        }
      });
    });

    return Array.from(sectionResults.values()).sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return a.entry.chapterNumber.localeCompare(b.entry.chapterNumber, locale === "zh" ? "zh-Hans" : locale, {
        numeric: true,
      });
    });
  }, [canSearch, dictionary.overview, locale, normalizedQuery, queryTerms, searchEntries]);

  const visibleResults = results.slice(0, 10);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8" id="suche">
      <div className="mb-6 max-w-3xl">
        <p className="text-sm font-semibold uppercase text-teal-800">{dictionary.search.title}</p>
        <h2 className="mt-2 text-2xl font-semibold text-stone-950 md:text-3xl">{dictionary.search.heading}</h2>
      </div>

      <label className="relative block max-w-3xl">
        <span className="sr-only">{dictionary.search.label}</span>
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" aria-hidden="true" />
        <input
          className="h-12 w-full rounded-lg border border-stone-300 bg-white pl-12 pr-4 text-base text-stone-950 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100"
          onChange={(event) => setQuery(event.target.value)}
          placeholder={dictionary.search.placeholder}
          type="search"
          value={query}
        />
      </label>

      {!hasInput ? (
        <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {chapters.map((chapter) => (
            <Link
              className="group min-h-44 rounded-lg border border-stone-200 bg-white p-5 transition hover:border-teal-300 hover:shadow-sm"
              href={localizePath(locale, `/kapitel/${chapter.slug}`)}
              key={chapter.slug}
            >
              <div className="mb-4 flex items-center justify-between gap-4">
                <span className="rounded-md bg-stone-100 px-2 py-1 text-xs font-semibold tabular-nums text-stone-600">
                  {chapter.number}
                </span>
                <ArrowRight className="h-4 w-4 text-stone-400 transition group-hover:translate-x-0.5 group-hover:text-teal-800" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold leading-6 text-stone-950">{chapter.title.replace(/^\d+\s*/, "")}</h3>
              <p className="mt-3 text-sm leading-6 text-stone-600">{chapter.summary}</p>
            </Link>
          ))}
        </div>
      ) : !canSearch ? (
        <p className="mt-8 rounded-lg border border-stone-200 bg-white p-5 text-sm text-stone-600">
          {dictionary.search.minChars}
        </p>
      ) : visibleResults.length > 0 ? (
        <div className="mt-8">
          <p className="mb-4 text-sm text-stone-600">
            {dictionary.search.resultCount(results.length)}
            {results.length > visibleResults.length ? dictionary.search.bestShown(visibleResults.length) : ""}.
          </p>
          <div className="grid gap-3 lg:grid-cols-2">
            {visibleResults.map((result) => (
              <Link
                className="group rounded-lg border border-stone-200 bg-white p-5 transition hover:border-teal-300 hover:shadow-sm"
                href={withSearchHighlight(result.entry.href, query)}
                key={result.entry.href}
              >
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-stone-500">
                    <span className="rounded-md bg-stone-100 px-2 py-1 tabular-nums">{result.entry.chapterNumber}</span>
                    <span>{result.entry.chapterTitle.replace(/^\d+\s*/, "")}</span>
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-stone-400 transition group-hover:translate-x-0.5 group-hover:text-teal-800" aria-hidden="true" />
                </div>
                <h3 className="text-base font-semibold leading-6 text-stone-950">{result.entry.heading}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {result.reasons.map((reason) => (
                    <span className="rounded-md bg-teal-50 px-2 py-1 text-xs font-semibold text-teal-900" key={reason}>
                      {reasonLabels[reason]}
                    </span>
                  ))}
                  {result.sectionHits > 1 ? (
                    <span className="rounded-md bg-stone-100 px-2 py-1 text-xs font-semibold text-stone-600">
                      {dictionary.search.sectionHits(result.sectionHits)}
                    </span>
                  ) : null}
                </div>
                <p className="mt-3 text-sm leading-6 text-stone-600">
                  {highlightText(createSnippet(result.entry.searchText, queryTerms), queryTerms)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <p className="mt-8 rounded-lg border border-stone-200 bg-white p-5 text-sm text-stone-600">
          {dictionary.search.empty}
        </p>
      )}
    </section>
  );
}
