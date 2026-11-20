import { useState } from 'react';
import { ExternalLink, Maximize2 } from 'lucide-react';
import { LINKS, SCREENSHOTS, SHOT_SIZES } from '../constants/assets';
import { SupportedLanguage, translations } from '../utils/i18n';

interface HeroProps {
  lang: SupportedLanguage;
  onOpenScreenshot: (id: number) => void;
}

/**
 * The first screen shows what Onmal does with its own tagline: the line in the
 * other language is "heard", then the headline appears as a subtitle.
 */
export function Hero({ lang, onOpenScreenshot }: HeroProps) {
  const t = translations[lang].hero;
  const other: SupportedLanguage = lang === 'ko' ? 'en' : 'ko';
  const heard = translations[other].hero.headline.replace('\n', ' ');
  const [shotId, setShotId] = useState(1);
  const shot = SCREENSHOTS.find((s) => s.id === shotId) ?? SCREENSHOTS[0];
  const size = SHOT_SIZES[shot.id];
  const statusItems = t.unreleasedNotice.split(' · ');

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-glow" aria-hidden="true" />
      <div className="wrap">
        <p className="heard" aria-hidden="true">
          <span className="bars"><i /><i /><i /><i /><i /></span>
          <span className="lang-chip">{other.toUpperCase()}</span>
          <span lang={other}>{heard}</span>
        </p>
        <h1 id="hero-title">
          {t.headline.split('\n').map((line) => (
            <span className="caption-line" key={line}><span>{line}</span></span>
          ))}
        </h1>

        <div className="hero-after">
          <p className="hero-supporting">{t.supporting}</p>
          <div className="hero-ctas">
            <a className="btn btn-primary" href={LINKS.steam} target="_blank" rel="noopener noreferrer">
              {t.ctaSteam}
              <ExternalLink aria-hidden="true" />
            </a>
            <a className="btn btn-ghost" href={LINKS.discord} target="_blank" rel="noopener noreferrer">
              {t.ctaDiscord}
              <ExternalLink aria-hidden="true" />
            </a>
          </div>
          <ul className="status-list" aria-label={t.statusListLabel}>
            <li>{t.statusBadge}</li>
            {statusItems.map((item) => <li key={item}>{item}</li>)}
          </ul>

          <div className="hero-shot">
            <div className="shot-toolbar">
              <p>{t.heroImageCaption}</p>
              <div className="segmented" role="group" aria-label={t.heroImageCaption}>
                <button type="button" aria-pressed={shotId === 1} onClick={() => setShotId(1)}>{t.themeSwitchDark}</button>
                <button type="button" aria-pressed={shotId === 4} onClick={() => setShotId(4)}>{t.themeSwitchIvory}</button>
              </div>
            </div>
            <button type="button" className="window-frame" onClick={() => onOpenScreenshot(shot.id)}>
              <img
                src={shot.url}
                alt={lang === 'ko' ? shot.altKo : shot.altEn}
                width={size.width}
                height={size.height}
                fetchPriority="high"
              />
              <span className="zoom-hint"><Maximize2 aria-hidden="true" />{t.inspectFullSize}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
