import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const HistoryFilters = ({ filters, onFilterChange, totalResults, historyData }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Get unique values for filter options
  const uniqueUsers = [...new Set(historyData.map(entry => entry.user))];
  const uniqueProjects = [...new Set(historyData.filter(entry => entry.project).map(entry => entry.project))];

  const actionTypes = [
    { value: 'all', label: 'All Actions', icon: 'List' },
    { value: 'received', label: 'Received', icon: 'Plus', color: 'text-accent' },
    { value: 'outgoing', label: 'Outgoing', icon: 'Minus', color: 'text-error' },
    { value: 'reserved', label: 'Reserved', icon: 'Clock', color: 'text-warning' },
    { value: 'audit', label: 'Audit', icon: 'CheckSquare', color: 'text-secondary' }
  ];

  const handleInputChange = (field, value) => {
    onFilterChange({ [field]: value });
  };

  const handleDateRangeChange = (field, value) => {
    onFilterChange({
      dateRange: { ...filters.dateRange, [field]: value }
    });
  };

  const clearFilters = () => {
    onFilterChange({
      dateRange: { start: '', end: '' },
      search: '',
      actionType: 'all',
      user: 'all',
      project: 'all'
    });
  };

  const hasActiveFilters = () => {
    return filters.dateRange.start || 
           filters.dateRange.end || 
           filters.search || 
           filters.actionType !== 'all' || 
           filters.user !== 'all' || 
           filters.project !== 'all';
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.dateRange.start || filters.dateRange.end) count++;
    if (filters.search) count++;
    if (filters.actionType !== 'all') count++;
    if (filters.user !== 'all') count++;
    if (filters.project !== 'all') count++;
    return count;
  };

  return (
    <div className="bg-surface rounded-lg border border-border shadow-card">
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="Filter" size={20} className="text-text-secondary" strokeWidth={2} />
            <h3 className="text-lg font-semibold text-text-primary font-heading">
              Filters
            </h3>
            {getActiveFilterCount() > 0 && (
              <span className="bg-primary text-white text-xs px-2 py-1 rounded-full font-medium">
                {getActiveFilterCount()}
              </span>
            )}
          </div>
          <div className="text-sm text-text-secondary font-body">
            {totalResults} {totalResults === 1 ? 'result' : 'results'} found
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {hasActiveFilters() && (
            <button
              onClick={clearFilters}
              className="text-sm text-text-secondary hover:text-text-primary font-body transition-smooth"
            >
              Clear all
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-text-secondary hover:text-text-primary hover:bg-secondary-50 rounded-lg transition-smooth lg:hidden"
            aria-label={isExpanded ? 'Collapse filters' : 'Expand filters'}
          >
            <Icon 
              name={isExpanded ? 'ChevronUp' : 'ChevronDown'} 
              size={20} 
              strokeWidth={2}
            />
          </button>
        </div>
      </div>

      {/* Filter Content */}
      <div className={`${isExpanded ? 'block' : 'hidden'} lg:block`}>
        <div className="p-4 space-y-4">
          {/* First Row - Search and Action Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-text-primary font-body mb-2">
                Search Article or Product
              </label>
              <div className="relative">
                <Icon 
                  name="Search" 
                  size={20} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"
                  strokeWidth={2}
                />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleInputChange('search', e.target.value)}
                  placeholder="Search by article code or product name..."
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-body"
                />
                {filters.search && (
                  <button
                    onClick={() => handleInputChange('search', '')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary"
                  >
                    <Icon name="X" size={16} strokeWidth={2} />
                  </button>
                )}
              </div>
            </div>

            {/* Action Type */}
            <div>
              <label className="block text-sm font-medium text-text-primary font-body mb-2">
                Action Type
              </label>
              <select
                value={filters.actionType}
                onChange={(e) => handleInputChange('actionType', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-body"
              >
                {actionTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Second Row - Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary font-body mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) => handleDateRangeChange('start', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-body"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary font-body mb-2">
                End Date
              </label>
              <input
                type="date"
                value={filters.dateRange.end}
                onChange={(e) => handleDateRangeChange('end', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-body"
              />
            </div>
          </div>

          {/* Third Row - User and Project */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* User Filter */}
            <div>
              <label className="block text-sm font-medium text-text-primary font-body mb-2">
                User
              </label>
              <select
                value={filters.user}
                onChange={(e) => handleInputChange('user', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-body"
              >
                <option value="all">All Users</option>
                {uniqueUsers.map(user => (
                  <option key={user} value={user}>{user}</option>
                ))}
              </select>
            </div>

            {/* Project Filter */}
            <div>
              <label className="block text-sm font-medium text-text-primary font-body mb-2">
                Project
              </label>
              <select
                value={filters.project}
                onChange={(e) => handleInputChange('project', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-body"
              >
                <option value="all">All Projects</option>
                <option value="no-project">No Project</option>
                {uniqueProjects.map(project => (
                  <option key={project} value={project}>{project}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters() && (
          <div className="px-4 pb-4">
            <div className="flex flex-wrap gap-2">
              {filters.search && (
                <div className="flex items-center space-x-1 bg-primary-50 text-primary px-3 py-1 rounded-full text-sm">
                  <span className="font-body">Search: "{filters.search}"</span>
                  <button
                    onClick={() => handleInputChange('search', '')}
                    className="hover:bg-primary-100 rounded-full p-0.5"
                  >
                    <Icon name="X" size={12} strokeWidth={2} />
                  </button>
                </div>
              )}
              
              {filters.actionType !== 'all' && (
                <div className="flex items-center space-x-1 bg-accent-50 text-accent px-3 py-1 rounded-full text-sm">
                  <span className="font-body">
                    Action: {actionTypes.find(t => t.value === filters.actionType)?.label}
                  </span>
                  <button
                    onClick={() => handleInputChange('actionType', 'all')}
                    className="hover:bg-accent-100 rounded-full p-0.5"
                  >
                    <Icon name="X" size={12} strokeWidth={2} />
                  </button>
                </div>
              )}

              {(filters.dateRange.start || filters.dateRange.end) && (
                <div className="flex items-center space-x-1 bg-secondary-50 text-secondary px-3 py-1 rounded-full text-sm">
                  <span className="font-body">
                    Date: {filters.dateRange.start || '...'} - {filters.dateRange.end || '...'}
                  </span>
                  <button
                    onClick={() => handleDateRangeChange('start', '') || handleDateRangeChange('end', '')}
                    className="hover:bg-secondary-100 rounded-full p-0.5"
                  >
                    <Icon name="X" size={12} strokeWidth={2} />
                  </button>
                </div>
              )}

              {filters.user !== 'all' && (
                <div className="flex items-center space-x-1 bg-success-50 text-success px-3 py-1 rounded-full text-sm">
                  <span className="font-body">User: {filters.user}</span>
                  <button
                    onClick={() => handleInputChange('user', 'all')}
                    className="hover:bg-success-100 rounded-full p-0.5"
                  >
                    <Icon name="X" size={12} strokeWidth={2} />
                  </button>
                </div>
              )}

              {filters.project !== 'all' && (
                <div className="flex items-center space-x-1 bg-warning-50 text-warning px-3 py-1 rounded-full text-sm">
                  <span className="font-body">
                    Project: {filters.project === 'no-project' ? 'No Project' : filters.project}
                  </span>
                  <button
                    onClick={() => handleInputChange('project', 'all')}
                    className="hover:bg-warning-100 rounded-full p-0.5"
                  >
                    <Icon name="X" size={12} strokeWidth={2} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryFilters;