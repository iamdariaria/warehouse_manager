import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const StockAlertSettings = ({ onNotification }) => {
  const [alertSettings, setAlertSettings] = useState({
    criticalThreshold: 5,
    lowThreshold: 10,
    enableCriticalAlerts: true,
    enableLowStockAlerts: true,
    alertFrequency: 'immediate',
    alertChannels: {
      email: true,
      telegram: true,
      inApp: true
    }
  });

  const handleThresholdChange = (field, value) => {
    const numValue = parseInt(value) || 0;
    if (numValue >= 0 && numValue <= 1000) {
      setAlertSettings(prev => ({
        ...prev,
        [field]: numValue
      }));
    }
  };

  const handleToggleChange = (field, value) => {
    setAlertSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleChannelChange = (channel, value) => {
    setAlertSettings(prev => ({
      ...prev,
      alertChannels: {
        ...prev.alertChannels,
        [channel]: value
      }
    }));
  };

  const handleSaveSettings = () => {
    // Validation
    if (alertSettings.criticalThreshold >= alertSettings.lowThreshold) {
      onNotification('error', 'Critical threshold must be less than low stock threshold', 'Validation Error');
      return;
    }

    // Mock save
    localStorage.setItem('stockAlertSettings', JSON.stringify(alertSettings));
    onNotification('success', 'Stock alert settings saved successfully', 'Settings Saved');
  };

  const alertFrequencyOptions = [
    { value: 'immediate', label: 'Immediate (Real-time)' },
    { value: 'hourly', label: 'Hourly Summary' },
    { value: 'daily', label: 'Daily Summary' },
    { value: 'weekly', label: 'Weekly Summary' }
  ];

  return (
    <div className="space-y-6">
      {/* Alert Thresholds */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary font-heading">
          Stock Level Thresholds
        </h3>
        
        {/* Critical Stock Threshold */}
        <div>
          <label className="block text-sm font-medium text-text-primary font-body mb-2">
            Critical Stock Threshold
          </label>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="number"
                min="0"
                max="1000"
                value={alertSettings.criticalThreshold}
                onChange={(e) => handleThresholdChange('criticalThreshold', e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-body"
              />
            </div>
            <span className="text-text-secondary font-body">units or less</span>
          </div>
          <p className="mt-1 text-sm text-text-muted font-body">
            Items with this quantity or less will trigger critical alerts
          </p>
        </div>

        {/* Low Stock Threshold */}
        <div>
          <label className="block text-sm font-medium text-text-primary font-body mb-2">
            Low Stock Threshold
          </label>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="number"
                min="0"
                max="1000"
                value={alertSettings.lowThreshold}
                onChange={(e) => handleThresholdChange('lowThreshold', e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-body"
              />
            </div>
            <span className="text-text-secondary font-body">units or less</span>
          </div>
          <p className="mt-1 text-sm text-text-muted font-body">
            Items with this quantity or less will trigger low stock warnings
          </p>
        </div>

        {/* Visual Preview */}
        <div className="p-4 bg-secondary-50 rounded-lg border border-border">
          <h4 className="font-medium text-text-primary font-body mb-3">Alert Preview</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-error rounded-full"></div>
              <span className="text-sm font-body">
                Critical: 0 - {alertSettings.criticalThreshold} units
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-warning rounded-full"></div>
              <span className="text-sm font-body">
                Low Stock: {alertSettings.criticalThreshold + 1} - {alertSettings.lowThreshold} units
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-success rounded-full"></div>
              <span className="text-sm font-body">
                Normal: {alertSettings.lowThreshold + 1}+ units
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Types */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h3 className="text-lg font-semibold text-text-primary font-heading">
          Alert Types
        </h3>
        
        <div className="space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={alertSettings.enableCriticalAlerts}
              onChange={(e) => handleToggleChange('enableCriticalAlerts', e.target.checked)}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
            />
            <div>
              <span className="text-text-primary font-body">Critical Stock Alerts</span>
              <p className="text-sm text-text-muted font-body">
                Immediate notifications when stock reaches critical levels
              </p>
            </div>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={alertSettings.enableLowStockAlerts}
              onChange={(e) => handleToggleChange('enableLowStockAlerts', e.target.checked)}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
            />
            <div>
              <span className="text-text-primary font-body">Low Stock Warnings</span>
              <p className="text-sm text-text-muted font-body">
                Notifications when stock levels are getting low
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Alert Frequency */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h3 className="text-lg font-semibold text-text-primary font-heading">
          Alert Frequency
        </h3>
        
        <select
          value={alertSettings.alertFrequency}
          onChange={(e) => handleToggleChange('alertFrequency', e.target.value)}
          className="w-full px-4 py-3 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-body"
        >
          {alertFrequencyOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Alert Channels */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h3 className="text-lg font-semibold text-text-primary font-heading">
          Notification Channels
        </h3>
        
        <div className="space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={alertSettings.alertChannels.inApp}
              onChange={(e) => handleChannelChange('inApp', e.target.checked)}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
            />
            <div className="flex items-center space-x-2">
              <Icon name="Bell" size={18} color="var(--color-primary)" strokeWidth={2} />
              <span className="text-text-primary font-body">In-App Notifications</span>
            </div>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={alertSettings.alertChannels.email}
              onChange={(e) => handleChannelChange('email', e.target.checked)}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
            />
            <div className="flex items-center space-x-2">
              <Icon name="Mail" size={18} color="var(--color-primary)" strokeWidth={2} />
              <span className="text-text-primary font-body">Email Notifications</span>
            </div>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={alertSettings.alertChannels.telegram}
              onChange={(e) => handleChannelChange('telegram', e.target.checked)}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
            />
            <div className="flex items-center space-x-2">
              <Icon name="MessageCircle" size={18} color="var(--color-primary)" strokeWidth={2} />
              <span className="text-text-primary font-body">Telegram Notifications</span>
            </div>
          </label>
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
            <span>Save Alert Settings</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default StockAlertSettings;