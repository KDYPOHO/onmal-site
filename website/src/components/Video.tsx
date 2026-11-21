import { useState } from 'react';
import { Play } from 'lucide-react';
import { MEDIA } from '../constants/assets';
import { SupportedLanguage, translations } from '../utils/i18n';
import { Viewer } from './Viewer';

export function Video({ lang }: { lang: SupportedLanguage }) {
  const t = translations[lang].video;
  const [open, setOpen] = useState(false);
  return (
    <section className="section" id="video" aria-labelledby="video-title">
      <div className="wrap video-grid">
        <button type="button" className="video-poster" onClick={() => setOpen(true)} aria-label={t.playAria}>
          <img src={MEDIA.poster} alt="" width={1920} height={1080} loading="lazy" decoding="async" />
          <span className="play-disc" aria-hidden="true"><Play /></span>
        </button>
        <div className="video-copy">
          <h2 id="video-title">{t.title}</h2>
          <p>{t.desc}</p>
          <p className="notice">{t.audioNotice}</p>
          <details className="video-transcript">
            <summary>{t.transcriptLabel}</summary>
            <p>{t.transcript}</p>
          </details>
        </div>
      </div>
      <Viewer open={open} title={t.modalTitle} closeLabel={t.closeModal} onClose={() => setOpen(false)}>
        <div className="viewer-body">
          <video controls playsInline preload="metadata" poster={MEDIA.poster}>
            <source src={MEDIA.video} type="video/mp4" />
          </video>
          <details className="video-transcript">
            <summary>{t.transcriptLabel}</summary>
            <p>{t.transcript}</p>
          </details>
          <p><a href={MEDIA.video} target="_blank" rel="noopener noreferrer">{t.directLink}</a></p>
        </div>
      </Viewer>
    </section>
  );
}
