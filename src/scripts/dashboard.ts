/*
 * Mini-Dashboard: Ring füllt sich einmal, wenn sichtbar. Zeiger oder
 * Pfeiltasten wählen einen Punkt im Verlauf, der Tooltip zeigt Tag und Wert.
 */
const dash = document.querySelector<HTMLElement>('[data-dashboard]');

if (dash) {
  const ring = dash.querySelector<SVGCircleElement>('[data-ring]');
  if (ring && 'IntersectionObserver' in window) {
    dash.classList.add('ist-bereit');
    const io = new IntersectionObserver(
      (e) => {
        if (e.some((x) => x.isIntersecting)) {
          dash.classList.add('ist-sichtbar');
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(ring);
  }

  dash.querySelectorAll<HTMLElement>('[data-verlauf]').forEach((verlauf) => {
    const punkte = Array.from(verlauf.querySelectorAll<SVGCircleElement>('[data-punkt]'));
    const tooltip = verlauf.querySelector<HTMLElement>('[data-tooltip]')!;
    let aktiv = punkte.length - 1;

    const zeigen = (i: number) => {
      aktiv = Math.max(0, Math.min(punkte.length - 1, i));
      punkte.forEach((p, j) => p.classList.toggle('ist-aktiv', j === aktiv));
      const p = punkte[aktiv];
      tooltip.textContent = `${p.dataset.tag}: ${p.dataset.wert}`;
      const svg = verlauf.querySelector('svg')!;
      const box = svg.getBoundingClientRect();
      const vb = svg.viewBox.baseVal;
      const x = (Number(p.getAttribute('cx')) / vb.width) * box.width;
      tooltip.style.setProperty('--x', `${x}px`);
      tooltip.classList.add('ist-sichtbar');
    };
    const verbergen = () => {
      punkte.forEach((p) => p.classList.remove('ist-aktiv'));
      tooltip.classList.remove('ist-sichtbar');
    };

    verlauf.addEventListener('pointermove', (e) => {
      const box = verlauf.getBoundingClientRect();
      const anteil = (e.clientX - box.left) / box.width;
      zeigen(Math.round(anteil * (punkte.length - 1)));
    });
    verlauf.addEventListener('pointerleave', () => {
      if (document.activeElement !== verlauf) verbergen();
    });
    verlauf.addEventListener('focus', () => zeigen(aktiv));
    verlauf.addEventListener('blur', verbergen);
    verlauf.addEventListener('keydown', (e) => {
      let ziel: number | null = null;
      if (e.key === 'ArrowRight') ziel = aktiv + 1;
      else if (e.key === 'ArrowLeft') ziel = aktiv - 1;
      else if (e.key === 'Home') ziel = 0;
      else if (e.key === 'End') ziel = punkte.length - 1;
      if (ziel !== null) {
        e.preventDefault();
        zeigen(ziel);
      }
    });
  });
}

export {};
