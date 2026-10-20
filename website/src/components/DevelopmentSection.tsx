import { ArrowUpRight } from 'lucide-react';
import { SupportedLanguage, translations } from '../utils/i18n';
import { LINKS } from '../constants/assets';

interface DevelopmentSectionProps {
  currentLanguage: SupportedLanguage;
}

export function DevelopmentSection({ currentLanguage }: DevelopmentSectionProps) {
  const t = translations[currentLanguage].development;

  return (
    <section
      id="development"
      className="py-20 md:py-28 bg-[#F7F4EE] text-[#14161F] border-b border-[#E2DDD2]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <p className="text-xs font-semibold tracking-wider text-[#0F766E] mb-3">
            {t.kicker}
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#12151E] tracking-tight leading-snug">
            {t.title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#454A59] leading-relaxed">
            {t.leadParagraph}
          </p>
        </div>

        {/* Prominent 3-Column Honest Status Banner (No pills, clean architectural ledger) */}
        <div className="rounded-2xl bg-[#12151E] text-white p-7 sm:p-9 mb-12 border border-[#12151E]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-white/15">
            <div className="pt-4 first:pt-0 md:pt-0 md:px-6 first:md:pl-0">
              <p className="text-xs font-medium text-teal-400 mb-1.5">
                {currentLanguage === 'ko' ? '현재 빌드 단계' : 'Current Build Stage'}
              </p>
              <p className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {t.versionStatus}
              </p>
            </div>

            <div className="pt-4 md:pt-0 md:px-6">
              <p className="text-xs font-medium text-[#F0B189] mb-1.5">
                {currentLanguage === 'ko' ? '출시 일정' : 'Release Schedule'}
              </p>
              <p className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {t.releaseDateStatus}
              </p>
            </div>

            <div className="pt-4 md:pt-0 md:px-6">
              <p className="text-xs font-medium text-slate-400 mb-1.5">
                {currentLanguage === 'ko' ? '테스트 참여 상태' : 'Playtest Status'}
              </p>
              <p className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {t.playtestStatus}
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Verification Specification Ledger */}
        <div className="border-t border-[#DCD6C8] divide-y divide-[#DCD6C8]">
          {t.specs.map((spec, idx) => (
            <div
              key={idx}
              className="py-6 sm:py-7 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6 items-baseline"
            >
              <div className="md:col-span-3">
                <span className="text-xs font-semibold text-[#646A7A]">
                  {spec.label}
                </span>
              </div>
              <div className="md:col-span-4">
                <span className="text-base font-bold text-[#12151E]">
                  {spec.value}
                </span>
              </div>
              <div className="md:col-span-5">
                <p className="text-sm text-[#383D4C] leading-relaxed">
                  {spec.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Official Channels Row */}
        <div className="mt-10 pt-8 border-t border-[#DCD6C8] flex flex-wrap items-center gap-3.5">
          <a
            href={LINKS.steam}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-[#12151E] hover:bg-[#1E2330] transition-colors whitespace-nowrap shrink-0"
          >
            <span>{t.ctaSteamFollow}</span>
            <ArrowUpRight className="w-4 h-4 text-teal-400" />
          </a>

          <a
            href={LINKS.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-[#12151E] bg-[#EAE5DA] hover:bg-[#DFD9CB] border border-[#CEC7B7] transition-colors whitespace-nowrap shrink-0"
          >
            <span>{t.ctaDiscordJoin}</span>
            <ArrowUpRight className="w-4 h-4 text-[#454A59]" />
          </a>
        </div>
      </div>
    </section>
  );
}
