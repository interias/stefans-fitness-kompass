import { LocalizedChaptersPage } from "@/app/_localized/chapters-page";

export const metadata = {
  title: "Kapitel",
  description: "Alle Kapitel des Fitness-Kompasses.",
};

export default function ChaptersPage() {
  return <LocalizedChaptersPage locale="de" />;
}
