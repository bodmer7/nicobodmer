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
- Die Farbe des Projekts steht in `src/data/farben.ts` (zum Beispiel
  `'neue-website': 'gruen'`). Ohne Eintrag ist das Projekt neutral.
- «Was ich gelernt habe»: Feld `gelernt:` im Kopf der Projektdatei. Der
  Abschnitt steht am Ende der Fallstudie und im Inhaltsverzeichnis. Ohne
  das Feld (oder mit `#` davor) fällt er weg.

## «Gerade» aktualisieren

In `src/data/profil.ts` die Liste `gerade` und `stand` anpassen. Im Footer
und im Hero steht zusätzlich «Stand Oktober 2026» in `src/i18n/ui.ts`
(`hero.gerade`, `footer.stand`).

## Hobbys ergänzen

In `src/data/profil.ts` bei `hobbies` Einträge hinzufügen, zum Beispiel
`{ de: 'Velofahren', en: 'Cycling' }`. Der Block «Ausserhalb der Arbeit»
erscheint, sobald etwas drinsteht.

## Studium nachführen

Die Themen des laufenden Semesters stehen in `src/data/profil.ts` in der
Können-Gruppe `studium` («Im Studium»). Jedes Semester:

1. Die Liste `begriffe` durch die Module des neuen Semesters ersetzen
   (Deutsch und Englisch).
2. Bei jedem Begriff `semester` auf die neue Zahl setzen.
3. Nur Themen eintragen, die gerade laufen: keine späteren Module, keine
   Noten.

Die Gruppe in «Können» und die Zeile «Themen im … Semester» beim BSc im
Lebenslauf zeigen die neuen Themen danach automatisch. Auch «Gerade» in
derselben Datei prüfen.

## Lebenslauf als PDF

Die Seite `/lebenslauf/` hat den Knopf «Als PDF speichern». Im Druckdialog
«Als PDF sichern» wählen. Der Lebenslauf passt auf zwei A4-Seiten.

## Screenshots neu machen

Das Geo-Quiz (Desktop und Handy) macht der Workflow «Extern prüfen und
messen» automatisch, siehe «Veröffentlichen». Von Hand auf dem eigenen
Rechner:

```bash
npm run screenshots -- --nur geo-quiz
npm run screenshots -- --nur doppelmeter firstlicht
npm run screenshots -- --alle
```

Das Skript legt WebP-Dateien in `src/assets/screens/` ab. Ohne `--nur` oder
`--alle` macht es nichts und zeigt die Möglichkeiten. Danach die Bilder
anschauen und `npm run build`.

Die Screenshots vom 19. Oktober 2026 sind aus dem Quellcode von odera.ch
(Repository odera-design) lokal gerendert, weil die Live-Seite aus der
Arbeitsumgebung nicht erreichbar war. Der Geo-Quiz-Screenshot ist der
bisherige. Mit `npm run screenshots` auf dem eigenen Rechner entstehen sie
direkt von den Live-Seiten.

## Messen

Die Werte der Live-Seiten misst der Workflow «Extern prüfen und messen»
(Lighthouse mobil, drei Läufe, Median). Er schreibt sie nach
`src/data/messwerte.json`, getrennt nach «diese Website» und «Projekte»:

- Der Footer zeigt die Live-Werte von nico-bodmer.ch mit Datum. Gibt es
  noch keine, zeigt er die lokale Messung mit dem Zusatz «lokal gemessen».
- Labor und Fallstudien zeigen für odera.ch und das Geo-Quiz die eigene
  Messung mit Datum und Methode. Ohne Messung erscheint nichts.
- Die veröffentlichten Werte der Musterprojekte bleiben mit ihrer Quelle
  stehen; eigene Messungen erscheinen getrennt als «Eigene Messung».

Lokal messen (Teil «lokal»):

```bash
npm run measure
npm run build
```

## Veröffentlichen

```bash
git add -A
git commit -m "Kurze Beschreibung"
git push
```

Nach 1 bis 2 Minuten ist die Änderung auf https://nico-bodmer.ch online.
Den Stand zeigt der Tab «Actions» im Repository auf GitHub: grüner Haken
heisst online, rotes Kreuz heisst, ein Test ist gescheitert und die alte
Version bleibt online. Vor dem Push lokal `npm run qa` laufen lassen.

Screenshots, Messwerte und Linkprüfung der Live-Seite: Tab «Actions»,
«Extern prüfen und messen», «Run workflow». Er läuft zusätzlich am ersten
Montag im Monat von selbst.

## Links für Bewerbungen

Diese Links wählen «Eine offene Stelle» vor:

- https://nico-bodmer.ch/?fuer=stelle
- https://nico-bodmer.ch/en/?for=job

Für Betriebe: https://nico-bodmer.ch/?fuer=website bzw.
https://nico-bodmer.ch/en/?for=website
