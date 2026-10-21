import { Globe, ArrowUpRight } from 'lucide-react';
import { APP_ICON_URL, LINKS } from '../constants/assets';
import { SupportedLanguage, translations } from '../utils/i18n';

interface FooterProps {
  currentLanguage: SupportedLanguage;
  onOpenLanguageModal: () => void;
}

export function Footer({ currentLanguage, onOpenLanguageModal }: FooterProps) {
  const t = translations[currentLanguage].footer;
  const navT = translations[currentLanguage].nav;

  return (
    <footer className="bg-[#070910] text-slate-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand, Developer, and Status */}
          <div className="md:col-span-7 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={APP_ICON_URL}
                alt={navT.iconAlt}
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-md object-cover border border-white/15"
                width={28}
                height={28}
              />
              <span className="text-base font-bold text-white tracking-tight">
                온말 Onmal
              </span>
              <span aria-hidden="true" className="text-slate-600">
                ·
              </span>
              <span className="text-sm font-medium text-slate-300">
                {t.team}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-teal-300/90 font-medium">
              {t.statusSummary}
            </p>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xl">
              {t.description}
            </p>
          </div>

          {/* Official Links & Direct Email Contact */}
          <div className="md:col-span-5 flex flex-col md:items-end justify-between">
            <div className="w-full md:w-auto">
              <h4 className="text-xs font-semibold tracking-wider text-slate-200 mb-4">
                {t.linksHeading}
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <a
                    href={LINKS.steam}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
                  >
                    <span>{t.steamLink}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                  </a>
                </li>
                <li>
                  <a
                    href={LINKS.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
                  >
                    <span>{t.discordLink}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                  </a>
                </li>
                <li>
                  <a
                    href={LINKS.x}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                  >
                    <span>{t.xLink}</span>
                    <ArrowUpRight aria-hidden="true" className="w-3.5 h-3.5 text-slate-500" />
                  </a>
                </li>
                <li>
                  <a
                    href={LINKS.email}
                    className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
                  >
                    <span>{t.emailLink}</span>
                  </a>
                </li>
                <li>
                  <a
                    href={LINKS.developerProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                  >
                    <span>{t.developerProfileLink}</span>
                    <ArrowUpRight aria-hidden="true" className="w-3.5 h-3.5 text-slate-500" />
                  </a>
                </li>
                {[
                  ['privacy.html', currentLanguage === 'ko' ? '개인정보 처리방침' : 'Privacy Policy'],
                  ['terms.html', currentLanguage === 'ko' ? '이용약관' : 'Terms of Use'],
                  ['licenses.html', currentLanguage === 'ko' ? '오픈소스 라이선스' : 'Open-source Licenses'],
                  ['website-third-party-notices.html', currentLanguage === 'ko' ? '웹사이트 라이선스 고지' : 'Website License Notices'],
                ].map(([href, label]) => (
                  <li key={href}>
                    <a href={`${href}?lang=${currentLanguage}`} className="text-slate-300 hover:text-white transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Language Button */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
          <p>{t.copyright}</p>

          <button
            type="button"
            onClick={(e) => {
              e.currentTarget.focus();
              onOpenLanguageModal();
            }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
            aria-label={navT.selectLanguage}
          >
            <Globe className="w-3.5 h-3.5 text-teal-400" />
            <span>{currentLanguage === 'ko' ? '한국어' : 'English'}</span>
            <span aria-hidden="true" className="text-slate-500">
              ·
            </span>
            <span>{t.changeLang}</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
