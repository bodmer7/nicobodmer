import roh from './einbettung.json';

export interface EinbettungsPruefung {
  url: string;
  /** X-Frame-Options der Antwort, falls gesetzt */
  xFrameOptions: string | null;
  /** frame-ancestors aus der Content-Security-Policy, falls gesetzt */
  frameAncestors: string | null;
  /** Ergebnis des Klicktests auf der Live-Seite (null: nicht geprüft) */
  live: boolean | null;
  einbettbar: boolean;
}

export interface Einbettung {
  datum: string | null;
  seiten: Record<string, EinbettungsPruefung>;
}

/** Geschrieben von scripts/einbettung.mjs in .github/workflows/extern.yml. */
export const einbettung = roh as Einbettung;

/**
 * Darf «Live laden» erscheinen? Ohne Prüfung ja (in der Quelle von odera.ch
 * und dem Geo-Quiz steht kein Einbettungsverbot), sonst nach dem Ergebnis.
 */
export function istEinbettbar(id: string): boolean {
  return einbettung.seiten[id]?.einbettbar ?? true;
}
