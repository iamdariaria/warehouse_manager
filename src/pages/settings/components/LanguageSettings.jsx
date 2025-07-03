import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const LanguageSettings = ({ onNotification }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [numberFormat, setNumberFormat] = useState('decimal');

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' }
  ];

  const dateFormats = [
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (US Format)' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (European Format)' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (ISO Format)' }
  ];

  const numberFormats = [
    { value: 'decimal', label: 'Decimal Point (1,234.56)' },
    { value: 'comma', label: 'Comma Separator (1.234,56)' }
  ];

  const handleLanguageChange = (languageCode) => {
    setCurrentLanguage(languageCode);
    const selectedLang = languages.find(lang => lang.code === languageCode);
    onNotification('success', `Interface language changed to ${selectedLang.name}`, 'Language Updated');
  };

  const handleSaveSettings = () => {
    // Save language and regional settings
    const settings = {
      language: currentLanguage,
      dateFormat,
      numberFormat
    };
    
    // Mock save to localStorage
    localStorage.setItem('warehouseSettings', JSON.stringify(settings));
    
    onNotification('success', 'Language and regional settings saved successfully', 'Settings Saved');
  };

  return (
    <div className="space-y-6">
      {/* Language Selection */}
      <div>
        <label className="block text-sm font-medium text-text-primary font-body mb-3">
          Interface Language
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`
                flex items-center space-x-3 p-4 rounded-lg border transition-smooth
                ${currentLanguage === language.code
                  ? 'border-primary bg-primary-50 text-primary' :'border-border bg-surface text-text-secondary hover:border-primary-300 hover:bg-primary-50'
                }
              `}
            >
              <span className="text-2xl">{language.flag}</span>
              <div className="text-left">
                <div className="font-medium font-body">{language.name}</div>
                <div className="text-sm opacity-75 font-body">{language.nativeName}</div>
              </div>
              {currentLanguage === language.code && (
                <Icon name="Check" size={20} className="ml-auto text-primary" strokeWidth={2} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Currency Display */}
      <div>
        <label className="block text-sm font-medium text-text-primary font-body mb-3">
          Currency Format
        </label>
        <div className="p-4 bg-secondary-50 rounded-lg border border-border">
          <div className="flex items-center space-x-2">
            <Icon name="DollarSign" size={20} color="var(--color-primary)" strokeWidth={2} />
            <span className="text-text-primary font-body">USD (United States Dollar)</span>
          </div>
          <div className="mt-2 text-sm text-text-secondary font-body">
            Format: $1,234.56 USD
          </div>
        </div>
      </div>

      {/* Date Format */}
      <div>
        <label className="block text-sm font-medium text-text-primary font-body mb-3">
          Date Format
        </label>
        <select
          value={dateFormat}
          onChange={(e) => setDateFormat(e.target.value)}
          className="w-full px-4 py-3 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-body"
        >
          {dateFormats.map((format) => (
            <option key={format.value} value={format.value}>
              {format.label}
            </option>
          ))}
        </select>
        <div className="mt-2 text-sm text-text-secondary font-body">
          Preview: {new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: dateFormat.includes('MM') ? '2-digit' : 'numeric',
            day: '2-digit'
          })}
        </div>
      </div>

      {/* Number Format */}
      <div>
        <label className="block text-sm font-medium text-text-primary font-body mb-3">
          Number Format
        </label>
        <div className="space-y-2">
          {numberFormats.map((format) => (
            <label key={format.value} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="numberFormat"
                value={format.value}
                checked={numberFormat === format.value}
                onChange={(e) => setNumberFormat(e.target.value)}
                className="w-4 h-4 text-primary border-border focus:ring-primary"
              />
              <span className="text-text-primary font-body">{format.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-4 border-t border-border">
        <button
          onClick={handleSaveSettings}
          className="w-full sm:w-auto bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 font-body"
        >
          <div className="flex items-center justify-center space-x-2">
            <Icon name="Save" size={18} strokeWidth={2} />
            <span>Save Language Settings</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default LanguageSettings;