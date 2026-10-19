/*
 * Können: Begriff öffnet «Eingesetzt in:». Esc oder Klick ausserhalb
 * schliesst. Betroffene Balken und Projekte werden markiert.
 */
const box = document.querySelector<HTMLElement>('[data-koennen]');

if (box) {
  const buttons = Array.from(box.querySelectorAll<HTMLButtonElement>('[data-begriff]'));
  let offen: { btn: HTMLButtonElement; panel: HTMLElement } | null = null;

  const markierungenLoeschen = () =>
    document.querySelectorAll('.ist-markiert').forEach((el) => el.classList.remove('ist-markiert'));

  const markieren = (panel: HTMLElement) => {
    markierungenLoeschen();
    panel.querySelectorAll<HTMLElement>('[data-ziel]').forEach((li) => {
      const [art, id] = (li.dataset.ziel ?? '').split(':');
      if (art === 'station') {
        document.querySelector(`[data-balken="${id}"]`)?.classList.add('ist-markiert');
        document.querySelector(`[data-eintrag="${id}"]`)?.classList.add('ist-markiert');
      } else if (art === 'projekt') {
        document.querySelector(`[data-projekt="${id}"]`)?.classList.add('ist-markiert');
        document.querySelector(`[data-balken="projekt-${id}"]`)?.classList.add('ist-markiert');
        document.querySelector(`[data-eintrag="projekt-${id}"]`)?.classList.add('ist-markiert');
      } else if (art === 'website') {
        document.querySelector('[data-balken="projekt-website"]')?.classList.add('ist-markiert');
        document.querySelector('[data-eintrag="projekt-website"]')?.classList.add('ist-markiert');
      }
    });
  };

  const schliessen = (fokus = false) => {
    if (!offen) return;
    offen.btn.setAttribute('aria-expanded', 'false');
    offen.panel.classList.remove('ist-offen');
    if (fokus) offen.btn.focus();
    offen = null;
    markierungenLoeschen();
  };

  const oeffnen = (btn: HTMLButtonElement) => {
    const panel = document.getElementById(btn.getAttribute('aria-controls') ?? '');
    if (!panel) return;
    schliessen();
    const gruppe = btn.closest<HTMLElement>('.koennen__gruppe')!;
    const g = gruppe.getBoundingClientRect();
    const b = btn.getBoundingClientRect();
    const breite = Math.min(380, window.innerWidth * 0.9);
    const x = Math.max(0, Math.min(b.left - g.left, window.innerWidth - g.left - breite - 16));
    panel.style.setProperty('--x', `${x}px`);
    panel.style.setProperty('--y', `${b.bottom - g.top}px`);
    btn.setAttribute('aria-expanded', 'true');
    panel.classList.add('ist-offen');
    offen = { btn, panel };
    markieren(panel);
  };

  buttons.forEach((btn) =>
    btn.addEventListener('click', () => {
      if (offen?.btn === btn) schliessen();
      else oeffnen(btn);
    }),
  );

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && offen) {
      e.preventDefault();
      schliessen(true);
    }
  });

  document.addEventListener('pointerdown', (e) => {
    if (!offen) return;
    const ziel = e.target as Node;
    if (!offen.panel.contains(ziel) && !offen.btn.contains(ziel)) schliessen();
  });
}
