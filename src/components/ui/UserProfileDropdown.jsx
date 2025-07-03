import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';

const UserProfileDropdown = ({ user = { name: 'Admin User', role: 'Warehouse Manager', email: 'admin@warehouse.com' }, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle();
    }
  };

  const handleLogout = () => {
    setIsOpen(false);
    if (onLogout) {
      onLogout();
    }
  };

  const menuItems = [
    {
      icon: 'User',
      label: 'Profile Settings',
      action: () => {
        setIsOpen(false);
        // Navigate to profile settings
      }
    },
    {
      icon: 'Settings',
      label: 'Account Settings',
      action: () => {
        setIsOpen(false);
        // Navigate to account settings
      }
    },
    {
      icon: 'HelpCircle',
      label: 'Help & Support',
      action: () => {
        setIsOpen(false);
        // Navigate to help
      }
    },
    {
      icon: 'LogOut',
      label: 'Sign Out',
      action: handleLogout,
      variant: 'danger'
    }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Trigger */}
      <button
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-secondary-50 transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="User profile menu"
      >
        <div className="flex flex-col text-right">
          <span className="text-sm font-medium text-text-primary font-body">
            {user.name}
          </span>
          <span className="text-xs text-text-secondary font-body">
            {user.role}
          </span>
        </div>
        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          <Icon name="User" size={16} color="#2563EB" strokeWidth={2} />
        </div>
        <Icon 
          name="ChevronDown" 
          size={16} 
          className={`text-text-secondary transition-smooth ${isOpen ? 'rotate-180' : ''}`}
          strokeWidth={2}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-surface rounded-lg shadow-modal border border-border z-200">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <Icon name="User" size={20} color="#2563EB" strokeWidth={2} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-text-primary font-body">
                  {user.name}
                </span>
                <span className="text-xs text-text-secondary font-body">
                  {user.email}
                </span>
                <span className="text-xs text-text-muted font-body">
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 text-left transition-smooth
                  min-h-touch hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset
                  ${item.variant === 'danger' ?'text-error hover:bg-error-50 hover:text-error-700' :'text-text-secondary hover:text-text-primary'
                  }
                `}
                role="menuitem"
              >
                <Icon 
                  name={item.icon} 
                  size={18} 
                  strokeWidth={2}
                  className={item.variant === 'danger' ? 'text-error' : 'text-current'}
                />
                <span className="font-body">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;