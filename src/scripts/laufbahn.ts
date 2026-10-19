/*
 * Laufbahn-Diagramm: Balken sind Buttons mit Roving Tabindex.
 * Zeiger, Fokus oder Tippen öffnet das Detailfeld darunter.
 * Unter 768px startet die Listenansicht.
 */
const box = document.querySelector<HTMLElement>('[data-laufbahn]');

if (box) {
  const diagramm = box.querySelector<HTMLElement>('.laufbahn__diagramm')!;
  const balken = Array.from(box.querySelectorAll<HTMLButtonElement>('[data-balken]'));
  const detail = box.querySelector<HTMLElement>('[data-detail]')!;
  const radioListe = box.querySelector<HTMLInputElement>('#laufbahn-liste')!;
  const radioDiagramm = box.querySelector<HTMLInputElement>('#laufbahn-diagramm')!;

  if (window.matchMedia('(max-width: 767.98px)').matches) radioListe.checked = true;

  let aktiv: HTMLButtonElement | null = null;

  const waehlen = (b: HTMLButtonElement) => {
    if (aktiv === b) return;
    aktiv = b;
    balken.forEach((x) => {
      x.setAttribute('aria-expanded', String(x === b));
      x.tabIndex = x === b ? 0 : -1;
    });
    const vorlage = box.querySelector<HTMLTemplateElement>(`template[data-detail-fuer="${b.dataset.balken}"]`);
    if (vorlage) detail.replaceChildren(vorlage.content.cloneNode(true));
  };

  balken.forEach((b, i) => {
    b.addEventListener('click', () => waehlen(b));
    b.addEventListener('focus', () => waehlen(b));
    b.addEventListener('pointerenter', (e) => {
      if (e.pointerType === 'mouse') waehlen(b);
    });
    b.addEventListener('keydown', (e) => {
      let ziel = -1;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') ziel = Math.min(balken.length - 1, i + 1);
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') ziel = Math.max(0, i - 1);
      else if (e.key === 'Home') ziel = 0;
      else if (e.key === 'End') ziel = balken.length - 1;
      if (ziel >= 0) {
        e.preventDefault();
        balken[ziel].focus();
      }
    });
  });

  // Balken wachsen einmal von links, wenn das Diagramm sichtbar wird.
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (eintraege) => {
        if (eintraege.some((e) => e.isIntersecting)) {
          diagramm.classList.add('ist-sichtbar');
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(diagramm);
    radioDiagramm.addEventListener('change', () => diagramm.classList.add('ist-sichtbar'));
  } else {
    diagramm.classList.add('ist-sichtbar');
  }

  // Links auf eine Station (#lb-…) öffnen den Balken bzw. den Listeneintrag.
  document.addEventListener('click', (e) => {
    const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href*="#lb-"]');
    if (!link) return;
    const id = link.hash.replace('#lb-', '');
    const b = balken.find((x) => x.dataset.balken === id);
    if (!b) return;
    e.preventDefault();
    if (radioListe.checked) {
      const eintrag = box.querySelector<HTMLElement>(`#lbl-${CSS.escape(id)}`);
      eintrag?.scrollIntoView({ block: 'center' });
      eintrag?.setAttribute('tabindex', '-1');
      eintrag?.focus({ preventScroll: true });
    } else {
      diagramm.classList.add('ist-sichtbar');
      b.scrollIntoView({ block: 'center', inline: 'center' });
      b.focus({ preventScroll: true });
      waehlen(b);
    }
  });
}

export {};
