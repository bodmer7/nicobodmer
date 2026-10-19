/**
 * Alle Oberflächentexte auf Deutsch und Englisch.
 * Längere Inhalte (Stationen, Können) stehen in src/data/profil.ts,
 * Projekttexte in src/content/projekte/.
 */
export const sprachen = ['de', 'en'] as const;
export type Lang = (typeof sprachen)[number];

export const htmlLang: Record<Lang, string> = { de: 'de-CH', en: 'en-GB' };
export const ogLocale: Record<Lang, string> = { de: 'de_CH', en: 'en_GB' };

const de = {
  'skip': 'Zum Inhalt',
  'home.label': 'Nico Bodmer, zur Startseite',
  'nav.label': 'Hauptnavigation',
  'nav.arbeiten': 'Arbeiten',
  'nav.laufbahn': 'Laufbahn',
  'nav.lebenslauf': 'Lebenslauf',
  'nav.kontakt': 'Kontakt',
  'menu.open': 'Menü',
  'menu.close': 'Schliessen',
  'theme.toDark': 'Dunkles Design',
  'theme.toLight': 'Helles Design',
  'lang.switch': 'EN',
  'lang.switchLabel': 'English version',
  'kopf.linkedin': 'LinkedIn-Profil von Nico Bodmer (externe Seite)',

  'footer.copy': '© 2026 Nico Bodmer, Raum Zürich',
  'footer.recht': 'Impressum und Datenschutz',
  'footer.cookies': 'Keine Cookies, kein Tracking.',
  'footer.stand': 'Stand der Inhalte: Oktober 2026',
  'footer.messung': 'Diese Seite: {kb} KB beim ersten Aufruf, Lighthouse mobil {lh}, gemessen auf nico-bodmer.ch am {datum}.',
  'footer.messungLokal': 'Diese Seite: {kb} KB beim ersten Aufruf, Lighthouse mobil {lh}, lokal gemessen am {datum}.',
  'footer.messungLabel': 'Leistung, Barrierefreiheit, Best Practices, SEO',

  'hero.frage': 'Was führt Sie her?',
  'hero.option.stelle': 'Eine offene Stelle',
  'hero.option.website': 'Eine Website für meinen Betrieb',
  'hero.intro.neutral':
    'Ich habe als Informatiker mit Fachrichtung Plattformentwicklung gelernt, wie Systeme laufen. Heute arbeite ich im technischen Vertrieb für Data & AI und studiere berufsbegleitend Digital Business & AI an der HWZ. Daneben gestalte ich mit ODERA Design Websites für kleine Unternehmen und setze sie um.',
  'hero.intro.stelle':
    'Technisch ausgebildet, im Vertrieb zuhause. Ich kläre Anforderungen, entwickle Lösungen bis zum technischen Konzept und arbeite an Angeboten mit. Wenn etwas gebaut werden muss, setze ich es mit KI-gestützter Entwicklung selbst um.',
  'hero.intro.website':
    'Sie brauchen eine Website, die Anfragen bringt? Mit ODERA Design gestalte ich Websites für Betriebe in der Schweiz und setze sie um. Sie sehen den fertigen Entwurf, bevor Sie bezahlen.',
  'hero.btn.arbeiten': 'Arbeiten ansehen',
  'hero.btn.lebenslauf': 'Lebenslauf',
  'hero.btn.lebenslaufAnsehen': 'Lebenslauf ansehen',
  'hero.btn.laufbahn': 'Laufbahn ansehen',
  'hero.btn.odera': 'Zu odera.ch',
  'hero.btn.muster': 'Musterprojekte ansehen',
  'hero.gerade': 'Gerade, Stand Oktober 2026',
  'hero.fotoAlt': 'Nico Bodmer im dunklen Anzug vor grauem Hintergrund, die Arme verschränkt',

  'arbeiten.titel': 'Ausgewählte Arbeiten',
  'arbeiten.intro': 'Websites, Apps und Werkzeuge, die ich konzipiert und umgesetzt habe. Jede mit Ziel, Vorgehen und Ergebnis.',
  'arbeiten.inArbeit': 'in Arbeit',
  'arbeiten.vorschau': 'Vorschau',

  'labor.titel': 'Auf jedem Bildschirm',
  'labor.intro': 'Drei Websites, drei Bildschirmgrössen. Wechseln Sie die Ansicht oder laden Sie eine Seite live und ziehen Sie am Rand.',
  'labor.seiten': 'Website wählen',
  'labor.geraete': 'Bildschirm wählen',
  'labor.desktop': 'Desktop',
  'labor.tablet': 'Tablet',
  'labor.handy': 'Handy',
  'labor.live': 'Live laden',
  'labor.liveAus': 'Screenshot zeigen',
  'labor.liveOeffnen': 'Live öffnen',
  'labor.hinweis': 'Lädt die Seite direkt von odera.ch. Dabei wird Ihre IP-Adresse an den Hoster übermittelt.',
  'labor.breite': 'Breite',
  'labor.griff': 'Breite der Vorschau',
  'labor.messwerte': 'Messwerte',
  'labor.eigeneMessung': 'Eigene Messung',
  'labor.iframeTitel': 'Live-Vorschau von {name}',

  'laufbahn.titel': 'Laufbahn',
  'laufbahn.intro': 'Ausbildung, Arbeit und eigene Projekte liefen bei mir von Anfang an parallel.',
  'laufbahn.ansicht': 'Ansicht',
  'laufbahn.diagramm': 'Diagramm',
  'laufbahn.liste': 'Liste',
  'laufbahn.spur.arbeit': 'Arbeit',
  'laufbahn.spur.ausbildung': 'Ausbildung',
  'laufbahn.spur.projekte': 'Eigene Projekte',
  'laufbahn.heute': 'Heute',
  'laufbahn.scrollHinweis': 'Seitlich wischen, um die ganze Zeitachse zu sehen.',
  'laufbahn.detailLeer': 'Wählen Sie einen Balken, um Details zu sehen.',
  'laufbahn.koennen': 'Dazu gehört',
  'laufbahn.projekt': 'Eigenes Projekt',
  'laufbahn.fallstudie': 'Zur Fallstudie',
  'laufbahn.geplant': 'geplant bis',
  'laufbahn.diagrammLabel': 'Laufbahn als Zeitachse von 2021 bis 2030',
  'laufbahn.arbeit': 'Berufserfahrung',

  'koennen.titel': 'Können, mit Nachweis',
  'koennen.intro':
    'Zu jeder Fähigkeit steht, wie sicher ich darin bin und wo ich sie eingesetzt habe. Code schreibe ich meist mit KI-Unterstützung: Ich verstehe, was ich ausliefere, bin aber kein Software-Entwickler.',
  'koennen.eingesetzt': 'Eingesetzt in:',
  'koennen.inProjekten': 'In meinen Projekten eingesetzt',
  'koennen.sprachen': 'Sprachen',
  'koennen.website': 'Diese Website',

  'ueber.titel': 'Über mich',
  'ueber.p1':
    '2021 habe ich als Lernender im IT-Support angefangen: Level 1 und 2, Geräte einrichten und migrieren, jede Woche eine Kurzpräsentation zu IT-Themen. Danach Technical Support direkt beim Kunden, Robotik-Projekte mit dem Roboter Pepper und IT- und Security-Schulungen an Oberstufenschulen.',
  'ueber.p2':
    'Später habe ich interne Anwendungen mit Red Hat OpenShift und IBM Cloud betrieben und an ihrer Weiterentwicklung mit React mitgearbeitet. Heute arbeite ich im technischen Vertrieb für Data & AI: Anforderungen klären, Lösungen bis zum technischen Konzept entwickeln, an Angeboten und RFPs mitarbeiten.',
  'ueber.p3':
    'Seit September 2026 studiere ich berufsbegleitend Digital Business & AI an der HWZ Zürich. Daneben setze ich mit ODERA Design Websites für kleine Unternehmen und eigene Anwendungen um, mit KI-gestützter Entwicklung. Wer Support gemacht hat, baut Seiten, die man auch in zwei Jahren noch pflegen kann.',
  'ueber.hobbies': 'Ausserhalb der Arbeit',
  'ueber.fotoAlt': 'Nico Bodmer im Anzug draussen vor einem Gebäude',

  'kontakt.titel': 'Schreiben Sie mir.',
  'kontakt.composer': 'Nachricht vorbereiten',
  'kontakt.thema': 'Worum geht es?',
  'kontakt.thema.stelle': 'Eine Stelle',
  'kontakt.thema.projekt': 'Ein gemeinsames Projekt',
  'kontakt.thema.website': 'Eine Website für meinen Betrieb',
  'kontakt.thema.anderes': 'Etwas anderes',
  'kontakt.odera': 'Dafür gibt es odera.ch mit dem Projekt-Check. So bekommen Sie schneller ein Angebot.',
  'kontakt.oderaBtn': 'Projekt-Check starten',
  'kontakt.name': 'Ihr Name',
  'kontakt.optional': 'optional',
  'kontakt.nachricht': 'Ihre Nachricht',
  'kontakt.senden': 'E-Mail vorbereiten',
  'kontakt.hinweis': 'Nichts wird gespeichert oder übertragen. Ihr E-Mail-Programm öffnet sich mit dem fertigen Text.',
  'kontakt.betreff': '{thema}: Anfrage über nico-bodmer.ch',
  'kontakt.betreffOhne': 'Anfrage über nico-bodmer.ch',
  'kontakt.gruss': 'Freundliche Grüsse',
  'kontakt.direkt': 'Oder direkt',
  'kontakt.kopieren': 'Adresse kopieren',
  'kontakt.kopiert': 'Adresse kopiert',
  'kontakt.kopierFehler': 'Kopieren nicht möglich. Die Adresse ist jetzt markiert.',
  'kontakt.vcard': 'Kontakt speichern (vCard)',

  'fall.zurueck': 'Zurück zu Arbeiten',
  'fall.jahr': 'Jahr',
  'fall.rolle': 'Rolle',
  'fall.typ': 'Typ',
  'fall.technik': 'Technik',
  'fall.links': 'Links',
  'fall.inhalt': 'Inhalt',
  'fall.messwerte': 'Messwerte',
  'fall.bilder': 'Bilder',
  'fall.naechstes': 'Nächstes Projekt',
  'fall.quelle': 'Quelle',
  'fall.anker': 'Link zu diesem Abschnitt',
  'fall.extern': '(externer Link)',
  'fall.beispiel': 'Frei erfundener Betrieb',

  'lightbox.schliessen': 'Schliessen',
  'lightbox.zurueck': 'Vorheriges Bild',
  'lightbox.weiter': 'Nächstes Bild',
  'lightbox.zaehler': '{n} von {total}',
  'lightbox.oeffnen': 'Bild vergrössern',

  'demo.spielen': 'Quiz hier spielen',
  'demo.hinweis': 'Lädt das Quiz direkt von GitHub Pages. Dabei wird Ihre IP-Adresse an den Hoster übermittelt.',
  'demo.neuerTab': 'Im neuen Tab öffnen',
  'demo.titel': 'Geo-Quiz, live eingebettet',

  'dashboard.beispiel': 'Beispieldaten',
  'dashboard.titel': 'Morgen-Check-in mit Beispieldaten',
  'dashboard.readiness': 'Readiness',
  'dashboard.verlauf': 'Verlauf der letzten 7 Tage',

  'cv.titel': 'Lebenslauf',
  'cv.pdf': 'Als PDF speichern',
  'cv.profil': 'Kurzprofil',
  'cv.profilText':
    'Informatiker EFZ mit Fachrichtung Plattformentwicklung und Erfahrung in Support und Deployment. Heute im technischen Vertrieb für Data & AI: Anforderungen klären, Lösungen bis zum technischen Konzept entwickeln, an Angeboten mitarbeiten. Daneben setze ich mit ODERA Design Websites für kleine Unternehmen mit KI-gestützter Entwicklung um und studiere berufsbegleitend Digital Business & AI an der HWZ.',
  'cv.erfahrung': 'Berufserfahrung',
  'cv.ausbildung': 'Ausbildung',
  'cv.projekte': 'Projekte',
  'cv.koennen': 'Können',
  'cv.sprachen': 'Sprachen',
  'cv.kontakt': 'Kontakt',
  'cv.fotoAlt': 'Nico Bodmer',
  'cv.referenzen': 'Referenzen auf Anfrage.',
  'cv.themen': 'Themen im {n}. Semester',

  'recht.titel': 'Impressum und Datenschutz',

  '404.titel': 'Diese Seite liegt nicht auf der Karte.',
  '404.start': 'Zur Startseite',
  '404.arbeiten': 'Zu den Arbeiten',
  '404.quiz': 'Oder üben Sie mit dem {link}, Orte zu finden.',
  '404.quizLink': 'Geo-Quiz',

  'toast.label': 'Hinweis',
} as const;

export type UiKey = keyof typeof de;

const en: Record<UiKey, string> = {
  'skip': 'Skip to content',
  'home.label': 'Nico Bodmer, home page',
  'nav.label': 'Main navigation',
  'nav.arbeiten': 'Work',
  'nav.laufbahn': 'Career',
  'nav.lebenslauf': 'CV',
  'nav.kontakt': 'Contact',
  'menu.open': 'Menu',
  'menu.close': 'Close',
  'theme.toDark': 'Dark theme',
  'theme.toLight': 'Light theme',
  'lang.switch': 'DE',
  'lang.switchLabel': 'Deutsche Version',
  'kopf.linkedin': 'Nico Bodmer on LinkedIn (external site)',

  'footer.copy': '© 2026 Nico Bodmer, Zurich area',
  'footer.recht': 'Legal notice and privacy',
  'footer.cookies': 'No cookies, no tracking.',
  'footer.stand': 'Content as of October 2026',
  'footer.messung': 'This page: {kb} KB on first load, Lighthouse mobile {lh}, measured on nico-bodmer.ch on {datum}.',
  'footer.messungLokal': 'This page: {kb} KB on first load, Lighthouse mobile {lh}, measured locally on {datum}.',
  'footer.messungLabel': 'performance, accessibility, best practices, SEO',

  'hero.frage': 'What brings you here?',
  'hero.option.stelle': 'An open position',
  'hero.option.website': 'A website for my business',
  'hero.intro.neutral':
    'I trained as a computer scientist specialising in platform development, so I know how systems run. Today I work in technical sales for data & AI and study Digital Business & AI part-time at HWZ. On the side, I design and implement websites for small businesses with ODERA Design.',
  'hero.intro.stelle':
    'Technically trained, at home in sales. I clarify requirements, develop solutions up to the technical concept and contribute to proposals. When something needs building, I implement it myself with AI-assisted development.',
  'hero.intro.website':
    'Need a website that brings in enquiries? With ODERA Design I design websites for businesses in Switzerland and implement them. You see the finished draft before you pay.',
  'hero.btn.arbeiten': 'See my work',
  'hero.btn.lebenslauf': 'CV',
  'hero.btn.lebenslaufAnsehen': 'View my CV',
  'hero.btn.laufbahn': 'View my career',
  'hero.btn.odera': 'Go to odera.ch',
  'hero.btn.muster': 'View sample projects',
  'hero.gerade': 'Right now, as of October 2026',
  'hero.fotoAlt': 'Nico Bodmer in a dark suit against a grey background, arms crossed',

  'arbeiten.titel': 'Selected work',
  'arbeiten.intro': 'Websites, apps and tools I have designed and implemented. Each with its goal, approach and result.',
  'arbeiten.inArbeit': 'in progress',
  'arbeiten.vorschau': 'Preview',

  'labor.titel': 'On every screen',
  'labor.intro': 'Three websites, three screen sizes. Switch the view, or load a page live and drag its edge.',
  'labor.seiten': 'Choose a website',
  'labor.geraete': 'Choose a screen',
  'labor.desktop': 'Desktop',
  'labor.tablet': 'Tablet',
  'labor.handy': 'Phone',
  'labor.live': 'Load live',
  'labor.liveAus': 'Show screenshot',
  'labor.liveOeffnen': 'Open live',
  'labor.hinweis': 'Loads the page directly from odera.ch. Your IP address is sent to the host.',
  'labor.breite': 'Width',
  'labor.griff': 'Preview width',
  'labor.messwerte': 'Measurements',
  'labor.eigeneMessung': 'Own measurement',
  'labor.iframeTitel': 'Live preview of {name}',

  'laufbahn.titel': 'Career',
  'laufbahn.intro': 'Training, work and my own projects have run in parallel from the start.',
  'laufbahn.ansicht': 'View',
  'laufbahn.diagramm': 'Chart',
  'laufbahn.liste': 'List',
  'laufbahn.spur.arbeit': 'Work',
  'laufbahn.spur.ausbildung': 'Education',
  'laufbahn.spur.projekte': 'Own projects',
  'laufbahn.heute': 'Today',
  'laufbahn.scrollHinweis': 'Swipe sideways to see the whole timeline.',
  'laufbahn.detailLeer': 'Choose a bar to see the details.',
  'laufbahn.koennen': 'Related skills',
  'laufbahn.projekt': 'Own project',
  'laufbahn.fallstudie': 'Read the case study',
  'laufbahn.geplant': 'planned until',
  'laufbahn.diagrammLabel': 'Career as a timeline from 2021 to 2030',
  'laufbahn.arbeit': 'Work experience',

  'koennen.titel': 'Skills, with evidence',
  'koennen.intro':
    'Each skill shows how confident I am in it and where I have used it. I mostly write code with AI assistance: I understand what I ship, but I am not a software developer.',
  'koennen.eingesetzt': 'Used in:',
  'koennen.inProjekten': 'Used in my projects',
  'koennen.sprachen': 'Languages',
  'koennen.website': 'This website',

  'ueber.titel': 'About me',
  'ueber.p1':
    'I started in IT support as an apprentice in 2021: level 1 and 2, setting up and migrating devices, a short presentation on IT topics every week. After that came technical support directly at customer sites, robotics projects with the Pepper robot, and IT and security training at secondary schools.',
  'ueber.p2':
    'Later I ran internal applications on Red Hat OpenShift and IBM Cloud and helped develop them further with React. Today I work in technical sales for data & AI: clarifying requirements, developing solutions up to the technical concept, contributing to proposals and RFPs.',
  'ueber.p3':
    'Since September 2026 I have been studying Digital Business & AI part-time at HWZ in Zurich. Alongside that I implement websites for small businesses with ODERA Design, and applications of my own, using AI-assisted development. Someone who has done support builds pages that are still maintainable two years later.',
  'ueber.hobbies': 'Outside work',
  'ueber.fotoAlt': 'Nico Bodmer in a suit outdoors in front of a building',

  'kontakt.titel': 'Write to me.',
  'kontakt.composer': 'Prepare a message',
  'kontakt.thema': 'What is it about?',
  'kontakt.thema.stelle': 'A position',
  'kontakt.thema.projekt': 'A joint project',
  'kontakt.thema.website': 'A website for my business',
  'kontakt.thema.anderes': 'Something else',
  'kontakt.odera': 'For that, odera.ch has the project check. It gets you a quote faster.',
  'kontakt.oderaBtn': 'Start the project check',
  'kontakt.name': 'Your name',
  'kontakt.optional': 'optional',
  'kontakt.nachricht': 'Your message',
  'kontakt.senden': 'Prepare email',
  'kontakt.hinweis': 'Nothing is stored or sent. Your email program opens with the finished text.',
  'kontakt.betreff': '{thema}: enquiry via nico-bodmer.ch',
  'kontakt.betreffOhne': 'Enquiry via nico-bodmer.ch',
  'kontakt.gruss': 'Kind regards',
  'kontakt.direkt': 'Or directly',
  'kontakt.kopieren': 'Copy address',
  'kontakt.kopiert': 'Address copied',
  'kontakt.kopierFehler': 'Copying is not possible. The address is now selected.',
  'kontakt.vcard': 'Save contact (vCard)',

  'fall.zurueck': 'Back to work',
  'fall.jahr': 'Year',
  'fall.rolle': 'Role',
  'fall.typ': 'Type',
  'fall.technik': 'Technology',
  'fall.links': 'Links',
  'fall.inhalt': 'Contents',
  'fall.messwerte': 'Measurements',
  'fall.bilder': 'Images',
  'fall.naechstes': 'Next project',
  'fall.quelle': 'Source',
  'fall.anker': 'Link to this section',
  'fall.extern': '(external link)',
  'fall.beispiel': 'Fictitious business',

  'lightbox.schliessen': 'Close',
  'lightbox.zurueck': 'Previous image',
  'lightbox.weiter': 'Next image',
  'lightbox.zaehler': '{n} of {total}',
  'lightbox.oeffnen': 'Enlarge image',

  'demo.spielen': 'Play the quiz here',
  'demo.hinweis': 'Loads the quiz directly from GitHub Pages. Your IP address is sent to the host.',
  'demo.neuerTab': 'Open in a new tab',
  'demo.titel': 'Geo quiz, embedded live',

  'dashboard.beispiel': 'Sample data',
  'dashboard.titel': 'Morning check-in with sample data',
  'dashboard.readiness': 'Readiness',
  'dashboard.verlauf': 'Last 7 days',

  'cv.titel': 'CV',
  'cv.pdf': 'Save as PDF',
  'cv.profil': 'Profile',
  'cv.profilText':
    'Computer scientist (Swiss federal VET diploma, platform development) with experience in support and deployment. Now in technical sales for data & AI: clarifying requirements, developing solutions up to the technical concept, contributing to proposals. Alongside that I implement websites for small businesses with ODERA Design using AI-assisted development and study Digital Business & AI part-time at HWZ.',
  'cv.erfahrung': 'Work experience',
  'cv.ausbildung': 'Education',
  'cv.projekte': 'Projects',
  'cv.koennen': 'Skills',
  'cv.sprachen': 'Languages',
  'cv.kontakt': 'Contact',
  'cv.fotoAlt': 'Nico Bodmer',
  'cv.referenzen': 'References available on request.',
  'cv.themen': 'Topics in semester {n}',

  'recht.titel': 'Legal notice and privacy',

  '404.titel': 'This page is not on the map.',
  '404.start': 'Go to the home page',
  '404.arbeiten': 'Go to my work',
  '404.quiz': 'Or practise finding places with the {link}.',
  '404.quizLink': 'geo quiz',

  'toast.label': 'Notice',
};

export const ui: Record<Lang, Record<UiKey, string>> = { de, en };

export function useT(lang: Lang) {
  return (key: UiKey, vars: Record<string, string | number> = {}) =>
    ui[lang][key].replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? `{${k}}`));
}

/**
 * Zahl auf Deutsch mit Dezimalkomma und Apostroph (0,4 und 1'900),
 * auf Englisch mit Punkt und Komma (0.4 und 1,900).
 */
export function zahl(n: number, lang: Lang, stellen = 0): string {
  const [ganz, rest] = n.toFixed(stellen).split('.');
  const tausend = lang === 'de' ? "'" : ',';
  const dezimal = lang === 'de' ? ',' : '.';
  const gruppiert = ganz.replace(/\B(?=(\d{3})+(?!\d))/g, tausend);
  return rest ? `${gruppiert}${dezimal}${rest}` : gruppiert;
}

/** Datum lang, z. B. «5. Oktober 2026» bzw. «5 October 2026». */
export function datum(iso: string, lang: Lang): string {
  const d = new Date(`${iso}T12:00:00Z`);
  return d.toLocaleDateString(lang === 'de' ? 'de-CH' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Zurich' });
}
