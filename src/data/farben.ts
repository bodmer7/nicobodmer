/**
 * Farben mit Bedeutung: Jedes Projekt trägt die Farbe seines eigenen
 * Auftritts, jede Spur der Laufbahn und jede Können-Gruppe eine feste Farbe.
 * Die Werte stehen in src/styles/tokens.css, die Zuordnung zu den
 * CSS-Variablen in src/styles/farbe.css (Attribut data-farbe).
 *
 * Neues Projekt: hier eine Farbe eintragen, sonst gilt «neutral».
 */
export type Farbe = 'blau' | 'gruen' | 'orange' | 'rosa' | 'gelb' | 'rot' | 'neutral';

const zuordnung: Record<string, Farbe> = {
  // Projekte (Farbe des eigenen Auftritts)
  odera: 'blau',
  musterprojekte: 'orange',
  'geo-quiz': 'gruen',
  'morgen-check-in': 'rosa',
  'prognose-app': 'neutral',
  website: 'rot',

  // Seiten im Viewport-Labor
  doppelmeter: 'gruen',
  firstlicht: 'orange',

  // Spuren der Laufbahn
  arbeit: 'blau',
  ausbildung: 'gelb',
  projekte: 'neutral',

  // Können-Gruppen
  web: 'blau',
  betrieb: 'gruen',
  daten: 'rosa',
  vertrieb: 'orange',
  support: 'gelb',
  arbeitsweise: 'neutral',
  sprachen: 'neutral',
};

export const farbe = (id: string): Farbe => zuordnung[id] ?? 'neutral';
