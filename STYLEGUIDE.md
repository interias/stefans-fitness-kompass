# Styleguide

Der Fitness-Kompass bleibt deutsch, nüchtern, pragmatisch und alltagstauglich. Ziel ist ein verständlicher Entscheidungsrahmen für gesunde Erwachsene, kein akademisches Lehrbuch und kein Social-Media-Programm.

## Grundsätze

- Grundlagen vor Optimierung: robuste Hebel zuerst, Details danach.
- Trends, Kontext und Wiederholbarkeit stärker gewichten als einzelne Tageswerte.
- Zahlenbereiche immer mit Zielgruppe, Grenze und Quelle nennen.
- Medizinische Werte als Prüfwerte formulieren, nicht als Diagnose.
- Coaches, YouTube und Social Media nur als Praxis- oder Einordnungsquellen nutzen, nicht als Hauptbeleg.
- Keine Hype-Sprache, keine Absolutismen, keine moralische Ernährungssprache.

## Bevorzugte Sprache

Bevorzugte Begriffe sind `Grundsatz`, `Grenze`, `Warnsignal`, `häufig sinnvoll`, `prüfen`, `Trend`, `Kontext` und `Wiederholbarkeit`.

Begriffe wie `Kernaussage`, `Einordnung`, `Praxis`, `Nutzen`, `Grenze` und `Beispiele` nur einsetzen, wenn sie einen längeren Abschnitt wirklich klarer machen. Kurze Abschnitte funktionieren meist besser als ein guter Absatz.

## Quellen

Die Quellenhierarchie lautet: Leitlinien und offizielle Quellen vor Reviews und Meta-Analysen, danach Positionspapiere und Einzelstudien. Coaches, Podcasts, YouTube und Influencer-Content sind ergänzend.

Kurzbelege stehen direkt im Text. Zentrale Quellen werden zusätzlich in `docs/15-quellen.md` thematisch eingeordnet. Bei starken fachlichen Aussagen gilt: ohne passende Quelle vorsichtig formulieren oder als `Quelle erforderlich` markieren.

## Sicherheit

Bei Erkrankungen, Medikamenten, Schmerzen, Essstörungen, starkem Übergewicht, Schlafstörungen, Schwangerschaft, extremen Diäten oder auffälligen Symptomen auf fachliche Abklärung verweisen. Keine Diagnosen, keine Heilversprechen, keine Garantien.

## Markdown

Kapitel bleiben nummerierte Markdown-Dateien unter `docs/`. Tabellen, Listen und Checklisten nur verwenden, wenn sie Entscheidungen klarer machen. Formeln werden als LaTeX-Math mit `$...$` oder `$$...$$` geschrieben, damit die Web-App sie mit KaTeX rendern kann. Bildassets brauchen eine passende `.prompt.md`.

## Web und Design

Für Web-, UI- und Asset-Änderungen gilt zusätzlich `DESIGN.md`. Die Web-App darf Inhalte aus `docs/` rendern, aber `docs/` bleibt die kanonische Quelle der Kapiteltexte.

## Übersetzungen

Englisch (`client/content/en`) wird maschinell mit `pnpm translate:content` aus `docs/` erzeugt. Chinesisch (`client/content/zh`) wird von Hand gepflegt: nüchtern, sachlich korrekt und gut lesbar, im selben Stil wie das deutsche Original. Der Übersetzungs-Script überspringt `zh` bewusst, damit handgetunte Formulierungen nicht überschrieben werden. Wer `docs/` inhaltlich ändert, zieht die Änderung anschließend manuell in `client/content/zh` nach. Bevorzugte Begriffsentsprechungen: `häufig sinnvoll` → 通常合理, `Warnsignal` → 警示信号, `prüfen` → 检查, `Trend` → 趋势, `Wiederholbarkeit` → 可重复性; RIR/RPE/VO2max/mTORC1/EMOM bleiben als Fachkürzel stehen.
