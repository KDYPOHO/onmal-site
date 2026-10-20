import { useState, useRef, useCallback } from 'react';
import { Play, X } from 'lucide-react';
import { SupportedLanguage, translations } from '../utils/i18n';
import { useDialogFocus } from '../utils/focusTrap';

interface VideoSectionProps {
  currentLanguage: SupportedLanguage;
  videoSrc?: string | null;
  posterSrc?: string;
}

export function VideoSection({ currentLanguage, videoSrc = null, posterSrc }: VideoSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const t = translations[currentLanguage].video;

  const handleClose = useCallback(() => {
    setIsDialogOpen(false);
  }, []);

  useDialogFocus({
    isOpen: Boolean(videoSrc && isDialogOpen),
    containerRef: dialogRef,
    initialFocusRef: closeButtonRef,
    onClose: handleClose,
  });

  return (
    <section
      id="video"
      className="py-20 md:py-28 bg-[#0B0E17] border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-6">
          <p className="text-xs font-semibold tracking-wider text-teal-400">
            {t.kicker}
          </p>
        </div>

        {videoSrc ? (
          /* Open the player manually; mounting it does not start playback. */
          <div className="rounded-2xl overflow-hidden border border-white/15 bg-[#12151E]">
            <div className="relative aspect-[16/9] w-full flex items-center justify-center p-6 sm:p-8 text-center bg-black">
              {posterSrc && (
                <img
                  src={posterSrc}
                  alt=""
                  width={1920}
                  height={1080}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-contain"
                />
              )}
              <div aria-hidden="true" className="absolute inset-0 bg-black/40" />
              <button
                type="button"
                onClick={(e) => {
                  e.currentTarget.focus();
                  setIsDialogOpen(true);
                }}
                className="relative inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-[#F0B189] hover:bg-[#F5C09E] text-[#141218] font-bold text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                aria-label={t.playAria}
                aria-describedby="promo-video-description"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{t.playAria}</span>
              </button>
            </div>
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
                {t.title}
              </h2>
              <p id="promo-video-description" className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {t.desc}
              </p>
              <p className="mt-3 text-sm text-slate-400">{t.audioNotice}</p>
              <a
                href={videoSrc}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-sm text-teal-300 underline underline-offset-4 hover:text-teal-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded"
              >
                {t.directLink}
              </a>
            </div>
          </div>
        ) : (
          /* Non-Clickable Static Notice State (videoSrc === null) */
          <div
            className="rounded-2xl border border-white/10 bg-[#101420] p-8 sm:p-12 md:p-14"
            role="region"
            aria-label={t.title}
          >
            <div className="max-w-2xl">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4">
                {t.title}
              </h2>
              <p className="text-base text-slate-300 leading-relaxed">
                {t.desc}
              </p>
            </div>
          </div>
        )}

        {/* Accessible 16:9 (1920x1080) Video Dialog (enabled when videoSrc is set) */}
        {videoSrc && isDialogOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label={t.modalTitle}
            aria-describedby="promo-video-dialog-description"
            onClick={handleClose}
          >
            <div
              ref={dialogRef}
              tabIndex={-1}
              className="relative w-full max-w-5xl max-h-[calc(100dvh-2rem)] bg-[#0E1320] rounded-2xl overflow-y-auto border border-white/20 focus:outline-none"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-[#0B0E17]">
                <span className="text-sm font-bold text-white">{t.modalTitle}</span>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={handleClose}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                  aria-label={t.closeModal}
                >
                  <span>{t.closeModal}</span>
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="aspect-[16/9] w-full bg-black">
                <video
                  src={videoSrc}
                  width={1920}
                  height={1080}
                  controls
                  playsInline
                  preload="metadata"
                  poster={posterSrc}
                  aria-label={t.modalTitle}
                  aria-describedby="promo-video-dialog-description"
                  className="w-full h-full object-contain"
                >
                  <a href={videoSrc}>{t.directLink}</a>
                </video>
              </div>
              <div className="px-5 py-4 text-sm text-slate-300 leading-relaxed">
                <p id="promo-video-dialog-description">{t.desc}</p>
                <p className="mt-2 text-slate-400">{t.audioNotice}</p>
                <a href={videoSrc} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-teal-300 underline underline-offset-4 hover:text-teal-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded">
                  {t.directLink}
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
