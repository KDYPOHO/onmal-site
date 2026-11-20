import { AudioLines, Captions, Cpu, ShieldCheck, Users } from 'lucide-react';
import { SupportedLanguage, translations } from '../utils/i18n';

const ICONS = [Cpu, AudioLines, Captions, Users];

export function Features({ lang }: { lang: SupportedLanguage }) {
  const t = translations[lang].features;
  return (
    <section className="section" id="features" aria-labelledby="features-title">
      <div className="wrap">
        <div className="features-grid">
          <div>
            <div className="section-head">
              <h2 id="features-title">{t.title}</h2>
              <p>{t.subtitle}</p>
            </div>
            <div className="local-panel">
              <h3><ShieldCheck aria-hidden="true" />{t.localProcessingLabel}</h3>
              <p>{t.localProcessingExact}</p>
              <p>{t.localProcessingSub}</p>
            </div>
          </div>
          <ul className="feature-list">
            {t.items.map((item, index) => {
              const Icon = ICONS[index] ?? Captions;
              return (
                <li className="feature" key={item.title}>
                  <span className="feature-icon" aria-hidden="true"><Icon /></span>
                  <div>
                    <h3>{item.title}</h3>
                    <p className="meta">{item.meta}</p>
                    <p className="desc">{item.desc}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <p className="scope-note"><strong>{t.scopeLabel}</strong><span>{t.scopeText}</span></p>
      </div>
    </section>
  );
}
