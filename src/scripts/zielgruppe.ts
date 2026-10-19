/*
 * Zielgruppen-Schalter «Was führt Sie her?»: wählt Intro und Buttons,
 * ordnet die Projektliste und den Kontakt-Composer passend vor.
 * URL-Parameter ?fuer=stelle|website (en: ?for=job|website) und
 * sessionStorage für die Dauer des Besuchs.
 */
const hero = document.querySelector<HTMLElement>('[data-hero]');
const radios = Array.from(document.querySelectorAll<HTMLInputElement>('input[name="zielgruppe"]'));
const ansage = document.querySelector<HTMLElement>('[data-ansage]');

type Wahl = 'stelle' | 'website';

function projektlisteOrdnen(wahl: Wahl | null): void {
  const liste = document.querySelector<HTMLElement>('[data-projektliste]');
  if (!liste) return;
  const zeilen = Array.from(liste.querySelectorAll<HTMLElement>(':scope > [data-projekt]'));
  const vorne = wahl === 'website' ? ['odera', 'musterprojekte'] : [];
  zeilen
    .sort((a, b) => {
      const va = vorne.includes(a.dataset.projekt ?? '') ? 0 : 1;
      const vb = vorne.includes(b.dataset.projekt ?? '') ? 0 : 1;
      return va - vb || Number(a.dataset.reihenfolge) - Number(b.dataset.reihenfolge);
    })
    .forEach((z) => liste.append(z));
}

function composerVorwaehlen(wahl: Wahl | null): void {
  if (!wahl) return;
  const ziel = document.querySelector<HTMLInputElement>(`input[name="thema"][value="${wahl}"]`);
  if (ziel && !document.querySelector('input[name="thema"]:checked:not([data-vorgewaehlt])')) {
    ziel.checked = true;
    ziel.dataset.vorgewaehlt = '';
    ziel.dispatchEvent(new Event('change', { bubbles: true }));
  }
}

function anwenden(wahl: Wahl | null, ansagen: boolean): void {
  projektlisteOrdnen(wahl);
  composerVorwaehlen(wahl);
  if (ansagen && ansage && hero) {
    const sichtbar = hero.querySelector<HTMLElement>(`[data-variante="${wahl ?? 'neutral'}"] .hero__intro`);
    ansage.textContent = sichtbar?.textContent ?? '';
  }
}

if (hero && radios.length) {
  const param = hero.dataset.param ?? 'fuer';
  const ausUrl = new URLSearchParams(location.search).get(param);
  let wahl: Wahl | null = null;
  if (ausUrl === hero.dataset.wertStelle) wahl = 'stelle';
  else if (ausUrl === hero.dataset.wertWebsite) wahl = 'website';
  if (!wahl) {
    try {
      const gespeichert = sessionStorage.getItem('zielgruppe');
      if (gespeichert === 'stelle' || gespeichert === 'website') wahl = gespeichert;
    } catch {
      /* ohne Speicher keine Erinnerung */
    }
  }
  if (wahl) {
    const r = radios.find((x) => x.value === wahl);
    if (r) r.checked = true;
    anwenden(wahl, false);
  }

  radios.forEach((r) =>
    r.addEventListener('change', () => {
      if (!r.checked) return;
      const neu = r.value as Wahl;
      hero.setAttribute('data-gewechselt', '');
      try {
        sessionStorage.setItem('zielgruppe', neu);
      } catch {
        /* egal */
      }
      anwenden(neu, true);
    }),
  );
}

export {};
