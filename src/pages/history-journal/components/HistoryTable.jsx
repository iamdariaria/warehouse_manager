import React from 'react';
import Icon from '../../../components/AppIcon';

const HistoryTable = ({ historyData, expandedEntries, onToggleExpansion }) => {
  const getActionIcon = (action) => {
    switch (action) {
      case 'received':
        return { name: 'Plus', color: 'text-accent', bg: 'bg-accent-50' };
      case 'outgoing':
        return { name: 'Minus', color: 'text-error', bg: 'bg-error-50' };
      case 'reserved':
        return { name: 'Clock', color: 'text-warning', bg: 'bg-warning-50' };
      case 'audit':
        return { name: 'CheckSquare', color: 'text-secondary', bg: 'bg-secondary-50' };
      default:
        return { name: 'Circle', color: 'text-text-secondary', bg: 'bg-secondary-50' };
    }
  };

  const getActionLabel = (action) => {
    switch (action) {
      case 'received':
        return 'Received';
      case 'outgoing':
        return 'Outgoing';
      case 'reserved':
        return 'Reserved';
      case 'audit':
        return 'Audit';
      default:
        return action;
    }
  };

  const formatQuantityChange = (change, action, reservedQuantity) => {
    if (action === 'reserved' && reservedQuantity) {
      return `Reserved: ${reservedQuantity}`;
    }
    
    if (change > 0) {
      return `+${change}`;
    } else if (change < 0) {
      return `${change}`;
    }
    return '0';
  };

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <div className="bg-surface rounded-lg border border-border shadow-card overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary-50 border-b border-border">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-text-primary font-heading">
                Date & Time
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-text-primary font-heading">
                Action
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-text-primary font-heading">
                Product
              </th>
              <th className="text-center px-6 py-4 text-sm font-semibold text-text-primary font-heading">
                Quantity
              </th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-text-primary font-heading">
                Cost
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-text-primary font-heading">
                User
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-text-primary font-heading">
                Project
              </th>
              <th className="text-center px-6 py-4 text-sm font-semibold text-text-primary font-heading">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {historyData.map((entry) => {
              const actionConfig = getActionIcon(entry.action);
              const isExpanded = expandedEntries.has(entry.id);
              
              return (
                <React.Fragment key={entry.id}>
                  <tr className="hover:bg-secondary-50 transition-smooth">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-text-primary font-body">
                        {entry.timestamp.toLocaleDateString()}
                      </div>
                      <div className="text-xs text-text-secondary font-body">
                        {entry.timestamp.toLocaleTimeString()}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-8 h-8 rounded-full ${actionConfig.bg} flex items-center justify-center`}>
                          <Icon 
                            name={actionConfig.name} 
                            size={16} 
                            className={actionConfig.color}
                            strokeWidth={2}
                          />
                        </div>
                        <span className="text-sm font-medium text-text-primary font-body capitalize">
                          {getActionLabel(entry.action)}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-text-primary font-body">
                        {entry.article}
                      </div>
                      <div className="text-xs text-text-secondary font-body">
                        {entry.productName}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 text-center">
                      <div className="text-sm font-medium font-body">
                        <span className={`${
                          entry.quantityChange > 0 ? 'text-success' : 
                          entry.quantityChange < 0 ? 'text-error': 'text-text-secondary'
                        }`}>
                          {formatQuantityChange(entry.quantityChange, entry.action, entry.reservedQuantity)}
                        </span>
                      </div>
                      <div className="text-xs text-text-secondary font-body">
                        {entry.quantityBefore} → {entry.quantityAfter}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 text-right">
                      <div className="text-sm font-medium text-text-primary font-body">
                        {formatCurrency(entry.totalCost)}
                      </div>
                      <div className="text-xs text-text-secondary font-body">
                        @ {formatCurrency(entry.cost)} each
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-text-primary font-body">
                        {entry.user}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      {entry.project ? (
                        <div className="text-sm font-medium text-text-primary font-body">
                          {entry.project}
                        </div>
                      ) : (
                        <span className="text-xs text-text-muted font-body">No project</span>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => onToggleExpansion(entry.id)}
                        className="p-2 text-text-secondary hover:text-primary hover:bg-primary-50 rounded-lg transition-smooth"
                        aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                      >
                        <Icon 
                          name={isExpanded ? 'ChevronUp' : 'ChevronDown'} 
                          size={16} 
                          strokeWidth={2}
                        />
                      </button>
                    </td>
                  </tr>
                  
                  {/* Expanded Details Row */}
                  {isExpanded && (
                    <tr className="bg-secondary-50">
                      <td colSpan="8" className="px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Basic Information */}
                          <div>
                            <h4 className="text-sm font-semibold text-text-primary font-heading mb-3">
                              Transaction Details
                            </h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-text-secondary font-body">Reference:</span>
                                <span className="text-sm font-medium text-text-primary font-body">
                                  {entry.reference}
                                </span>
                              </div>
                              {entry.comments && (
                                <div className="flex justify-between">
                                  <span className="text-sm text-text-secondary font-body">Comments:</span>
                                  <span className="text-sm text-text-primary font-body text-right max-w-xs">
                                    {entry.comments}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Additional Details */}
                          <div>
                            <h4 className="text-sm font-semibold text-text-primary font-heading mb-3">
                              Additional Information
                            </h4>
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
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-border">
        {historyData.map((entry) => {
          const actionConfig = getActionIcon(entry.action);
          const isExpanded = expandedEntries.has(entry.id);
          
          return (
            <div key={entry.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full ${actionConfig.bg} flex items-center justify-center`}>
                    <Icon 
                      name={actionConfig.name} 
                      size={18} 
                      className={actionConfig.color}
                      strokeWidth={2}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-text-primary font-body capitalize">
                      {getActionLabel(entry.action)}
                    </div>
                    <div className="text-xs text-text-secondary font-body">
                      {entry.timestamp.toLocaleDateString()} {entry.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => onToggleExpansion(entry.id)}
                  className="p-2 text-text-secondary hover:text-primary hover:bg-primary-50 rounded-lg transition-smooth"
                >
                  <Icon 
                    name={isExpanded ? 'ChevronUp' : 'ChevronDown'} 
                    size={16} 
                    strokeWidth={2}
                  />
                </button>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-text-secondary font-body">Product:</span>
                  <div className="text-right">
                    <div className="text-sm font-medium text-text-primary font-body">
                      {entry.article}
                    </div>
                    <div className="text-xs text-text-secondary font-body">
                      {entry.productName}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-text-secondary font-body">Quantity:</span>
                  <div className="text-right">
                    <div className={`text-sm font-medium font-body ${
                      entry.quantityChange > 0 ? 'text-success' : 
                      entry.quantityChange < 0 ? 'text-error': 'text-text-secondary'
                    }`}>
                      {formatQuantityChange(entry.quantityChange, entry.action, entry.reservedQuantity)}
                    </div>
                    <div className="text-xs text-text-secondary font-body">
                      {entry.quantityBefore} → {entry.quantityAfter}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-text-secondary font-body">Cost:</span>
                  <div className="text-right">
                    <div className="text-sm font-medium text-text-primary font-body">
                      {formatCurrency(entry.totalCost)}
                    </div>
                    <div className="text-xs text-text-secondary font-body">
                      @ {formatCurrency(entry.cost)} each
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-text-secondary font-body">User:</span>
                  <span className="text-sm font-medium text-text-primary font-body">
                    {entry.user}
                  </span>
                </div>
                
                {entry.project && (
                  <div className="flex justify-between">
                    <span className="text-sm text-text-secondary font-body">Project:</span>
                    <span className="text-sm font-medium text-text-primary font-body">
                      {entry.project}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Expanded Details */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold text-text-primary font-heading mb-2">
                        Reference
                      </h4>
                      <p className="text-sm text-text-secondary font-body">
                        {entry.reference}
                      </p>
                    </div>
                    
                    {entry.comments && (
                      <div>
                        <h4 className="text-sm font-semibold text-text-primary font-heading mb-2">
                          Comments
                        </h4>
                        <p className="text-sm text-text-secondary font-body">
                          {entry.comments}
                        </p>
                      </div>
                    )}
                    
                    {entry.details && Object.keys(entry.details).length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-text-primary font-heading mb-2">
                          Additional Details
                        </h4>
                        <div className="space-y-1">
                          {Object.entries(entry.details).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-sm text-text-secondary font-body capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}:
                              </span>
                              <span className="text-sm text-text-primary font-body">
                                {value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryTable;