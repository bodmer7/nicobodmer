import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';

export type Projekt = CollectionEntry<'projekte'>;

/** Projekte einer Sprache, ohne Entwürfe, nach Reihenfolge sortiert. */
export async function projekte(lang: Lang): Promise<Projekt[]> {
  const alle = await getCollection('projekte', (p) => p.id.startsWith(`${lang}/`) && p.data.status !== 'entwurf');
  return alle.sort((a, b) => a.data.reihenfolge - b.data.reihenfolge);
}

/** Projekte mit eigener Fallstudie (live). */
export async function fallstudien(lang: Lang): Promise<Projekt[]> {
  return (await projekte(lang)).filter((p) => p.data.status === 'live');
}

export function istExtern(url: string): boolean {
  return /^https?:\/\//.test(url) && !url.startsWith('https://nico-bodmer.ch');
}
