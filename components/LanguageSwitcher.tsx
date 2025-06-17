
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
  { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' }, // Added Swahili
  { code: 'pt', name: 'Português', flag: '🇵🇹' }, // Added Portuguese
  // Add more languages here
];

export const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = supportedLanguages.find(lang => lang.code === i18n.language) || supportedLanguages[0];

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
        // iconClass is removed, content is passed as children
        onClick={() => setIsOpen(!isOpen)}
        tooltip={t('tooltips.changeLanguage')}
        className="p-2 rounded-full text-white hover:bg-gray-700 text-sm md:text-base flex items-center"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="mr-1">{currentLanguage.flag}</span> {/* Flag emoji as a child */}
        <span className="text-xs hidden sm:inline">{currentLanguage.code.toUpperCase()}</span>
        <i className={`fas fa-chevron-down text-xs ml-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}></i>
      </IconButton>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg py-1 z-50"> {/* Increased width slightly for longer names */}
          {supportedLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-purple-600 ${
                i18n.language === lang.code ? 'bg-purple-700 text-white' : 'text-gray-200'
              }`}
            >
              <span className="mr-2">{lang.flag}</span>
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
