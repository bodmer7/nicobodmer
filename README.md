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
| `npm run screenshots -- --nur geo-quiz` | Screenshots einzelner Projekte neu machen (`--alle` für alle) |
| `npm run og` | OG-Bild und Apple-Touch-Icon neu rendern |
| `npm run measure` | Lighthouse lokal messen und den Teil «lokal» in `src/data/messwerte.json` schreiben |
| `npm run measure:extern` | Lighthouse auf den Live-Seiten, je drei Läufe, Median (braucht Netz, läuft in GitHub Actions) |
| `npm run einbettung` | Prüfen, ob odera.ch und Geo-Quiz im iframe laden; schreibt `src/data/einbettung.json` |
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
  data/messwerte.json   Lighthouse-Werte: lokal, diese Website, Projekte (aus scripts/measure.mjs)
  data/einbettung.json  Ergebnis des Einbettungstests (aus scripts/einbettung.mjs)
  i18n/ui.ts            Alle Oberflächentexte Deutsch und Englisch
  i18n/routes.ts        Pfade beider Sprachen, Sprachumschalter
  layouts/              Base (Kopf, Fuss, Metadaten), Fallstudie
  pages/                Startseite, Fallstudien, Lebenslauf, Recht, 404, Links, OG-Bilder
  scripts/              Kleine TypeScript-Module für die Interaktion
  styles/               tokens.css (Designsystem), base, layout, print, components/
public/                 Schrift, Favicon, og.jpg, vCard, robots.txt, CNAME, .nojekyll
scripts/                screenshots, og, measure, einbettung, check-text, check-size, qa
.github/workflows/      deploy.yml (GitHub Pages), extern.yml (Messen und Prüfen mit Netz)
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

Jeder Push auf `main` startet `.github/workflows/deploy.yml`: `npm ci`,
`astro check`, Build mit Grössenprüfung, Textprüfung, Playwright-Tests,
danach Veröffentlichung auf GitHub Pages unter https://nico-bodmer.ch.
Nach 1 bis 2 Minuten ist die neue Version online. Den Stand zeigt der Tab
«Actions» im Repository. Scheitert ein Schritt, bleibt die alte Version
online.

- Die Domain steht in `public/CNAME`, `public/.nojekyll` schaltet Jekyll ab.
- `404.html` liegt in der Wurzel von `dist/`; GitHub Pages zeigt sie für
  unbekannte Pfade.
- Weiterleitungen und Header wie früher in `.htaccess` gibt es bei GitHub
  Pages nicht. Die Datei ist entfernt. HTTPS erzwingt GitHub Pages selbst
  («Enforce HTTPS» in den Einstellungen).
- Von Hand starten: Tab «Actions», Workflow «Deploy», «Run workflow».

**Extern prüfen und messen** (`.github/workflows/extern.yml`): läuft am
ersten Montag im Monat und von Hand. Macht die Geo-Quiz-Screenshots,
misst die Live-Seiten mit Lighthouse (Median aus drei Läufen), prüft die
Einbettung und alle Links der Live-Seite inklusive externer. Geänderte
Dateien schreibt der Workflow zurück auf `main` und startet danach den
Deploy. Kaputte Links lassen den Lauf rot werden; die Liste steht im
Schritt «Links der Live-Seite».

Früher lag die Seite bei Infomaniak (Starter) und wurde per Web FTP
hochgeladen. Die Domain bleibt bei Infomaniak, nur die DNS-Einträge zeigen
auf GitHub Pages.

## Rechte

Code, Texte und Bilder: alle Rechte vorbehalten. Die Schrift Schibsted
Grotesk steht unter der SIL Open Font License (siehe public/fonts/OFL.txt).
