import { Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
      className="p-2 glass-card rounded-full hover:scale-110 transition-all duration-300 flex items-center gap-2"
      aria-label="Toggle language"
      title={language === 'fr' ? 'Switch to English' : 'Passer au français'}
    >
      <Globe className="w-5 h-5 text-[#5a03cf] dark:text-[#9cff02]" />
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 uppercase">
        {language === 'fr' ? 'EN' : 'FR'}
      </span>
    </button>
  );
}