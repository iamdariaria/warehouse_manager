import React, { useState } from 'react';
import Header from 'components/ui/Header';
import MainNavigation from 'components/ui/MainNavigation';
import Icon from 'components/AppIcon';
import LanguageSettings from './components/LanguageSettings';
import NotificationSettings from './components/NotificationSettings';
import TelegramSettings from './components/TelegramSettings';
import StockAlertSettings from './components/StockAlertSettings';
import ImportExportSettings from './components/ImportExportSettings';
import UserProfileSettings from './components/UserProfileSettings';

const Settings = () => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = (type, message, title) => {
    const notification = {
      id: Date.now(),
      type,
      message,
      title,
      timestamp: new Date().toISOString()
    };
    setNotifications(prev => [...prev, notification]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  const settingsSections = [
    {
      id: 'language',
      title: 'Language & Localization',
      description: 'Configure interface language and regional preferences',
      icon: 'Globe',
      component: LanguageSettings
    },
    {
      id: 'notifications',
      title: 'Email Notifications',
      description: 'Setup SMTP configuration for email alerts',
      icon: 'Mail',
      component: NotificationSettings
    },
    {
      id: 'telegram',
      title: 'Telegram Integration',
      description: 'Configure Telegram bot for instant notifications',
      icon: 'MessageCircle',
      component: TelegramSettings
    },
    {
      id: 'alerts',
      title: 'Stock Alert Settings',
      description: 'Customize critical stock level thresholds',
      icon: 'AlertTriangle',
      component: StockAlertSettings
    },
    {
      id: 'import',
      title: 'Import/Export Preferences',
      description: 'Configure Excel file handling and data management',
      icon: 'FileSpreadsheet',
      component: ImportExportSettings
    },
    {
      id: 'profile',
      title: 'User Profile',
      description: 'Manage account information and security settings',
      icon: 'User',
      component: UserProfileSettings
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <MainNavigation />
      
      {/* Main Content */}
      <main className="pt-32 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Icon name="Settings" size={24} color="var(--color-primary)" strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-text-primary font-heading">
                  Settings
                </h1>
                <p className="text-text-secondary font-body">
                  Configure system preferences and integrations
                </p>
              </div>
            </div>
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {settingsSections.map((section) => {
              const ComponentToRender = section.component;
              return (
                <div
                  key={section.id}
                  className="bg-surface rounded-lg border border-border shadow-card"
                >
                  {/* Section Header */}
                  <div className="p-6 border-b border-border">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Icon 
                          name={section.icon} 
                          size={18} 
                          color="var(--color-primary)" 
                          strokeWidth={2} 
                        />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-text-primary font-heading">
                          {section.title}
                        </h2>
                        <p className="text-sm text-text-secondary font-body">
                          {section.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Section Content */}
                  <div className="p-6">
                    <ComponentToRender onNotification={showNotification} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Toast Notifications */}
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-400 space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`
                w-80 max-w-full p-4 rounded-lg shadow-modal border transition-modal
                ${notification.type === 'success' ?'bg-success-50 border-success-200 text-success-700' 
                  : notification.type === 'error' ?'bg-error-50 border-error-200 text-error-700' :'bg-accent-50 border-accent-200 text-accent-700'
                }
              `}
              role="alert"
            >
              <div className="flex items-start space-x-3">
                <Icon 
                  name={notification.type === 'success' ? 'CheckCircle' : notification.type === 'error' ? 'AlertCircle' : 'Info'} 
                  size={20} 
                  className={
                    notification.type === 'success' ?'text-success' 
                      : notification.type === 'error' ?'text-error' :'text-accent'
                  }
                  strokeWidth={2}
                />
                <div className="flex-1">
                  {notification.title && (
                    <h4 className="text-sm font-semibold font-heading mb-1">
                      {notification.title}
                    </h4>
                  )}
                  <p className="text-sm font-body">{notification.message}</p>
                </div>
                <button
                  onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                  className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-smooth"
                >
                  <Icon name="X" size={16} className="opacity-70" strokeWidth={2} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Settings;