import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import AddStockModal from './AddStockModal';
import StockMovementModal from './StockMovementModal';

const WarehouseTable = ({ 
  inventory, 
  onAddStock, 
  onUpdateArticle,
  onStockMovementView 
}) => {
  const [sortConfig, setSortConfig] = useState({ key: 'remainingStock', direction: 'asc' });
  const [addingStockId, setAddingStockId] = useState(null);
  const [viewingMovementsId, setViewingMovementsId] = useState(null);
  const [editingItems, setEditingItems] = useState({});

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedInventory = React.useMemo(() => {
    let sortableInventory = [...inventory];
    if (sortConfig.key) {
      sortableInventory.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableInventory;
  }, [inventory, sortConfig]);

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <Icon name="ArrowUpDown" size={14} className="text-text-muted" strokeWidth={2} />;
    }
    return sortConfig.direction === 'asc' 
      ? <Icon name="ArrowUp" size={14} className="text-primary" strokeWidth={2} />
      : <Icon name="ArrowDown" size={14} className="text-primary" strokeWidth={2} />;
  };

  const handleInlineEdit = (id, field, value) => {
    setEditingItems(prev => ({
      ...prev,
      [`${id}-${field}`]: value
    }));
  };

  const handleSaveEdit = (id, field) => {
    const key = `${id}-${field}`;
    const value = editingItems[key];
    if (value !== undefined) {
      onUpdateArticle(id, { [field]: value });
      setEditingItems(prev => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
    }
  };

  const handleKeyDown = (e, id, field) => {
    if (e.key === 'Enter') {
      handleSaveEdit(id, field);
    } else if (e.key === 'Escape') {
      setEditingItems(prev => {
        const updated = { ...prev };
        delete updated[`${id}-${field}`];
        return updated;
      });
    }
  };

  const isCriticalStock = (stock) => stock <= 5;

  if (inventory.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="flex items-center justify-center w-16 h-16 bg-secondary-100 rounded-full mx-auto mb-4">
          <Icon name="Package" size={32} className="text-text-muted" strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-semibold text-text-primary font-heading mb-2">
          No Inventory Items Found
        </h3>
        <p className="text-text-secondary font-body">
          Start by adding your first product to begin inventory management.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4">
                <button
                  onClick={() => handleSort('article')}
                  className="flex items-center space-x-2 text-sm font-semibold text-text-primary hover:text-primary transition-smooth font-heading"
                >
                  <span>Article ID</span>
                  {getSortIcon('article')}
                </button>
              </th>
              <th className="text-left py-3 px-4">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-2 text-sm font-semibold text-text-primary hover:text-primary transition-smooth font-heading"
                >
                  <span>Name</span>
                  {getSortIcon('name')}
                </button>
              </th>
              <th className="text-center py-3 px-4">
                <button
                  onClick={() => handleSort('receivedQuantity')}
                  className="flex items-center space-x-2 text-sm font-semibold text-text-primary hover:text-primary transition-smooth font-heading mx-auto"
                >
                  <span>Received</span>
                  {getSortIcon('receivedQuantity')}
                </button>
              </th>
              <th className="text-center py-3 px-4">
                <button
                  onClick={() => handleSort('outgoingQuantity')}
                  className="flex items-center space-x-2 text-sm font-semibold text-text-primary hover:text-primary transition-smooth font-heading mx-auto"
                >
                  <span>Outgoing</span>
                  {getSortIcon('outgoingQuantity')}
                </button>
              </th>
              <th className="text-center py-3 px-4">
                <button
                  onClick={() => handleSort('reservedQuantity')}
                  className="flex items-center space-x-2 text-sm font-semibold text-text-primary hover:text-primary transition-smooth font-heading mx-auto"
                >
                  <span>Reserved</span>
                  {getSortIcon('reservedQuantity')}
                </button>
              </th>
              <th className="text-center py-3 px-4">
                <button
                  onClick={() => handleSort('remainingStock')}
                  className="flex items-center space-x-2 text-sm font-semibold text-text-primary hover:text-primary transition-smooth font-heading mx-auto"
                >
                  <span>Remaining</span>
                  {getSortIcon('remainingStock')}
                </button>
              </th>
              <th className="text-center py-3 px-4">
                <button
                  onClick={() => handleSort('costPrice')}
                  className="flex items-center space-x-2 text-sm font-semibold text-text-primary hover:text-primary transition-smooth font-heading mx-auto"
                >
                  <span>Cost Price</span>
                  {getSortIcon('costPrice')}
                </button>
              </th>
              <th className="text-center py-3 px-4">
                <span className="text-sm font-semibold text-text-primary font-heading">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedInventory.map((item) => (
              <tr 
                key={item.id} 
                className={`border-b border-border hover:bg-secondary-50 transition-smooth ${
                  isCriticalStock(item.remainingStock) ? 'bg-error-50' : ''
                }`}
              >
                <td className="py-4 px-4">
                  <div className="text-sm font-medium text-text-primary font-data">
                    {item.article}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="max-w-xs">
                    {editingItems[`${item.id}-name`] !== undefined ? (
                      <input
                        type="text"
                        value={editingItems[`${item.id}-name`]}
                        onChange={(e) => handleInlineEdit(item.id, 'name', e.target.value)}
                        onBlur={() => handleSaveEdit(item.id, 'name')}
                        onKeyDown={(e) => handleKeyDown(e, item.id, 'name')}
                        className="w-full px-2 py-1 text-sm border border-primary rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-body"
                        autoFocus
                      />
                    ) : (
                      <button
                        onClick={() => handleInlineEdit(item.id, 'name', item.name)}
                        className="text-left text-sm text-text-primary hover:text-primary hover:underline font-body w-full"
                      >
                        {item.name}
                      </button>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
                  <div className="text-sm font-medium text-text-primary font-data">
                    {item.receivedQuantity || 0}
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
                  <div className="text-sm font-medium text-text-primary font-data">
                    {item.outgoingQuantity || 0}
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
                  <div className="text-sm font-medium text-text-primary font-data">
                    {item.reservedQuantity || 0}
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
                  <div className={`text-sm font-medium font-data ${
                    isCriticalStock(item.remainingStock) 
                      ? 'text-error-700 font-semibold' :'text-text-primary'
                  }`}>
                    {item.remainingStock}
                    {isCriticalStock(item.remainingStock) && (
                      <Icon name="AlertTriangle" size={14} className="inline ml-1 text-error-700" strokeWidth={2} />
                    )}
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
                  <div className="text-sm">
                    {editingItems[`${item.id}-costPrice`] !== undefined ? (
                      <input
                        type="number"
                        step="0.01"
                        value={editingItems[`${item.id}-costPrice`]}
                        onChange={(e) => handleInlineEdit(item.id, 'costPrice', parseFloat(e.target.value) || 0)}
                        onBlur={() => handleSaveEdit(item.id, 'costPrice')}
                        onKeyDown={(e) => handleKeyDown(e, item.id, 'costPrice')}
                        className="w-20 px-2 py-1 text-center text-sm border border-primary rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-data"
                        autoFocus
                      />
                    ) : (
                      <button
                        onClick={() => handleInlineEdit(item.id, 'costPrice', item.costPrice)}
                        className="text-sm text-text-primary hover:text-primary hover:underline font-data"
                      >
                        ${item.costPrice?.toFixed(2) || '0.00'}
                      </button>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => setAddingStockId(item.id)}
                      className="p-2 text-text-secondary hover:text-success hover:bg-success-50 rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-success focus:ring-offset-2"
                      title="Add Stock"
                    >
                      <Icon name="Plus" size={16} strokeWidth={2} />
                    </button>
                    <button
                      onClick={() => setViewingMovementsId(item.id)}
                      className="p-2 text-text-secondary hover:text-primary hover:bg-primary-50 rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      title="View Stock Movements"
                    >
                      <Icon name="Eye" size={16} strokeWidth={2} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet Cards */}
      <div className="lg:hidden space-y-4">
        {sortedInventory.map((item) => (
          <div 
            key={item.id} 
            className={`bg-surface border border-border rounded-lg p-4 shadow-card ${
              isCriticalStock(item.remainingStock) ? 'border-error-200 bg-error-50' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-sm font-medium text-text-primary font-data">
                    {item.article}
                  </h3>
                  {isCriticalStock(item.remainingStock) && (
                    <Icon name="AlertTriangle" size={14} className="text-error-700" strokeWidth={2} />
                  )}
                </div>
                <p className="text-sm text-text-secondary font-body truncate">
                  {item.name}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setAddingStockId(item.id)}
                  className="p-2 text-text-secondary hover:text-success hover:bg-success-50 rounded-lg transition-smooth"
                  title="Add Stock"
                >
                  <Icon name="Plus" size={16} strokeWidth={2} />
                </button>
                <button
                  onClick={() => setViewingMovementsId(item.id)}
                  className="p-2 text-text-secondary hover:text-primary hover:bg-primary-50 rounded-lg transition-smooth"
                  title="View Movements"
                >
                  <Icon name="Eye" size={16} strokeWidth={2} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted font-body">Received:</span>
                  <span className="font-medium text-text-primary font-data">{item.receivedQuantity || 0}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted font-body">Outgoing:</span>
                  <span className="font-medium text-text-primary font-data">{item.outgoingQuantity || 0}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted font-body">Reserved:</span>
                  <span className="font-medium text-text-primary font-data">{item.reservedQuantity || 0}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted font-body">Remaining:</span>
                  <span className={`font-medium font-data ${
                    isCriticalStock(item.remainingStock) 
                      ? 'text-error-700 font-semibold' :'text-text-primary'
                  }`}>
                    {item.remainingStock}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted font-body">Cost Price:</span>
                  <span className="font-medium text-text-primary font-data">
                    ${item.costPrice?.toFixed(2) || '0.00'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Stock Modal */}
      {addingStockId && (
        <AddStockModal
          item={inventory.find(item => item.id === addingStockId)}
          onSave={onAddStock}
          onClose={() => setAddingStockId(null)}
        />
      )}

      {/* Stock Movement Modal */}
      {viewingMovementsId && (
        <StockMovementModal
          item={inventory.find(item => item.id === viewingMovementsId)}
          onClose={() => setViewingMovementsId(null)}
        />
      )}
    </>
  );
};

export default WarehouseTable;