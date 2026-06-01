import { LocalizedDisclaimerPage } from "@/app/_localized/disclaimer-page";

export const metadata = {
  title: "Disclaimer",
  description: "Medizinischer und rechtlicher Hinweis zum Fitness-Kompass.",
};

export default async function DisclamerPage() {
  return <LocalizedDisclaimerPage locale="de" />;
}
