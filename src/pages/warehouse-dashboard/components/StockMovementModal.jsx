import React from 'react';
import Icon from '../../../components/AppIcon';

const StockMovementModal = ({ item, onClose }) => {
  // Mock stock movements data - in real app would come from API
  const stockMovements = [
    {
      id: 1,
      type: 'received',
      quantity: 50,
      date: '2024-01-15',
      time: '10:30',
      reference: 'PO-2024-001',
      cost: 125.50,
      notes: 'Initial stock delivery'
    },
    {
      id: 2,
      type: 'outgoing',
      quantity: -15,
      date: '2024-01-20',
      time: '14:15',
      reference: 'EXP-001',
      project: 'Office Building A - Phase 1',
      notes: 'Allocated to project'
    },
    {
      id: 3,
      type: 'received',
      quantity: 25,
      date: '2024-01-25',
      time: '09:45',
      reference: 'PO-2024-008',
      cost: 125.50,
      notes: 'Restock order'
    },
    {
      id: 4,
      type: 'reserved',
      quantity: -10,
      date: '2024-01-28',
      time: '11:20',
      reference: 'RES-005',
      project: 'Warehouse Expansion',
      notes: 'Reserved for upcoming project'
    },
    {
      id: 5,
      type: 'adjustment',
      quantity: -3,
      date: '2024-01-30',
      time: '16:00',
      reference: 'ADJ-002',
      notes: 'Damaged items removed from inventory'
    }
  ];

  const getMovementIcon = (type) => {
    switch (type) {
      case 'received':
        return { icon: 'ArrowDownLeft', color: 'text-success-700', bg: 'bg-success-50' };
      case 'outgoing':
        return { icon: 'ArrowUpRight', color: 'text-error-700', bg: 'bg-error-50' };
      case 'reserved':
        return { icon: 'Shield', color: 'text-warning-700', bg: 'bg-warning-50' };
      case 'adjustment':
        return { icon: 'Edit3', color: 'text-secondary-700', bg: 'bg-secondary-50' };
      default:
        return { icon: 'ArrowRight', color: 'text-text-secondary', bg: 'bg-secondary-50' };
    }
  };

  const getMovementLabel = (type) => {
    switch (type) {
      case 'received':
        return 'Stock Received';
      case 'outgoing':
        return 'Stock Outgoing';
      case 'reserved':
        return 'Stock Reserved';
      case 'adjustment':
        return 'Stock Adjustment';
      default:
        return 'Stock Movement';
    }
  };

  const formatQuantity = (quantity) => {
    return quantity > 0 ? `+${quantity}` : quantity.toString();
  };

  return (
    <div className="fixed inset-0 z-400 flex items-center justify-center p-4 bg-secondary-900 bg-opacity-50 backdrop-blur-sm">
      <div className="bg-surface rounded-lg shadow-modal border border-border w-full max-w-3xl max-h-screen overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-text-primary font-heading">
              Stock Movements
            </h2>
            <p className="text-sm text-text-secondary font-body mt-1">
              {item?.article} - {item?.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text-secondary hover:text-text-primary hover:bg-secondary-50 rounded-lg transition-smooth"
          >
            <Icon name="X" size={20} strokeWidth={2} />
          </button>
        </div>

        {/* Current Stock Summary */}
        <div className="p-6 bg-secondary-50 border-b border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-text-primary font-data">
                {item?.receivedQuantity || 0}
              </div>
              <div className="text-xs text-text-muted font-body">Total Received</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-text-primary font-data">
                {item?.outgoingQuantity || 0}
              </div>
              <div className="text-xs text-text-muted font-body">Total Outgoing</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-text-primary font-data">
                {item?.reservedQuantity || 0}
              </div>
              <div className="text-xs text-text-muted font-body">Reserved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary font-data">
                {item?.remainingStock || 0}
              </div>
              <div className="text-xs text-text-muted font-body">Remaining</div>
            </div>
          </div>
        </div>

        {/* Movements List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {stockMovements.length === 0 ? (
              <div className="text-center py-8">
                <div className="flex items-center justify-center w-16 h-16 bg-secondary-100 rounded-full mx-auto mb-4">
                  <Icon name="Activity" size={32} className="text-text-muted" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-text-primary font-heading mb-2">
                  No Stock Movements
                </h3>
                <p className="text-text-secondary font-body">
                  No stock movements recorded for this item yet.
                </p>
              </div>
            ) : (
              stockMovements.map((movement, index) => {
                const iconConfig = getMovementIcon(movement.type);
                return (
                  <div key={movement.id} className="flex items-start space-x-4 p-4 bg-surface border border-border rounded-lg">
                    {/* Icon */}
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${iconConfig.bg}`}>
                      <Icon 
                        name={iconConfig.icon} 
                        size={20} 
                        className={iconConfig.color} 
                        strokeWidth={2} 
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-text-primary font-body">
                          {getMovementLabel(movement.type)}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-medium font-data ${
                            movement.quantity > 0 ? 'text-success-700' : 'text-error-700'
                          }`}>
                            {formatQuantity(movement.quantity)} units
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-text-secondary font-body">
                        <div className="flex items-center space-x-2">
                          <Icon name="Calendar" size={12} strokeWidth={2} />
                          <span>{new Date(movement.date).toLocaleDateString()} at {movement.time}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Icon name="Hash" size={12} strokeWidth={2} />
                          <span>{movement.reference}</span>
                        </div>
                        {movement.project && (
                          <div className="flex items-center space-x-2">
                            <Icon name="Briefcase" size={12} strokeWidth={2} />
                            <span className="truncate">{movement.project}</span>
                          </div>
                        )}
                        {movement.cost && (
                          <div className="flex items-center space-x-2">
                            <Icon name="DollarSign" size={12} strokeWidth={2} />
                            <span>${movement.cost.toFixed(2)} per unit</span>
                          </div>
                        )}
                      </div>

                      {movement.notes && (
                        <div className="mt-2 text-xs text-text-muted font-body">
                          <Icon name="MessageSquare" size={12} className="inline mr-1" strokeWidth={2} />
                          {movement.notes}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-border">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-smooth font-body"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockMovementModal;