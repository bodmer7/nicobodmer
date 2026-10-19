# CLAUDE.md: nico-bodmer.ch

Portfolio von Nico Bodmer. Astro 7, statisch, Deutsch (ohne Präfix) und
Englisch (`/en/`). Gehostet auf GitHub Pages, Domain bei Infomaniak.
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
- Farben mit Bedeutung (Werte in tokens.css, Zuordnung in
  `src/data/farben.ts`, Variablen über `data-farbe` in `src/styles/farbe.css`):
  blau #2B45D4, gruen #0F7B5F, orange #E8641E, rosa #C42F5C, gelb #FFC53D,
  je mit `-text` (lesbar auf paper) und `-hell` (Tönung, dunkel im Dark Mode).
  Projekte tragen die Farbe ihres Auftritts (ODERA blau, Musterprojekte
  orange, Geo-Quiz gruen, Morgen-Check-in rosa). Laufbahn: Arbeit blau,
  Ausbildung gelb. Jede Können-Gruppe hat eine feste Farbe.
- Bänder über die volle Breite: Hero blau (`band--blau` stellt die Tokens
  um, Kopfzeile oben ebenfalls blau), Über mich und Fallstudien-Kopf in der
  Tönung (`band--hell`), Kontakt rot. Keine weiteren Bänder.
- Rot bleibt Handlung: Kontakt-Bereich, Signal-Button, Heute-Linie.
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
Pillen-Tags, Emoji, «Verfügbar»-Badges, nummerierte Abschnitte,
Versalien-Labels, Mono-Schrift, Mittelpunkte als Trenner,
Dark Mode per Taste, Wisch-Gesten, Vorher-Nachher-Regler, erfundene
Browserleisten, KI-Bilder, Stockfotos.

Icons nur mit Funktion: eigene Inline-SVGs (1.5px Strich, currentColor) und
die Markenzeichen von LinkedIn und GitHub. Kein Icon-Paket im Build.
Externe Links mit dem Icon «extern», nie mit Pfeilzeichen im Text.
Icons in `src/components/Icon.astro`, Marken mit Quelle und Lizenz in
`src/components/Marke.astro`.

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
- Push auf main deployt über GitHub Actions auf GitHub Pages. Vor jedem Push `npm run qa`.
- Netz nach aussen (Screenshots, Lighthouse live, Einbettung, externe Links)
  nur in `.github/workflows/extern.yml`.
