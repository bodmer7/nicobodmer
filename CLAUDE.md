# CLAUDE.md: nico-bodmer.ch

Portfolio von Nico Bodmer. Astro 7, statisch, Deutsch (ohne Präfix) und
Englisch (`/en/`). Gehostet bei Infomaniak, Upload von `dist/` per Web FTP.
Inhalte und Befehle: README.md und CONTENT.md.

## Wahrheitsregel

Nur Fakten aus `src/data/profil.ts`, den Projektdateien oder aus geprüften
Live-Seiten. Keine erfundenen Zahlen, Kunden, Zitate, Bewertungen,
Auszeichnungen oder Ergebnisse. Messwerte immer mit Quelle und Datum.
Lieber einen auskommentierten Platzhalter als erfundenen Inhalt. Der
Arbeitgeber erscheint nur in Laufbahn und Lebenslauf, nie im Hero, in
Seitentiteln oder Meta-Beschreibungen. Musterprojekte sind frei erfundene
Betriebe und werden überall so bezeichnet. Morgen-Check-in: nur
Beispieldaten; den MCP-Server hat Nico eingerichtet, nicht programmiert.

## Textregeln

- Schweizer Rechtschreibung (ss), Anführungszeichen «so», Ich-Form, Siezen.
- Verboten überall (Seite, Alt-Texte, Meta, Doku, Commit-Messages):
  U+2014, U+2013, U+00B7, U+2192, U+2197, U+2193 und U+00DF.
  `npm run check:text` prüft das.
- Keine Werbefloskeln («Leidenschaft», «innovativ», «massgeschneidert»,
  «nahtlos», «Mehrwert», «next level»).
- «Data & AI» und «Business & AI» mit geschützten Leerzeichen (U+00A0).

## Designsystem «Signal» (src/styles/tokens.css)

- Farben hell: paper #F2F2EF, surface #E7E7E3, ink #141619, ink-2 #5C6066,
  line #D5D5D0, signal #C8261C (Flächen), signal-text #B3241B (Text).
  Dunkel nach Systemeinstellung oder Schalter (`data-theme`).
- Rot sparsam: Kontakt-Bereich, ein Signal-Button, Heute-Linie, aktive Tabs.
- Eine Schrift: Schibsted Grotesk (variabel 400 bis 900), selbst gehostet.
  `font-variant-numeric: tabular-nums` nur über `.ziffern` oder gezielt:
  die tnum-Funktion dieser Schrift macht auch Punkt und Komma breit.
- Raster 4/6/12 Spalten, Inhalt höchstens 1360px, `border-radius: 0`
  (einzige Ausnahme: Handy-Rahmen 28px), keine Schatten, keine Verläufe.
- Der Name im Hero füllt die Inhaltsbreite: `--r: 6.04` und
  `margin-left: -0.0625em` in `hero.css`, gemessen bei Gewicht 900 und
  Laufweite -0.045em. Bei Änderungen an Schrift oder Laufweite neu messen.
- Bewegung nur: Hero-Auftritt einmal pro Sitzung, View Transitions,
  Antworten auf Handlungen, Laufbahn-Balken und Readiness-Ring einmal.
  `prefers-reduced-motion` schaltet alles ab.

## Verboten (nicht bauen)

Laufband, Zähler-Animationen, Kennzahlen ohne Quelle, Magnet-Buttons,
eigene Mauszeiger, Partikel, 3D-Kippen, Glas, Verläufe, Glow, Grain,
Einblenden jeder Sektion beim Scrollen, Wort-für-Wort-Text,
Schreibmaschinen-Effekt, Scroll-Jacking, Bento-Raster, Karten mit Schatten,
Pillen-Tags, Emoji, Icon-Sets, «Verfügbar»-Badges, nummerierte Abschnitte,
Versalien-Labels, Mono-Schrift, Mittelpunkte als Trenner, Pfeile an Links,
Dark Mode per Taste, Wisch-Gesten, Vorher-Nachher-Regler, erfundene
Browserleisten, KI-Bilder, Stockfotos.

## Technik

- Fachtexte: `src/i18n/ui.ts` (UI), `src/data/profil.ts` (Laufbahn, Können),
  `src/content/projekte/` (Projekte). Keine doppelt gepflegten Inhalte.
- Interaktion als kleine Module in `src/scripts/`. Alles funktioniert ohne
  JavaScript sinnvoll (Inhalte im HTML, Schalter über native Radios und
  `:has()`).
- Bilder über `src/components/Bild.astro` (AVIF, WebP-Rückfall, wenige
  Breiten). `dist/` muss unter 9 MB bleiben (`scripts/check-size.mjs`).
- iframes (odera.ch, Geo-Quiz) erst nach Klick.
- Astro 7: `compressHTML: true` (HTML-Leerraum), Markdown über Sätteri ohne
  Smart Punctuation. Bei Inline-Elementen in Vorlagen auf Leerzeichen vor
  Satzzeichen achten.

## Prüfen vor jedem Push

```bash
npm run qa
```

Läuft: `astro check`, Build, Text- und Grössenprüfung, Playwright-Tests
(inkl. axe hell und dunkel), html-validate, linkinator, Lighthouse mobil
(Ziel: Leistung mindestens 95, sonst 100) und QA-Screenshots nach
`qa-screenshots/`. Die Screenshots selbst ansehen.

## Repo

- Branch `main`, kein Force-Push. Commit-Messages auf Deutsch.
- Der Push aktualisiert die Live-Seite nicht (Upload per Web FTP).
