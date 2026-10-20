import { useState } from 'react';
import { ArrowUpRight, Maximize2 } from 'lucide-react';
import { APP_ICON_URL, SCREENSHOTS, LINKS } from '../constants/assets';
import { SupportedLanguage, translations } from '../utils/i18n';
import { SafeImage } from './SafeImage';

interface HeroProps {
  currentLanguage: SupportedLanguage;
  onOpenScreenshot: (id: number) => void;
}

export function Hero({ currentLanguage, onOpenScreenshot }: HeroProps) {
  const t = translations[currentLanguage].hero;
  const commonT = translations[currentLanguage].common;
  // Default to Screenshot 1 (Korean Dark Theme), allow toggling to Screenshot 4 (Korean Ivory Theme)
  const [heroShotId, setHeroShotId] = useState<number>(1);
  const activeScreenshot = SCREENSHOTS.find((s) => s.id === heroShotId) || SCREENSHOTS[0];

  return (
    <section className="relative pt-14 pb-20 md:pt-24 md:pb-28 bg-[#0B0E17] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Hero Header */}
        <div className="max-w-3xl">
          {/* Prominent Honest Status (Unboxed typographic metadata, zero-pill discipline) */}
          <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold tracking-wide text-teal-300 mb-6">
            <img
              src={APP_ICON_URL}
              alt=""
              aria-hidden="true"
              referrerPolicy="no-referrer"
              className="w-5 h-5 rounded object-cover border border-white/15"
            />
            <span>{t.statusBadge}</span>
          </div>

          {/* Exact Korean Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold text-white tracking-tight leading-[1.16] whitespace-pre-line">
            {t.headline}
          </h1>

          {/* Supporting Line */}
          <p className="mt-6 text-lg sm:text-xl text-slate-300 leading-relaxed font-normal max-w-2xl">
            {t.supporting}
          </p>

          {/* Primary & Secondary CTAs (No download/install/purchase CTA) */}
          <div className="mt-9 flex flex-wrap items-center gap-3.5">
            <a
              href={LINKS.steam}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-[#141218] bg-[#F0B189] hover:bg-[#F5C09E] transition-colors text-sm whitespace-nowrap shrink-0"
            >
              <span>{t.ctaSteam}</span>
              <ArrowUpRight className="w-4 h-4 text-[#141218]" />
            </a>

            <a
              href={LINKS.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-100 bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 transition-colors text-sm whitespace-nowrap shrink-0"
            >
              <span>{t.ctaDiscord}</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </a>
          </div>

          {/* Unreleased Notice */}
          <p className="mt-4 text-xs sm:text-sm text-slate-400">
            {t.unreleasedNotice}
          </p>
        </div>

        {/* Large Uncropped Real App Screenshot Showcase */}
        <div className="mt-14 sm:mt-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10 mb-4">
            <p className="text-xs sm:text-sm text-slate-300">
              {t.heroImageCaption}
            </p>
            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
              {/* Interactive Theme Preview Switcher (Dark vs Ivory real screenshot) */}
              <div
                className="inline-flex items-center p-0.5 rounded-lg bg-white/[0.05] border border-white/10"
                role="group"
                aria-label={currentLanguage === 'ko' ? '화면 테마 미리보기 전환' : 'Switch interface theme preview'}
              >
                <button
                  type="button"
                  onClick={() => setHeroShotId(1)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                    heroShotId === 1
                      ? 'bg-white/15 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t.themeSwitchDark}
                </button>
                <button
                  type="button"
                  onClick={() => setHeroShotId(4)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                    heroShotId === 4
                      ? 'bg-[#F5F0E6] text-[#141218]'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t.themeSwitchIvory}
                </button>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.currentTarget.focus();
                  onOpenScreenshot(activeScreenshot.id);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-teal-300 hover:text-teal-200 bg-teal-500/10 hover:bg-teal-500/15 border border-teal-500/25 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>{t.inspectFullSize}</span>
              </button>
            </div>
          </div>

          <div
            className="group relative rounded-2xl overflow-hidden border border-white/15 bg-[#12151E] cursor-pointer transition-colors hover:border-teal-400/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
            onClick={(e) => {
              e.currentTarget.focus();
              onOpenScreenshot(activeScreenshot.id);
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onOpenScreenshot(activeScreenshot.id);
              }
            }}
            aria-label={`${currentLanguage === 'ko' ? activeScreenshot.titleKo : activeScreenshot.titleEn} — ${t.inspectFullSize}`}
          >
            <SafeImage
              src={activeScreenshot.url}
              alt={currentLanguage === 'ko' ? activeScreenshot.altKo : activeScreenshot.altEn}
              fallbackText={commonT.imageFallback}
              retryText={commonT.retry}
              aspectRatioClass="aspect-[16/9]"
              priority={true}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
