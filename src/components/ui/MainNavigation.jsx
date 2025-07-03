import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const MainNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      path: '/warehouse-dashboard',
      label: 'Warehouse',
      icon: 'Package',
      description: 'Stock monitoring and receiving'
    },
    {
      path: '/expenses-tracking',
      label: 'Expenses',
      icon: 'DollarSign',
      description: 'Project allocation tracking'
    },
    {
      path: '/reserves-management',
      label: 'Reserves',
      icon: 'Shield',
      description: 'Material booking management'
    },
    {
      path: '/inventory-audit',
      label: 'Audit',
      icon: 'CheckSquare',
      description: 'Stock verification processes'
    },
    {
      path: '/history-journal',
      label: 'History',
      icon: 'Clock',
      description: 'Audit trail and movements'
    },
    {
      path: '/settings',
      label: 'Settings',
      icon: 'Settings',
      description: 'System configuration'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleKeyDown = (event, path) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleNavigation(path);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="fixed top-16 left-0 right-0 z-100 bg-surface border-b border-border shadow-card">
        <div className="hidden md:flex items-center px-6 space-x-1">
          {navigationItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              onKeyDown={(e) => handleKeyDown(e, item.path)}
              className={`
                flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-smooth
                min-h-touch hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset
                ${isActive(item.path)
                  ? 'text-primary border-b-2 border-primary bg-primary-50' :'text-text-secondary hover:text-text-primary'
                }
              `}
              title={item.description}
              role="tab"
              aria-selected={isActive(item.path)}
            >
              <Icon 
                name={item.icon} 
                size={18} 
                strokeWidth={2}
                className={isActive(item.path) ? 'text-primary' : 'text-current'}
              />
              <span className="font-body">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="md:hidden flex items-center justify-between px-4 py-3">
          <span className="text-sm font-medium text-text-primary font-body">
            {navigationItems.find(item => isActive(item.path))?.label || 'Navigation'}
          </span>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-text-secondary hover:text-primary hover:bg-secondary-50 rounded-lg transition-smooth"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            <Icon 
              name={isMobileMenuOpen ? 'X' : 'Menu'} 
              size={20} 
              strokeWidth={2}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-300 md:hidden">
          <div 
            className="absolute inset-0 bg-secondary-900 bg-opacity-50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute top-0 right-0 w-80 max-w-full h-full bg-surface shadow-modal">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-text-primary font-heading">
                Navigation
              </h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-text-secondary hover:text-primary hover:bg-secondary-50 rounded-lg transition-smooth"
                aria-label="Close navigation menu"
              >
                <Icon name="X" size={20} strokeWidth={2} />
              </button>
            </div>
            <div className="py-4">
              {navigationItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  onKeyDown={(e) => handleKeyDown(e, item.path)}
                  className={`
                    w-full flex items-center space-x-3 px-6 py-4 text-left transition-smooth
                    min-h-touch hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset
                    ${isActive(item.path)
                      ? 'text-primary bg-primary-50 border-r-2 border-primary' :'text-text-secondary hover:text-text-primary'
                    }
                  `}
                  role="menuitem"
                >
                  <Icon 
                    name={item.icon} 
                    size={20} 
                    strokeWidth={2}
                    className={isActive(item.path) ? 'text-primary' : 'text-current'}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium font-body">{item.label}</span>
                    <span className="text-xs text-text-muted font-body">
                      {item.description}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MainNavigation;