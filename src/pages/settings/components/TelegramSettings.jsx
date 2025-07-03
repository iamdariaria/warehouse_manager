import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const TelegramSettings = ({ onNotification }) => {
  const [telegramSettings, setTelegramSettings] = useState({
    botToken: '',
    chatId: '',
    isConnected: false
  });
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  const handleInputChange = (field, value) => {
    setTelegramSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    
    // Mock connection test
    setTimeout(() => {
      setIsTestingConnection(false);
      if (telegramSettings.botToken && telegramSettings.chatId) {
        setTelegramSettings(prev => ({ ...prev, isConnected: true }));
        onNotification('success', 'Telegram bot connected successfully! Test message sent.', 'Connection Successful');
      } else {
        onNotification('error', 'Please provide both Bot Token and Chat ID', 'Connection Failed');
      }
    }, 2000);
  };

  const handleSaveTelegramSettings = () => {
    if (!telegramSettings.botToken || !telegramSettings.chatId) {
      onNotification('error', 'Please fill in all required fields', 'Validation Error');
      return;
    }

    // Mock save
    localStorage.setItem('telegramSettings', JSON.stringify(telegramSettings));
    onNotification('success', 'Telegram settings saved successfully', 'Settings Saved');
  };

  const setupInstructions = [
    {
      step: 1,
      title: 'Create a Telegram Bot',
      description: 'Message @BotFather on Telegram and use /newbot command to create your bot'
    },
    {
      step: 2,
      title: 'Get Bot Token',
      description: 'Copy the bot token provided by BotFather (format: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz)'
    },
    {
      step: 3,
      title: 'Get Chat ID',
      description: 'Start a chat with your bot, then visit https://api.telegram.org/bot[TOKEN]/getUpdates to find your chat ID'
    },
    {
      step: 4,
      title: 'Configure & Test',
      description: 'Enter the Bot Token and Chat ID below, then test the connection'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className={`p-4 rounded-lg border ${
        telegramSettings.isConnected 
          ? 'bg-success-50 border-success-200' :'bg-warning-50 border-warning-200'
      }`}>
        <div className="flex items-center space-x-3">
          <Icon 
            name={telegramSettings.isConnected ? 'CheckCircle' : 'AlertCircle'} 
            size={20} 
            color={telegramSettings.isConnected ? 'var(--color-success)' : 'var(--color-warning)'} 
            strokeWidth={2} 
          />
          <div>
            <div className={`font-medium font-body ${
              telegramSettings.isConnected ? 'text-success-700' : 'text-warning-700'
            }`}>
              {telegramSettings.isConnected ? 'Connected' : 'Not Connected'}
            </div>
            <div className={`text-sm font-body ${
              telegramSettings.isConnected ? 'text-success-600' : 'text-warning-600'
            }`}>
              {telegramSettings.isConnected 
                ? 'Telegram bot is ready to send notifications' 
                : 'Configure your Telegram bot to receive notifications'
              }
            </div>
          </div>
        </div>
      </div>

      {/* Setup Instructions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary font-heading">
          Setup Instructions
        </h3>
        
        <div className="space-y-4">
          {setupInstructions.map((instruction) => (
            <div key={instruction.step} className="flex space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium font-body">
                {instruction.step}
              </div>
              <div>
                <h4 className="font-medium text-text-primary font-body mb-1">
                  {instruction.title}
                </h4>
                <p className="text-sm text-text-secondary font-body">
                  {instruction.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Configuration */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h3 className="text-lg font-semibold text-text-primary font-heading">
          Bot Configuration
        </h3>
        
        {/* Bot Token */}
        <div>
          <label className="block text-sm font-medium text-text-primary font-body mb-2">
            Bot Token *
          </label>
          <input
            type="password"
            value={telegramSettings.botToken}
            onChange={(e) => handleInputChange('botToken', e.target.value)}
            placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
            className="w-full px-4 py-3 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-data text-sm"
          />
          <p className="mt-1 text-xs text-text-muted font-body">
            Get this from @BotFather on Telegram
          </p>
        </div>

        {/* Chat ID */}
        <div>
          <label className="block text-sm font-medium text-text-primary font-body mb-2">
            Chat ID *
          </label>
          <input
            type="text"
            value={telegramSettings.chatId}
            onChange={(e) => handleInputChange('chatId', e.target.value)}
            placeholder="-1001234567890 or 123456789"
            className="w-full px-4 py-3 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-data text-sm"
          />
          <p className="mt-1 text-xs text-text-muted font-body">
            Your personal chat ID or group chat ID (starts with -)
          </p>
        </div>

        {/* Test Connection */}
        <button
          onClick={handleTestConnection}
          disabled={isTestingConnection}
          className="w-full sm:w-auto bg-accent text-white px-6 py-3 rounded-lg font-medium hover:bg-accent-600 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 font-body"
        >
          <div className="flex items-center justify-center space-x-2">
            {isTestingConnection ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Testing Connection...</span>
              </>
            ) : (
              <>
                <Icon name="MessageCircle" size={18} strokeWidth={2} />
                <span>Test Connection</span>
              </>
            )}
          </div>
        </button>
      </div>

      {/* Notification Types */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h3 className="text-lg font-semibold text-text-primary font-heading">
          Telegram Notification Types
        </h3>
        
        <div className="space-y-3">
          {[
            { key: 'criticalStock', label: 'Critical Stock Alerts (≤5 units)', enabled: true },
            { key: 'importSuccess', label: 'Import Success Notifications', enabled: true },
            { key: 'importErrors', label: 'Import Error Notifications', enabled: true },
            { key: 'auditCompleted', label: 'Audit Completion Notifications', enabled: false },
            { key: 'dailySummary', label: 'Daily Stock Summary', enabled: false }
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
          onClick={handleSaveTelegramSettings}
          className="w-full sm:w-auto bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 font-body"
        >
          <div className="flex items-center justify-center space-x-2">
            <Icon name="Save" size={18} strokeWidth={2} />
            <span>Save Telegram Settings</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default TelegramSettings;