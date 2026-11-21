import { ExternalLink } from 'lucide-react';
import { BRAND, LINKS } from '../constants/assets';
import { SupportedLanguage, translations } from '../utils/i18n';

export function Footer({ lang }: { lang: SupportedLanguage }) {
  const t = translations[lang].footer;
  const ko = lang === 'ko';
  const channels: Array<[string, string, boolean]> = [
    [LINKS.steam, t.steamLink, true],
    [LINKS.discord, t.discordLink, true],
    [LINKS.x, t.xLink, true],
    [LINKS.developerProfile, t.developerProfileLink, true],
    [LINKS.email, t.emailLink, false],
  ];
  const legal: Array<[string, string]> = [
    ['privacy.html', ko ? '개인정보 처리방침' : 'Privacy Policy'],
    ['terms.html', ko ? '이용약관' : 'Terms of Use'],
    ['licenses.html', ko ? '오픈소스 라이선스' : 'Open-source Licenses'],
    ['website-third-party-notices.html', ko ? '웹사이트 라이선스 고지' : 'Website License Notices'],
  ];

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <p className="footer-brand"><img src={BRAND.mark96} alt="" width={44} height={44} /><span>온말 <span lang="en">Onmal</span></span></p>
            <p>{t.description}</p>
            <ul className="footer-status">
              {t.statusSummary.split(' · ').map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div>
            <h2>{t.linksHeading}</h2>
            <ul className="footer-links">
              {channels.map(([href, label, external]) => (
                <li key={href}>
                  <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                    {label}{external && <ExternalLink aria-hidden="true" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2>{t.legalHeading}</h2>
            <ul className="footer-links">
              {legal.map(([href, label]) => (
                <li key={href}>
                  <a href={`${href}?lang=${lang}`} className={href === 'privacy.html' ? 'footer-privacy' : undefined}>
                    {href === 'privacy.html' ? <strong>{label}</strong> : label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="footer-legal-notes">
          <p>{t.aiNotice}</p>
          <p>{t.operator}</p>
        </div>
        <div className="footer-bottom">
          <span>{t.copyright}</span>
          <a href="#top">{t.backToTop}</a>
        </div>
      </div>
    </footer>
  );
}
