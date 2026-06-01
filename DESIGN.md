# Design

Diese Datei beschreibt die verbindliche Designrichtung fuer die Web-Version von Stefans Fitness-Kompass. Sie ergaenzt `STYLEGUIDE.md`, `REVIEW_CHECKLIST.md` und `DISCLAIMER.md`; sie ersetzt keine fachliche Pruefung.

## Grundsatz

Die Website ist ein ruhiges Wissensprodukt, kein Fitness-Programmverkauf. Sie soll schnell Orientierung geben, Kapitel gut lesbar machen und praktische Entscheidungen unterstuetzen. Der Ton bleibt nuechtern, pragmatisch und alltagstauglich.

## Informationsarchitektur

- `docs/` bleibt die kanonische Quelle der Kapiteltexte.
- Die Startseite fuehrt direkt in den Kompass: Schnellstart, Suche, Kapitel und zentrale Hebel.
- Kapitel brauchen eine stabile Lesespalte, sichtbare Navigation und bei laengeren Seiten eine Abschnittsnavigation.
- Der Disclaimer steht zentral unter `/disclamer`; Warnsignale und fachliche Grenzen bleiben in den betroffenen Inhalten sichtbar.
- Sprachversionen sind ueber einen ruhigen Flaggen-Tab in der Hauptnavigation erreichbar. Die deutsche Fassung bleibt fachliche Quelle; englische und chinesische Inhalte sind Web-Ableitungen.
- Tools oder Rechner duerfen nur Pruefwerte liefern und muessen Kontext, Grenze und fachliche Abklaerung klar halten.

## Visuelle Richtung

- Ruhig, hochwertig, hell, gut lesbar.
- Keine aggressive Bodybuilding-Aesthetik, keine Vorher-nachher-Optik, keine Produktwerbung.
- Bestehende Assets werden bevorzugt als Kapitelbilder, Hero-Hintergruende oder ruhige Erklaergrafiken genutzt.
- Bilder duerfen Orientierung geben, sollen aber keine fachliche Genauigkeit vortaeuschen.
- Kein Text in generierten Bildern.

## Kapitelbanner

- Kapitelbanner sind das erste Bild direkt nach der H1 im jeweiligen Markdown-Kapitel der Source of Truth unter `docs/`.
- Das Zielformat ist 2400x600 px im Seitenverhaeltnis 4:1. Die PNG-Originale bleiben unter `assets/visuals/`; der Client nutzt daraus erzeugte WebP-Ableitungen.
- Banner sollen das Kapitelthema als ruhiges Systembild zeigen: Kompass-/Routenmotiv, konkrete Symbole fuer den Inhalt und genuegend ruhige Flaeche fuer die Leseseite.
- Banner duerfen keine lesbaren Woerter, Zahlen, Labels, Logos, Wasserzeichen oder pseudo-textartige Markierungen enthalten.
- Jedes Banner braucht eine gleichnamige `.prompt.md` mit Zielpfad, Markdown-Datei, Format, Prompt und relevanter Nachbearbeitung.

## Layout

- Desktop: linke Kapitelnavigation, zentrale Lesespalte, rechte Abschnittsnavigation, sofern der Inhalt lang genug ist.
- Mobile: zuerst Inhalt und Suche, Navigation kompakt und ohne Ueberlagerungen.
- Lesespalte: etwa 70-80 Zeichen Breite.
- Cards nur fuer einzelne wiederholte Elemente, Hinweise oder kompakte Werkzeuge; keine verschachtelten Cards.
- Interaktive Elemente brauchen stabile Groessen, klare Fokuszustaende und gute Tastaturbedienbarkeit.

## Farbe und Typografie

- Basis: helle neutrale Flaechen, Graphit-Text, dezente Linien.
- Akzente: gedaempftes Teal, Gruen und Blau; Warnungen in ruhigem Amber oder Rot.
- Keine dominante Ein-Farb-Palette, keine lauten Verlaeufe, keine dekorativen Orbs.
- Schriftgroessen nicht mit Viewportbreite skalieren.
- Letter-Spacing bleibt 0.

## Komponenten

- Icons vorzugsweise aus `lucide-react`.
- Komplexe UI-Primitives koennen auf Radix UI oder shadcn/ui basieren, wenn sie Barrierefreiheit und Wartbarkeit verbessern.
- Animationen bleiben sparsam und funktional: Orientierung, Zustandswechsel, keine Showeffekte.
- Tabellen, Listen und Callouts werden nur eingesetzt, wenn sie Entscheidungen klarer machen.

## Inhaltliche Darstellung

- Starke Aussagen behalten Kurzbelege.
- Quellenlinks muessen sichtbar und benutzbar bleiben.
- Formeln werden in KaTeX gerendert; sie sollen ruhig, gut lesbar und mobil horizontal scrollbar bleiben, wenn sie zu breit werden.
- Callouts sind fuer `Grundsatz`, `Grenze`, `Warnsignal` oder `Quelle pruefen` gedacht, nicht als Pflichtschema.
- Medizinische und rechtliche Hinweise bleiben vorsichtig formuliert: keine Diagnosen, keine Garantien, keine Einzelberatung.

## Technische Zielrichtung

- Next.js mit App Router und TypeScript.
- Statischer Export bleibt bevorzugt, solange keine Serverfunktionen noetig sind.
- Die Next.js-App liegt unter `client/`; deutsches Markdown aus `docs/` wird zur Build-Zeit gerendert, englische und chinesische Kopien liegen unter `client/content/`.
- Abgeleitete Assets fuer die Web-App duerfen aus `assets/` nach `client/public/assets` synchronisiert werden; Rasterbilder werden dort als komprimierte WebP-Dateien in der noetigen Web-Groesse erzeugt. Originaldateien in `assets/` bleiben erhalten.
