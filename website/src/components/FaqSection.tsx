import { SupportedLanguage, translations } from '../utils/i18n';

export function FaqSection({ currentLanguage }: { currentLanguage: SupportedLanguage }) {
  const t = translations[currentLanguage].faq;

  return (
    <section id="faq" className="py-20 md:py-28 bg-[#0B0F19] text-[#F1F5F9] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold tracking-wider text-teal-400 mb-3">{t.kicker}</p>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-snug mb-10">{t.title}</h2>
        <div className="border-t border-white/15 divide-y divide-white/15">
          {t.items.map((item) => (
            <details key={item.question} className="group py-5 sm:py-6">
              <summary className="cursor-pointer text-base sm:text-lg font-semibold text-white rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400">
                {item.question}
              </summary>
              <p className="mt-4 max-w-4xl text-sm sm:text-base leading-relaxed text-slate-300">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
