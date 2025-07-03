import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const ImportExportSettings = ({ onNotification }) => {
  const [importSettings, setImportSettings] = useState({
    duplicateHandling: 'skip',
    autoValidation: true,
    createBackup: true,
    allowPartialImport: true,
    dateFormat: 'auto',
    numberFormat: 'auto',
    encoding: 'utf-8'
  });

  const handleSettingChange = (field, value) => {
    setImportSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveSettings = () => {
    // Mock save
    localStorage.setItem('importExportSettings', JSON.stringify(importSettings));
    onNotification('success', 'Import/Export settings saved successfully', 'Settings Saved');
  };

  const handleDownloadTemplate = () => {
    // Mock template download
    onNotification('success', 'Excel template downloaded successfully', 'Template Downloaded');
  };

  const duplicateOptions = [
    { value: 'skip', label: 'Skip Duplicates', description: 'Ignore duplicate articles during import' },
    { value: 'update', label: 'Update Existing', description: 'Update existing articles with new data' },
    { value: 'create', label: 'Create New', description: 'Create new entries with modified article codes' },
    { value: 'prompt', label: 'Ask Each Time', description: 'Prompt user for each duplicate found' }
  ];

  const dateFormatOptions = [
    { value: 'auto', label: 'Auto-detect' },
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (US)' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (EU)' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (ISO)' }
  ];

  const encodingOptions = [
    { value: 'utf-8', label: 'UTF-8 (Recommended)' },
    { value: 'windows-1251', label: 'Windows-1251 (Cyrillic)' },
    { value: 'iso-8859-1', label: 'ISO-8859-1 (Latin)' }
  ];

  return (
    <div className="space-y-6">
      {/* Excel Template */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary font-heading">
          Excel Template
        </h3>
        
        <div className="p-4 bg-secondary-50 rounded-lg border border-border">
          <div className="flex items-start space-x-3">
            <Icon name="FileSpreadsheet" size={24} color="var(--color-primary)" strokeWidth={2} />
            <div className="flex-1">
              <h4 className="font-medium text-text-primary font-body mb-2">
                Standard Import Template
              </h4>
              <p className="text-sm text-text-secondary font-body mb-3">
                Download the Excel template with the correct column structure for importing inventory data.
              </p>
              <div className="text-sm text-text-muted font-body mb-3">
                Required columns: Article, Name, Quantity, Cost Price (USD)
              </div>
              <button
                onClick={handleDownloadTemplate}
                className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 font-body"
              >
                <div className="flex items-center space-x-2">
                  <Icon name="Download" size={16} strokeWidth={2} />
                  <span>Download Template</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Duplicate Handling */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h3 className="text-lg font-semibold text-text-primary font-heading">
          Duplicate Article Handling
        </h3>
        
        <div className="space-y-3">
          {duplicateOptions.map((option) => (
            <label key={option.value} className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                name="duplicateHandling"
                value={option.value}
                checked={importSettings.duplicateHandling === option.value}
                onChange={(e) => handleSettingChange('duplicateHandling', e.target.value)}
                className="w-4 h-4 text-primary border-border focus:ring-primary mt-1"
              />
              <div>
                <span className="text-text-primary font-body">{option.label}</span>
                <p className="text-sm text-text-muted font-body">{option.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Import Options */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h3 className="text-lg font-semibold text-text-primary font-heading">
          Import Options
        </h3>
        
        <div className="space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={importSettings.autoValidation}
              onChange={(e) => handleSettingChange('autoValidation', e.target.checked)}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
            />
            <div>
              <span className="text-text-primary font-body">Auto-validate Data</span>
              <p className="text-sm text-text-muted font-body">
                Automatically validate data types and formats during import
              </p>
            </div>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={importSettings.createBackup}
              onChange={(e) => handleSettingChange('createBackup', e.target.checked)}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
            />
            <div>
              <span className="text-text-primary font-body">Create Backup Before Import</span>
              <p className="text-sm text-text-muted font-body">
                Automatically backup existing data before importing new data
              </p>
            </div>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={importSettings.allowPartialImport}
              onChange={(e) => handleSettingChange('allowPartialImport', e.target.checked)}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
            />
            <div>
              <span className="text-text-primary font-body">Allow Partial Import</span>
              <p className="text-sm text-text-muted font-body">
                Continue import even if some rows contain errors
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Data Format Settings */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h3 className="text-lg font-semibold text-text-primary font-heading">
          Data Format Settings
        </h3>
        
        {/* Date Format */}
        <div>
          <label className="block text-sm font-medium text-text-primary font-body mb-2">
            Date Format Detection
          </label>
          <select
            value={importSettings.dateFormat}
            onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-body"
          >
            {dateFormatOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Number Format */}
        <div>
          <label className="block text-sm font-medium text-text-primary font-body mb-2">
            Number Format Detection
          </label>
          <select
            value={importSettings.numberFormat}
            onChange={(e) => handleSettingChange('numberFormat', e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-body"
          >
            <option value="auto">Auto-detect</option>
            <option value="decimal">Decimal Point (1,234.56)</option>
            <option value="comma">Comma Separator (1.234,56)</option>
          </select>
        </div>

        {/* File Encoding */}
        <div>
          <label className="block text-sm font-medium text-text-primary font-body mb-2">
            File Encoding
          </label>
          <select
            value={importSettings.encoding}
            onChange={(e) => handleSettingChange('encoding', e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-body"
          >
            {encodingOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Export Settings */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h3 className="text-lg font-semibold text-text-primary font-heading">
          Export Settings
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-secondary-50 rounded-lg border border-border">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="FileSpreadsheet" size={18} color="var(--color-primary)" strokeWidth={2} />
              <span className="font-medium text-text-primary font-body">Excel Export</span>
            </div>
            <p className="text-sm text-text-secondary font-body">
              Export inventory data to Excel format with formatting
            </p>
          </div>
          
          <div className="p-4 bg-secondary-50 rounded-lg border border-border">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="FileText" size={18} color="var(--color-primary)" strokeWidth={2} />
              <span className="font-medium text-text-primary font-body">CSV Export</span>
            </div>
            <p className="text-sm text-text-secondary font-body">
              Export data in CSV format for external systems
            </p>
          </div>
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
            <span>Save Import/Export Settings</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ImportExportSettings;