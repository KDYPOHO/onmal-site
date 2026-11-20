import { ExternalLink } from 'lucide-react';
import { BRAND, LINKS } from '../constants/assets';
import { SupportedLanguage, translations } from '../utils/i18n';

export function Development({ lang }: { lang: SupportedLanguage }) {
  const t = translations[lang].development;
  const team = translations[lang].footer.team;
  // The last spec is the developer's note about pace; it is shown as a signed note.
  const specs = t.specs.slice(0, -1);
  const note = t.specs[t.specs.length - 1];
  const nextIndex = specs.findIndex((spec) => spec.label.includes('0.1.0') && !spec.label.includes('Windows'));

  return (
    <section className="section" id="development" aria-labelledby="dev-title">
      <div className="wrap">
        <div className="dev-top">
          <div className="section-head">
            <h2 id="dev-title">{t.title}</h2>
            <p>{t.leadParagraph}</p>
          </div>
          <div className="status-board">
            <h3>{t.statusLabel}</h3>
            <ul>
              <li><span className="dot live" aria-hidden="true" />{t.playtestStatus}</li>
              <li><span className="dot next" aria-hidden="true" />{t.versionStatus}</li>
              <li><span className="dot wait" aria-hidden="true" />{t.releaseDateStatus}</li>
            </ul>
          </div>
        </div>

        <h3 className="sr-only">{t.specsLabel}</h3>
        <dl className="specs">
          {specs.map((spec, index) => (
            <div className={`spec${index === nextIndex ? ' highlight' : ''}`} key={spec.label}>
              <dt>{spec.label}</dt>
              <dd>
                <span className="value">{spec.value}</span>
                <p>{spec.detail}</p>
              </dd>
            </div>
          ))}
        </dl>

        <div className="dev-note">
          <img src={BRAND.mark192} alt="" width={64} height={64} />
          <div>
            <h3>{note.value}</h3>
            <p>{note.detail}</p>
            <p className="sign">{team}</p>
          </div>
        </div>

        <div className="dev-ctas">
          <a className="btn btn-primary" href={LINKS.steam} target="_blank" rel="noopener noreferrer">{t.ctaSteamFollow}<ExternalLink aria-hidden="true" /></a>
          <a className="btn btn-ghost" href={LINKS.discord} target="_blank" rel="noopener noreferrer">{t.ctaDiscordJoin}<ExternalLink aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  );
}
