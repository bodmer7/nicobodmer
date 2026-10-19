---
title: Two sample projects
projekt: musterprojekte
slug: sample-projects
kurz: A joinery and a solar installer, both fictitious. Two goals, two distinct identities.
typ: Websites
jahr: 2026
rolle: Concept, design, build and copy
technik: [HTML, CSS, JavaScript, Lighthouse, Playwright]
links:
  - label: View Schreinerei Doppelmeter
    url: https://odera.ch/musterprojekte/doppelmeter/
  - label: View Firstlicht Solartechnik
    url: https://odera.ch/musterprojekte/firstlicht/
  - label: View Firstlicht with explanations
    url: https://odera.ch/musterprojekte/firstlicht/?erklaeren=1
messwerte:
  - wert: "0.5"
    einheit: s
    label: Load time Doppelmeter, until the largest content is visible
    quelle: Lighthouse desktop, median of three runs, slowest of the five pages
    bezug: doppelmeter
    datum: "2026-10-01"
  - wert: "0.4"
    einheit: s
    label: Load time Firstlicht, until the largest content is visible
    quelle: Lighthouse desktop, median of three runs, slowest of the six pages
    bezug: firstlicht
    datum: "2026-10-05"
  - wert: "100"
    label: Firstlicht, Lighthouse mobile for performance, accessibility and best practices
    quelle: Lighthouse mobile, all six pages
    bezug: firstlicht
    datum: "2026-10-05"
  - wert: 84 to 107
    einheit: KB
    label: Firstlicht, weight per page
    quelle: Lighthouse mobile, all six pages
    bezug: firstlicht
    datum: "2026-10-05"
bilder:
  - datei: ../../../assets/screens/firstlicht-desktop.webp
    alt: Home page of Firstlicht Solartechnik, a fictitious business, in a dark design with a house with solar panels and a time-of-day slider
    unterschrift: odera.ch/musterprojekte/firstlicht, desktop. Fictitious business.
    geraet: desktop
vorschau: 0
reihenfolge: 2
featured: true
status: live
position: 50% 0%
seo: "Two ODERA Design sample projects, the joinery Doppelmeter and Firstlicht Solartechnik, both fictitious. Goals, design and measurements."
# gelernt: ""
---

So that businesses can see how an ODERA site works, I built two fictitious businesses with complete websites.

## Starting point

A description convinces a business less than a site it can try for itself. I do not show real client projects. So the examples need to be complete and clearly marked as fictitious.

## Goal

Two businesses with different goals: the joinery wants phone calls, the solar installer wants prepared enquiries. Each site should show how the design follows that one goal, rather than being one template in different colours.

## Schreinerei Doppelmeter

Standard package, 5 pages. The goal of the site is the phone call, so the number is on every screen: as a button at the top right and, on phones, in a fixed bar at the bottom.

The design is calm and crafted: warm paper white, a serif typeface for the large headings, dark green for the buttons and a large photo of a kitchen with a caption. Small lines such as the founding year are set in a typewriter face.

![Joinery Doppelmeter on desktop, a fictitious business: German headline about furniture your grandchildren will still use, a call button and a photo of a kitchen](../../../assets/screens/doppelmeter-desktop.webp) ![Joinery Doppelmeter on a phone, a fictitious business, with a fixed call bar at the bottom](../../../assets/screens/doppelmeter-handy.webp)

## Firstlicht Solartechnik

Pro package, 6 pages. The goal is the prepared enquiry: a solar calculator works out the numbers, and the result goes straight into the form.

The identity is dark with orange as the accent, with a switch for light and dark. The hero shows an illustrated house with solar panels. A slider moves the time of day, and production, consumption, storage and feed-in follow along, for summer or winter. On phones, «call» and «calculator» stay within reach at the bottom. The switch «Was ist hier besonders?» numbers seven spots on the page and explains them.

![Firstlicht Solartechnik in explanation mode, a fictitious business, with numbered markers and a box explaining what is special](../../../assets/screens/firstlicht-erklaert-desktop.webp) ![Firstlicht Solartechnik on a phone, a fictitious business, with call and calculator buttons at the bottom](../../../assets/screens/firstlicht-handy.webp)

## Decisions

- **Fictitious and labelled as such everywhere.** Each site carries a note at the top saying it is a sample page by ODERA Design and the business is made up.
- **One goal per site.** Everything on the site leads to the call or the enquiry.
- **Two distinct identities.** Type, colours and imagery follow the business, not a shared template.
- **Measure instead of claim.** Load times and Lighthouse scores are recorded with method and date.

## Result

Two complete websites that businesses can try for themselves on odera.ch. The measurements are listed below with source and date.
