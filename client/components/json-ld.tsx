type JsonLdData = Record<string, unknown> | Array<Record<string, unknown>>;

/**
 * Rendert strukturierte Daten als <script type="application/ld+json">.
 * `<` wird escaped, damit kein eingebettetes </script> das Tag schließen kann.
 */
export function JsonLd({ data }: { data: JsonLdData }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
