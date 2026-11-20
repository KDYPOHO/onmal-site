import { SupportedLanguage, translations } from '../utils/i18n';

export function NameBand({ lang }: { lang: SupportedLanguage }) {
  const t = translations[lang].nameBand;
  return (
    <section className="name-band" aria-labelledby="name-title">
      <div className="wrap">
        <h2 className="section-label" id="name-title">{t.title}</h2>
        <div className="name-grid">
          <p className="glyph on"><b lang="ko">온</b><span>{t.onGloss}</span></p>
          <p className="glyph mal"><b lang="ko">말</b><span>{t.malGloss}</span></p>
          <div className="name-sentence">
            <p className="big">{t.sentence}</p>
            <p className="small">{t.romanNote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
