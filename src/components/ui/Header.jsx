import React from 'react';
import Icon from '../AppIcon';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-100 bg-surface border-b border-border shadow-card">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
            <Icon 
              name="Package" 
              size={24} 
              color="white" 
              strokeWidth={2}
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-text-primary font-heading">
              WarehouseFlow
            </h1>
            <span className="text-xs text-text-secondary font-body">
              Inventory Management
            </span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 text-text-secondary hover:text-primary hover:bg-secondary-50 rounded-lg transition-smooth">
            <Icon name="Bell" size={20} strokeWidth={2} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full border-2 border-surface"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-3 pl-4 border-l border-border">
            <div className="flex flex-col text-right">
              <span className="text-sm font-medium text-text-primary font-body">
                Admin User
              </span>
              <span className="text-xs text-text-secondary font-body">
                Warehouse Manager
              </span>
            </div>
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <Icon name="User" size={16} color="#2563EB" strokeWidth={2} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;