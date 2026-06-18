import type { Metadata } from "next";
import { LocalizedChapterPage } from "@/app/_localized/chapter-page";
import { getAllChapters, getChapter } from "@/lib/content";
import { chapterMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllChapters("de").map((chapter) => ({
    slug: chapter.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const chapter = getChapter(slug, "de");

  if (!chapter) {
    return {};
  }

  return chapterMetadata("de", chapter);
}

export default async function ChapterPage({ params }: PageProps) {
  const { slug } = await params;
  return <LocalizedChapterPage locale="de" slug={slug} />;
}
