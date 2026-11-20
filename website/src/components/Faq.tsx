import { Plus } from 'lucide-react';
import { SupportedLanguage, translations } from '../utils/i18n';

export function Faq({ lang }: { lang: SupportedLanguage }) {
  const t = translations[lang].faq;
  return (
    <section className="section" id="faq" aria-labelledby="faq-title">
      <div className="wrap faq-grid">
        <div className="section-head">
          <h2 id="faq-title">{t.title}</h2>
        </div>
        <div className="faq-list">
          {t.items.map((item) => (
            <details className="faq-item" key={item.question}>
              <summary>{item.question}<Plus aria-hidden="true" /></summary>
              <p className="answer">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
