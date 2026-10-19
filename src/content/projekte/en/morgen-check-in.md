---
title: Morning check-in
projekt: morgen-check-in
slug: morning-check-in
kurz: My sports watch data as my own morning page, local and read-only.
typ: Tool
jahr: 2026
rolle: Setup, hardening and design of the page
technik: [MCP, Python, SQLite, Jinja2, Playwright, scheduled tasks]
links: []
messwerte: []
bilder:
  - datei: ../../../assets/screens/health-dashboard.webp
    alt: Morning check-in with sample data, greeting, weather, suggestion for the day, a readiness ring showing 82 and figures for sleep, HRV, Body Battery and stress
    unterschrift: The whole morning page, with sample data
    geraet: desktop
  - datei: ../../../assets/screens/health-dashboard-crop.webp
    alt: Detail with greeting, the week's weather and a readiness score of 82, sample data
    unterschrift: Top detail, with sample data
    geraet: desktop
vorschau: 1
reihenfolge: 4
featured: true
status: live
position: 50% 0%
seo: "Morning check-in, a private tool by Nico Bodmer. Sports watch data as a morning page, local and read-only. Shown with sample data."
gelernt: "With personal data, I set the permissions first: read only, stay local. Only then do I build."
---

## Starting point

The sports watch collects health data every day, and it stays locked inside the manufacturer's app.

## Goal

A page of my own every morning with what matters for the day, without handing the data over.

## Approach

1. **Access:** A local open-source MCP server for Garmin data. I set it up and limited it to read-only access with an allowlist.
2. **Page:** From it, a morning page is generated automatically with a greeting, the weather for Zurich, a suggestion for the day, a readiness ring and figures for sleep, HRV trend, Body Battery and stress.
3. **Schedule:** A scheduled task rebuilds the page every morning.

## Decisions

- **Local instead of cloud.** The data stays on my device.
- **Read-only.** The allowlist permits no write access.
- **A page instead of an app.** HTML from a template is enough and opens anywhere.

## Privacy

The data stays local and the server may only read. Only sample data is shown here, never real health values.

## Result

A morning page that appears without me doing anything. Below is a small replica with sample data to try out.
