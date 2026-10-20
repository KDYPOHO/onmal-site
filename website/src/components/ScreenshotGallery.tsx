import { useEffect, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { SCREENSHOTS } from '../constants/assets';
import { SupportedLanguage, translations } from '../utils/i18n';
import { useDialogFocus } from '../utils/focusTrap';
import { SafeImage } from './SafeImage';

interface ScreenshotGalleryProps {
  currentLanguage: SupportedLanguage;
  activeScreenshotId: number | null;
  onSelectScreenshot: (id: number | null) => void;
}

export function ScreenshotGallery({
  currentLanguage,
  activeScreenshotId,
  onSelectScreenshot,
}: ScreenshotGalleryProps) {
  const t = translations[currentLanguage].gallery;
  const commonT = translations[currentLanguage].common;
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const activeIndex = SCREENSHOTS.findIndex((s) => s.id === activeScreenshotId);
  const activeItem = activeIndex >= 0 ? SCREENSHOTS[activeIndex] : null;
  const isOpen = activeItem !== null;

  const handleClose = useCallback(() => {
    onSelectScreenshot(null);
  }, [onSelectScreenshot]);

  const handlePrev = useCallback(() => {
    if (activeIndex > 0) {
      onSelectScreenshot(SCREENSHOTS[activeIndex - 1].id);
    } else {
      onSelectScreenshot(SCREENSHOTS[SCREENSHOTS.length - 1].id);
    }
  }, [activeIndex, onSelectScreenshot]);

  const handleNext = useCallback(() => {
    if (activeIndex < SCREENSHOTS.length - 1) {
      onSelectScreenshot(SCREENSHOTS[activeIndex + 1].id);
    } else {
      onSelectScreenshot(SCREENSHOTS[0].id);
    }
  }, [activeIndex, onSelectScreenshot]);

  useDialogFocus({
    isOpen,
    containerRef: dialogRef,
    initialFocusRef: closeButtonRef,
    onClose: handleClose,
  });

  useEffect(() => {
    if (!isOpen) return;

    const handleArrowKeys = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleArrowKeys);
    return () => window.removeEventListener('keydown', handleArrowKeys);
  }, [isOpen, handlePrev, handleNext]);

  return (
    <section
      id="screenshots"
      className="py-20 md:py-28 bg-[#090C14] border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
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

        {/* Asymmetric Editorial Showcase of the 5 Official Screenshots */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SCREENSHOTS.map((item, idx) => {
            const isFeatured = idx === 0;
            const title = currentLanguage === 'ko' ? item.titleKo : item.titleEn;
            const desc = currentLanguage === 'ko' ? item.descKo : item.descEn;
            const alt = currentLanguage === 'ko' ? item.altKo : item.altEn;

            return (
              <figure
                key={item.id}
                className={`group rounded-2xl bg-[#0F1422] border border-white/10 overflow-hidden hover:border-teal-400/40 transition-colors flex flex-col justify-between ${
                  isFeatured ? 'md:col-span-2' : ''
                }`}
              >
                <div
                  className="cursor-pointer relative overflow-hidden bg-[#12151E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                  onClick={(e) => {
                    e.currentTarget.focus();
                    onSelectScreenshot(item.id);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectScreenshot(item.id);
                    }
                  }}
                  aria-label={`${title} — ${t.openLightbox}`}
                >
                  <SafeImage
                    src={item.url}
                    alt={alt}
                    fallbackText={commonT.imageFallback}
                    retryText={commonT.retry}
                    aspectRatioClass="aspect-[16/9]"
                  />
                </div>

                <figcaption className="p-5 sm:p-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
                  <div>
                    <div className="flex items-baseline gap-2.5">
                      <span className="font-mono text-xs font-bold text-teal-400 tabular-nums">
                        0{item.id}.
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                        {title}
                      </h3>
                    </div>
                    <p className="mt-1.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {desc}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.currentTarget.focus();
                      onSelectScreenshot(item.id);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-300 hover:text-teal-200 transition-colors whitespace-nowrap shrink-0 self-start sm:self-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded px-1 py-0.5"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>{t.openLightbox}</span>
                  </button>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>

      {/* Accessible Lightbox Modal */}
      {activeItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={currentLanguage === 'ko' ? activeItem.titleKo : activeItem.titleEn}
          onClick={handleClose}
        >
          <div
            ref={dialogRef}
            tabIndex={-1}
            className="relative w-full max-w-6xl max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-3rem)] md:max-h-[calc(100dvh-4rem)] flex flex-col bg-[#0E1320] border border-white/15 rounded-2xl overflow-y-auto focus:outline-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="sticky top-0 z-10 shrink-0 flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-[#0B0E17]">
              <div className="flex items-baseline gap-3 truncate">
                <span className="font-mono text-xs font-bold text-teal-400 tabular-nums shrink-0">
                  {activeIndex + 1} / {SCREENSHOTS.length}
                </span>
                <span className="text-sm font-bold text-white truncate">
                  {currentLanguage === 'ko' ? activeItem.titleKo : activeItem.titleEn}
                </span>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={handleClose}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                aria-label={t.closeLightbox}
              >
                <span>{t.closeLightbox}</span>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Main Contained 16:9 Frame */}
            <div className="relative shrink-0 bg-[#12151E] flex items-center justify-center p-2 sm:p-4">
              <div className="w-full max-h-[70vh] aspect-[16/9] flex items-center justify-center">
                <img
                  src={activeItem.url}
                  alt={currentLanguage === 'ko' ? activeItem.altKo : activeItem.altEn}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain rounded"
                />
              </div>

              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 p-2.5 rounded-lg bg-[#0B0E17]/85 hover:bg-[#0B0E17] text-white border border-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                aria-label={t.prev}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 p-2.5 rounded-lg bg-[#0B0E17]/85 hover:bg-[#0B0E17] text-white border border-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                aria-label={t.next}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Bottom Caption & Keyboard Hint */}
            <div className="shrink-0 px-5 py-3.5 border-t border-white/10 bg-[#0B0E17] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <p className="text-slate-200">
                {currentLanguage === 'ko' ? activeItem.descKo : activeItem.descEn}
              </p>
              <span className="text-slate-400 shrink-0">
                {t.zoomHint}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
