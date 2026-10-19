/*
 * Fallstudie: Ankerlinks an Überschriften, aktueller Abschnitt im
 * Inhaltsverzeichnis, mobil klappt das Inhaltsverzeichnis zu.
 */
const prosa = document.querySelector<HTMLElement>('[data-prosa]');
const toc = document.querySelector<HTMLElement>('[data-toc]');
const label = document.documentElement.lang.startsWith('de') ? 'Link zu diesem Abschnitt' : 'Link to this section';

document.querySelectorAll<HTMLElement>('.fall__inhalt h2[id]').forEach((h) => {
  const a = document.createElement('a');
  a.href = `#${h.id}`;
  a.className = 'anker';
  a.setAttribute('aria-label', `${label}: ${h.textContent ?? ''}`);
  a.textContent = '#';
  h.append(' ', a);
});

if (toc) {
  const details = toc.querySelector<HTMLDetailsElement>('[data-toc-details]');
  const mobil = window.matchMedia('(max-width: 1023.98px)');
  const anpassen = () => {
    if (details) details.open = !mobil.matches;
  };
  anpassen();
  mobil.addEventListener('change', anpassen);

  const links = Array.from(toc.querySelectorAll<HTMLAnchorElement>('[data-toc-link]'));
  const ziele = links
    .map((l) => document.getElementById(l.dataset.tocLink ?? ''))
    .filter((x): x is HTMLElement => x !== null);
  if ('IntersectionObserver' in window && ziele.length) {
    const sichtbar = new Set<string>();
    const io = new IntersectionObserver(
      (eintraege) => {
        eintraege.forEach((e) => (e.isIntersecting ? sichtbar.add(e.target.id) : sichtbar.delete(e.target.id)));
        const erster = ziele.find((z) => sichtbar.has(z.id));
        if (!erster) return;
        links.forEach((l) => {
          if (l.dataset.tocLink === erster.id) l.setAttribute('aria-current', 'true');
          else l.removeAttribute('aria-current');
        });
      },
      { rootMargin: '-80px 0px -55% 0px' },
    );
    ziele.forEach((z) => io.observe(z));
  }
  if (prosa && details) {
    toc.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('a') && mobil.matches) details.open = false;
    });
  }
}

export {};
