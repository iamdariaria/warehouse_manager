import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const NotificationToast = ({ 
  notifications = [], 
  onDismiss,
  position = 'top-right',
  autoHideDuration = 5000 
}) => {
  const [visibleNotifications, setVisibleNotifications] = useState([]);

  useEffect(() => {
    setVisibleNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    const timers = visibleNotifications.map((notification) => {
      if (notification.autoHide !== false && autoHideDuration > 0) {
        return setTimeout(() => {
          handleDismiss(notification.id);
        }, autoHideDuration);
      }
      return null;
    });

    return () => {
      timers.forEach(timer => {
        if (timer) clearTimeout(timer);
      });
    };
  }, [visibleNotifications, autoHideDuration]);

  const handleDismiss = (id) => {
    setVisibleNotifications(prev => prev.filter(notification => notification.id !== id));
    if (onDismiss) {
      onDismiss(id);
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-right':
        return 'bottom-4 right-4';
      default:
        return 'top-4 right-4';
    }
  };

  const getNotificationStyles = (type) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-success-50',
          border: 'border-success-200',
          text: 'text-success-700',
          icon: 'CheckCircle',
          iconColor: 'text-success'
        };
      case 'warning':
        return {
          bg: 'bg-warning-50',
          border: 'border-warning-200',
          text: 'text-warning-700',
          icon: 'AlertTriangle',
          iconColor: 'text-warning'
        };
      case 'error':
        return {
          bg: 'bg-error-50',
          border: 'border-error-200',
          text: 'text-error-700',
          icon: 'AlertCircle',
          iconColor: 'text-error'
        };
      case 'info':
      default:
        return {
          bg: 'bg-accent-50',
          border: 'border-accent-200',
          text: 'text-accent-700',
          icon: 'Info',
          iconColor: 'text-accent'
        };
    }
  };

  if (visibleNotifications.length === 0) {
    return null;
  }

  return (
    <div className={`fixed z-400 ${getPositionClasses()}`}>
      <div className="space-y-3 w-80 max-w-full">
        {visibleNotifications.map((notification) => {
          const styles = getNotificationStyles(notification.type);
          
          return (
            <div
              key={notification.id}
              className={`
                ${styles.bg} ${styles.border} ${styles.text}
                border rounded-lg shadow-modal p-4 transition-modal
                transform translate-x-0 opacity-100
              `}
              role="alert"
              aria-live="polite"
            >
              <div className="flex items-start space-x-3">
                {/* Icon */}
                <div className="flex-shrink-0 mt-0.5">
                  <Icon 
                    name={styles.icon} 
                    size={20} 
                    className={styles.iconColor}
                    strokeWidth={2}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {notification.title && (
                    <h4 className="text-sm font-semibold font-heading mb-1">
                      {notification.title}
                    </h4>
                  )}
                  <p className="text-sm font-body">
                    {notification.message}
                  </p>
                  {notification.timestamp && (
                    <p className="text-xs text-text-muted font-body mt-1">
                      {new Date(notification.timestamp).toLocaleTimeString()}
                    </p>
                  )}
                </div>

                {/* Dismiss Button */}
                <button
                  onClick={() => handleDismiss(notification.id)}
                  className="flex-shrink-0 p-1 hover:bg-white hover:bg-opacity-20 rounded transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label="Dismiss notification"
                >
                  <Icon 
                    name="X" 
                    size={16} 
                    className="text-current opacity-70 hover:opacity-100"
                    strokeWidth={2}
                  />
                </button>
              </div>

              {/* Progress Bar for Auto-hide */}
              {notification.autoHide !== false && autoHideDuration > 0 && (
                <div className="mt-3 h-1 bg-white bg-opacity-30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-current opacity-50 rounded-full transition-all ease-linear"
                    style={{
                      animation: `shrink ${autoHideDuration}ms linear forwards`
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

// Hook for managing notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      timestamp: new Date().toISOString(),
      ...notification
    };
    
    setNotifications(prev => [...prev, newNotification]);
    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Convenience methods
  const showSuccess = (message, title, options = {}) => {
    return addNotification({ type: 'success', message, title, ...options });
  };

  const showError = (message, title, options = {}) => {
    return addNotification({ type: 'error', message, title, ...options });
  };

  const showWarning = (message, title, options = {}) => {
    return addNotification({ type: 'warning', message, title, ...options });
  };

  const showInfo = (message, title, options = {}) => {
    return addNotification({ type: 'info', message, title, ...options });
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};

export default NotificationToast;