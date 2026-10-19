/* Projektliste: Zeiger oder Fokus auf einer Zeile wechselt die Vorschau.
   Die gewählte Zeile behält die Tönung ihrer Projektfarbe. */
const box = document.querySelector<HTMLElement>('[data-projekte]');
if (box) {
  const bilder = Array.from(box.querySelectorAll<HTMLElement>('[data-vorschau]'));
  const zeilen = Array.from(box.querySelectorAll<HTMLElement>('[data-projekt]'));
  const markieren = (id: string | undefined) => {
    zeilen.forEach((z) => z.classList.toggle('ist-aktiv', z.dataset.projekt === id));
  };
  const zeigen = (id: string | undefined) => {
    if (!id) return;
    const ziel = bilder.find((b) => b.dataset.vorschau === id);
    if (!ziel) return;
    markieren(id);
    if (ziel.classList.contains('ist-aktiv')) return;
    bilder.forEach((b) => b.classList.toggle('ist-aktiv', b === ziel));
  };
  markieren(bilder.find((b) => b.classList.contains('ist-aktiv'))?.dataset.vorschau);
  box.querySelectorAll<HTMLElement>('[data-vorschau-fuer]').forEach((link) => {
    const id = link.dataset.vorschauFuer;
    link.addEventListener('pointerenter', () => zeigen(id));
    link.addEventListener('focus', () => zeigen(id));
  });
}

export {};
