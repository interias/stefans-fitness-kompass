import type { Metadata } from "next";
import { LocalizedChaptersPage } from "@/app/_localized/chapters-page";
import { chaptersMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return chaptersMetadata("de");
}

export default function ChaptersPage() {
  return <LocalizedChaptersPage locale="de" />;
}
