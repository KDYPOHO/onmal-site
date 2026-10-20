import { useState, useEffect } from 'react';
import { SupportedLanguage, translations } from './utils/i18n';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductExplanation } from './components/ProductExplanation';
import { HowItWorks } from './components/HowItWorks';
import { ScreenshotGallery } from './components/ScreenshotGallery';
import { DevelopmentSection } from './components/DevelopmentSection';
import { FaqSection } from './components/FaqSection';
import { VideoSection } from './components/VideoSection';
import { Footer } from './components/Footer';
import { LanguageModal } from './components/LanguageModal';

export default function App() {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(() => {
    try {
      return localStorage.getItem('onmal-lang') === 'en' ? 'en' : 'ko';
    } catch {
      return 'ko';
    }
  });
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [activeScreenshotId, setActiveScreenshotId] = useState<number | null>(null);

  // Sync document title and html lang attribute whenever language changes
  useEffect(() => {
    document.title = translations[currentLanguage].siteTitle;
    document.documentElement.lang = currentLanguage;
    // Share the existing language preference with the preserved legal pages.
    try { localStorage.setItem('onmal-lang', currentLanguage); } catch { /* Storage can be unavailable in private browsing. */ }
  }, [currentLanguage]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F19] text-[#F1F5F9] font-sans selection:bg-teal-500/30 selection:text-white">
      {/* Top Header */}
      <Header
        currentLanguage={currentLanguage}
        onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        <Hero
          currentLanguage={currentLanguage}
          onOpenScreenshot={(id) => setActiveScreenshotId(id)}
        />

        <ProductExplanation currentLanguage={currentLanguage} />

        <HowItWorks
          currentLanguage={currentLanguage}
          onOpenScreenshot={(id) => setActiveScreenshotId(id)}
        />

        <ScreenshotGallery
          currentLanguage={currentLanguage}
          activeScreenshotId={activeScreenshotId}
          onSelectScreenshot={(id) => setActiveScreenshotId(id)}
        />

        <DevelopmentSection currentLanguage={currentLanguage} />

        <FaqSection currentLanguage={currentLanguage} />

        <VideoSection currentLanguage={currentLanguage} videoSrc={null} />
      </main>

      {/* Site Footer */}
      <Footer
        currentLanguage={currentLanguage}
        onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
      />

      {/* Accessible Searchable Language Modal */}
      <LanguageModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        currentLanguage={currentLanguage}
        onSelectLanguage={(lang) => setCurrentLanguage(lang)}
      />
    </div>
  );
}
