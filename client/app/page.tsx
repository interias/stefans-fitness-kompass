import type { Metadata } from "next";
import { LocalizedHomePage } from "@/app/_localized/home-page";
import { homeMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return homeMetadata("de");
}

export default function Home() {
  return <LocalizedHomePage locale="de" />;
}
