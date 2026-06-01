# AGENTS.md

Dieses Repository ist ein deutschsprachiger, persoenlicher Fitness-Kompass. Aenderungen muessen den bestehenden Stil in `docs/` fortfuehren.

Vor inhaltlichen Aenderungen zuerst `STYLEGUIDE.md`, `REVIEW_CHECKLIST.md` und `DISCLAIMER.md` lesen. Diese Dateien sind die verbindlichen Detailregeln fuer Stil, Review sowie medizinische und rechtliche Grenzen; `AGENTS.md` ist die kurze Arbeitsanweisung fuer Agenten.

Vor Web-, UI- oder Asset-Aenderungen zusaetzlich `DESIGN.md` lesen. Diese Datei ist die verbindliche Designquelle fuer die Next.js-Webseite, Layout, Komponenten, Bildnutzung und visuelle Grenzen.

## Projektstil

- Nuechtern, pragmatisch, alltagstauglich; keine Hype-Sprache, keine Absolutismen, keine moralische Ernaehrungssprache.
- Grundlagen vor Optimierung: robuste Hebel zuerst, Details danach.
- Trends, Kontext und Wiederholbarkeit betonen statt einzelne Tageswerte.
- Bevorzugte Begriffe: `Grundsatz`, `Grenze`, `Warnsignal`, `haeufig sinnvoll`, `pruefen`, `Trend`, `Kontext`, `Wiederholbarkeit`.
- Begriffe wie `Kernaussage`, `Einordnung`, `Praxis`, `Nutzen`, `Grenze` und `Beispiele` nur gezielt einsetzen, wenn sie einen laengeren Abschnitt wirklich klarer machen. Nicht als Pflichtschema pro Abschnitt verwenden.

## Struktur

- Die oberste `README.md` und die Markdown-Dateien unter `docs/` sind die Source of Truth fuer Inhalt, Reihenfolge, Geltungsbereich und fachliche Einordnung.
- Kapitel bleiben nummerierte Markdown-Dateien unter `docs/`.
- Die Web-App darf Inhalte aus `README.md` und `docs/` rendern, uebersetzen, verlinken oder visuell aufbereiten, aber nicht zur inhaltlichen Primaerquelle werden.
- Abschnitte bevorzugt als klar geschriebene Absaetze formulieren: erst die zentrale Aussage, dann Kontext oder Grenze, dann die praktische Konsequenz.
- Wiederholte Mini-Schemata wie `Nutzen/Grenze/Beispiele` oder `Kernaussage/Praxis` vermeiden; bei kurzen Abschnitten ist ein einzelner guter Absatz meist besser.
- Methoden-Unterkapitel wie Drop-Saetze, EMOM, Supersaetze, HIIT-Protokolle oder Tracking-Methoden nicht in identische Labelbloecke pressen; lieber 2-3 zusammenhaengende Absaetze mit Beispiel im Satzfluss.
- Tabellen, Listen und Checklisten nur nutzen, wenn sie Entscheidungen klarer machen.
- Kurzbelege direkt im Text verlinken; zentrale Quellen zusaetzlich in `docs/15-quellen.md` einordnen.
- Neue Meta-Regeln, Review-Fragen oder Disclaimer-Text nicht nur hier pflegen, sondern in `STYLEGUIDE.md`, `REVIEW_CHECKLIST.md` oder `DISCLAIMER.md` aktualisieren.
- Bildassets mit passender `.prompt.md` dokumentieren.

## Evidenz

- Quellenhierarchie: offizielle Quellen/Leitlinien > Reviews/Meta-Analysen/Positionspapiere > Coaches/YouTube > Influencer-Content.
- Aussagen auf Aktualitaet, Zielgruppe, Evidenzbasis, Interessenkonflikte und Praxisuebertragbarkeit pruefen.
- Coaches und YouTube nur als Praxis- und Einordnungsquellen behandeln, nicht als Primaerquelle.
- Medizinische Aussagen vorsichtig formulieren: keine Diagnosen, keine Einzelberatung, keine Garantien.

## Geltungsbereich

Primaer gesunde Erwachsene von 18 bis 65 Jahren. Bei Erkrankungen, Medikamenten, Schmerzen, Essstoerungen, starkem Uebergewicht, Schwangerschaft, Schlafstoerungen oder extremen Diaeten auf fachliche Abklaerung verweisen.

Der kurze oeffentliche Hinweis steht in `DISCLAIMER.md`; bei sicherheitsrelevanten Aenderungen pruefen, ob der Hinweis dort oder im betroffenen Kapitel aktualisiert werden muss.

## Assets

Ruhiger, hochwertiger Fitness-Kompass-Stil mit Gesundheit, Training, Ernaehrung und Evidenz. Keine aggressiven Bodybuilding-Klischees, keine Vorher-nachher-Optik, keine Produktwerbung, kein Text in generierten Bildern.

- Kapitelbanner werden als erstes Bild direkt nach der H1 im jeweiligen `docs/`-Kapitel gepflegt. Zielformat: 2400x600 px, 4:1, PNG-Original unter `assets/visuals/`, gleichnamige `.prompt.md`, keine lesbaren Woerter, Zahlen, Labels, Logos, Wasserzeichen oder pseudo-textartige Markierungen.

## Web-App

- Next.js-Aenderungen muessen die Inhalte als ruhiges Wissensprodukt zeigen: schnelle Navigation, gute Lesbarkeit, Suche und klare Warn-/Grenzhinweise statt Marketing-Optik.
- Die Next.js-App liegt unter `client/`; `README.md`, `docs/`, `assets/`, `DISCLAIMER.md` und die Projektregeln bleiben im Repository-Root.
- `client/` ist eine technische und visuelle Abbildung des Projekts. Inhaltliche Korrekturen, neue Kapitel, Reihenfolge, Quellenlogik und fachliche Aussagen werden zuerst in der Root-`README.md` oder in `docs/` gepflegt und danach in die Web-App uebernommen.
- `docs/` bleibt die deutsche Quelle; `client/content/en` und `client/content/zh` sind uebersetzte Web-Ableitungen und koennen mit `pnpm translate:content` im `client/` neu erzeugt werden.
- Generierte oder kopierte Web-Assets muessen als Ableitung behandelt werden.
- Komponenten, Farben, Abstaende und Bildnutzung muessen zu `DESIGN.md` passen.
