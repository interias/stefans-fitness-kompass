import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold text-stone-950">Seite nicht gefunden</h1>
      <p className="mt-4 text-base leading-7 text-stone-700">
        Der angeforderte Inhalt ist im Fitness-Kompass nicht vorhanden.
      </p>
      <Link
        className="mt-6 inline-flex rounded-md bg-teal-900 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
        href="/"
      >
        Zur Startseite
      </Link>
    </main>
  );
}
