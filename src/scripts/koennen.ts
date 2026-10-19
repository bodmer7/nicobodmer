/*
 * Können: ab 1024px vertikale Tabs nach WAI-ARIA (Pfeiltasten hoch und
 * runter, Home, End), darunter Akkordeons mit der ersten Gruppe offen.
 * Links auf eine Gruppe (#koennen-…) wählen den Tab bzw. öffnen die Gruppe.
 */
const box = document.querySelector<HTMLElement>('[data-koennen]');

if (box) {
  const liste = box.querySelector<HTMLElement>('[data-koennen-tabs]')!;
  const tabs = Array.from(box.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
  const gruppen = Array.from(box.querySelectorAll<HTMLElement>('[data-gruppe]'));
  const details = gruppen.map((g) => g.querySelector('details')!);
  const breit = window.matchMedia('(min-width: 1024px)');
  let aktiv = 0;
  let istTabs = false;

  const zeigen = (i: number, uebergang = true) => {
    aktiv = i;
    tabs.forEach((t, k) => {
      t.setAttribute('aria-selected', String(k === i));
      t.tabIndex = k === i ? 0 : -1;
    });
    gruppen.forEach((g, k) => {
      g.hidden = k !== i;
      g.classList.toggle('ist-neu', uebergang && k === i);
    });
  };

  const modus = () => {
    istTabs = breit.matches;
    box.classList.toggle('ist-tabs', istTabs);
    liste.hidden = !istTabs;
    gruppen.forEach((g, k) => {
      if (istTabs) {
        g.setAttribute('role', 'tabpanel');
        g.setAttribute('aria-labelledby', tabs[k].id);
        g.tabIndex = 0;
        details[k].open = true;
      } else {
        g.removeAttribute('role');
        g.setAttribute('aria-labelledby', `titel-${g.id}`);
        g.removeAttribute('tabindex');
        g.hidden = false;
        details[k].open = k === aktiv;
      }
    });
    if (istTabs) zeigen(aktiv, false);
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => zeigen(i));
    tab.addEventListener('keydown', (e) => {
      let ziel = -1;
      if (e.key === 'ArrowDown') ziel = (i + 1) % tabs.length;
      else if (e.key === 'ArrowUp') ziel = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') ziel = 0;
      else if (e.key === 'End') ziel = tabs.length - 1;
      if (ziel < 0) return;
      e.preventDefault();
      zeigen(ziel);
      tabs[ziel].focus();
    });
  });

  // Im Akkordeon merkt sich «aktiv» die zuletzt geöffnete Gruppe.
  details.forEach((d, k) =>
    d.addEventListener('toggle', () => {
      if (!istTabs && d.open) aktiv = k;
    }),
  );

  /** Gruppe zu einem Anker wählen, bevor der Browser dorthin springt */
  const oeffnen = (hash: string) => {
    const i = gruppen.findIndex((g) => `#${g.id}` === hash);
    if (i < 0) return;
    if (istTabs) zeigen(i, false);
    else details[i].open = true;
  };

  document.addEventListener('click', (e) => {
    const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href*="#"]');
    if (link && link.pathname === location.pathname) oeffnen(link.hash);
  });
  window.addEventListener('hashchange', () => oeffnen(location.hash));

  modus();
  oeffnen(location.hash);
  breit.addEventListener('change', modus);
}

export {};
