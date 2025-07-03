import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const NotificationSettings = ({ onNotification }) => {
  const [emailSettings, setEmailSettings] = useState({
    smtpServer: 'smtp.gmail.com',
    port: '587',
    username: 'warehouse@company.com',
    password: '',
    enableTLS: true,
    testEmail: 'admin@company.com'
  });
  const [isTestingEmail, setIsTestingEmail] = useState(false);

  const handleInputChange = (field, value) => {
    setEmailSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTestEmail = async () => {
    setIsTestingEmail(true);
    
    // Mock email test
    setTimeout(() => {
      setIsTestingEmail(false);
      if (emailSettings.smtpServer && emailSettings.username && emailSettings.testEmail) {
        onNotification('success', `Test email sent successfully to ${emailSettings.testEmail}`, 'Email Test');
      } else {
        onNotification('error', 'Please fill in all required email configuration fields', 'Email Test Failed');
      }
    }, 2000);
  };

  const handleSaveEmailSettings = () => {
    if (!emailSettings.smtpServer || !emailSettings.username || !emailSettings.port) {
      onNotification('error', 'Please fill in all required fields', 'Validation Error');
      return;
    }

    // Mock save
    localStorage.setItem('emailSettings', JSON.stringify(emailSettings));
    onNotification('success', 'Email notification settings saved successfully', 'Settings Saved');
  };

  return (
    <div className="space-y-6">
      {/* SMTP Configuration */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary font-heading">
          SMTP Configuration
        </h3>
        
        {/* SMTP Server */}
        <div>
          <label className="block text-sm font-medium text-text-primary font-body mb-2">
            SMTP Server *
          </label>
          <input
            type="text"
            value={emailSettings.smtpServer}
            onChange={(e) => handleInputChange('smtpServer', e.target.value)}
            placeholder="smtp.gmail.com"
            className="w-full px-4 py-3 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-body"
          />
        </div>

        {/* Port */}
        <div>
          <label className="block text-sm font-medium text-text-primary font-body mb-2">
            Port *
          </label>
          <input
            type="number"
            value={emailSettings.port}
            onChange={(e) => handleInputChange('port', e.target.value)}
            placeholder="587"
            className="w-full px-4 py-3 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-body"
          />
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-text-primary font-body mb-2">
            Username/Email *
          </label>
          <input
            type="email"
            value={emailSettings.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            placeholder="warehouse@company.com"
            className="w-full px-4 py-3 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-body"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-text-primary font-body mb-2">
            Password/App Password
          </label>
          <input
            type="password"
            value={emailSettings.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="Enter password or app-specific password"
            className="w-full px-4 py-3 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-body"
          />
        </div>

        {/* TLS Option */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="enableTLS"
            checked={emailSettings.enableTLS}
            onChange={(e) => handleInputChange('enableTLS', e.target.checked)}
            className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
          />
          <label htmlFor="enableTLS" className="text-text-primary font-body cursor-pointer">
            Enable TLS/SSL encryption
          </label>
        </div>
      </div>

      {/* Test Email */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h3 className="text-lg font-semibold text-text-primary font-heading">
          Test Configuration
        </h3>
        
        <div>
          <label className="block text-sm font-medium text-text-primary font-body mb-2">
            Test Email Address
          </label>
          <input
            type="email"
            value={emailSettings.testEmail}
            onChange={(e) => handleInputChange('testEmail', e.target.value)}
            placeholder="admin@company.com"
            className="w-full px-4 py-3 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-body"
          />
        </div>

        <button
          onClick={handleTestEmail}
          disabled={isTestingEmail}
          className="w-full sm:w-auto bg-accent text-white px-6 py-3 rounded-lg font-medium hover:bg-accent-600 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 font-body"
        >
          <div className="flex items-center justify-center space-x-2">
            {isTestingEmail ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Sending Test Email...</span>
              </>
            ) : (
              <>
                <Icon name="Send" size={18} strokeWidth={2} />
                <span>Send Test Email</span>
              </>
            )}
          </div>
        </button>
      </div>

      {/* Notification Types */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h3 className="text-lg font-semibold text-text-primary font-heading">
          Email Notification Types
        </h3>
        
        <div className="space-y-3">
          {[
            { key: 'criticalStock', label: 'Critical Stock Alerts (≤5 units)', enabled: true },
            { key: 'importSuccess', label: 'Import Success Notifications', enabled: true },
            { key: 'importErrors', label: 'Import Error Notifications', enabled: true },
            { key: 'stockMovements', label: 'Stock Movement Summaries', enabled: false },
            { key: 'auditReminders', label: 'Inventory Audit Reminders', enabled: false }
          ].map((notification) => (
            <label key={notification.key} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked={notification.enabled}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
              />
              <span className="text-text-primary font-body">{notification.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-4 border-t border-border">
        <button
          onClick={handleSaveEmailSettings}
          className="w-full sm:w-auto bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 font-body"
        >
          <div className="flex items-center justify-center space-x-2">
            <Icon name="Save" size={18} strokeWidth={2} />
            <span>Save Email Settings</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default NotificationSettings;