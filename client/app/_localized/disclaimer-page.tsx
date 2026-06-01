import { AppShell } from "@/components/app-shell";
import { readDisclaimer } from "@/lib/content";
import { type Locale } from "@/lib/i18n";
import { renderMarkdown } from "@/lib/markdown";

type LocalizedDisclaimerPageProps = {
  locale: Locale;
};

export async function LocalizedDisclaimerPage({ locale }: LocalizedDisclaimerPageProps) {
  const markdown = readDisclaimer(locale);
  const html = await renderMarkdown(markdown, locale);

  return (
    <AppShell locale={locale}>
      <main className="bg-stone-50">
        <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="prose-kompass" dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        </article>
      </main>
    </AppShell>
  );
}
