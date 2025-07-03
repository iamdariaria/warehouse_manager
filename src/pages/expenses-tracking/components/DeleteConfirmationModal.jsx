import React, { useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const DeleteConfirmationModal = ({ expense, onConfirm, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-400 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-secondary-900 bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-surface rounded-lg shadow-modal border border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-error-50 rounded-lg">
              <Icon name="AlertTriangle" size={20} className="text-error" strokeWidth={2} />
            </div>
            <h2 className="text-xl font-semibold text-text-primary font-heading">
              Delete Expense
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text-secondary hover:text-text-primary hover:bg-secondary-50 rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <Icon name="X" size={20} strokeWidth={2} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-text-primary font-body mb-4">
              Are you sure you want to delete this expense record? This action cannot be undone.
            </p>
            
            {/* Expense Details */}
            <div className="bg-error-50 border border-error-200 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary font-body">Date:</span>
                <span className="text-sm font-medium text-text-primary font-body">
                  {new Date(expense.date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary font-body">Project:</span>
                <span className="text-sm font-medium text-text-primary font-body">
                  {expense.projectName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary font-body">Product:</span>
                <span className="text-sm font-medium text-text-primary font-body">
                  {expense.article} - {expense.productName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary font-body">Quantity:</span>
                <span className="text-sm font-medium text-text-primary font-body">
                  {expense.quantity} units
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary font-body">Total Cost:</span>
                <span className="text-sm font-medium text-text-primary font-body">
                  ${expense.totalCost.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Warning Message */}
            <div className="mt-4 p-3 bg-warning-50 border border-warning-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <Icon name="Info" size={16} className="text-warning mt-0.5" strokeWidth={2} />
                <div className="text-sm text-warning-700 font-body">
                  <p className="font-medium mb-1">Stock will be restored:</p>
                  <p>
                    {expense.quantity} units of {expense.article} will be added back to warehouse inventory.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-border text-text-secondary hover:text-text-primary hover:bg-secondary-50 rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 font-medium font-body"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-error text-white rounded-lg hover:bg-error-700 transition-smooth focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2 font-medium font-body"
            >
              <Icon name="Trash2" size={18} strokeWidth={2} />
              <span>Delete Expense</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;