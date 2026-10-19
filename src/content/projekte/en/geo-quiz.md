---
title: Geo quiz
projekt: geo-quiz
slug: geo-quiz
kurz: Find places on an unlabelled aerial map. Scored by distance.
typ: Web app
jahr: 2026
rolle: Idea, design and build
technik: [Vite, TypeScript, Leaflet, OpenStreetMap data, swisstopo aerial imagery, GitHub Actions, GitHub Pages]
links:
  - label: Try the geo quiz
    url: https://bodmer7.github.io/segberike/
messwerte: []
bilder:
  - datei: ../../../assets/screens/geo-quiz-desktop.webp
    alt: Geo quiz on desktop, an unlabelled aerial map of a village with the question where the church of St. Mauritius is
    unterschrift: bodmer7.github.io/segberike, question 1 of 8
    geraet: desktop
vorschau: 0
reihenfolge: 3
featured: true
status: live
position: 0% 0%
seo: "Geo quiz, a web app by Nico Bodmer. Tap places on an unlabelled aerial map, scored by distance. With a live demo."
# gelernt: ""
---

## Starting point

You know your own region from the bike and the train window. On a blank map you still cannot find it.

## Goal

A quiz for my circle of friends that shows how well you really know your own village.

## Approach

1. **Data:** Places and streets come from OpenStreetMap and are filtered and clipped to the village by script, not maintained by hand.
2. **Map:** Leaflet shows swisstopo aerial imagery without labels, plus the outline of the village.
3. **Game:** You tap a place, confirm and see the distance and your points.
4. **Publishing:** On every push, GitHub Actions builds the app and deploys it to GitHub Pages.

## Decisions

- **Aerial imagery instead of a street map.** Without labels you have to find your way by roofs, fields and woods.
- **Distance instead of right or wrong.** The closer to the right spot, the more points.
- **Eight questions per round.** Short enough for a quick break.
- **Data by script.** Changes in OpenStreetMap reach the game with a new run.

## Result

A live web app with eight questions per round and its own logo. You can play it right here below.
