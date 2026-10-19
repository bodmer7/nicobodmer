---
title: Geo-Quiz
projekt: geo-quiz
slug: geo-quiz
kurz: Orte auf einer unbeschrifteten Luftbildkarte finden. Gewertet wird nach Distanz.
typ: Web-App
jahr: 2026
rolle: Idee, Gestaltung und Umsetzung
technik: [Vite, TypeScript, Leaflet, OpenStreetMap-Daten, swisstopo-Luftbilder, GitHub Actions, GitHub Pages]
links:
  - label: Geo-Quiz ausprobieren
    url: https://bodmer7.github.io/segberike/
messwerte: []
bilder:
  - datei: ../../../assets/screens/geo-quiz-desktop.webp
    alt: Geo-Quiz auf dem Desktop, Luftbildkarte einer Gemeinde ohne Beschriftung und unten die Frage, wo die Kirche St. Mauritius steht
    unterschrift: bodmer7.github.io/segberike, Frage 1 von 8
    geraet: desktop
vorschau: 0
reihenfolge: 3
featured: true
status: live
position: 0% 0%
seo: "Geo-Quiz, eine Web-App von Nico Bodmer. Orte auf einer unbeschrifteten Luftbildkarte antippen, gewertet nach Distanz. Mit Live-Demo."
gelernt: "Mit Geodaten zu arbeiten heisst, sauber mit Quellen und Lizenzen umzugehen. Und ein automatisches Deployment über GitHub Actions spart bei jeder Änderung Zeit."
---

## Ausgangslage

Die eigene Region kennt man vom Velo und vom Zugfenster. Auf einer leeren Karte findet man sie trotzdem nicht.

## Ziel

Ein Quiz für den eigenen Freundeskreis, das zeigt, wie gut man die eigene Gemeinde wirklich kennt.

## Vorgehen

1. **Daten:** Orte und Strassen kommen aus OpenStreetMap und werden per Skript gefiltert und auf die Gemeinde zugeschnitten, nicht von Hand gepflegt.
2. **Karte:** Leaflet zeigt Luftbilder von swisstopo, ohne Beschriftung, dazu den Umriss der Gemeinde.
3. **Spiel:** Man tippt einen Ort an, bestätigt und sieht Distanz und Punkte.
4. **Veröffentlichung:** Bei jedem Push baut GitHub Actions die App und stellt sie auf GitHub Pages.

## Entscheidungen

- **Luftbild statt Strassenkarte.** Ohne Beschriftung muss man sich an Dächern, Feldern und Wald orientieren.
- **Distanz statt richtig oder falsch.** Je näher am richtigen Punkt, desto mehr Punkte.
- **Acht Fragen pro Runde.** Kurz genug für zwischendurch.
- **Daten per Skript.** Änderungen in OpenStreetMap kommen mit einem neuen Lauf ins Spiel.

## Ergebnis

Eine Live-Webapp mit acht Fragen pro Runde und eigenem Logo. Unten lässt sie sich direkt hier spielen.
