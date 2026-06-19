/**
 * Zentrale Seiten-/SEO-Konfiguration.
 *
 * Die Base-URL ist die EINZIGE Stelle, die bei einem Domainwechsel (z. B. von
 * workers.dev auf eine eigene Domain) angepasst werden muss – am besten über die
 * Umgebungsvariable `NEXT_PUBLIC_SITE_URL` (siehe .env.example), ohne Codeänderung.
 */
const FALLBACK_SITE_URL = "https://stefans-fitness-kompass.stefanboerzel.workers.dev";

/** Absolute Base-URL der Seite, ohne abschließenden Slash. */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_SITE_URL).replace(/\/+$/, "");

/** Marken-/Seitenname (locale-neutral, für strukturierte Daten und Defaults). */
export const siteName = "Stefans Fitness-Kompass";

/** Urheber (Inhalte stehen unter CC0). */
export const authorName = "Stefan";

/** Projekt-Repository, u. a. als `sameAs` in JSON-LD. */
export const githubUrl = "https://github.com/interias/stefans-fitness-kompass";

/** Spenden-/Unterstützungs-Link (PayPal.me). */
export const paypalUrl = "https://paypal.me/stefanboerzel";

/** CC0-Lizenz-URL für JSON-LD. */
export const licenseUrl = "https://creativecommons.org/publicdomain/zero/1.0/";

/** Standard-Social-Card (1.91:1), als optimiertes WebP unter /public/assets. */
export const ogImage = "/assets/github-social-preview.webp";
export const ogImageWidth = 1280;
export const ogImageHeight = 640;
export const ogImageType = "image/webp";

/** Baut aus einem (root-relativen) Pfad eine absolute URL auf Basis von `siteUrl`. */
export function absoluteUrl(path: string): string {
  if (/^[a-z][a-z0-9+.-]*:/i.test(path)) {
    return path;
  }

  return `${siteUrl}${path.startsWith("/") ? "" : "/"}${path}`;
}
