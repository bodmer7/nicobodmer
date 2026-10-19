/* Projektliste: Zeiger oder Fokus auf einer Zeile wechselt die Vorschau. */
const box = document.querySelector<HTMLElement>('[data-projekte]');
if (box) {
  const bilder = Array.from(box.querySelectorAll<HTMLElement>('[data-vorschau]'));
  const zeigen = (id: string | undefined) => {
    if (!id) return;
    const ziel = bilder.find((b) => b.dataset.vorschau === id);
    if (!ziel || ziel.classList.contains('ist-aktiv')) return;
    bilder.forEach((b) => b.classList.toggle('ist-aktiv', b === ziel));
  };
  box.querySelectorAll<HTMLElement>('[data-vorschau-fuer]').forEach((link) => {
    const id = link.dataset.vorschauFuer;
    link.addEventListener('pointerenter', () => zeigen(id));
    link.addEventListener('focus', () => zeigen(id));
  });
}

export {};
