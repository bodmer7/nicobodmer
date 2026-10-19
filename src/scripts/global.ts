/* Seitenweite Funktionen: Hell/Dunkel, Kopfzeile, Menü, Kopieren. */
import { toast } from './toast';

const root = document.documentElement;
const dunkelSystem = window.matchMedia('(prefers-color-scheme: dark)');

function aktivesDesign(): 'dark' | 'light' {
  const gesetzt = root.getAttribute('data-theme');
  if (gesetzt === 'dark' || gesetzt === 'light') return gesetzt;
  return dunkelSystem.matches ? 'dark' : 'light';
}

function designAnzeigen(): void {
  const aktiv = aktivesDesign();
  root.setAttribute('data-theme-aktiv', aktiv);
  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((btn) => {
    btn.hidden = false;
    const label = aktiv === 'dark' ? btn.dataset.toLight : btn.dataset.toDark;
    const span = btn.querySelector('[data-theme-label]');
    if (span && label) span.textContent = label;
  });
}

document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const neu = aktivesDesign() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', neu);
    try {
      localStorage.setItem('theme', neu);
    } catch {
      /* Speicher gesperrt: Wahl gilt nur für diese Seite */
    }
    designAnzeigen();
  });
});
dunkelSystem.addEventListener('change', designAnzeigen);
designAnzeigen();

// Kopfzeile wird nach 80px kompakter --------------------------------------
const kopf = document.querySelector<HTMLElement>('[data-kopf]');
if (kopf) {
  let geplant = false;
  const pruefen = () => {
    geplant = false;
    kopf.classList.toggle('ist-kompakt', window.scrollY > 80);
  };
  window.addEventListener(
    'scroll',
    () => {
      if (!geplant) {
        geplant = true;
        requestAnimationFrame(pruefen);
      }
    },
    { passive: true },
  );
  pruefen();
}

// Mobiles Menü als Disclosure ----------------------------------------------
const menuBtn = document.querySelector<HTMLButtonElement>('[data-menu-btn]');
const panel = document.querySelector<HTMLElement>('[data-menu-panel]');
if (menuBtn && panel) {
  const text = menuBtn.querySelector<HTMLElement>('[data-menu-text]');
  const setzen = (offen: boolean, fokusZurueck = false) => {
    menuBtn.setAttribute('aria-expanded', String(offen));
    panel.classList.toggle('ist-offen', offen);
    root.classList.toggle('menu-offen', offen);
    if (text) text.textContent = (offen ? text.dataset.close : text.dataset.open) ?? '';
    if (offen) panel.querySelector<HTMLElement>('a, button')?.focus();
    else if (fokusZurueck) menuBtn.focus();
  };
  menuBtn.addEventListener('click', () => setzen(menuBtn.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') setzen(false, true);
  });
  panel.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a')) setzen(false);
  });
  window.matchMedia('(min-width: 900px)').addEventListener('change', (e) => {
    if (e.matches) setzen(false);
  });
}

// Adresse kopieren ----------------------------------------------------------
document.querySelectorAll<HTMLButtonElement>('[data-kopieren]').forEach((btn) => {
  btn.hidden = false;
  btn.addEventListener('click', async () => {
    const wert = btn.dataset.kopieren ?? '';
    let ok = false;
    try {
      await navigator.clipboard.writeText(wert);
      ok = true;
    } catch {
      // Rückfall ohne Zwischenablage: die Adresse auf der Seite markieren.
      const ziel = document.querySelector(`a[href="mailto:${wert}"]`);
      const auswahl = window.getSelection();
      if (ziel && auswahl) {
        const bereich = document.createRange();
        bereich.selectNodeContents(ziel);
        auswahl.removeAllRanges();
        auswahl.addRange(bereich);
      }
    }
    toast((ok ? btn.dataset.ok : btn.dataset.fehler) ?? '');
  });
});
