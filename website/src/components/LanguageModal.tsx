import { useState, useEffect, useRef } from 'react';
import { Search, X, Check, Globe } from 'lucide-react';
import {
  SupportedLanguage,
  SUPPORTED_LANGUAGES,
  filterLanguages,
  translations,
} from '../utils/i18n';
import { useDialogFocus } from '../utils/focusTrap';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
}

export function LanguageModal({
  isOpen,
  onClose,
  currentLanguage,
  onSelectLanguage,
}: LanguageModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const t = translations[currentLanguage].langModal;

  const filtered = filterLanguages(searchQuery, SUPPORTED_LANGUAGES);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  useDialogFocus({
    isOpen,
    containerRef: dialogRef,
    initialFocusRef: inputRef,
    onClose,
  });

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="language-modal-title"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="w-full max-w-md bg-[#0E1320] border border-white/15 rounded-2xl p-6 relative focus:outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <Globe className="w-4 h-4 text-teal-400" />
            <h2 id="language-modal-title" className="text-base font-bold text-white">
              {t.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
            aria-label={t.close}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 relative">
          <label htmlFor="language-search-input" className="sr-only">
            {t.searchAria}
          </label>
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="language-search-input"
            ref={inputRef}
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            aria-label={t.searchAria}
            className="w-full pl-10 pr-4 py-2.5 bg-[#090C14] border border-white/15 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition"
          />
        </div>

        <div className="mt-4 space-y-2" role="listbox" aria-label={t.title}>
          {filtered.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-400">{t.noResults}</p>
          ) : (
            filtered.map((lang) => {
              const isSelected = currentLanguage === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onSelectLanguage(lang.code);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${
                    isSelected
                      ? 'bg-teal-500/15 border-teal-500/40 text-white'
                      : 'bg-[#121828] border-white/10 text-slate-200 hover:bg-[#182036]'
                  }`}
                >
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-sm text-white">
                      {lang.nativeName}
                    </span>
                    <span className="text-xs text-slate-400">
                      {lang.name}
                    </span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-teal-400 shrink-0" />}
                </button>
              );
            })
          )}
        </div>

        <p className="mt-4 pt-3 border-t border-white/10 text-xs text-slate-400">
          {t.supportedNote}
        </p>
      </div>
    </div>
  );
}
