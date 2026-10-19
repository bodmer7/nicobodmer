/**
 * Einzige Quelle für Person, Stationen, Ausbildung, Können und «Gerade».
 * Startseite, Laufbahn-Diagramm und Lebenslauf lesen alle von hier.
 * Texte stehen pro Sprache: { de, en }.
 */
import type { Lang } from '../i18n/ui';

export type Text = Record<Lang, string>;

/** Monat als 'JJJJ-MM'. */
export type Monat = `${number}-${string}`;

export type ProjektId = 'odera' | 'musterprojekte' | 'geo-quiz' | 'morgen-check-in';

export type NachweisRef =
  | { art: 'station'; id: string }
  | { art: 'projekt'; id: ProjektId }
  | { art: 'website' };

export interface Station {
  id: string;
  rolle: string;
  organisation: Text;
  von: Monat;
  /** null heisst: läuft noch */
  bis: Monat | null;
  punkte: Text[];
}

export interface Ausbildung {
  id: string;
  titel: Text;
  schule: Text;
  zusatz?: Text;
  von: Monat;
  bis: Monat | null;
  /** Anzeige des Zeitraums, wenn er von der Monatsangabe abweicht */
  zeitraum?: Text;
  /** Geplantes Ende für das Diagramm (gestrichelt nach «Heute») */
  geplantBis?: Monat;
}

export interface EigenesProjekt {
  id: ProjektId | 'website';
  titel: Text;
  jahr: number;
}

export interface KoennenGruppe {
  id: string;
  titel: Text;
  begriffe: Text[];
  nachweise: NachweisRef[];
}

export const person = {
  name: 'Nico Bodmer',
  ort: { de: 'Raum Zürich', en: 'Zurich area' } satisfies Text,
  email: 'nico.bodmer@gmx.ch',
  linkedin: 'https://www.linkedin.com/in/nico-bodmer/',
  github: 'https://github.com/bodmer7',
  website: 'https://nico-bodmer.ch/',
  odera: 'https://odera.ch/',
  projektCheck: 'https://odera.ch/projekt-check/',
  rollenzeile: {
    de: 'Platform Developer EFZ. Technischer Vertrieb für Data & AI. Websites mit ODERA Design.',
    en: 'Platform Developer (Swiss federal VET diploma). Technical sales for data & AI. Websites with ODERA Design.',
  } satisfies Text,
  sprachen: [
    { de: 'Deutsch (Muttersprache)', en: 'German (native)' },
    { de: 'Englisch (fliessend)', en: 'English (fluent)' },
    { de: 'Französisch (gut)', en: 'French (good)' },
  ] satisfies Text[],
};

/** Stand der Inhalte. Beim Aktualisieren auch «gerade» prüfen. */
export const stand = {
  monat: '2026-10' as Monat,
  text: { de: 'Oktober 2026', en: 'October 2026' } satisfies Text,
};

export const gerade: Text[] = [
  { de: '1. Semester an der HWZ', en: 'First semester at HWZ' },
  { de: 'ODERA Design nimmt Projekte an', en: 'ODERA Design is taking on projects' },
  { de: 'Prognose-App in Arbeit', en: 'Forecasting app in progress' },
];

export const stationen: Station[] = [
  {
    id: 'tech-seller',
    rolle: 'Tech Seller Data & AI',
    organisation: { de: 'IBM Schweiz AG', en: 'IBM Schweiz AG' },
    von: '2025-07',
    bis: null,
    punkte: [
      {
        de: 'Mitarbeit an RFPs, Angeboten und Vertriebsaktivitäten im Bereich Data & AI',
        en: 'Contributing to RFPs, proposals and sales activities in data & AI',
      },
      {
        de: 'Lösungsentwicklung von der Anforderungsanalyse bis zum technischen Konzept',
        en: 'Solution design from requirements analysis to the technical concept',
      },
      { de: 'Zusammenarbeit mit cross-funktionalen Teams', en: 'Working with cross-functional teams' },
      {
        de: 'Mitwirkung an Events und Kundenanlässen (u. a. TechXchange)',
        en: 'Supporting events and customer sessions (including TechXchange)',
      },
    ],
  },
  {
    id: 'web-dev',
    rolle: 'Web Development & Deployment',
    organisation: { de: 'IBM Schweiz AG', en: 'IBM Schweiz AG' },
    von: '2024-01',
    bis: '2025-07',
    punkte: [
      {
        de: 'Deployment interner Anwendungen mit Red Hat OpenShift und IBM Cloud',
        en: 'Deploying internal applications on Red Hat OpenShift and IBM Cloud',
      },
      { de: 'Web-Entwicklung mit HTML, CSS, JavaScript und React', en: 'Web development with HTML, CSS, JavaScript and React' },
      {
        de: 'Optimierung bestehender interner Anwendungen für bessere Bedienbarkeit',
        en: 'Improving existing internal applications for better usability',
      },
    ],
  },
  {
    id: 'support-lenovo',
    rolle: 'Technical Support Lenovo',
    organisation: { de: 'IBM Schweiz AG', en: 'IBM Schweiz AG' },
    von: '2022-11',
    bis: '2023-12',
    punkte: [
      { de: 'Reparatur von Lenovo-Geräten vor Ort beim Kunden', en: 'Repairing Lenovo devices on site at customers' },
      { de: 'Robotik-Projekte mit dem Roboter Pepper', en: 'Robotics projects with the Pepper robot' },
      { de: 'IT- und Security-Schulungen an Oberstufenschulen', en: 'IT and security training at secondary schools' },
    ],
  },
  {
    id: 'help-desk',
    rolle: 'IT Help Desk',
    organisation: { de: 'IBM Forschungslabor Zürich', en: 'IBM Research Zurich' },
    von: '2021-08',
    bis: '2022-11',
    punkte: [
      { de: 'Level-1- und Level-2-Support für interne Mitarbeitende', en: 'Level 1 and level 2 support for internal staff' },
      {
        de: 'Geräte-Management: Setup, Migration und Datenlöschung von Mac- und Windows-Notebooks',
        en: 'Device management: setup, migration and data wiping of Mac and Windows laptops',
      },
      { de: 'Wöchentliche Kurzpräsentationen im Team', en: 'Weekly short presentations for the team' },
    ],
  },
];

export const ausbildung: Ausbildung[] = [
  {
    id: 'bsc-hwz',
    titel: { de: 'BSc Digital Business & AI', en: 'BSc Digital Business & AI' },
    schule: {
      de: 'HWZ Hochschule für Wirtschaft Zürich',
      en: 'HWZ University of Applied Sciences in Business Administration Zurich',
    },
    zusatz: { de: 'berufsbegleitend, 8 Semester', en: 'part-time, 8 semesters' },
    von: '2026-09',
    bis: null,
    geplantBis: '2030-08',
  },
  {
    id: 'efz',
    titel: { de: 'Platform Developer EFZ', en: 'Platform Developer (Swiss federal VET diploma)' },
    schule: { de: 'Technische Berufsschule Zürich', en: 'Technical Vocational School Zurich' },
    von: '2021-08',
    bis: '2025-07',
    zeitraum: { de: '2021 bis 2025', en: '2021 to 2025' },
  },
  {
    id: 'bm',
    titel: { de: 'Berufsmaturität technischer Richtung', en: 'Federal vocational baccalaureate, technical focus' },
    schule: { de: 'Berufsmaturitätsschule Zürich', en: 'Vocational Baccalaureate School Zurich' },
    von: '2021-08',
    bis: '2025-07',
    zeitraum: { de: '2021 bis 2025', en: '2021 to 2025' },
  },
];

/** Eigene Projekte im Laufbahn-Diagramm, nur auf Jahresebene. */
export const eigeneProjekte: EigenesProjekt[] = [
  { id: 'odera', titel: { de: 'ODERA Design', en: 'ODERA Design' }, jahr: 2026 },
  { id: 'geo-quiz', titel: { de: 'Geo-Quiz', en: 'Geo quiz' }, jahr: 2026 },
  { id: 'morgen-check-in', titel: { de: 'Morgen-Check-in', en: 'Morning check-in' }, jahr: 2026 },
  { id: 'website', titel: { de: 'Diese Website', en: 'This website' }, jahr: 2026 },
];

export const koennen: KoennenGruppe[] = [
  {
    id: 'web',
    titel: { de: 'Web-Entwicklung', en: 'Web development' },
    begriffe: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Vite', 'Astro', 'Leaflet'].map((b) => ({ de: b, en: b })),
    nachweise: [
      { art: 'station', id: 'web-dev' },
      { art: 'projekt', id: 'odera' },
      { art: 'projekt', id: 'musterprojekte' },
      { art: 'projekt', id: 'geo-quiz' },
      { art: 'website' },
    ],
  },
  {
    id: 'betrieb',
    titel: { de: 'Betrieb und Cloud', en: 'Operations and cloud' },
    begriffe: ['Red Hat OpenShift', 'IBM Cloud', 'Docker', 'GitHub Actions', 'GitHub Pages'].map((b) => ({ de: b, en: b })),
    nachweise: [
      { art: 'station', id: 'web-dev' },
      { art: 'projekt', id: 'geo-quiz' },
      { art: 'projekt', id: 'odera' },
    ],
  },
  {
    id: 'daten',
    titel: { de: 'Daten und Automatisierung', en: 'Data and automation' },
    begriffe: [
      { de: 'Python', en: 'Python' },
      { de: 'SQLite', en: 'SQLite' },
      { de: 'MCP', en: 'MCP' },
      { de: 'Playwright', en: 'Playwright' },
      { de: 'KI-Werkzeuge', en: 'AI tools' },
    ],
    nachweise: [
      { art: 'projekt', id: 'morgen-check-in' },
      { art: 'website' },
    ],
  },
  {
    id: 'vertrieb',
    titel: { de: 'Vertrieb und Beratung', en: 'Sales and consulting' },
    begriffe: [
      { de: 'Anforderungsanalyse', en: 'Requirements analysis' },
      { de: 'RFPs und Angebote', en: 'RFPs and proposals' },
      { de: 'Technische Konzepte', en: 'Technical concepts' },
      { de: 'Kundenanlässe', en: 'Customer events' },
    ],
    nachweise: [
      { art: 'station', id: 'tech-seller' },
      { art: 'projekt', id: 'odera' },
    ],
  },
  {
    id: 'support',
    titel: { de: 'Support und Schulung', en: 'Support and training' },
    begriffe: [
      { de: 'Level-1- und Level-2-Support', en: 'Level 1 and level 2 support' },
      { de: 'Geräte-Management für Mac und Windows', en: 'Device management for Mac and Windows' },
      { de: 'IT- und Security-Schulungen', en: 'IT and security training' },
    ],
    nachweise: [
      { art: 'station', id: 'help-desk' },
      { art: 'station', id: 'support-lenovo' },
    ],
  },
];

/** Präzisierung einzelner Nachweise (z. B. wofür diese Website steht). */
export const nachweisZusatz: Partial<Record<string, Text>> = {
  'daten:website': { de: 'Screenshots und Messungen per Playwright', en: 'screenshots and measurements with Playwright' },
  'vertrieb:odera': { de: 'Projekt-Check, Angebote', en: 'project check, proposals' },
};

export const weitereWerkzeuge: string[] = ['Tailwind', 'Supabase'];

/** «Ausserhalb der Arbeit»: Der Block erscheint nur, wenn hier etwas steht. */
export const hobbies: Text[] = [];

// Hilfsfunktionen ---------------------------------------------------------

const MONATE: Record<Lang, string[]> = {
  de: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};

/** '2025-07' wird zu '07/2025'. */
export function kurzMonat(m: Monat): string {
  const [j, mo] = m.split('-');
  return `${mo}/${j}`;
}

/** '2025-07' wird zu 'Juli 2025' bzw. 'July 2025'. */
export function langMonat(m: Monat, lang: Lang): string {
  const [j, mo] = m.split('-');
  return `${MONATE[lang][Number(mo) - 1]} ${j}`;
}

/** Zeitraum kurz, z. B. «seit 07/2025» oder «01/2024 bis 07/2025». */
export function zeitraumKurz(von: Monat, bis: Monat | null, lang: Lang): string {
  if (bis === null) return `${lang === 'de' ? 'seit' : 'since'} ${kurzMonat(von)}`;
  return `${kurzMonat(von)} ${lang === 'de' ? 'bis' : 'to'} ${kurzMonat(bis)}`;
}

/** Zeitraum ausgeschrieben, z. B. «seit Juli 2025». */
export function zeitraumLang(von: Monat, bis: Monat | null, lang: Lang): string {
  if (bis === null) return `${lang === 'de' ? 'seit' : 'since'} ${langMonat(von, lang)}`;
  return `${langMonat(von, lang)} ${lang === 'de' ? 'bis' : 'to'} ${langMonat(bis, lang)}`;
}

export function ausbildungZeitraum(a: Ausbildung, lang: Lang): string {
  return a.zeitraum ? a.zeitraum[lang] : zeitraumKurz(a.von, a.bis, lang);
}
