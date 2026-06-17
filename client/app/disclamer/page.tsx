import type { Metadata } from "next";
import { LocalizedDisclaimerPage } from "@/app/_localized/disclaimer-page";
import { disclaimerMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return disclaimerMetadata("de");
}

export default async function DisclamerPage() {
  return <LocalizedDisclaimerPage locale="de" />;
}
