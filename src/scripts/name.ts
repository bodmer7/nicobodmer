/*
 * Name im Hero: Buchstaben nahe am Zeiger werden leichter (bis 500),
 * entfernte bleiben bei 900. Nur bei feinem Zeiger und ohne reduzierte
 * Bewegung. Weich nachgezogen mit requestAnimationFrame.
 */
const fein = window.matchMedia('(hover: hover) and (pointer: fine)');
const ruhig = window.matchMedia('(prefers-reduced-motion: reduce)');
const name = document.querySelector<HTMLElement>('[data-name]');

if (name && fein.matches && !ruhig.matches) {
  const zellen = Array.from(name.querySelectorAll<HTMLElement>('.name__z')).filter((z) => z.textContent?.trim());
  const ist = zellen.map(() => 900);
  const soll = zellen.map(() => 900);
  let mitten: { x: number; y: number }[] = [];
  let radius = 200;
  let laeuft = false;

  const messen = () => {
    const fs = parseFloat(getComputedStyle(name).fontSize);
    radius = fs * 0.72 * 1.5; // ungefähr anderthalb Buchstabenhöhen
    mitten = zellen.map((z) => {
      const r = z.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });
  };

  const schritt = () => {
    let bewegt = false;
    zellen.forEach((z, i) => {
      const d = soll[i] - ist[i];
      if (Math.abs(d) > 0.5) {
        ist[i] += d * 0.18;
        bewegt = true;
      } else {
        ist[i] = soll[i];
      }
      z.style.fontWeight = String(Math.round(ist[i]));
    });
    if (bewegt) requestAnimationFrame(schritt);
    else laeuft = false;
  };

  const starten = () => {
    if (!laeuft) {
      laeuft = true;
      requestAnimationFrame(schritt);
    }
  };

  const hero = name.closest('[data-hero]') ?? document.body;
  hero.addEventListener('pointerenter', messen);
  hero.addEventListener('pointermove', (e) => {
    const ev = e as PointerEvent;
    if (ev.pointerType !== 'mouse' && ev.pointerType !== 'pen') return;
    if (mitten.length === 0) messen();
    mitten.forEach((m, i) => {
      const d = Math.hypot(ev.clientX - m.x, ev.clientY - m.y);
      const naehe = Math.max(0, 1 - d / radius);
      soll[i] = 900 - 400 * naehe * naehe * (3 - 2 * naehe);
    });
    starten();
  });
  hero.addEventListener('pointerleave', () => {
    soll.fill(900);
    starten();
  });
  window.addEventListener('scroll', () => (mitten = []), { passive: true });
  window.addEventListener('resize', () => (mitten = []));
}

export {};
