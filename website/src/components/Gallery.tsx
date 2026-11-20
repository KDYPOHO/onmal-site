import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SCREENSHOTS, SHOT_SIZES } from '../constants/assets';
import { SupportedLanguage, translations } from '../utils/i18n';
import { Viewer } from './Viewer';

interface GalleryProps {
  lang: SupportedLanguage;
  activeId: number | null;
  onSelect: (id: number | null) => void;
}

export function Gallery({ lang, activeId, onSelect }: GalleryProps) {
  const t = translations[lang].gallery;
  const track = useRef<HTMLDivElement>(null);
  const ko = lang === 'ko';
  const index = SCREENSHOTS.findIndex((s) => s.id === activeId);
  const active = index >= 0 ? SCREENSHOTS[index] : null;

  const scrollBy = (direction: number) => {
    const el = track.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: reduce ? 'auto' : 'smooth' });
  };
  const step = (direction: number) => {
    if (index < 0) return;
    const next = (index + direction + SCREENSHOTS.length) % SCREENSHOTS.length;
    onSelect(SCREENSHOTS[next].id);
  };

  return (
    <section className="section" id="screenshots" aria-labelledby="gallery-title">
      <div className="wrap">
        <div className="gallery-head section-head" style={{ maxWidth: 'none' }}>
          <div style={{ maxWidth: '44rem' }}>
            <h2 id="gallery-title">{t.title}</h2>
            <p>{t.subtitle}</p>
          </div>
          <div className="gallery-nav">
            <button type="button" className="icon-btn" onClick={() => scrollBy(-1)} aria-label={t.prev}><ChevronLeft aria-hidden="true" /></button>
            <button type="button" className="icon-btn" onClick={() => scrollBy(1)} aria-label={t.next}><ChevronRight aria-hidden="true" /></button>
          </div>
        </div>
        <div className="gallery-track" ref={track}>
          {SCREENSHOTS.map((shot) => {
            const size = SHOT_SIZES[shot.id];
            const width = Math.round((size.width / size.height) * 400);
            return (
              <figure className="gallery-item" key={shot.id} style={{ ['--w' as string]: `${width}px` }}>
                <button type="button" onClick={() => onSelect(shot.id)} aria-label={`${t.openLightbox}: ${ko ? shot.titleKo : shot.titleEn}`}>
                  <img src={shot.url} alt={ko ? shot.altKo : shot.altEn} width={size.width} height={size.height} loading="lazy" decoding="async" />
                </button>
                <figcaption>{ko ? shot.titleKo : shot.titleEn}</figcaption>
              </figure>
            );
          })}
        </div>
      </div>

      <Viewer
        open={active !== null}
        title={active ? (ko ? active.titleKo : active.titleEn) : ''}
        closeLabel={t.closeLightbox}
        onClose={() => onSelect(null)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') step(1);
          if (event.key === 'ArrowLeft') step(-1);
        }}
      >
        {active && (
          <>
            <div className="viewer-body">
              <img
                src={active.url}
                alt={ko ? active.altKo : active.altEn}
                width={SHOT_SIZES[active.id].width}
                height={SHOT_SIZES[active.id].height}
              />
              <p>{ko ? active.descKo : active.descEn}</p>
            </div>
            <div className="viewer-foot">
              <button type="button" className="icon-btn" onClick={() => step(-1)} aria-label={t.prev}><ChevronLeft aria-hidden="true" /></button>
              <span aria-live="polite">{t.counterLabel} {index + 1} / {SCREENSHOTS.length}</span>
              <button type="button" className="icon-btn" onClick={() => step(1)} aria-label={t.next}><ChevronRight aria-hidden="true" /></button>
            </div>
            <p className="sr-only">{t.zoomHint}</p>
          </>
        )}
      </Viewer>
    </section>
  );
}
