import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <h1 className="font-fk-serif text-[34px] font-semibold leading-[1.2] text-fk-teal-dark">Seite nicht gefunden</h1>
      <p className="mt-4 text-[16px] leading-[1.65] text-fk-ink-soft">
        Der angeforderte Inhalt ist im Fitness-Kompass nicht vorhanden.
      </p>
      <Link
        className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-fk-teal px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:bg-fk-teal-dark"
        href="/"
      >
        Zur Startseite
      </Link>
    </main>
  );
}
