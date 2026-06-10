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
      <main>
        <article className="mx-auto max-w-3xl px-4 py-10 md:px-6">
          <div className="rounded-xl border border-fk-line bg-white p-5 shadow-[var(--fk-card-shadow)] sm:p-8">
            <div className="prose-kompass" dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        </article>
      </main>
    </AppShell>
  );
}
