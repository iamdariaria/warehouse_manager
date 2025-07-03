import React, { useState } from 'react';
import Icon from '../AppIcon';

const LanguageToggle = ({ currentLanguage = 'en', onLanguageChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸'
    },
    {
      code: 'ru',
      name: 'Russian',
      nativeName: 'Русский',
      flag: '🇷🇺'
    }
  ];

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  const handleLanguageSelect = (languageCode) => {
    setIsOpen(false);
    if (onLanguageChange) {
      onLanguageChange(languageCode);
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleKeyDown = (event, action) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  return (
    <div className="relative">
      {/* Language Toggle Button */}
      <button
        onClick={handleToggle}
        onKeyDown={(e) => handleKeyDown(e, handleToggle)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-secondary-50 rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-touch min-w-touch"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Select language"
        title="Change language"
      >
        <span className="text-base">{currentLang.flag}</span>
        <span className="font-body">{currentLang.code.toUpperCase()}</span>
        <Icon 
          name="ChevronDown" 
          size={14} 
          className={`transition-smooth ${isOpen ? 'rotate-180' : ''}`}
          strokeWidth={2}
        />
      </button>

      {/* Language Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-100"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-surface rounded-lg shadow-modal border border-border z-200">
            <div className="py-2">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageSelect(language.code)}
                  onKeyDown={(e) => handleKeyDown(e, () => handleLanguageSelect(language.code))}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 text-left transition-smooth
                    min-h-touch hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset
                    ${currentLanguage === language.code
                      ? 'text-primary bg-primary-50 border-r-2 border-primary' :'text-text-secondary hover:text-text-primary'
                    }
                  `}
                  role="menuitem"
                  aria-selected={currentLanguage === language.code}
                >
                  <span className="text-lg">{language.flag}</span>
                  <div className="flex flex-col">
                    <span className="font-medium font-body">{language.name}</span>
                    <span className="text-xs text-text-muted font-body">
                      {language.nativeName}
                    </span>
                  </div>
                  {currentLanguage === language.code && (
                    <Icon 
                      name="Check" 
                      size={16} 
                      className="text-primary ml-auto"
                      strokeWidth={2}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageToggle;