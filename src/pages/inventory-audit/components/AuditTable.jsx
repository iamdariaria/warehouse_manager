import React, { useState, useMemo } from 'react';
import Icon from 'components/AppIcon';

const AuditTable = ({ 
  auditData, 
  selectedItems, 
  onActualStockChange, 
  onItemSelection, 
  onSelectAll 
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return auditData;

    return [...auditData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [auditData, sortConfig]);

  const getVarianceColor = (variance) => {
    if (variance > 0) return 'text-success-700 bg-success-50';
    if (variance < 0) return 'text-error-700 bg-error-50';
    return 'text-text-secondary bg-secondary-50';
  };

  const getVarianceIcon = (variance) => {
    if (variance > 0) return 'TrendingUp';
    if (variance < 0) return 'TrendingDown';
    return 'Minus';
  };

  const allSelected = auditData.length > 0 && selectedItems.length === auditData.length;
  const someSelected = selectedItems.length > 0 && selectedItems.length < auditData.length;

  return (
    <div className="bg-surface rounded-lg shadow-card border border-border overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary-50 border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={input => {
                      if (input) input.indeterminate = someSelected;
                    }}
                    onChange={(e) => onSelectAll(e.target.checked)}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
                  />
                  <span className="text-sm font-medium text-text-primary font-body">Select</span>
                </div>
              </th>
              
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('article')}
                  className="flex items-center space-x-1 text-sm font-medium text-text-primary hover:text-primary transition-smooth font-body"
                >
                  <span>Article</span>
                  <Icon 
                    name={sortConfig.key === 'article' && sortConfig.direction === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={14} 
                    strokeWidth={2}
                  />
                </button>
              </th>
              
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('productName')}
                  className="flex items-center space-x-1 text-sm font-medium text-text-primary hover:text-primary transition-smooth font-body"
                >
                  <span>Product Name</span>
                  <Icon 
                    name={sortConfig.key === 'productName' && sortConfig.direction === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={14} 
                    strokeWidth={2}
                  />
                </button>
              </th>
              
              <th className="px-6 py-4 text-center">
                <span className="text-sm font-medium text-text-primary font-body">System Stock</span>
              </th>
              
              <th className="px-6 py-4 text-center">
                <span className="text-sm font-medium text-text-primary font-body">Actual Stock</span>
              </th>
              
              <th className="px-6 py-4 text-center">
                <button
                  onClick={() => handleSort('variance')}
                  className="flex items-center space-x-1 text-sm font-medium text-text-primary hover:text-primary transition-smooth font-body mx-auto"
                >
                  <span>Variance</span>
                  <Icon 
                    name={sortConfig.key === 'variance' && sortConfig.direction === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={14} 
                    strokeWidth={2}
                  />
                </button>
              </th>
              
              <th className="px-6 py-4 text-center">
                <span className="text-sm font-medium text-text-primary font-body">Status</span>
              </th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-border">
            {sortedData.map((item) => (
              <tr 
                key={item.id} 
                className={`hover:bg-secondary-50 transition-smooth ${
                  selectedItems.includes(item.id) ? 'bg-primary-50' : ''
                }`}
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={(e) => onItemSelection(item.id, e.target.checked)}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
                  />
                </td>
                
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-text-primary font-data">
                    {item.article}
                  </span>
                </td>
                
                <td className="px-6 py-4">
                  <span className="text-sm text-text-primary font-body">
                    {item.productName}
                  </span>
                </td>
                
                <td className="px-6 py-4 text-center">
                  <span className="text-sm font-medium text-text-primary font-data">
                    {item.systemStock}
                  </span>
                </td>
                
                <td className="px-6 py-4 text-center">
                  <input
                    type="number"
                    value={item.actualStock}
                    onChange={(e) => onActualStockChange(item.id, parseInt(e.target.value) || 0)}
                    className="w-20 px-2 py-1 text-center text-sm border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-data"
                    min="0"
                  />
                </td>
                
                <td className="px-6 py-4 text-center">
                  <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getVarianceColor(item.variance)}`}>
                    <Icon name={getVarianceIcon(item.variance)} size={12} strokeWidth={2} />
                    <span className="font-data">
                      {item.variance > 0 ? '+' : ''}{item.variance}
                    </span>
                  </div>
                </td>
                
                <td className="px-6 py-4 text-center">
                  {item.verified ? (
                    <div className="inline-flex items-center space-x-1 px-2 py-1 bg-success-50 text-success-700 rounded-full text-xs font-medium">
                      <Icon name="CheckCircle" size={12} strokeWidth={2} />
                      <span className="font-body">Verified</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center space-x-1 px-2 py-1 bg-warning-50 text-warning-700 rounded-full text-xs font-medium">
                      <Icon name="Clock" size={12} strokeWidth={2} />
                      <span className="font-body">Pending</span>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet Cards */}
      <div className="lg:hidden">
        <div className="p-4 bg-secondary-50 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={allSelected}
                ref={input => {
                  if (input) input.indeterminate = someSelected;
                }}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
              />
              <span className="text-sm font-medium text-text-primary font-body">
                Select All ({auditData.length} items)
              </span>
            </div>
            
            {selectedItems.length > 0 && (
              <span className="text-sm text-primary font-medium font-body">
                {selectedItems.length} selected
              </span>
            )}
          </div>
        </div>
        
        <div className="divide-y divide-border">
          {sortedData.map((item) => (
            <div 
              key={item.id} 
              className={`p-4 ${selectedItems.includes(item.id) ? 'bg-primary-50' : ''}`}
            >
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={(e) => onItemSelection(item.id, e.target.checked)}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2 mt-1"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-text-primary font-data">
                      {item.article}
                    </h3>
                    {item.verified ? (
                      <div className="inline-flex items-center space-x-1 px-2 py-1 bg-success-50 text-success-700 rounded-full text-xs font-medium">
                        <Icon name="CheckCircle" size={12} strokeWidth={2} />
                        <span className="font-body">Verified</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center space-x-1 px-2 py-1 bg-warning-50 text-warning-700 rounded-full text-xs font-medium">
                        <Icon name="Clock" size={12} strokeWidth={2} />
                        <span className="font-body">Pending</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-text-secondary mb-3 font-body">
                    {item.productName}
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-xs text-text-muted mb-1 font-body">System</div>
                      <div className="text-sm font-medium text-text-primary font-data">
                        {item.systemStock}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-xs text-text-muted mb-1 font-body">Actual</div>
                      <input
                        type="number"
                        value={item.actualStock}
                        onChange={(e) => onActualStockChange(item.id, parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1 text-center text-sm border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-data"
                        min="0"
                      />
                    </div>
                    
                    <div className="text-center">
                      <div className="text-xs text-text-muted mb-1 font-body">Variance</div>
                      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getVarianceColor(item.variance)}`}>
                        <Icon name={getVarianceIcon(item.variance)} size={12} strokeWidth={2} />
                        <span className="font-data">
                          {item.variance > 0 ? '+' : ''}{item.variance}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuditTable;