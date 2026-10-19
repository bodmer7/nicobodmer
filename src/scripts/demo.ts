/* Geo-Quiz: iframe erst nach Klick. Desktop 16:10, mobil 9:16 (per CSS). */
const demo = document.querySelector<HTMLElement>('[data-demo]');
if (demo) {
  const start = demo.querySelector<HTMLButtonElement>('[data-demo-start]');
  if (start) start.hidden = false;
  start?.addEventListener('click', () => {
    const iframe = document.createElement('iframe');
    iframe.src = demo.dataset.url ?? '';
    iframe.title = demo.dataset.titel ?? '';
    iframe.className = 'demo__iframe';
    iframe.allow = 'fullscreen';
    iframe.referrerPolicy = 'no-referrer';
    demo.querySelector('[data-demo-platzhalter]')?.replaceWith(iframe);
    iframe.focus();
  });
}

export {};
