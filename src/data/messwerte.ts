import roh from './messwerte.json';

export interface SeitenMessung {
  leistung: number;
  barrierefreiheit: number;
  bestPractices: number;
  seo: number;
  /** Übertragene Bytes beim ersten Aufruf in KB */
  kb: number;
}

export interface Messwerte {
  /** ISO-Datum der Messung oder null, wenn noch nicht gemessen */
  datum: string | null;
  seiten: Record<string, SeitenMessung>;
}

/** Geschrieben von scripts/measure.mjs. Ohne Messung bleibt die Footer-Zeile weg. */
export const messwerte = roh as Messwerte;
