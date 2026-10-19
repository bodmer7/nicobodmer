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

export type NachweisRef = (
  | { art: 'station'; id: string }
  | { art: 'ausbildung'; id: string }
  | { art: 'projekt'; id: ProjektId }
  | { art: 'website' }
  /** Verweis auf die Laufbahn als Ganzes, markiert mehrere Balken */
  | { art: 'laufbahn'; ids: string[]; text: Text }
) & {
  /** Präzisierung, was genau den Nachweis liefert */
  zusatz?: Text;
};

/**
 * Ehrliche Einstufung, immer als Text (nie Balken, Prozent oder Punkte):
 * sicher = setze ich selbständig im Alltag ein, erfahrung = im Beruf oder in
 * Projekten eingesetzt, grundlagen = kenne ich und arbeite mich ein.
 */
export type Niveau = 'sicher' | 'erfahrung' | 'grundlagen';

export const niveaus: Niveau[] = ['sicher', 'erfahrung', 'grundlagen'];

export interface Begriff extends Text {
  /** Fehlt bei Arbeitsweise und Studium */
  niveau?: Niveau;
  /** Nur «Im Studium»: laufendes Semester statt Niveau */
  semester?: number;
  /** Eigene Nachweise; sonst gelten die der Gruppe */
  nachweise?: NachweisRef[];
}

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
  schule?: Text;
  zusatz?: Text;
  von: Monat;
  bis: Monat | null;
  /** Nur im Lebenslauf, nicht im Laufbahn-Diagramm */
  nurLebenslauf?: boolean;
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
  /** Zeile unter dem Gruppennamen */
  unterzeile?: Text;
  /** Satz unter der Tabelle */
  fusszeile?: Text;
  begriffe: Begriff[];
  /** Rückfall für Begriffe ohne eigene Nachweise */
  nachweise: NachweisRef[];
}

export interface Sprache {
  sprache: Text;
  niveau: Text;
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
    de: 'Informatiker EFZ (Plattformentwicklung). Technischer Vertrieb für Data & AI. Websites mit ODERA Design.',
    en: 'Computer Scientist, platform development (Swiss federal VET diploma). Technical sales for data & AI. Websites with ODERA Design.',
  } satisfies Text,
  sprachen: [
    { sprache: { de: 'Deutsch', en: 'German' }, niveau: { de: 'Muttersprache', en: 'native' } },
    { sprache: { de: 'Englisch', en: 'English' }, niveau: { de: 'fliessend', en: 'fluent' } },
    { sprache: { de: 'Französisch', en: 'French' }, niveau: { de: 'gut', en: 'good' } },
  ] satisfies Sprache[],
};

/** Stand der Inhalte. Beim Aktualisieren auch «gerade» prüfen. */
export const stand = {
  monat: '2026-10' as Monat,
  text: { de: 'Oktober 2026', en: 'October 2026' } satisfies Text,
};

/** Berufliches Ziel: Lebenslauf (Kurzprofil) und Hero-Option «Eine offene Stelle» */
export const ziel: Text = {
  de: 'Mein Ziel: mich in Richtung Business, IT und projektorientierte Rollen weiterzuentwickeln.',
  en: 'My goal is to grow further into business, IT and project-oriented roles.',
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
      {
        de: 'Zusammenarbeit mit cross-funktionalen Teams bei Kundenprojekten',
        en: 'Working with cross-functional teams on customer projects',
      },
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
      {
        de: 'Mitarbeit an der Web-Entwicklung mit HTML, CSS, JavaScript und React',
        en: 'Contributing to web development with HTML, CSS, JavaScript and React',
      },
      {
        de: 'Optimierung bestehender interner Anwendungen für bessere Bedienbarkeit',
        en: 'Improving existing internal applications for better usability',
      },
      {
        de: 'Enge Zusammenarbeit mit verschiedenen Teams bei der Umsetzung von Projekten',
        en: 'Close collaboration with various teams on implementing projects',
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
        de: 'Geräte-Management: Setup, Migration und Datenlöschung von Mac- und Windows-Notebooks für neue und austretende Mitarbeitende',
        en: 'Device management: setup, migration and data wiping of Mac and Windows laptops for new and departing staff',
      },
      {
        de: 'Wöchentliche Kurzpräsentationen von 5 bis 10 Minuten zu IT-Themen im Austausch mit meinem Berufsbildner',
        en: 'Weekly 5 to 10 minute presentations on IT topics, in exchange with my vocational trainer',
      },
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
    titel: {
      de: 'Informatiker EFZ, Fachrichtung Plattformentwicklung',
      en: 'Computer Scientist (Swiss federal VET diploma), platform development',
    },
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
  {
    id: 'bezirksschule',
    titel: { de: 'Bezirksschule Mutschellen', en: 'Bezirksschule Mutschellen (lower secondary school)' },
    von: '2018-08',
    bis: '2021-07',
    zeitraum: { de: '2018 bis 2021', en: '2018 to 2021' },
    nurLebenslauf: true,
  },
];

/** Eigene Projekte im Laufbahn-Diagramm, nur auf Jahresebene. */
export const eigeneProjekte: EigenesProjekt[] = [
  { id: 'odera', titel: { de: 'ODERA Design', en: 'ODERA Design' }, jahr: 2026 },
  { id: 'geo-quiz', titel: { de: 'Geo-Quiz', en: 'Geo quiz' }, jahr: 2026 },
  { id: 'morgen-check-in', titel: { de: 'Morgen-Check-in', en: 'Morning check-in' }, jahr: 2026 },
  { id: 'website', titel: { de: 'Diese Website', en: 'This website' }, jahr: 2026 },
];

const station = (id: string, zusatz?: Text): NachweisRef => ({ art: 'station', id, zusatz });
const projekt = (id: ProjektId, zusatz?: Text): NachweisRef => ({ art: 'projekt', id, zusatz });
const website = (zusatz?: Text): NachweisRef => ({ art: 'website', zusatz });

export const koennen: KoennenGruppe[] = [
  {
    id: 'web',
    titel: { de: 'Web und Umsetzung', en: 'Web and implementation' },
    begriffe: [
      {
        de: 'HTML und CSS',
        en: 'HTML and CSS',
        niveau: 'grundlagen',
        nachweise: [station('web-dev'), projekt('odera'), projekt('musterprojekte'), website()],
      },
      {
        de: 'KI-gestützte Entwicklung',
        en: 'AI-assisted development',
        niveau: 'erfahrung',
        nachweise: [projekt('odera'), projekt('musterprojekte'), projekt('geo-quiz'), website()],
      },
      { de: 'JavaScript', en: 'JavaScript', niveau: 'grundlagen', nachweise: [station('web-dev'), projekt('odera'), projekt('musterprojekte')] },
      { de: 'React', en: 'React', niveau: 'grundlagen', nachweise: [station('web-dev')] },
      { de: 'TypeScript', en: 'TypeScript', niveau: 'grundlagen', nachweise: [projekt('geo-quiz'), website()] },
    ],
    nachweise: [],
  },
  {
    id: 'betrieb',
    titel: { de: 'Betrieb und Cloud', en: 'Operations and cloud' },
    begriffe: [
      { de: 'Red Hat OpenShift', en: 'Red Hat OpenShift', niveau: 'erfahrung', nachweise: [station('web-dev')] },
      { de: 'IBM Cloud', en: 'IBM Cloud', niveau: 'erfahrung', nachweise: [station('web-dev')] },
      {
        de: 'GitHub, GitHub Actions und Pages',
        en: 'GitHub, GitHub Actions and Pages',
        niveau: 'erfahrung',
        nachweise: [projekt('geo-quiz'), projekt('odera'), website()],
      },
      { de: 'Docker', en: 'Docker', niveau: 'grundlagen', nachweise: [station('web-dev')] },
    ],
    nachweise: [],
  },
  {
    id: 'daten',
    titel: { de: 'Daten und KI', en: 'Data and AI' },
    begriffe: [
      {
        de: 'KI-Werkzeuge im Arbeitsalltag',
        en: 'AI tools in everyday work',
        niveau: 'erfahrung',
        nachweise: [projekt('morgen-check-in'), website()],
      },
      {
        de: 'Data & AI-Lösungen erklären und einordnen',
        en: 'Explaining and positioning data & AI solutions',
        niveau: 'erfahrung',
        nachweise: [station('tech-seller')],
      },
      { de: 'MCP-Server einrichten', en: 'Setting up MCP servers', niveau: 'grundlagen', nachweise: [projekt('morgen-check-in')] },
      { de: 'Python', en: 'Python', niveau: 'grundlagen', nachweise: [projekt('morgen-check-in')] },
      { de: 'SQL und SQLite', en: 'SQL and SQLite', niveau: 'grundlagen', nachweise: [projekt('morgen-check-in')] },
    ],
    nachweise: [],
  },
  {
    id: 'vertrieb',
    titel: { de: 'Vertrieb und Beratung', en: 'Sales and consulting' },
    begriffe: [
      {
        de: 'Präsentieren',
        en: 'Presenting',
        niveau: 'sicher',
        nachweise: [
          station('help-desk', { de: 'wöchentliche Kurzpräsentationen', en: 'weekly short presentations' }),
          station('tech-seller', { de: 'Kundenanlässe', en: 'customer events' }),
        ],
      },
      {
        de: 'Anforderungsanalyse',
        en: 'Requirements analysis',
        niveau: 'erfahrung',
        nachweise: [station('tech-seller'), projekt('odera', { de: 'Projekt-Check', en: 'project check' })],
      },
      {
        de: 'RFPs und Angebote',
        en: 'RFPs and proposals',
        niveau: 'erfahrung',
        nachweise: [station('tech-seller'), projekt('odera', { de: 'Angebote', en: 'proposals' })],
      },
      { de: 'Technische Konzepte', en: 'Technical concepts', niveau: 'erfahrung', nachweise: [station('tech-seller')] },
      {
        de: 'Kundenanlässe',
        en: 'Customer events',
        niveau: 'erfahrung',
        nachweise: [station('tech-seller', { de: 'u. a. TechXchange', en: 'including TechXchange' })],
      },
    ],
    nachweise: [],
  },
  {
    id: 'support',
    titel: { de: 'Support und Schulung', en: 'Support and training' },
    begriffe: [
      { de: 'Level-1- und Level-2-Support', en: 'Level 1 and level 2 support', niveau: 'sicher', nachweise: [station('help-desk')] },
      {
        de: 'Geräte-Management für Mac und Windows',
        en: 'Device management for Mac and Windows',
        niveau: 'sicher',
        nachweise: [station('help-desk')],
      },
      { de: 'Ticketing-Systeme', en: 'Ticketing systems', niveau: 'sicher', nachweise: [station('help-desk')] },
      {
        de: 'IT- und Security-Schulungen',
        en: 'IT and security training',
        niveau: 'erfahrung',
        nachweise: [station('support-lenovo', { de: 'an Oberstufenschulen', en: 'at secondary schools' })],
      },
      {
        de: 'Prozessoptimierung',
        en: 'Process optimisation',
        niveau: 'erfahrung',
        nachweise: [station('web-dev', { de: 'Optimierung interner Anwendungen', en: 'optimising internal applications' })],
      },
    ],
    nachweise: [],
  },
  {
    id: 'arbeitsweise',
    titel: { de: 'Arbeitsweise', en: 'Way of working' },
    begriffe: [
      {
        de: 'Kommunikation',
        en: 'Communication',
        nachweise: [
          station('help-desk', { de: 'wöchentliche Kurzpräsentationen', en: 'weekly short presentations' }),
          station('support-lenovo', { de: 'IT- und Security-Schulungen an Oberstufenschulen', en: 'IT and security training at secondary schools' }),
          station('tech-seller', { de: 'Kundenanlässe', en: 'customer events' }),
        ],
      },
      {
        de: 'Teamarbeit',
        en: 'Teamwork',
        nachweise: [
          station('tech-seller', { de: 'cross-funktionale Teams', en: 'cross-functional teams' }),
          station('web-dev', { de: 'Zusammenarbeit mit verschiedenen Teams', en: 'collaboration with various teams' }),
        ],
      },
      {
        de: 'Zeitmanagement',
        en: 'Time management',
        nachweise: [
          {
            art: 'laufbahn',
            ids: ['efz', 'bm', 'tech-seller', 'bsc-hwz', 'projekt-odera'],
            text: {
              de: 'Laufbahn: Lehre und Berufsmaturität parallel 2021 bis 2025. Heute Arbeit, berufsbegleitendes Studium und ODERA Design parallel',
              en: 'Career: apprenticeship and vocational baccalaureate in parallel from 2021 to 2025. Today work, part-time studies and ODERA Design in parallel',
            },
          },
        ],
      },
      {
        de: 'Lernbereitschaft',
        en: 'Willingness to learn',
        nachweise: [
          { art: 'ausbildung', id: 'bm' },
          { art: 'ausbildung', id: 'bsc-hwz', zusatz: { de: 'berufsbegleitend', en: 'part-time' } },
        ],
      },
      {
        de: 'Kreativität',
        en: 'Creativity',
        nachweise: [projekt('musterprojekte', { de: 'zwei eigenständige Auftritte', en: 'two distinct identities' })],
      },
    ],
    nachweise: [],
  },
];

/** Werkzeuge ohne Niveau: «In meinen Projekten eingesetzt», keine eigene Fähigkeit */
export const inProjekten: string[] = ['Astro', 'Vite', 'Leaflet', 'Playwright', 'Tailwind', 'Supabase'];

/** «Ausserhalb der Arbeit»: Der Block erscheint nur, wenn hier etwas steht. */
export const hobbies: Text[] = [
  { de: 'Krafttraining', en: 'Strength training' },
  { de: 'Eishockey (als Fan)', en: 'Ice hockey (as a fan)' },
  { de: 'Snowboarden', en: 'Snowboarding' },
];

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

/** Schule und Zusatz als eine Zeile, z. B. «HWZ ..., berufsbegleitend, 8 Semester». */
export function ausbildungOrt(a: Ausbildung, lang: Lang): string {
  return [a.schule?.[lang], a.zusatz?.[lang]].filter(Boolean).join(', ');
}

/** Ausbildungen für das Laufbahn-Diagramm (ohne «nur Lebenslauf»). */
/** Nachweise eines Begriffs: eigene, sonst die der Gruppe */
export const nachweiseVon = (g: KoennenGruppe, b: Begriff): NachweisRef[] => b.nachweise ?? g.nachweise;

/** Alle Nachweise einer Gruppe, auch die der einzelnen Begriffe */
export const alleNachweise = (g: KoennenGruppe): NachweisRef[] => [...g.nachweise, ...g.begriffe.flatMap((b) => b.nachweise ?? [])];

/** «Deutsch (Muttersprache), Englisch (fliessend), ...» */
export const sprachenText = (lang: Lang): string =>
  person.sprachen.map((s) => `${s.sprache[lang]} (${s.niveau[lang]})`).join(', ');

export const ausbildungLaufbahn = ausbildung.filter((a) => !a.nurLebenslauf);

export function ausbildungZeitraum(a: Ausbildung, lang: Lang): string {
  return a.zeitraum ? a.zeitraum[lang] : zeitraumKurz(a.von, a.bis, lang);
}
