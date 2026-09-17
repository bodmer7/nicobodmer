# Portfolio — Nico Bodmer

Persönliche Portfolio-Website: Werdegang, Projekte, Websites, Skills und Kontakt.
Statische Seite ohne Build-Schritt — reines HTML, CSS und Vanilla JavaScript.

## Struktur

```
index.html            Gesamte Seite (semantisches Markup, deutsche Texte)
assets/css/style.css  Design-Tokens, Sektionen, Responsive-Regeln
assets/js/i18n.js     Englische Übersetzungen (Deutsch steht im HTML)
assets/js/main.js     Interaktion: Theme, Menü, Filter, Slider, Scroll-Effekte
assets/img/           Bilder (WebP, optimiert)
```

## Lokal starten

Keine Abhängigkeiten, kein Build. Einfach einen kleinen Server starten:

```bash
python3 -m http.server 8000
```

Danach http://localhost:8000 öffnen. (Ein Doppelklick auf `index.html` funktioniert
ebenfalls, nur werden dann je nach Browser die Schriften von Google Fonts blockiert.)

## Funktionen

- **Dark / Light** — Umschalter im Menü und im Footer, Taste `T`, oder vom rechten
  Bildschirmrand wischen. Die Wahl wird im `localStorage` gemerkt.
- **Deutsch / Englisch** — Umschalter im Menü und im Footer. Deutsch ist der
  Ausgangszustand im HTML, Englisch kommt aus `assets/js/i18n.js`.
- **Werdegang** — Zeilen öffnen per Klick, Tastatur (Enter / Space) oder Hover.
- **Projektfilter** — Alle / Websites / Apps / Tools.
- **Vorher-Nachher-Regler** — Maus, Touch und Pfeiltasten.
- **Skills** — beim Hovern wird die zugehörige Station im Werdegang hervorgehoben.
- Alle Animationen respektieren `prefers-reduced-motion`.

## Inhalte pflegen

- **Texte:** direkt in `index.html`. Für die englische Fassung den gleichen
  `data-i18n`-Schlüssel in `assets/js/i18n.js` ergänzen.
- **Bilder:** nach `assets/img/` legen. Konvertierung, die hier verwendet wurde:
  ```bash
  cwebp -q 82 -resize 1600 0 -metadata none input.png -o assets/img/output.webp
  ```
- **Offene Platzhalter** sind im HTML mit `TODO` markiert (Website-Karte unter
  „Websites", Lebenslauf-PDF).
- **Vorher-Nachher im Projektteil** zeigt ein neutrales Beispiel-Layout („Muster AG"),
  keine Kundenscreenshots. Beide Zustände sind in HTML/CSS gebaut (`.mock`), nicht
  als Bild — sie skalieren über Container-Queries mit der Box mit.

## Deployment

Die Seite ist statisch und läuft auf jedem Webspace, GitHub Pages, Netlify oder
Vercel — es muss lediglich der Repo-Inhalt ausgeliefert werden.
