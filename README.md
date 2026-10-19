# nico-bodmer.ch

Portfolio von Nico Bodmer: mehrseitige, statische Website mit Astro, auf
Deutsch und Englisch. Keine Cookies, kein Tracking, keine externen Dienste
beim Aufruf.

Inhalte pflegen ohne Programmierkenntnisse: siehe [CONTENT.md](CONTENT.md).
Regeln für künftige Arbeiten mit Claude Code: [CLAUDE.md](CLAUDE.md).

## Befehle

| Befehl | Was er tut |
|---|---|
| `npm install` | Abhängigkeiten installieren (Node 22.22 oder neuer) |
| `npm run dev` | Entwicklungsserver auf http://localhost:4321 |
| `npm run build` | Seite nach `dist/` bauen, danach Grössenprüfung (unter 9 MB) |
| `npm run preview` | Gebaute Seite lokal ansehen |
| `npm run check` | `astro check` (TypeScript und Vorlagen) |
| `npm test` | Playwright-Tests in `tests/e2e/` |
| `npm run qa` | Alles prüfen: check, Build, Text, Grösse, Tests, axe, html-validate, Links, Lighthouse, QA-Screenshots |
| `npm run screenshots` | Screenshots von odera.ch, Musterprojekten und Geo-Quiz neu machen |
| `npm run og` | OG-Bild und Apple-Touch-Icon neu rendern |
| `npm run measure` | Lighthouse messen und `src/data/messwerte.json` schreiben |
| `npm run check:text` | Verbotene Zeichen suchen (Gedankenstriche, Mittelpunkte, Pfeile, Eszett) |

## Struktur

```
astro.config.mjs        Astro 7: statisch, i18n (de ohne Präfix, en unter /en/), Sitemap
src/
  assets/fotos/         Echte Porträts (keine KI-Bilder)
  assets/screens/       Screenshots der Projekte (aus scripts/screenshots.mjs)
  components/           Hero, ProjektIndex, ViewportLabor, LaufbahnSpuren, ...
  content/projekte/     Eine Markdown-Datei pro Projekt und Sprache
  content.config.ts     Schema der Projekte
  data/profil.ts        Einzige Quelle für Stationen, Ausbildung, Können, «Gerade»
  data/messwerte.json   Lighthouse-Werte für den Footer (aus scripts/measure.mjs)
  i18n/ui.ts            Alle Oberflächentexte Deutsch und Englisch
  i18n/routes.ts        Pfade beider Sprachen, Sprachumschalter
  layouts/              Base (Kopf, Fuss, Metadaten), Fallstudie
  pages/                Startseite, Fallstudien, Lebenslauf, Recht, 404, Links, OG-Bilder
  scripts/              Kleine TypeScript-Module für die Interaktion
  styles/               tokens.css (Designsystem), base, layout, print, components/
public/                 Schrift, Favicon, og.jpg, vCard, robots.txt, .htaccess
scripts/                screenshots, og, measure, check-text, check-size, qa
tests/e2e/              Playwright-Tests
```

## Seiten

| Deutsch | Englisch |
|---|---|
| `/` | `/en/` |
| `/arbeiten/odera/` | `/en/work/odera/` |
| `/arbeiten/musterprojekte/` | `/en/work/sample-projects/` |
| `/arbeiten/geo-quiz/` | `/en/work/geo-quiz/` |
| `/arbeiten/morgen-check-in/` | `/en/work/morning-check-in/` |
| `/lebenslauf/` | `/en/cv/` |
| `/impressum-datenschutz/` | `/en/legal/` |
| `/links/` (noindex, nicht in der Navigation) | |
| `/404.html` | |

## Deployment

Das Repository ist privat, GitHub Pages ist dafür nicht verfügbar. Die Seite
liegt bei Infomaniak (Starter, 10 MB) und wird per Web FTP hochgeladen:

1. `npm run build` ausführen. Am Ende steht «Grössenprüfung: dist/ ist … MB».
2. In Infomaniak im Web FTP den Webordner der Domain öffnen.
3. Alte Dateien der früheren Version löschen: `index.html`, `en/`,
   `assets/`, `robots.txt`, `sitemap.xml`, `README.md` (falls vorhanden).
4. Den **Inhalt** von `dist/` in die Wurzel hochladen (nicht den Ordner
   `dist` selbst). Dazu gehört die versteckte Datei `.htaccess`.
5. Prüfen: https://nico-bodmer.ch/, https://nico-bodmer.ch/en/,
   https://nico-bodmer.ch/gibt-es-nicht/ (eigene 404-Seite),
   https://nico-bodmer.ch/sitemap-index.xml.

**Variante GitHub Pages:** Mit einem öffentlichen Repository oder GitHub Pro
(zum Beispiel über GitHub Education) kann GitHub Actions die Seite bei jedem
Push bauen und veröffentlichen. Dafür braucht es einen Workflow nach der
offiziellen Astro-Anleitung, `public/CNAME` mit `nico-bodmer.ch` und neue
DNS-Einträge bei Infomaniak.
