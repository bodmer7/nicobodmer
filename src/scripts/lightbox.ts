/*
 * Lightbox mit <dialog>: Pfeiltasten, Wischen, Esc schliesst,
 * Fokus kehrt zum auslösenden Bild zurück. Nachbarbilder werden vorgeladen.
 */
const dialog = document.querySelector<HTMLDialogElement>('[data-lightbox-dialog]');

// Bilder im Fliesstext (Markdown) werden zu Knöpfen, die die Lightbox öffnen.
document.querySelectorAll<HTMLImageElement>('[data-prosa] img').forEach((img) => {
  const knopf = document.createElement('button');
  knopf.type = 'button';
  knopf.className = 'bild-knopf';
  knopf.dataset.lightbox = '';
  knopf.dataset.alt = img.alt;
  knopf.dataset.unterschrift = img.alt;
  img.replaceWith(knopf);
  knopf.append(img);
});

const links = Array.from(document.querySelectorAll<HTMLElement>('[data-lightbox]'));
const grossVon = (l: HTMLElement) =>
  l.dataset.gross ?? l.querySelector('img')?.currentSrc ?? l.querySelector('img')?.src ?? '';

if (dialog && links.length) {
  const bild = dialog.querySelector<HTMLImageElement>('[data-lightbox-bild]')!;
  const unterschrift = dialog.querySelector<HTMLElement>('[data-lightbox-unterschrift]')!;
  const zaehler = dialog.querySelector<HTMLElement>('[data-lightbox-zaehler]')!;
  let index = 0;
  let ausloeser: HTMLElement | null = null;

  const vorladen = (i: number) => {
    const l = links[(i + links.length) % links.length];
    const src = grossVon(l);
    if (src) new Image().src = src;
  };

  const zeigen = (i: number) => {
    index = (i + links.length) % links.length;
    const l = links[index];
    bild.src = grossVon(l);
    bild.alt = l.dataset.alt ?? '';
    const img = l.querySelector('img');
    bild.width = Number(l.dataset.breite ?? img?.naturalWidth ?? 0) || 1600;
    bild.height = Number(l.dataset.hoehe ?? img?.naturalHeight ?? 0) || 1000;
    unterschrift.textContent = l.dataset.unterschrift ?? '';
    zaehler.textContent = (dialog.dataset.zaehler ?? '{n} / {total}')
      .replace('{n}', String(index + 1))
      .replace('{total}', String(links.length));
    vorladen(index + 1);
    vorladen(index - 1);
  };

  links.forEach((l, i) =>
    l.addEventListener('click', (e) => {
      e.preventDefault();
      ausloeser = l;
      zeigen(i);
      dialog.showModal();
      dialog.querySelector<HTMLButtonElement>('[data-lightbox-schliessen]')?.focus();
    }),
  );

  dialog.querySelector('[data-lightbox-schliessen]')?.addEventListener('click', () => dialog.close());
  dialog.querySelector('[data-lightbox-zurueck]')?.addEventListener('click', () => zeigen(index - 1));
  dialog.querySelector('[data-lightbox-weiter]')?.addEventListener('click', () => zeigen(index + 1));

  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      zeigen(index - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      zeigen(index + 1);
    }
  });

  // Klick auf den Hintergrund schliesst
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });

  // Wischen auf Touch-Geräten
  let startX: number | null = null;
  dialog.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') startX = e.clientX;
  });
  dialog.addEventListener('pointerup', (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 50) zeigen(index + (dx < 0 ? 1 : -1));
  });

  dialog.addEventListener('close', () => {
    bild.removeAttribute('src');
    ausloeser?.focus();
  });
}
