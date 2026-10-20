import { useState } from 'react';
import { Globe, Menu, X, ArrowUpRight } from 'lucide-react';
import { APP_ICON_URL, LINKS } from '../constants/assets';
import { SupportedLanguage, translations } from '../utils/i18n';

interface HeaderProps {
  currentLanguage: SupportedLanguage;
  onOpenLanguageModal: () => void;
}

export function Header({ currentLanguage, onOpenLanguageModal }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[currentLanguage].nav;

  const navLinks = [
    { href: '#features', label: t.features },
    { href: '#how-it-works', label: t.howItWorks },
    { href: '#screenshots', label: t.screenshots },
    { href: '#development', label: t.development },
    { href: '#faq', label: t.faq },
    { href: '#video', label: t.video },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0B0E17]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Official Registered App Icon + 온말 Wordmark */}
        <a
          href="#"
          className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded-md whitespace-nowrap shrink-0"
          aria-label={t.brandHomeAria}
        >
          <img
            src={APP_ICON_URL}
            alt={t.iconAlt}
            referrerPolicy="no-referrer"
            className="w-8 h-8 rounded-lg object-cover border border-white/15"
            width={32}
            height={32}
          />
          <span className="text-lg font-bold tracking-tight text-white">
            온말 <span className="font-medium text-slate-400 text-sm ml-0.5">Onmal</span>
          </span>
        </a>

        {/* Zone 2: Section Navigation Links */}
        <nav
          className="hidden xl:flex items-center gap-5 text-sm font-medium text-slate-300"
          aria-label={currentLanguage === 'ko' ? '주요 섹션 탐색' : 'Primary navigation'}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-white transition-colors py-1 border-b border-transparent hover:border-teal-400/70 whitespace-nowrap shrink-0"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Searchable Language Selector & Official External Links */}
        <div className="hidden xl:flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.currentTarget.focus();
              onOpenLanguageModal();
            }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
            aria-label={t.selectLanguage}
          >
            <Globe className="w-3.5 h-3.5 text-teal-400" />
            <span>{currentLanguage === 'ko' ? '한국어' : 'English'}</span>
          </button>

          <a
            href={LINKS.steam}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors whitespace-nowrap shrink-0"
          >
            <span>{t.steam}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </a>

          <a
            href={LINKS.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors whitespace-nowrap shrink-0"
          >
            <span>{t.discord}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>

        {/* Mobile Controls */}
        <div className="flex xl:hidden items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.currentTarget.focus();
              onOpenLanguageModal();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 bg-white/[0.05] border border-white/10 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
            aria-label={t.selectLanguage}
          >
            <Globe className="w-3.5 h-3.5 text-teal-400" />
            <span>{currentLanguage === 'ko' ? '한국어' : 'EN'}</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-lg text-slate-200 hover:text-white bg-white/[0.05] border border-white/10"
            aria-label={mobileMenuOpen ? t.closeMenu : t.openMenu}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-white/10 bg-[#0B0E17] px-4 pt-3 pb-6 space-y-4">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-white/5"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-2.5">
            <a
              href={LINKS.steam}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold text-white bg-white/[0.06] border border-white/10"
            >
              <span>{t.steam}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </a>
            <a
              href={LINKS.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold text-white bg-white/[0.06] border border-white/10"
            >
              <span>{t.discord}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
