/*
 * Viewport-Labor: Tabs (Pfeiltasten), Geräte, Live-Vorschau mit Ziehgriff.
 * Das iframe entsteht erst nach dem Klick auf «Live laden».
 */
const labor = document.querySelector<HTMLElement>('[data-labor]');

const PRESETS: Record<string, number> = { desktop: 1280, tablet: 768, handy: 390 };
const RASTER = [390, 768, 1280];
const MIN = 320;

if (labor) {
  const tabs = Array.from(labor.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
  const panels = Array.from(labor.querySelectorAll<HTMLElement>('[data-panel]'));
  const liveBtn = labor.querySelector<HTMLButtonElement>('[data-live-laden]')!;
  const ausBtn = labor.querySelector<HTMLButtonElement>('[data-live-aus]')!;
  const liveLink = labor.querySelector<HTMLAnchorElement>('[data-live-link]')!;
  const gross = window.matchMedia('(min-width: 768px)');

  const aktivesPanel = () => panels.find((p) => !p.hidden) ?? panels[0];
  const geraet = () => labor.querySelector<HTMLInputElement>('input[name="labor-geraet"]:checked')?.value ?? 'desktop';

  const liveSichtbarkeit = () => {
    const istLive = aktivesPanel().classList.contains('ist-live');
    liveBtn.hidden = !gross.matches || istLive;
    ausBtn.hidden = !istLive;
  };

  const maxBreite = (panel: HTMLElement) => {
    const buehne = panel.querySelector<HTMLElement>('[data-buehne]')!;
    const stil = getComputedStyle(buehne);
    const innen = buehne.clientWidth - parseFloat(stil.paddingLeft) - parseFloat(stil.paddingRight);
    return Math.max(MIN, Math.floor(innen - 28));
  };

  const breiteSetzen = (panel: HTMLElement, wunsch: number, einrasten = false) => {
    const max = maxBreite(panel);
    let w = Math.round(Math.min(max, Math.max(MIN, wunsch)));
    if (einrasten) {
      const nah = RASTER.find((r) => Math.abs(r - w) <= 12 && r <= max);
      if (nah) w = nah;
    }
    panel.style.setProperty('--live-breite', `${w}px`);
    const griff = panel.querySelector<HTMLElement>('[data-griff]')!;
    griff.setAttribute('aria-valuemax', String(max));
    griff.setAttribute('aria-valuenow', String(w));
    griff.setAttribute('aria-valuetext', `${w} px`);
    const anzeige = panel.querySelector<HTMLElement>('[data-breite]')!;
    anzeige.textContent = `${anzeige.dataset.label ?? ''} ${w} px`.trim();
    return w;
  };

  const liveAus = (panel: HTMLElement) => {
    panel.classList.remove('ist-live');
    panel.querySelector('iframe')?.remove();
    panel.querySelector<HTMLElement>('[data-griff]')!.hidden = true;
    panel.querySelector<HTMLElement>('[data-breite]')!.hidden = true;
  };

  const liveAn = (panel: HTMLElement) => {
    const rahmen = panel.querySelector<HTMLElement>('[data-rahmen]')!;
    const iframe = document.createElement('iframe');
    iframe.src = panel.dataset.url ?? '';
    iframe.title = (labor.dataset.iframeTitel ?? '{name}').replace('{name}', panel.dataset.name ?? '');
    iframe.loading = 'eager';
    iframe.referrerPolicy = 'no-referrer';
    rahmen.append(iframe);
    panel.classList.add('ist-live');
    panel.querySelector<HTMLElement>('[data-griff]')!.hidden = false;
    panel.querySelector<HTMLElement>('[data-breite]')!.hidden = false;
    breiteSetzen(panel, PRESETS[geraet()]);
  };

  // Tabs ------------------------------------------------------------------
  const tabWaehlen = (tab: HTMLButtonElement, fokus: boolean) => {
    const vorher = aktivesPanel();
    if (vorher.classList.contains('ist-live')) liveAus(vorher);
    tabs.forEach((t) => {
      const an = t === tab;
      t.setAttribute('aria-selected', String(an));
      t.tabIndex = an ? 0 : -1;
    });
    panels.forEach((p) => (p.hidden = p.dataset.panel !== tab.dataset.tab));
    liveLink.href = aktivesPanel().dataset.url ?? liveLink.href;
    if (fokus) tab.focus();
    liveSichtbarkeit();
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => tabWaehlen(tab, false));
    tab.addEventListener('keydown', (e) => {
      let ziel = -1;
      if (e.key === 'ArrowRight') ziel = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') ziel = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') ziel = 0;
      else if (e.key === 'End') ziel = tabs.length - 1;
      if (ziel >= 0) {
        e.preventDefault();
        tabWaehlen(tabs[ziel], true);
      }
    });
  });

  // Geräte ------------------------------------------------------------------
  labor.querySelectorAll<HTMLInputElement>('input[name="labor-geraet"]').forEach((r) =>
    r.addEventListener('change', () => {
      const p = aktivesPanel();
      if (p.classList.contains('ist-live')) breiteSetzen(p, PRESETS[r.value]);
    }),
  );

  // Live --------------------------------------------------------------------
  liveBtn.addEventListener('click', () => {
    liveAn(aktivesPanel());
    liveSichtbarkeit();
    ausBtn.focus();
  });
  ausBtn.addEventListener('click', () => {
    liveAus(aktivesPanel());
    liveSichtbarkeit();
    liveBtn.focus();
  });
  gross.addEventListener('change', () => {
    if (!gross.matches) panels.forEach(liveAus);
    liveSichtbarkeit();
  });

  // Ziehgriff mit Zeiger und Tastatur ---------------------------------------
  panels.forEach((panel) => {
    const griff = panel.querySelector<HTMLElement>('[data-griff]')!;
    const anzeige = panel.querySelector<HTMLElement>('[data-breite]')!;
    anzeige.dataset.label = labor.dataset.breiteLabel ?? '';
    let startX = 0;
    let startW = 0;
    const aktuell = () => Number(griff.getAttribute('aria-valuenow'));

    griff.addEventListener('pointerdown', (e) => {
      startX = e.clientX;
      startW = aktuell();
      griff.setPointerCapture(e.pointerId);
      panel.classList.add('ist-ziehen');
    });
    griff.addEventListener('pointermove', (e) => {
      if (!griff.hasPointerCapture(e.pointerId)) return;
      breiteSetzen(panel, startW + (e.clientX - startX), true);
    });
    const ende = (e: PointerEvent) => {
      if (griff.hasPointerCapture(e.pointerId)) griff.releasePointerCapture(e.pointerId);
      panel.classList.remove('ist-ziehen');
    };
    griff.addEventListener('pointerup', ende);
    griff.addEventListener('pointercancel', ende);
    griff.addEventListener('keydown', (e) => {
      const schritt = e.shiftKey ? 50 : 10;
      let neu: number | null = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') neu = aktuell() + schritt;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') neu = aktuell() - schritt;
      else if (e.key === 'Home') neu = MIN;
      else if (e.key === 'End') neu = maxBreite(panel);
      if (neu !== null) {
        e.preventDefault();
        breiteSetzen(panel, neu);
      }
    });
  });

  window.addEventListener('resize', () => {
    const p = aktivesPanel();
    if (p.classList.contains('ist-live')) breiteSetzen(p, Number(p.querySelector('[data-griff]')?.getAttribute('aria-valuenow')));
  });

  liveSichtbarkeit();
}

export {};
