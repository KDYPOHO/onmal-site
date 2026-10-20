import { useState } from 'react';
import { Maximize2 } from 'lucide-react';
import { SupportedLanguage, translations } from '../utils/i18n';
import { SCREENSHOTS } from '../constants/assets';
import { SafeImage } from './SafeImage';

interface HowItWorksProps {
  currentLanguage: SupportedLanguage;
  onOpenScreenshot: (id: number) => void;
}

export function HowItWorks({ currentLanguage, onOpenScreenshot }: HowItWorksProps) {
  const t = translations[currentLanguage].howItWorks;
  const commonT = translations[currentLanguage].common;
  const [selectedStepIdx, setSelectedStepIdx] = useState<number>(0);

  const activeStep = t.steps[selectedStepIdx] || t.steps[0];
  const activeScreenshot =
    SCREENSHOTS.find((s) => s.id === activeStep.screenshotId) || SCREENSHOTS[0];

  return (
    <section
      id="how-it-works"
      className="py-20 md:py-28 bg-[#0B0E17] border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <p className="text-xs font-semibold tracking-wider text-teal-400 mb-3">
            {t.kicker}
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
            {t.title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* 2-Column Editorial Walkthrough: Static Steps + Original Screenshot */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: 3 Sequential Steps */}
          <div className="lg:col-span-5 border-t border-white/10 divide-y divide-white/10">
            {t.steps.map((step, idx) => {
              const isSelected = idx === selectedStepIdx;
              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => setSelectedStepIdx(idx)}
                  className={`w-full text-left py-6 px-4 sm:px-5 transition-colors block ${
                    isSelected
                      ? 'bg-white/[0.05]'
                      : 'hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-3 mb-2">
                    <div className="flex items-baseline gap-3">
                      <span
                        className={`font-mono text-sm font-bold tabular-nums ${
                          isSelected ? 'text-[#F0B189]' : 'text-teal-400'
                        }`}
                      >
                        {step.num}.
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                        {step.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-teal-300/90 mb-2 pl-7">
                    {step.uiLabel}
                  </p>
                  <p className="text-sm text-slate-300 leading-relaxed pl-7">
                    {step.desc}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Right: Real Screenshot Proof (Contained 16:9) */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-white/15 bg-[#12151E] overflow-hidden">
              <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-white/10">
                <div className="text-xs text-slate-300 font-medium truncate">
                  <span className="font-mono text-[#F0B189] mr-2">
                    {activeStep.num}.
                  </span>
                  <span>
                    {currentLanguage === 'ko'
                      ? activeScreenshot.titleKo
                      : activeScreenshot.titleEn}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.currentTarget.focus();
                    onOpenScreenshot(activeScreenshot.id);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-300 hover:text-teal-200 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded px-1 py-0.5"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>{t.viewCapture}</span>
                </button>
              </div>

              <div
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
                aria-label={`${
                  currentLanguage === 'ko'
                    ? activeScreenshot.titleKo
                    : activeScreenshot.titleEn
                } — ${t.viewCapture}`}
                className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
              >
                <SafeImage
                  src={activeScreenshot.url}
                  alt={
                    currentLanguage === 'ko'
                      ? activeScreenshot.altKo
                      : activeScreenshot.altEn
                  }
                  fallbackText={commonT.imageFallback}
                  retryText={commonT.retry}
                  aspectRatioClass="aspect-[16/9]"
                />
              </div>

              <div className="px-4 sm:px-5 py-3.5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
                <span>
                  {currentLanguage === 'ko'
                    ? activeScreenshot.descKo
                    : activeScreenshot.descEn}
                </span>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              {t.staticNotice}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
