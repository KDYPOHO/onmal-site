import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { BRAND, LINKS } from '../constants/assets';
import { SupportedLanguage, translations } from '../utils/i18n';

interface HeaderProps {
  lang: SupportedLanguage;
  onChangeLanguage: (lang: SupportedLanguage) => void;
}

export function Header({ lang, onChangeLanguage }: HeaderProps) {
  const t = translations[lang].nav;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const links: Array<[string, string]> = [
    ['#features', t.features],
    ['#how-it-works', t.howItWorks],
    ['#screenshots', t.screenshots],
    ['#development', t.development],
    ['#faq', t.faq],
    ['#video', t.video],
  ];

  const langToggle = (
    <div className="lang-toggle" role="group" aria-label={t.langGroup}>
      <button type="button" lang="ko" aria-pressed={lang === 'ko'} onClick={() => onChangeLanguage('ko')}>한국어</button>
      <button type="button" lang="en" aria-pressed={lang === 'en'} onClick={() => onChangeLanguage('en')}>EN</button>
    </div>
  );

  return (
    <header className="site-header">
      <div className="wrap">
        <a className="brand" href="#top" aria-label={t.brandHomeAria}>
          <img src={BRAND.mark96} alt="" width={34} height={34} />
          <span>온말</span>
          <small lang="en">Onmal</small>
        </a>
        <nav aria-label={t.primary}>
          <ul className="nav-links">
            {links.map(([href, label]) => (
              <li key={href}><a href={href}>{label}</a></li>
            ))}
          </ul>
        </nav>
        {langToggle}
        <a className="btn btn-primary btn-small header-steam" href={LINKS.steam} target="_blank" rel="noopener noreferrer">
          {t.steam}
        </a>
        <button
          type="button"
          className="menu-button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? t.closeMenu : t.openMenu}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      <div id="mobile-menu" className="mobile-panel" data-open={open} hidden={!open}>
        <ul>
          {links.map(([href, label]) => (
            <li key={href}><a className="m-link" href={href} onClick={() => setOpen(false)}>{label}</a></li>
          ))}
        </ul>
        <a className="btn btn-primary" href={LINKS.steam} target="_blank" rel="noopener noreferrer">
          {translations[lang].hero.ctaSteam}
        </a>
      </div>
    </header>
  );
}
