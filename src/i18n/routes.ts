import type { Lang } from './ui';
import type { ProjektId } from '../data/profil';

/** Seiten mit ihren Pfaden pro Sprache. Der Sprachumschalter liest hier. */
export const seiten = {
  start: { de: '/', en: '/en/' },
  lebenslauf: { de: '/lebenslauf/', en: '/en/cv/' },
  recht: { de: '/impressum-datenschutz/', en: '/en/legal/' },
  'projekt:odera': { de: '/arbeiten/odera/', en: '/en/work/odera/' },
  'projekt:musterprojekte': { de: '/arbeiten/musterprojekte/', en: '/en/work/sample-projects/' },
  'projekt:geo-quiz': { de: '/arbeiten/geo-quiz/', en: '/en/work/geo-quiz/' },
  'projekt:morgen-check-in': { de: '/arbeiten/morgen-check-in/', en: '/en/work/morning-check-in/' },
} as const satisfies Record<string, Record<Lang, string>>;

export type SeitenId = keyof typeof seiten;

export function pfad(id: SeitenId, lang: Lang): string {
  return seiten[id][lang];
}

export function projektPfad(id: ProjektId, lang: Lang): string {
  return seiten[`projekt:${id}`][lang];
}

/** Anker auf der Startseite, z. B. #arbeiten bzw. #work. */
export const anker = {
  arbeiten: { de: 'arbeiten', en: 'work' },
  laufbahn: { de: 'laufbahn', en: 'career' },
  koennen: { de: 'koennen', en: 'skills' },
  ueber: { de: 'ueber-mich', en: 'about' },
  kontakt: { de: 'kontakt', en: 'contact' },
} as const satisfies Record<string, Record<Lang, string>>;

export function ankerPfad(id: keyof typeof anker, lang: Lang): string {
  return `${seiten.start[lang]}#${anker[id][lang]}`;
}

export const andereSprache = (lang: Lang): Lang => (lang === 'de' ? 'en' : 'de');
