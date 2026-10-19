# Inhalte pflegen

Diese Anleitung ist für Änderungen ohne Programmierkenntnisse. Nach jeder
Änderung: `npm run build`, dann den Inhalt von `dist/` hochladen (siehe
README, Abschnitt Deployment).

## Textregeln

- Schweizer Rechtschreibung: ss statt Eszett. Anführungszeichen «so».
- Keine Gedankenstriche, keine Mittelpunkte, keine Pfeile. Stattdessen Komma,
  Punkt, Doppelpunkt oder ein neuer Satz. Zeiträume mit «bis».
- Ich-Form, Besucher werden gesiezt. Nur Fakten, die stimmen.
- `npm run check:text` findet verbotene Zeichen.

## Texte ändern

- **Oberflächentexte** (Hero, Überschriften, Buttons, Kontakt, Footer):
  `src/i18n/ui.ts`. Oben Deutsch, darunter Englisch mit denselben Schlüsseln.
- **Stationen, Ausbildung, Können, Sprachen:** `src/data/profil.ts`. Die
  Startseite, das Laufbahn-Diagramm und der Lebenslauf lesen alle von dort.
- **Projekte:** `src/content/projekte/de/*.md` und `src/content/projekte/en/*.md`.
- **Impressum und Datenschutz:** `src/components/RechtSeite.astro`.

## Projekt hinzufügen

Eine Datei pro Sprache anlegen, zum Beispiel
`src/content/projekte/de/neue-website.md`:

```markdown
---
title: Website für Muster AG
projekt: odera
slug: neue-website
kurz: Ein Satz, worum es geht.
typ: Website
jahr: 2027
rolle: Konzept, Gestaltung und Umsetzung
technik: [HTML, CSS, JavaScript]
links:
  - label: Website ansehen
    url: https://example.ch/
messwerte: []
bilder:
  - datei: ../../../assets/screens/neue-website-desktop.webp
    alt: Was auf dem Bild zu sehen ist
    unterschrift: example.ch, Startseite
    geraet: desktop
reihenfolge: 6
featured: true
status: entwurf
---

## Ausgangslage

…

## Ziel

## Vorgehen

1. **Schritt:** …

## Entscheidungen

- **Entscheid.** Warum.

## Ergebnis
```

- `status: entwurf` zeigt das Projekt nirgends an. Erst mit `status: live`
  erscheint es in der Liste und bekommt eine eigene Seite.
- `projekt:` ist der Schlüssel. Für ein ganz neues Projekt muss er in
  `src/content.config.ts` (Liste bei `projekt`), in `src/i18n/routes.ts`
  (Pfade) und in `src/data/profil.ts` (Typ `ProjektId`) ergänzt werden.
  Das ist eine kleine Programmieraufgabe, am einfachsten mit Claude Code.
- «Was ich gelernt habe»: In jeder Projektdatei steht im Kopf die Zeile
  `# gelernt: ""`. Das `#` entfernen und den Text eintragen, dann erscheint
  der Abschnitt.

## «Gerade» aktualisieren

In `src/data/profil.ts` die Liste `gerade` und `stand` anpassen. Im Footer
und im Hero steht zusätzlich «Stand Oktober 2026» in `src/i18n/ui.ts`
(`hero.gerade`, `footer.stand`).

## Hobbys ergänzen

In `src/data/profil.ts` bei `hobbies` Einträge hinzufügen, zum Beispiel
`{ de: 'Velofahren', en: 'Cycling' }`. Der Block «Ausserhalb der Arbeit»
erscheint, sobald etwas drinsteht.

## Lebenslauf als PDF

Die Seite `/lebenslauf/` hat den Knopf «Als PDF speichern». Im Druckdialog
«Als PDF sichern» wählen. Der Lebenslauf passt auf zwei A4-Seiten.

## Screenshots neu machen

```bash
npm run screenshots
```

Das Skript öffnet odera.ch, die Musterprojekte und das Geo-Quiz in drei
Bildschirmgrössen und legt WebP-Dateien in `src/assets/screens/` ab. Danach
die Bilder anschauen und `npm run build`. Einzelne Seiten:
`npm run screenshots -- doppelmeter firstlicht`.

Die Screenshots vom 19. Oktober 2026 sind aus dem Quellcode von odera.ch
(Repository odera-design) lokal gerendert, weil die Live-Seite aus der
Arbeitsumgebung nicht erreichbar war. Der Geo-Quiz-Screenshot ist der
bisherige. Mit `npm run screenshots` auf dem eigenen Rechner entstehen sie
direkt von den Live-Seiten.

## Messen

```bash
npm run measure
npm run build
```

`measure` schreibt die Lighthouse-Werte mit Datum in
`src/data/messwerte.json`. Der Footer zeigt sie auf Startseite,
ODERA-Fallstudie und Lebenslauf. Ohne Messung erscheint die Zeile nicht.

## Links für Bewerbungen

Diese Links wählen «Eine offene Stelle» vor:

- https://nico-bodmer.ch/?fuer=stelle
- https://nico-bodmer.ch/en/?for=job

Für Betriebe: https://nico-bodmer.ch/?fuer=website bzw.
https://nico-bodmer.ch/en/?for=website
