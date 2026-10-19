---
title: Morgen-Check-in
projekt: morgen-check-in
slug: morgen-check-in
kurz: Die Daten meiner Sportuhr als eigene Morgen-Seite, lokal und nur lesend.
typ: Werkzeug
jahr: 2026
rolle: Einrichtung, Absicherung und Gestaltung der Seite
technik: [MCP, Python, SQLite, Jinja2, Playwright, geplante Aufgaben]
links: []
messwerte: []
bilder:
  - datei: ../../../assets/screens/health-dashboard.webp
    alt: Morgen-Check-in mit Beispieldaten, Begrüssung, Wetter, Tagesvorschlag, Readiness-Ring mit dem Wert 82 und Kennzahlen zu Schlaf, HRV, Body Battery und Stress
    unterschrift: Die ganze Morgen-Seite, mit Beispieldaten
    geraet: desktop
  - datei: ../../../assets/screens/health-dashboard-crop.webp
    alt: Ausschnitt mit Begrüssung, Wetter der Woche und Readiness-Wert 82, Beispieldaten
    unterschrift: Ausschnitt oben, mit Beispieldaten
    geraet: desktop
vorschau: 1
reihenfolge: 4
featured: true
status: live
position: 50% 0%
seo: "Morgen-Check-in, ein privates Werkzeug von Nico Bodmer. Daten der Sportuhr lokal und nur lesend als Morgen-Seite. Mit Beispieldaten."
gelernt: "Bei persönlichen Daten lege ich zuerst die Rechte fest: nur lesen, lokal bleiben. Erst dann baue ich."
---

## Ausgangslage

Die Sportuhr sammelt jeden Tag Gesundheitsdaten, die in der Hersteller-App liegen bleiben.

## Ziel

Jeden Morgen eine eigene Seite mit dem, was für den Tag zählt, ohne die Daten aus der Hand zu geben.

## Vorgehen

1. **Zugriff:** Ein lokaler Open-Source-MCP-Server für Garmin-Daten. Ich habe ihn eingerichtet und per Allowlist auf reine Lesezugriffe beschränkt.
2. **Seite:** Daraus entsteht automatisch eine Morgen-Seite mit Begrüssung, Wetter für Zürich, Tagesvorschlag, Readiness-Ring und Kennzahlen zu Schlaf, HRV-Trend, Body Battery und Stress.
3. **Ablauf:** Eine geplante Aufgabe erzeugt die Seite jeden Morgen neu.

## Entscheidungen

- **Lokal statt Cloud.** Die Daten bleiben auf meinem Gerät.
- **Nur lesen.** Die Allowlist lässt keine schreibenden Zugriffe zu.
- **Eine Seite statt einer App.** HTML aus einer Vorlage reicht und lässt sich überall öffnen.

## Datenschutz

Die Daten bleiben lokal, der Server darf nur lesen. Hier gezeigt werden ausschliesslich Beispieldaten, nie echte Gesundheitswerte.

## Ergebnis

Eine Morgen-Seite, die ohne mein Zutun entsteht. Unten eine kleine Nachbildung mit Beispieldaten zum Ausprobieren.
