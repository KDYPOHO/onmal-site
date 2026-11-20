import { useEffect, useState } from 'react';
import { SupportedLanguage, translations } from './utils/i18n';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { HowItWorks } from './components/HowItWorks';
import { Gallery } from './components/Gallery';
import { NameBand } from './components/NameBand';
import { Development } from './components/Development';
import { Faq } from './components/Faq';
import { Video } from './components/Video';
import { Footer } from './components/Footer';

function initialLanguage(): SupportedLanguage {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('lang');
    if (fromUrl === 'en' || fromUrl === 'ko') return fromUrl;
    const saved = localStorage.getItem('onmal-lang');
    if (saved === 'en' || saved === 'ko') return saved;
  } catch {
    /* Storage can be unavailable in private browsing. */
  }
  return 'ko';
}

export default function App() {
  const [lang, setLang] = useState<SupportedLanguage>(initialLanguage);
  const [activeShot, setActiveShot] = useState<number | null>(null);

  useEffect(() => {
    document.title = translations[lang].siteTitle;
    document.documentElement.lang = lang;
    // Shared with the preserved legal pages.
    try { localStorage.setItem('onmal-lang', lang); } catch { /* ignore */ }
  }, [lang]);

  return (
    <>
      <a className="skip-link" href="#main">{translations[lang].nav.skip}</a>
      <Header lang={lang} onChangeLanguage={setLang} />
      <main id="main" tabIndex={-1}>
        <Hero lang={lang} onOpenScreenshot={setActiveShot} />
        <Features lang={lang} />
        <HowItWorks lang={lang} onOpenScreenshot={setActiveShot} />
        <Gallery lang={lang} activeId={activeShot} onSelect={setActiveShot} />
        <NameBand lang={lang} />
        <Development lang={lang} />
        <Faq lang={lang} />
        <Video lang={lang} />
      </main>
      <Footer lang={lang} />
    </>
  );
}
