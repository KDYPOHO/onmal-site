import { SupportedLanguage, translations } from '../utils/i18n';

interface ProductExplanationProps {
  currentLanguage: SupportedLanguage;
}

export function ProductExplanation({ currentLanguage }: ProductExplanationProps) {
  const t = translations[currentLanguage].features;

  return (
    <section
      id="features"
      className="py-20 md:py-28 bg-[#F7F4EE] text-[#14161F] border-b border-[#E2DDD2]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="max-w-3xl mb-16">
          <p className="text-xs font-semibold tracking-wider text-[#0F766E] mb-3">
            {t.kicker}
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#12151E] tracking-tight leading-snug">
            {t.title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#454A59] leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Architectural Editorial List (Avoiding template card grids) */}
        <div className="border-t border-[#DCD6C8] divide-y divide-[#DCD6C8]">
          {t.items.map((item) => (
            <div
              key={item.num}
              className="py-8 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-baseline"
            >
              <div className="lg:col-span-5 flex items-baseline gap-4">
                <span className="font-mono text-sm font-bold text-[#0F766E] tabular-nums shrink-0">
                  {item.num}.
                </span>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#12151E] tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-xs font-medium text-[#646A7A]">
                    {item.meta}
                  </p>
                </div>
              </div>

              <div className="lg:col-span-7 lg:pl-4">
                <p className="text-base text-[#2D3240] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Local Processing Architecture & Honest Scope Notice */}
        <div className="mt-14 pt-12 border-t border-[#DCD6C8] grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Mandatory Exact Statement on Local PC Processing */}
          <div className="lg:col-span-7 rounded-2xl bg-[#12151E] text-[#F5F2EB] p-7 sm:p-9 border border-[#12151E]">
            <p className="text-xs font-semibold tracking-wider text-teal-400 mb-3">
              {t.localProcessingLabel}
            </p>
            <p className="text-lg sm:text-xl font-bold text-white leading-relaxed">
              {t.localProcessingExact}
            </p>
            <p className="mt-4 text-sm text-slate-300 leading-relaxed">
              {t.localProcessingSub}
            </p>
          </div>

          {/* Honest Scope & No Fabricated Performance Claims */}
          <div className="lg:col-span-5 rounded-2xl bg-[#EFECE4] p-7 sm:p-9 border border-[#DCD6C8] flex flex-col justify-center">
            <p className="text-xs font-semibold tracking-wider text-[#8C4A27] mb-2.5">
              {t.scopeLabel}
            </p>
            <p className="text-sm sm:text-base text-[#2D3240] leading-relaxed">
              {t.scopeText}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
