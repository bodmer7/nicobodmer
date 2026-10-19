/*
 * Kontakt-Composer: baut einen mailto:-Link mit Betreff und Text.
 * Nichts wird gespeichert oder übertragen.
 */
const form = document.querySelector<HTMLFormElement>('[data-composer]');

/** mailto nach RFC 6068: Zeilenumbrüche als CRLF, alles URL-kodiert. */
export function mailtoBauen(email: string, betreff: string, text: string): string {
  const kodieren = (s: string) => encodeURIComponent(s.replace(/\r?\n/g, '\r\n'));
  return `mailto:${email}?subject=${kodieren(betreff)}&body=${kodieren(text)}`;
}

if (form) {
  const nachricht = form.querySelector<HTMLTextAreaElement>('#composer-nachricht')!;
  const name = form.querySelector<HTMLInputElement>('#composer-name')!;

  const pruefen = () => {
    const thema = form.querySelector<HTMLInputElement>('input[name="thema"]:checked');
    nachricht.required = thema?.value !== 'website';
  };
  form.addEventListener('change', pruefen);
  pruefen();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const thema = form.querySelector<HTMLInputElement>('input[name="thema"]:checked');
    const betreff = thema
      ? (form.dataset.betreff ?? '').replace('{thema}', thema.dataset.text ?? '')
      : (form.dataset.betreffOhne ?? '');
    let text = nachricht.value.trim();
    const n = name.value.trim();
    if (n) text += `\n\n${form.dataset.gruss ?? ''}\n${n}`;
    const href = mailtoBauen(form.dataset.email ?? '', betreff, text);
    form.dataset.mailto = href;
    window.location.href = href;
  });
}
