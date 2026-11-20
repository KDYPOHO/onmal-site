import { useState } from 'react';
import { Maximize2 } from 'lucide-react';
import { SCREENSHOTS, SHOT_SIZES } from '../constants/assets';
import { SupportedLanguage, translations } from '../utils/i18n';

interface HowItWorksProps {
  lang: SupportedLanguage;
  onOpenScreenshot: (id: number) => void;
}

export function HowItWorks({ lang, onOpenScreenshot }: HowItWorksProps) {
  const t = translations[lang].howItWorks;
  const [active, setActive] = useState(0);
  const step = t.steps[active];
  const shot = SCREENSHOTS.find((s) => s.id === step.screenshotId) ?? SCREENSHOTS[0];
  const size = SHOT_SIZES[shot.id];

  return (
    <section className="section" id="how-it-works" aria-labelledby="how-title">
      <div className="wrap">
        <div className="section-head">
          <h2 id="how-title">{t.title}</h2>
          <p>{t.subtitle}</p>
        </div>
        <div className="how-grid">
          <ol className="steps">
            {t.steps.map((item, index) => (
              <li key={item.title}>
                <button
                  type="button"
                  className="step-button"
                  aria-pressed={active === index}
                  aria-controls="step-preview"
                  onClick={() => setActive(index)}
                >
                  <span className="step-num" aria-hidden="true">{index + 1}</span>
                  <span>
                    <span className="step-title">{item.title}</span>
                    <span className="step-ui">{item.uiLabel}</span>
                    <span className="step-desc">{item.desc}</span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <figure className="step-preview" id="step-preview" aria-live="polite">
            <button type="button" className="window-frame" onClick={() => onOpenScreenshot(shot.id)}>
              <img
                src={shot.url}
                alt={lang === 'ko' ? shot.altKo : shot.altEn}
                width={size.width}
                height={size.height}
                loading="lazy"
                decoding="async"
              />
              <span className="zoom-hint"><Maximize2 aria-hidden="true" />{t.viewCapture}</span>
            </button>
            <figcaption>{lang === 'ko' ? shot.titleKo : shot.titleEn}</figcaption>
          </figure>
        </div>
        <p className="static-notice">{t.staticNotice}</p>
      </div>
    </section>
  );
}
