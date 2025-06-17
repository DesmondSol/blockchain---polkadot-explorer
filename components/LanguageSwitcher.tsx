
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton } from './IconButton';

interface Language {
  code: string;
  name: string;
  flag: string; // Emoji flag
}

const supportedLanguages: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'am', name: 'አማርኛ', flag: '🇪🇹' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' }, 
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' }, // Added Arabic
];

export const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = supportedLanguages.find(lang => lang.code === i18n.language) || supportedLanguages[0];
  const isRtl = i18n.language === 'ar';

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <IconButton
        onClick={() => setIsOpen(!isOpen)}
        tooltip={t('tooltips.changeLanguage')}
        className={`p-2 rounded-full text-white hover:bg-gray-700 text-sm md:text-base flex items-center ${isRtl ? 'flex-row-reverse' : ''}`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className={`${isRtl ? 'ml-1' : 'mr-1'}`}>{currentLanguage.flag}</span>
        <span className="text-xs hidden sm:inline">{currentLanguage.code.toUpperCase()}</span>
        <i className={`fas fa-chevron-down text-xs ${isRtl ? 'mr-1' : 'ml-1'} transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}></i>
      </IconButton>
      {isOpen && (
        <div className={`absolute mt-2 w-48 bg-gray-700 rounded-md shadow-lg py-1 z-50 ${isRtl ? 'left-0' : 'right-0'}`}>
          {supportedLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full px-4 py-2 text-sm hover:bg-purple-600 flex items-center ${isRtl ? 'flex-row-reverse justify-end text-right' : 'text-left'} ${
                i18n.language === lang.code ? 'bg-purple-700 text-white' : 'text-gray-200'
              }`}
            >
              <span className={`${isRtl ? 'ml-2' : 'mr-2'}`}>{lang.flag}</span>
              <span className="flex-grow">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
