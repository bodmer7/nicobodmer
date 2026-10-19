let timer: number | undefined;

/** Kurze Meldung unten mittig, verschwindet nach 2 Sekunden. */
export function toast(text: string): void {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = text;
  el.classList.add('ist-sichtbar');
  window.clearTimeout(timer);
  timer = window.setTimeout(() => {
    el.classList.remove('ist-sichtbar');
    window.setTimeout(() => {
      if (!el.classList.contains('ist-sichtbar')) el.textContent = '';
    }, 250);
  }, 2000);
}
