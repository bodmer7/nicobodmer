import roh from './messwerte.json';
import { zahl, datum as datumText, type Lang } from '../i18n/ui';

export interface Messung {
  url?: string;
  leistung: number;
  barrierefreiheit: number;
  bestPractices: number;
  seo: number;
  /** Übertragene Bytes beim ersten Aufruf in KB */
  kb: number;
  lcpMs?: number;
  cls?: number;
  tbtMs?: number;
}

export interface Messreihe {
  /** ISO-Datum der Messung oder null, wenn noch nicht gemessen */
  datum: string | null;
  methode: string;
  seiten: Record<string, Messung>;
}

export interface Messwerte {
  /** Lokal mit astro preview (npm run measure) */
  lokal: Messreihe;
  /** Live auf nico-bodmer.ch (extern.yml) */
  website: Messreihe;
  /** Live auf odera.ch, Musterprojekten und Geo-Quiz (extern.yml) */
  projekte: Messreihe;
}

/** Geschrieben von scripts/measure.mjs. Ohne Messung erscheint nichts. */
export const messwerte = roh as Messwerte;

export interface FooterMessung {
  messung: Messung;
  datum: string;
  live: boolean;
}

/**
 * Messung für die Footer-Zeile: zuerst die Live-Messung auf nico-bodmer.ch,
 * sonst die lokale Messung (dann mit dem Zusatz «lokal gemessen»).
 */
export function footerMessung(key: string | undefined): FooterMessung | null {
  if (!key) return null;
  const live = messwerte.website.datum ? messwerte.website.seiten[key] : undefined;
  if (live && messwerte.website.datum) return { messung: live, datum: messwerte.website.datum, live: true };
  const lokal = messwerte.lokal.datum ? messwerte.lokal.seiten[key] : undefined;
  if (lokal && messwerte.lokal.datum) return { messung: lokal, datum: messwerte.lokal.datum, live: false };
  return null;
}

export interface Wert {
  wert: string;
  einheit?: string;
  label: string;
  quelle: string;
  datum: string;
}

/**
 * Eigene Live-Messung eines Projekts (odera, doppelmeter, firstlicht,
 * geo-quiz) als Messwerte für die Anzeige. Leer, wenn nicht gemessen.
 */
export function eigeneWerte(key: string, lang: Lang): Wert[] {
  const reihe = messwerte.projekte;
  const m = reihe.datum ? reihe.seiten[key] : undefined;
  if (!m || !reihe.datum) return [];
  const de = lang === 'de';
  const url = (m.url ?? '').replace(/^https:\/\//, '').replace(/\/$/, '');
  const quelle = de
    ? `Eigene Messung: Lighthouse mobil, Median aus drei Läufen, ${url}`
    : `Own measurement: Lighthouse mobile, median of three runs, ${url}`;
  const werte: Wert[] = [
    {
      wert: `${m.leistung} / ${m.barrierefreiheit} / ${m.bestPractices} / ${m.seo}`,
      label: de ? 'Lighthouse mobil: Leistung, Barrierefreiheit, Best Practices, SEO' : 'Lighthouse mobile: performance, accessibility, best practices, SEO',
      quelle,
      datum: reihe.datum,
    },
  ];
  if (m.lcpMs !== undefined) {
    werte.push({
      wert: zahl(m.lcpMs / 1000, lang, 1),
      einheit: 's',
      label: de ? 'Ladezeit, bis der grösste Inhalt sichtbar ist (mobil)' : 'Load time until the largest content is visible (mobile)',
      quelle,
      datum: reihe.datum,
    });
  }
  werte.push({
    wert: zahl(m.kb, lang),
    einheit: 'KB',
    label: de ? 'Gewicht beim ersten Aufruf' : 'Weight on first load',
    quelle,
    datum: reihe.datum,
  });
  return werte;
}

export { datumText };
