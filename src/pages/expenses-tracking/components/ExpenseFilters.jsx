import React from 'react';
import Icon from '../../../components/AppIcon';

const ExpenseFilters = ({ filters, projects, onFiltersChange }) => {
  const handleFilterChange = (field, value) => {
    onFiltersChange({
      ...filters,
      [field]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      project: '',
      dateFrom: '',
      dateTo: ''
    });
  };

  const hasActiveFilters = filters.search || filters.project || filters.dateFrom || filters.dateTo;

  return (
    <div className="space-y-4">
      {/* Search and Project Filter Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="Search by article, product, or project..."
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-surface text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-smooth font-body"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon name="Search" size={18} className="text-text-muted" strokeWidth={2} />
          </div>
          {filters.search && (
            <button
              onClick={() => handleFilterChange('search', '')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted hover:text-text-primary transition-smooth"
            >
              <Icon name="X" size={16} strokeWidth={2} />
            </button>
          )}
        </div>

        {/* Project Filter */}
        <div>
          <select
            value={filters.project}
            onChange={(e) => handleFilterChange('project', e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-smooth font-body"
          >
            <option value="">All Projects</option>
            {projects.map(project => (
              <option key={project.id} value={project.id.toString()}>
                {project.code} - {project.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Date Range Filter Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        {/* Date From */}
        <div>
          <label className="block text-sm font-medium text-text-secondary font-body mb-1">
            From Date
          </label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            max={filters.dateTo || new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-smooth font-body"
          />
        </div>

        {/* Date To */}
        <div>
          <label className="block text-sm font-medium text-text-secondary font-body mb-1">
            To Date
          </label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            min={filters.dateFrom}
            max={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-smooth font-body"
          />
        </div>

        {/* Clear Filters Button */}
        <div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center space-x-2 px-4 py-2 text-text-secondary hover:text-text-primary hover:bg-secondary-50 rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 font-body"
            >
              <Icon name="X" size={16} strokeWidth={2} />
              <span>Clear Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
          {filters.search && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-primary-50 text-primary rounded-full text-sm font-body">
              <span>Search: "{filters.search}"</span>
              <button
                onClick={() => handleFilterChange('search', '')}
                className="hover:text-primary-700 transition-smooth"
              >
                <Icon name="X" size={14} strokeWidth={2} />
              </button>
            </div>
          )}
          
          {filters.project && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-accent-50 text-accent rounded-full text-sm font-body">
              <span>Project: {projects.find(p => p.id.toString() === filters.project)?.code}</span>
              <button
                onClick={() => handleFilterChange('project', '')}
                className="hover:text-accent-700 transition-smooth"
              >
                <Icon name="X" size={14} strokeWidth={2} />
              </button>
            </div>
          )}
          
          {filters.dateFrom && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-success-50 text-success rounded-full text-sm font-body">
              <span>From: {new Date(filters.dateFrom).toLocaleDateString()}</span>
              <button
                onClick={() => handleFilterChange('dateFrom', '')}
                className="hover:text-success-700 transition-smooth"
              >
                <Icon name="X" size={14} strokeWidth={2} />
              </button>
            </div>
          )}
          
          {filters.dateTo && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-warning-50 text-warning rounded-full text-sm font-body">
              <span>To: {new Date(filters.dateTo).toLocaleDateString()}</span>
              <button
                onClick={() => handleFilterChange('dateTo', '')}
                className="hover:text-warning-700 transition-smooth"
              >
                <Icon name="X" size={14} strokeWidth={2} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExpenseFilters;