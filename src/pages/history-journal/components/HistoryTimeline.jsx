import React from 'react';
import Icon from '../../../components/AppIcon';

const HistoryTimeline = ({ historyData, expandedEntries, onToggleExpansion }) => {
  const getActionIcon = (action) => {
    switch (action) {
      case 'received':
        return { name: 'Plus', color: 'text-accent', bg: 'bg-accent', border: 'border-accent' };
      case 'outgoing':
        return { name: 'Minus', color: 'text-error', bg: 'bg-error', border: 'border-error' };
      case 'reserved':
        return { name: 'Clock', color: 'text-warning', bg: 'bg-warning', border: 'border-warning' };
      case 'audit':
        return { name: 'CheckSquare', color: 'text-secondary', bg: 'bg-secondary', border: 'border-secondary' };
      default:
        return { name: 'Circle', color: 'text-text-secondary', bg: 'bg-secondary', border: 'border-secondary' };
    }
  };

  const getActionLabel = (action) => {
    switch (action) {
      case 'received':
        return 'Stock Received';
      case 'outgoing':
        return 'Stock Outgoing';
      case 'reserved':
        return 'Stock Reserved';
      case 'audit':
        return 'Audit Adjustment';
      default:
        return action;
    }
  };

  const formatQuantityChange = (change, action, reservedQuantity) => {
    if (action === 'reserved' && reservedQuantity) {
      return `${reservedQuantity} units reserved`;
    }
    
    if (change > 0) {
      return `+${change} units added`;
    } else if (change < 0) {
      return `${Math.abs(change)} units removed`;
    }
    return 'No quantity change';
  };

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  const groupByDate = (data) => {
    const groups = {};
    data.forEach(entry => {
      const dateKey = entry.timestamp.toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(entry);
    });
    return groups;
  };

  const groupedData = groupByDate(historyData);
  const sortedDates = Object.keys(groupedData).sort((a, b) => new Date(b) - new Date(a));

  return (
    <div className="bg-surface rounded-lg border border-border shadow-card">
      <div className="p-6">
        {sortedDates.map((dateKey, dateIndex) => {
          const entries = groupedData[dateKey];
          const date = new Date(dateKey);
          
          return (
            <div key={dateKey} className={`${dateIndex > 0 ? 'mt-8' : ''}`}>
              {/* Date Header */}
              <div className="flex items-center mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <h3 className="text-lg font-semibold text-text-primary font-heading">
                    {date.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h3>
                </div>
                <div className="flex-1 h-px bg-border ml-4"></div>
                <div className="ml-4 text-sm text-text-secondary font-body">
                  {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
                </div>
              </div>

              {/* Timeline Entries */}
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"></div>
                
                <div className="space-y-6">
                  {entries.map((entry, entryIndex) => {
                    const actionConfig = getActionIcon(entry.action);
                    const isExpanded = expandedEntries.has(entry.id);
                    
                    return (
                      <div key={entry.id} className="relative flex items-start space-x-4">
                        {/* Timeline Icon */}
                        <div className={`relative z-10 w-12 h-12 rounded-full ${actionConfig.bg} border-4 border-surface flex items-center justify-center shadow-sm`}>
                          <Icon 
                            name={actionConfig.name} 
                            size={20} 
                            className="text-white"
                            strokeWidth={2}
                          />
                        </div>

                        {/* Content Card */}
                        <div className="flex-1 bg-surface border border-border rounded-lg shadow-sm hover:shadow-md transition-smooth">
                          <div className="p-4">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h4 className="text-lg font-semibold text-text-primary font-heading">
                                    {getActionLabel(entry.action)}
                                  </h4>
                                  <span className="text-sm text-text-secondary font-body">
                                    {entry.timestamp.toLocaleTimeString()}
                                  </span>
                                </div>
                                <p className="text-sm text-text-secondary font-body">
                                  {entry.reference}
                                </p>
                              </div>
                              
                              <button
                                onClick={() => onToggleExpansion(entry.id)}
                                className="p-2 text-text-secondary hover:text-primary hover:bg-primary-50 rounded-lg transition-smooth ml-2"
                                aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                              >
                                <Icon 
                                  name={isExpanded ? 'ChevronUp' : 'ChevronDown'} 
                                  size={16} 
                                  strokeWidth={2}
                                />
                              </button>
                            </div>

                            {/* Product Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <div className="flex items-start space-x-3">
                                  <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
                                    <Icon name="Package" size={16} className="text-secondary" strokeWidth={2} />
                                  </div>
                                  <div className="flex-1">
                                    <div className="text-sm font-medium text-text-primary font-body">
                                      {entry.article}
                                    </div>
                                    <div className="text-xs text-text-secondary font-body">
                                      {entry.productName}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm text-text-secondary font-body">Quantity:</span>
                                  <span className={`text-sm font-medium font-body ${
                                    entry.quantityChange > 0 ? 'text-success' : 
                                    entry.quantityChange < 0 ? 'text-error': 'text-text-secondary'
                                  }`}>
                                    {formatQuantityChange(entry.quantityChange, entry.action, entry.reservedQuantity)}
                                  </span>
                                </div>
                                
                                <div className="flex justify-between">
                                  <span className="text-sm text-text-secondary font-body">Total Cost:</span>
                                  <span className="text-sm font-medium text-text-primary font-body">
                                    {formatCurrency(entry.totalCost)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Meta Information */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary font-body">
                              <div className="flex items-center space-x-1">
                                <Icon name="User" size={14} strokeWidth={2} />
                                <span>{entry.user}</span>
                              </div>
                              
                              {entry.project && (
                                <div className="flex items-center space-x-1">
                                  <Icon name="Folder" size={14} strokeWidth={2} />
                                  <span>{entry.project}</span>
                                </div>
                              )}
                              
                              <div className="flex items-center space-x-1">
                                <Icon name="BarChart3" size={14} strokeWidth={2} />
                                <span>{entry.quantityBefore} → {entry.quantityAfter}</span>
                              </div>
                            </div>

                            {/* Comments Preview */}
                            {entry.comments && !isExpanded && (
                              <div className="mt-3 p-3 bg-secondary-50 rounded-lg">
                                <p className="text-sm text-text-secondary font-body line-clamp-2">
                                  {entry.comments}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Expanded Details */}
                          {isExpanded && (
                            <div className="border-t border-border p-4 bg-secondary-50">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Transaction Details */}
                                <div>
                                  <h5 className="text-sm font-semibold text-text-primary font-heading mb-3">
                                    Transaction Details
                                  </h5>
                                  <div className="space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-sm text-text-secondary font-body">Before:</span>
                                      <span className="text-sm font-medium text-text-primary font-body">
                                        {entry.quantityBefore} units
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-text-secondary font-body">After:</span>
                                      <span className="text-sm font-medium text-text-primary font-body">
                                        {entry.quantityAfter} units
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-text-secondary font-body">Unit Cost:</span>
                                      <span className="text-sm font-medium text-text-primary font-body">
                                        {formatCurrency(entry.cost)}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Additional Information */}
                                <div>
                                  <h5 className="text-sm font-semibold text-text-primary font-heading mb-3">
                                    Additional Information
                                  </h5>
                                  <div className="space-y-2">
                                    {Object.entries(entry.details || {}).map(([key, value]) => (
                                      <div key={key} className="flex justify-between">
                                        <span className="text-sm text-text-secondary font-body capitalize">
                                          {key.replace(/([A-Z])/g, ' $1').trim()}:
                                        </span>
                                        <span className="text-sm font-medium text-text-primary font-body text-right max-w-xs">
                                          {value}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Full Comments */}
                              {entry.comments && (
                                <div className="mt-4 pt-4 border-t border-border">
                                  <h5 className="text-sm font-semibold text-text-primary font-heading mb-2">
                                    Comments
                                  </h5>
                                  <p className="text-sm text-text-secondary font-body">
                                    {entry.comments}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {sortedDates.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto bg-secondary-100 rounded-full flex items-center justify-center mb-4">
              <Icon name="Clock" size={24} className="text-secondary-500" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-text-primary font-heading mb-2">
              No History Available
            </h3>
            <p className="text-text-secondary font-body">
              No history entries found for the selected filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryTimeline;