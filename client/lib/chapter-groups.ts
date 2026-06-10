import type { ChapterMeta } from "@/lib/content";
import type { ChapterGroupKey } from "@/lib/i18n";

export const chapterGroups: Array<{ key: ChapterGroupKey; numbers: string[] }> = [
  { key: "orientierung", numbers: ["00", "01", "02"] },
  { key: "alltag", numbers: ["03", "04"] },
  { key: "ernaehrung", numbers: ["05", "06", "07"] },
  { key: "training", numbers: ["08", "09", "10"] },
  { key: "gesundheit", numbers: ["11", "12"] },
  { key: "einordnung", numbers: ["13", "14", "15", "16"] },
];

export function getGroupKeyForNumber(number: string): ChapterGroupKey {
  return chapterGroups.find((group) => group.numbers.includes(number))?.key ?? "einordnung";
}

export type GroupedChapters = Array<{ chapters: ChapterMeta[]; key: ChapterGroupKey }>;

export function groupChapters(chapters: ChapterMeta[]): GroupedChapters {
  return chapterGroups
    .map((group) => ({
      chapters: chapters.filter((chapter) => group.numbers.includes(chapter.number)),
      key: group.key,
    }))
    .filter((group) => group.chapters.length > 0);
}

export function chapterDisplayTitle(chapter: ChapterMeta) {
  return chapter.title.replace(/^\d+\s*/, "");
}
