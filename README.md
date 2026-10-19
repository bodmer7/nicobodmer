# nico-bodmer.ch

Persönliche Website von Nico Bodmer. Statische Seite ohne Build, ohne
Abhängigkeiten und ohne externe Dienste: HTML, eine CSS-Datei, ein kleines
Skript und eine selbst gehostete Schrift.

## Struktur

```
index.html                          Deutsche Seite (lang de-CH)
en/index.html                       Englische Seite, gleicher Aufbau
assets/css/style.css                Gestaltung: Farben, Schrift, Raster, Druck
assets/js/kopieren.js               Knopf «Adresse kopieren» (einziges Skript)
assets/fonts/                       Schibsted Grotesk, variabel, Subset latin (OFL)
assets/img/                         Fotos, Screenshots, Favicon, og.jpg
sitemap.xml, robots.txt             Für Suchmaschinen
```

Alle Pfade sind relativ, die Seite läuft unter jeder Adresse. Nur canonical,
hreflang, Open Graph, JSON-LD und Sitemap verwenden die absolute Adresse
https://nico-bodmer.ch/.

## Lokal starten

```bash
python3 -m http.server 8000
```

Danach http://localhost:8000 öffnen. Die englische Seite liegt unter
http://localhost:8000/en/.

## Inhalte pflegen

- **Texte:** direkt in `index.html` und `en/index.html`. Beide Dateien haben
  denselben Aufbau, Änderungen also immer in beiden machen.
- **Projekte:** ein Projekt ist ein `<article class="project grid">` mit
  Screenshot, Titel, einem Satz, einer Liste (`<dl>`) und dem Link.
  Screenshots im Format 16:10 als WebP ablegen; sie werden oben ausgerichtet
  zugeschnitten. Mit der Klasse `project__shot--left` wird links statt mittig
  zugeschnitten.
- **Bilder:** immer mit `width`, `height` und `alt`. Alle ausser dem Foto
  oben bekommen `loading="lazy"`.
- **Nach Änderungen an CSS oder JS:** die Zahl in `?v=10` in beiden HTML-Dateien
  erhöhen, damit Browser die neue Fassung laden.
- **Lebenslauf:** im Kontakt steht ein auskommentierter Link. PDF unter
  `assets/Lebenslauf-Nico-Bodmer.pdf` ablegen und den Kommentar entfernen.
- **Jahr in der Fusszeile:** steht fest im HTML und wird jährlich angepasst.

## Gestaltung

- Farben: Hintergrund `#F3F4F1`, Text `#1A1D20`, Nebentext `#5A6066`,
  Linien `#D3D6D1`, Akzent `#1F5A44` (nur für Hover und Fokus).
- Schrift: nur Schibsted Grotesk, Gewichte 400, 600 und 650.
- Raster: 12 Spalten, Inhalt höchstens 1280px, unter 720px gestapelt.
- Der Name oben füllt immer genau die Inhaltsbreite. Die Schriftgrösse ergibt
  sich aus der gemessenen Breite des Namens (5.805 em). Wer Schrift, Gewicht
  oder Laufweite ändert, muss diesen Wert in `style.css` neu messen.

## Textregeln

Schweizer Rechtschreibung (ss), Anführungszeichen «so», Besucher werden
gesiezt. Keine Gedankenstriche, Mittelpunkte oder Pfeile im Text. Prüfen:

```bash
perl -CSD -ne 'print "$ARGV:$.: $_" if /[\x{2014}\x{2013}\x{00B7}\x{2192}\x{2197}\x{2193}\x{00DF}]/; close ARGV if eof' \
  index.html en/index.html README.md
```

Das Ergebnis muss leer sein.

## Veröffentlichen

Die Seite liegt bei Infomaniak. Ein Push auf GitHub aktualisiert sie nicht:
geänderte Dateien per Web FTP hochladen.
